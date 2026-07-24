import { demoProfile, demoQuestions } from "@/lib/demo-data";
import type {
  LearningAttempt,
  MistakeRecord,
  StudentProfile,
} from "@/lib/types";

export interface LearningState {
  schemaVersion: 2;
  profile: StudentProfile;
  attempts: LearningAttempt[];
  mistakes: MistakeRecord[];
}

const seedAttempts: LearningAttempt[] = [
  {
    id: "attempt-seed-1",
    questionId: "math-fractions-01",
    subject: "Mathematics",
    topic: "Fractions",
    answer: "2/3",
    correct: false,
    hintsUsed: 1,
    completedAt: "2026-07-20T08:30:00.000Z",
  },
  {
    id: "attempt-seed-2",
    questionId: "math-percentage-01",
    subject: "Mathematics",
    topic: "Percentages",
    answer: "20",
    correct: true,
    hintsUsed: 0,
    completedAt: "2026-07-20T08:36:00.000Z",
  },
  {
    id: "attempt-seed-3",
    questionId: "math-equation-01",
    subject: "Mathematics",
    topic: "Linear equations",
    answer: "5",
    correct: false,
    hintsUsed: 1,
    completedAt: "2026-07-21T09:10:00.000Z",
  },
  {
    id: "attempt-seed-4",
    questionId: "math-fractions-01",
    subject: "Mathematics",
    topic: "Fractions",
    answer: "3/4",
    correct: true,
    hintsUsed: 2,
    completedAt: "2026-07-22T07:55:00.000Z",
  },
  {
    id: "attempt-seed-5",
    questionId: "math-percentage-01",
    subject: "Mathematics",
    topic: "Percentages",
    answer: "20",
    correct: true,
    hintsUsed: 0,
    completedAt: "2026-07-22T08:02:00.000Z",
  },
];

const seedMistakes: MistakeRecord[] = [
  {
    id: "mistake-math-fractions-01",
    question: demoQuestions[0],
    lastAnswer: "2/3",
    attempts: 2,
    status: "practising",
    lastAttemptedAt: "2026-07-22T07:55:00.000Z",
  },
  {
    id: "mistake-math-equation-01",
    question: demoQuestions[2],
    lastAnswer: "5",
    attempts: 1,
    status: "new",
    lastAttemptedAt: "2026-07-21T09:10:00.000Z",
  },
];

export const initialLearningState: LearningState = {
  schemaVersion: 2,
  profile: demoProfile,
  attempts: seedAttempts,
  mistakes: seedMistakes,
};

export function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
