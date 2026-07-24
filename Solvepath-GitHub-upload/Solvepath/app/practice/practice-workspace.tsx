"use client";

import { useState } from "react";
import { QuestionRunner } from "@/components/question-runner";
import { demoQuestions } from "@/lib/demo-data";

export function PracticeWorkspace() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  function startPractice(index: number) {
    setActiveIndex(index);
    setSessionComplete(false);
  }

  function finishQuestion() {
    if (activeIndex === null) return;
    if (activeIndex < demoQuestions.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(null);
      setSessionComplete(true);
    }
  }

  if (activeIndex !== null) {
    const question = demoQuestions[activeIndex];
    const progress = Math.round(
      ((activeIndex + 1) / demoQuestions.length) * 100,
    );
    return (
      <div className="page-stack">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Practice session</p>
            <h1>
              Question {activeIndex + 1} of {demoQuestions.length}
            </h1>
            <p className="page-intro">
              Use a hint when you need one. The goal is to understand the next
              step, not to rush.
            </p>
          </div>
          <button
            className="button button-secondary"
            onClick={() => setActiveIndex(null)}
            type="button"
          >
            Leave session
          </button>
        </section>
        <div className="progress-track session-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <section className="panel runner-panel">
          <QuestionRunner
            key={question.id}
            finishLabel={
              activeIndex === demoQuestions.length - 1
                ? "Complete session"
                : "Next question"
            }
            onFinish={finishQuestion}
            question={question}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Practice</p>
          <h1>Build confidence one topic at a time</h1>
          <p className="page-intro">
            Recommended questions adapt to recent answers and mistakes stored
            on this device.
          </p>
        </div>
      </section>

      {sessionComplete && (
        <div className="feedback feedback-correct" role="status">
          <strong>Practice complete.</strong>
          <p>Your answers are now reflected in Progress and the Mistake book.</p>
        </div>
      )}

      <section className="topic-card-grid">
        {demoQuestions.map((question, index) => (
          <article className="panel practice-card" key={question.id}>
            <div className="practice-card-topline">
              <span className="subject-pill">{question.subject}</span>
              <span>{question.level}</span>
            </div>
            <h2>{question.topic}</h2>
            <p>{index === 0 ? "Recommended review" : "Ready when you are"}</p>
            <button
              className="button button-secondary"
              onClick={() => startPractice(index)}
              type="button"
            >
              Start here
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
