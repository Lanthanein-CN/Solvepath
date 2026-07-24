import Link from "next/link";
import {
  chatGPTSignOutPath,
  requireChatGPTUser,
} from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function DeveloperPage() {
  const user = await requireChatGPTUser("/developer");
  const aiConfigured = Boolean(process.env.GEMINI_API_KEY);

  return (
    <main className="developer-shell">
      <header className="developer-header">
        <div>
          <Link className="brand" href="/app">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span>
              <strong>SolvePath</strong>
              <small>Developer console</small>
            </span>
          </Link>
        </div>
        <div className="developer-user">
          <span>{user.displayName}</span>
          <Link href={chatGPTSignOutPath("/developer")}>Sign out</Link>
        </div>
      </header>

      <section className="developer-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Protected developer endpoint</p>
            <h1>System overview</h1>
            <p className="page-intro">
              Monitor the tutoring pipeline and prepare production services
              without exposing keys or internal controls to students.
            </p>
          </div>
          <Link className="button button-secondary" href="/app">
            Open student app
          </Link>
        </div>

        <section className="developer-grid" aria-label="Service status">
          <StatusCard
            detail={aiConfigured ? "Gemini API connected" : "Add GEMINI_API_KEY"}
            label="AI tutor"
            ready={aiConfigured}
          />
          <StatusCard
            detail={aiConfigured ? "Gemini vision connected" : "Uses Gemini connection"}
            label="Image OCR"
            ready={aiConfigured}
          />
          <StatusCard
            detail="ChatGPT identity protection"
            label="Developer access"
            ready
          />
          <StatusCard
            detail="D1 learning records are next"
            label="Cloud database"
            ready={false}
          />
        </section>

        <section className="developer-panels">
          <article className="panel">
            <p className="eyebrow">API routes</p>
            <h2>Connected services</h2>
            <div className="developer-table">
              <div><code>POST /api/tutor/analyse</code><span>Text and image maths analysis</span></div>
              <div><code>GET /api/developer/status</code><span>Protected configuration health</span></div>
            </div>
          </article>

          <article className="panel">
            <p className="eyebrow">Next infrastructure step</p>
            <h2>Persistent learning data</h2>
            <p className="page-intro">
              Student attempts and mistake-book records still remain on the
              current device. The next milestone will add accounts and a cloud
              database before public student access.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}

function StatusCard({
  detail,
  label,
  ready,
}: {
  detail: string;
  label: string;
  ready: boolean;
}) {
  return (
    <article className="metric-card developer-status-card">
      <div className="developer-status-line">
        <span className="metric-label">{label}</span>
        <span className={ready ? "status status-mastered" : "status status-review"}>
          {ready ? "Ready" : "Pending"}
        </span>
      </div>
      <strong>{ready ? "Operational" : "Setup required"}</strong>
      <p>{detail}</p>
    </article>
  );
}
