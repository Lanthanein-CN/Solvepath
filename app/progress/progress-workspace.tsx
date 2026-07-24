"use client";

import { useLearning } from "@/components/learning-provider";

export function ProgressWorkspace() {
  const { state, resetDemo } = useLearning();
  const { attempts, profile } = state;
  const correctAttempts = attempts.filter((attempt) => attempt.correct).length;
  const accuracy = attempts.length
    ? Math.round((correctAttempts / attempts.length) * 100)
    : 0;

  const topicStats = Array.from(
    new Set(attempts.map((attempt) => attempt.topic)),
  ).map((topic) => {
    const topicAttempts = attempts.filter((attempt) => attempt.topic === topic);
    const correct = topicAttempts.filter((attempt) => attempt.correct).length;
    return {
      topic,
      attempts: topicAttempts.length,
      accuracy: Math.round((correct / topicAttempts.length) * 100),
    };
  });
  const strongest = [...topicStats].sort((a, b) => b.accuracy - a.accuracy)[0];

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Progress</p>
          <h1>See what is improving</h1>
          <p className="page-intro">
            This report updates from answers recorded on the current device.
          </p>
        </div>
        <button
          className="button button-secondary"
          onClick={resetDemo}
          type="button"
        >
          Reset demo data
        </button>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">Questions recorded</span>
          <strong>{attempts.length}</strong>
          <p>
            {profile.weeklyCompleted} of {profile.weeklyGoal} in the weekly goal
          </p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Overall accuracy</span>
          <strong>{accuracy}%</strong>
          <p>{correctAttempts} correct responses</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Strongest maths topic</span>
          <strong>{strongest?.topic ?? "Not enough data"}</strong>
          <p>
            {strongest ? `${strongest.accuracy}% accuracy` : "Complete practice"}
          </p>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Topic breakdown</p>
            <h2>Accuracy by maths topic</h2>
          </div>
        </div>
        <div className="subject-report">
          {topicStats.map((item) => (
            <article key={item.topic}>
              <div>
                <strong>{item.topic}</strong>
                <span>
                  {item.attempts} {item.attempts === 1 ? "answer" : "answers"}
                </span>
              </div>
              <div
                aria-label={`${item.topic}: ${item.accuracy}% accuracy`}
                className="report-track"
              >
                <span style={{ width: `${item.accuracy}%` }} />
              </div>
              <strong>{item.accuracy}%</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Latest answers</h2>
            </div>
          </div>
          <div className="attempt-list">
            {attempts.slice(0, 5).map((attempt) => (
              <div className="attempt-row" key={attempt.id}>
                <span
                  className={
                    attempt.correct
                      ? "attempt-result result-correct"
                      : "attempt-result result-incorrect"
                  }
                  aria-hidden="true"
                >
                  {attempt.correct ? "✓" : "×"}
                </span>
                <span>
                  <strong>{attempt.topic}</strong>
                  <small>{attempt.subject}</small>
                </span>
                <span>{attempt.hintsUsed} hints</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Report framework</p>
              <h2>Next connection</h2>
            </div>
          </div>
          <p className="panel-copy">
            A later parent account can receive the same weekly summary once
            authentication, cloud storage and notifications are connected.
          </p>
        </aside>
      </section>
    </div>
  );
}
