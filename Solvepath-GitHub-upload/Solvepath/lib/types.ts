export type YearLevel =
  | "Prep"
  | "Year 1"
  | "Year 2"
  | "Year 3"
  | "Year 4"
  | "Year 5"
  | "Year 6"
  | "Year 7"
  | "Year 8"
  | "Year 9"
  | "Year 10"
  | "Year 11"
  | "Year 12";

export type Subject = "Mathematics";

export interface StudentProfile {
  id: string;
  firstName: string;
  yearLevel: YearLevel;
  weeklyGoal: number;
  weeklyCompleted: number;
  streakDays: number;
}

export interface LearningQuestion {
  id: string;
  subject: Subject;
  level: YearLevel;
  topic: string;
  prompt: string;
  kind: "short-answer" | "multiple-choice" | "worked-response";
  acceptedAnswers: string[];
  hints: string[];
  explanation: string;
  source: "sample" | "uploaded" | "generated";
}

export interface LearningAttempt {
  id: string;
  questionId: string;
  subject: Subject;
  topic: string;
  answer: string;
  correct: boolean;
  hintsUsed: number;
  completedAt: string;
}

export type MistakeStatus = "new" | "practising" | "mastered";

export interface MistakeRecord {
  id: string;
  question: LearningQuestion;
  lastAnswer: string;
  attempts: number;
  status: MistakeStatus;
  lastAttemptedAt: string;
}

export interface TopicSummary {
  id: string;
  subject: Subject;
  title: string;
  level: YearLevel;
  status: "completed" | "review" | "active";
  statusLabel: string;
}
