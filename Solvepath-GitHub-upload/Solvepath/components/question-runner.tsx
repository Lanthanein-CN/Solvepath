"use client";

import { useState } from "react";
import { useLearning } from "@/components/learning-provider";
import { demoTutorEngine } from "@/lib/tutor-engine";
import type { LearningQuestion } from "@/lib/types";

interface QuestionRunnerProps {
  question: LearningQuestion;
  onFinish?: () => void;
  finishLabel?: string;
}

export function QuestionRunner({
  question,
  onFinish,
  finishLabel = "Finish",
}: QuestionRunnerProps) {
  const { recordAttempt } = useLearning();
  const [answer, setAnswer] = useState("");
  const [hintsShown, setHintsShown] = useState(0);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function showNextHint() {
    setHintsShown((current) => Math.min(current + 1, question.hints.length));
  }

  function checkAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim() || submitted) return;
    const correct = demoTutorEngine.checkAnswer(question, answer);
    setResult(correct ? "correct" : "incorrect");
    setSubmitted(true);
    recordAttempt({
      question,
      answer,
      correct,
      hintsUsed: hintsShown,
    });
  }

  return (
    <article className="question-runner">
      <div className="question-meta">
        <span className="subject-pill">{question.subject}</span>
        <span>{question.level}</span>
        <span>{question.topic}</span>
      </div>
      <h2 className="question-prompt">{question.prompt}</h2>

      {hintsShown > 0 && (
        <div className="hint-stack" aria-label="Hints">
          {question.hints.slice(0, hintsShown).map((hint, index) => (
            <div className="hint-card" key={`${question.id}-hint-${index}`}>
              <strong>Hint {index + 1}</strong>
              <p>{hint}</p>
            </div>
          ))}
        </div>
      )}

      <form className="answer-form" onSubmit={checkAnswer}>
        <label htmlFor={`answer-${question.id}`}>Your answer</label>
        <div className="answer-row">
          <input
            autoComplete="off"
            disabled={submitted}
            id={`answer-${question.id}`}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer"
            value={answer}
          />
          <button
            className="button button-primary"
            disabled={!answer.trim() || submitted}
            type="submit"
          >
            Check answer
          </button>
        </div>
      </form>

      {!submitted && hintsShown < question.hints.length && (
        <button className="link-button" onClick={showNextHint} type="button">
          Give me a hint
        </button>
      )}

      <div aria-live="polite">
        {result === "correct" && (
          <div className="feedback feedback-correct">
            <strong>Correct — well done.</strong>
            <p>{question.explanation}</p>
          </div>
        )}
        {result === "incorrect" && (
          <div className="feedback feedback-incorrect">
            <strong>Not quite yet.</strong>
            <p>
              This question has been added to your mistake book. Review a hint,
              then try a similar question in practice.
            </p>
          </div>
        )}
      </div>

      {submitted && onFinish && (
        <button
          className="button button-secondary runner-finish"
          onClick={onFinish}
          type="button"
        >
          {finishLabel}
        </button>
      )}
    </article>
  );
}
