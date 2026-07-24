import { demoQuestions } from "@/lib/demo-data";
import type {
  LearningQuestion,
  Subject,
  YearLevel,
} from "@/lib/types";

export interface QuestionAnalysisInput {
  questionText: string;
  subject: Subject;
  level: YearLevel;
  imageName?: string;
}

export interface QuestionAnalysisResult {
  question: LearningQuestion;
  matchedAsSample: boolean;
  note: string;
}

export interface TutorEngine {
  analyseQuestion(
    input: QuestionAnalysisInput,
  ): Promise<QuestionAnalysisResult>;
  checkAnswer(question: LearningQuestion, answer: string): boolean;
}

function normaliseAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "");
}

function makeEquationQuestion(
  prompt: string,
  level: YearLevel,
): LearningQuestion {
  return {
    id: `typed-equation-${Date.now()}`,
    subject: "Mathematics",
    level,
    topic: "Linear equations",
    prompt,
    kind: "short-answer",
    acceptedAnswers: ["6", "x = 6", "x=6"],
    hints: [
      "Undo the addition first.",
      "Subtract 5 from both sides.",
      "Then divide both sides by 2.",
    ],
    explanation:
      "2x + 5 = 17, so 2x = 12 after subtracting 5. Dividing by 2 gives x = 6.",
    source: "uploaded",
  };
}

function makePercentageQuestion(
  prompt: string,
  level: YearLevel,
): LearningQuestion {
  return {
    id: `typed-percentage-${Date.now()}`,
    subject: "Mathematics",
    level,
    topic: "Percentages",
    prompt,
    kind: "short-answer",
    acceptedAnswers: ["20", "20 items", "20 students"],
    hints: [
      "Convert 25% to the decimal 0.25.",
      "Multiply 80 by 0.25.",
    ],
    explanation: "25% of 80 is 0.25 × 80 = 20.",
    source: "uploaded",
  };
}

export const demoTutorEngine: TutorEngine = {
  async analyseQuestion(input) {
    const text = input.questionText.trim();
    const lower = text.toLowerCase();

    if (
      lower.includes("2x") &&
      lower.includes("17")
    ) {
      return {
        question: makeEquationQuestion(text || "Solve 2x + 5 = 17.", input.level),
        matchedAsSample: false,
        note: "Recognised as a linear equation.",
      };
    }

    if (
      lower.includes("25%") &&
      lower.includes("80")
    ) {
      return {
        question: makePercentageQuestion(
          text || "What is 25% of 80?",
          input.level,
        ),
        matchedAsSample: false,
        note: "Recognised as a percentage question.",
      };
    }

    const sample = demoQuestions[0];
    return {
      question: {
        ...sample,
        id: `${sample.id}-${Date.now()}`,
        level: input.level,
        source: input.imageName ? "uploaded" : "sample",
      },
      matchedAsSample: true,
      note: input.imageName
        ? `Image "${input.imageName}" is kept on this device. OCR is represented by a matched sample until the service is connected.`
        : "This prototype matched the input to a sample tutoring flow until the full AI service is connected.",
    };
  },

  checkAnswer(question, answer) {
    const normalised = normaliseAnswer(answer);
    return question.acceptedAnswers.some(
      (accepted) => normaliseAnswer(accepted) === normalised,
    );
  },
};
