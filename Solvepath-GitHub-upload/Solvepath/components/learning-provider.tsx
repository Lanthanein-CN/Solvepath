"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createLocalId,
  initialLearningState,
  type LearningState,
} from "@/lib/learning-state";
import type {
  LearningQuestion,
  MistakeStatus,
  StudentProfile,
} from "@/lib/types";

const storageKey = "solvepath-maths-state-v2";

interface RecordAttemptInput {
  question: LearningQuestion;
  answer: string;
  correct: boolean;
  hintsUsed: number;
}

interface LearningContextValue {
  state: LearningState;
  isReady: boolean;
  recordAttempt: (input: RecordAttemptInput) => void;
  setMistakeStatus: (id: string, status: MistakeStatus) => void;
  updateProfile: (changes: Partial<StudentProfile>) => void;
  resetDemo: () => void;
}

const LearningContext = createContext<LearningContextValue | null>(null);

function readSavedState() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return initialLearningState;
    const parsed = JSON.parse(raw) as Partial<LearningState>;
    if (
      parsed.schemaVersion !== 2 ||
      !parsed.profile ||
      !Array.isArray(parsed.attempts) ||
      !Array.isArray(parsed.mistakes)
    ) {
      return initialLearningState;
    }
    return parsed as LearningState;
  } catch {
    return initialLearningState;
  }
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>(initialLearningState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setState(readSavedState());
      setIsReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [isReady, state]);

  const recordAttempt = useCallback((input: RecordAttemptInput) => {
    const now = new Date().toISOString();
    setState((current) => {
      const attempt = {
        id: createLocalId("attempt"),
        questionId: input.question.id,
        subject: input.question.subject,
        topic: input.question.topic,
        answer: input.answer,
        correct: input.correct,
        hintsUsed: input.hintsUsed,
        completedAt: now,
      };
      const existing = current.mistakes.find(
        (mistake) => mistake.question.id === input.question.id,
      );
      let mistakes = current.mistakes;

      if (!input.correct) {
        mistakes = existing
          ? current.mistakes.map((mistake) =>
              mistake.id === existing.id
                ? {
                    ...mistake,
                    lastAnswer: input.answer,
                    attempts: mistake.attempts + 1,
                    status: "practising" as const,
                    lastAttemptedAt: now,
                  }
                : mistake,
            )
          : [
              {
                id: createLocalId("mistake"),
                question: input.question,
                lastAnswer: input.answer,
                attempts: 1,
                status: "new" as const,
                lastAttemptedAt: now,
              },
              ...current.mistakes,
            ];
      } else if (existing && existing.status !== "mastered") {
        mistakes = current.mistakes.map((mistake) =>
          mistake.id === existing.id
            ? {
                ...mistake,
                attempts: mistake.attempts + 1,
                status: "practising" as const,
                lastAttemptedAt: now,
              }
            : mistake,
        );
      }

      return {
        ...current,
        attempts: [attempt, ...current.attempts],
        mistakes,
        profile: {
          ...current.profile,
          weeklyCompleted: current.profile.weeklyCompleted + 1,
        },
      };
    });
  }, []);

  const setMistakeStatus = useCallback(
    (id: string, status: MistakeStatus) => {
      setState((current) => ({
        ...current,
        mistakes: current.mistakes.map((mistake) =>
          mistake.id === id ? { ...mistake, status } : mistake,
        ),
      }));
    },
    [],
  );

  const updateProfile = useCallback((changes: Partial<StudentProfile>) => {
    setState((current) => ({
      ...current,
      profile: { ...current.profile, ...changes },
    }));
  }, []);

  const resetDemo = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setState(initialLearningState);
  }, []);

  const value = useMemo(
    () => ({
      state,
      isReady,
      recordAttempt,
      setMistakeStatus,
      updateProfile,
      resetDemo,
    }),
    [
      state,
      isReady,
      recordAttempt,
      setMistakeStatus,
      updateProfile,
      resetDemo,
    ],
  );

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used inside LearningProvider");
  }
  return context;
}
