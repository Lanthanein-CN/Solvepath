import type {
  LearningQuestion,
  StudentProfile,
  TopicSummary,
  YearLevel,
} from "@/lib/types";

export const yearLevels: YearLevel[] = [
  "Prep",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
];

export const demoProfile: StudentProfile = {
  id: "student-demo",
  firstName: "Alex",
  yearLevel: "Year 7",
  weeklyGoal: 20,
  weeklyCompleted: 12,
  streakDays: 4,
};

export const recentTopics: TopicSummary[] = [
  {
    id: "topic-1",
    subject: "Mathematics",
    title: "Equivalent fractions",
    level: "Year 7",
    status: "review",
    statusLabel: "Review",
  },
  {
    id: "topic-2",
    subject: "Mathematics",
    title: "Percentages",
    level: "Year 7",
    status: "completed",
    statusLabel: "Completed",
  },
  {
    id: "topic-3",
    subject: "Mathematics",
    title: "Linear equations",
    level: "Year 7",
    status: "active",
    statusLabel: "In progress",
  },
];

export const demoQuestions: LearningQuestion[] = [
  {
    id: "math-fractions-01",
    subject: "Mathematics",
    level: "Year 7",
    topic: "Fractions",
    prompt: "Simplify 18/24 to its lowest terms.",
    kind: "short-answer",
    acceptedAnswers: ["3/4", "¾"],
    hints: [
      "Find a number that divides both 18 and 24.",
      "The highest common factor of 18 and 24 is 6.",
      "Divide both the numerator and denominator by 6.",
    ],
    explanation:
      "18 ÷ 6 = 3 and 24 ÷ 6 = 4, so 18/24 simplifies to 3/4.",
    source: "sample",
  },
  {
    id: "math-percentage-01",
    subject: "Mathematics",
    level: "Year 7",
    topic: "Percentages",
    prompt: "What is 25% of 80?",
    kind: "short-answer",
    acceptedAnswers: ["20", "20 items", "20 students"],
    hints: [
      "Convert 25% to the decimal 0.25.",
      "Multiply 80 by 0.25.",
    ],
    explanation: "25% of 80 is 0.25 × 80 = 20.",
    source: "sample",
  },
  {
    id: "math-equation-01",
    subject: "Mathematics",
    level: "Year 7",
    topic: "Linear equations",
    prompt: "Solve 2x + 5 = 17.",
    kind: "short-answer",
    acceptedAnswers: ["6", "x = 6", "x=6"],
    hints: [
      "Undo the addition first.",
      "Subtract 5 from both sides.",
      "Then divide both sides by 2.",
    ],
    explanation:
      "Subtracting 5 gives 2x = 12. Dividing both sides by 2 gives x = 6.",
    source: "sample",
  },
];
