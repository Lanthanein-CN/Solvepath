"use client";

import Link from "next/link";
import { useLearning } from "@/components/learning-provider";
import { recentTopics } from "@/lib/demo-data";

export function DashboardWorkspace() {
  const { state } = useLearning();
  const { profile } = state;
  const goalPercent = Math.min(
    100,
    Math.round((profile.weeklyCompleted / profile.weeklyGoal) * 100),
  );
  const activeMistakes = state.mistakes.filter(
    (mistake) => mistake.status !== "mastered",
  ).length;

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Student workspace</p>
          <h1>Good afternoon, {profile.firstName}</h1>
          <p className="page-intro">
            Pick up where you left off, or bring in a new maths question.
          </p>
        </div>
        <Link className="button button-primary" href="/solve">
          Add a question
        </Link>
      </section>

      <section className="metric-grid" aria-label="Learning overview">
        <article className="metric-card">
          <span className="metric-label">Weekly goal</span>
          <strong>
            {profile.weeklyCompleted}/{profile.weeklyGoal}
          </strong>
          <div
            aria-label={`${goalPercent}% of weekly goal completed`}
            className="progress-track"
          >
            <span style={{ width: `${goalPercent}%` }} />
          </div>
        </article>
        <article className="metric-card">
          <span className="metric-label">Current streak</span>
          <strong>{profile.streakDays} days</strong>
          <p>One short practice keeps it going.</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Questions to revisit</span>
          <strong>{activeMistakes}</strong>
          <Link className="text-link" href="/mistakes">
            Open mistake book
          </Link>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Quick start</p>
              <h2>What do you need help with?</h2>
            </div>
          </div>
          <div className="action-grid">
            <Link className="action-card" href="/solve?mode=upload">
              <span className="action-icon" aria-hidden="true">
                01
              </span>
              <span>
                <strong>Upload a maths question</strong>
                <small>Use a photo or screenshot of one problem</small>
              </span>
            </Link>
            <Link className="action-card" href="/solve?mode=type">
              <span className="action-icon" aria-hidden="true">
                02
              </span>
              <span>
                <strong>Type a maths question</strong>
                <small>Get guided, step-by-step working</small>
              </span>
            </Link>
            <Link className="action-card" href="/practice">
              <span className="action-icon" aria-hidden="true">
                03
              </span>
              <span>
                <strong>Start practice</strong>
                <small>Review recommended topics</small>
              </span>
            </Link>
          </div>
        </article>

        <aside className="panel recommendation-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">This week</p>
              <h2>Suggested next step</h2>
            </div>
          </div>
          <div className="recommendation">
            <span className="subject-pill">Mathematics</span>
            <h3>Equivalent fractions</h3>
            <p>A short review based on your most recent practice.</p>
            <Link className="button button-secondary button-full" href="/practice">
              Begin 5-question review
            </Link>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Learning history</p>
            <h2>Recent topics</h2>
          </div>
          <Link className="text-link" href="/progress">
            View all progress
          </Link>
        </div>
        <div className="topic-list">
          {recentTopics.map((topic) => (
            <article className="topic-row" key={topic.id}>
              <span className="topic-mark" aria-hidden="true">
                {topic.subject.slice(0, 1)}
              </span>
              <div>
                <strong>{topic.title}</strong>
                <p>
                  {topic.level}
                </p>
              </div>
              <span className={`status status-${topic.status}`}>
                {topic.statusLabel}
              </span>
            </article>
          ))}
        </div>
      </section>

      <aside className="build-note" role="note">
        <strong>Maths-first workspace:</strong> typed questions can use the
        connected AI tutor when the service is enabled. Uploaded images are
        only sent after the student chooses to analyse them.
      </aside>
    </div>
  );
}
