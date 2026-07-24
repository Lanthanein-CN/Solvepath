"use client";

import { useState } from "react";
import { useLearning } from "@/components/learning-provider";
import { QuestionRunner } from "@/components/question-runner";
import type { LearningQuestion, MistakeStatus } from "@/lib/types";

const filters: Array<{ value: "all" | MistakeStatus; label: string }> = [
  { value: "all", label: "All questions" },
  { value: "new", label: "New" },
  { value: "practising", label: "Practising" },
  { value: "mastered", label: "Mastered" },
];

export function MistakesWorkspace() {
  const { state, setMistakeStatus } = useLearning();
  const [filter, setFilter] = useState<"all" | MistakeStatus>("all");
  const [selectedQuestion, setSelectedQuestion] =
    useState<LearningQuestion | null>(null);

  const visibleMistakes = state.mistakes.filter(
    (mistake) => filter === "all" || mistake.status === filter,
  );

  if (selectedQuestion) {
    return (
      <div className="page-stack">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Mistake review</p>
            <h1>Try it again</h1>
            <p className="page-intro">
              Rework the question without looking back at the previous answer.
            </p>
          </div>
          <button
            className="button button-secondary"
            onClick={() => setSelectedQuestion(null)}
            type="button"
          >
            Back to mistake book
          </button>
        </section>
        <section className="panel runner-panel">
          <QuestionRunner
            key={selectedQuestion.id}
            finishLabel="Return to mistake book"
            onFinish={() => setSelectedQuestion(null)}
            question={selectedQuestion}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Mistake book</p>
          <h1>Turn mistakes into a study plan</h1>
          <p className="page-intro">
            Review what went wrong, try again and mark the topic as mastered
            when it feels secure.
          </p>
        </div>
        <label className="compact-field">
          <span className="sr-only">Filter mistakes</span>
          <select
            onChange={(event) =>
              setFilter(event.target.value as "all" | MistakeStatus)
            }
            value={filter}
          >
            {filters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {visibleMistakes.length === 0 ? (
        <section className="panel empty-state">
          <span className="empty-mark" aria-hidden="true">
            M
          </span>
          <h2>No questions in this view</h2>
          <p>
            Choose another filter or answer a practice question to update the
            mistake book.
          </p>
        </section>
      ) : (
        <section className="mistake-list">
          {visibleMistakes.map((mistake) => (
            <article className="panel mistake-card" key={mistake.id}>
              <div className="mistake-topline">
                <span className="subject-pill">{mistake.question.subject}</span>
                <span className={`status status-${mistake.status}`}>
                  {mistake.status}
                </span>
              </div>
              <h2>{mistake.question.prompt}</h2>
              <dl className="mistake-details">
                <div>
                  <dt>Topic</dt>
                  <dd>{mistake.question.topic}</dd>
                </div>
                <div>
                  <dt>Last answer</dt>
                  <dd>{mistake.lastAnswer}</dd>
                </div>
                <div>
                  <dt>Attempts</dt>
                  <dd>{mistake.attempts}</dd>
                </div>
              </dl>
              <div className="card-actions">
                <button
                  className="button button-primary"
                  onClick={() => setSelectedQuestion(mistake.question)}
                  type="button"
                >
                  Practise again
                </button>
                <button
                  className="button button-secondary"
                  onClick={() =>
                    setMistakeStatus(
                      mistake.id,
                      mistake.status === "mastered" ? "practising" : "mastered",
                    )
                  }
                  type="button"
                >
                  {mistake.status === "mastered"
                    ? "Move back to practice"
                    : "Mark as mastered"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
