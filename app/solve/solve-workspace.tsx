"use client";

import { useState } from "react";
import { QuestionRunner } from "@/components/question-runner";
import { yearLevels } from "@/lib/demo-data";
import {
  demoTutorEngine,
  type QuestionAnalysisResult,
} from "@/lib/tutor-engine";
import type { YearLevel } from "@/lib/types";

type InputMode = "upload" | "type";

export function SolveWorkspace() {
  const [mode, setMode] = useState<InputMode>(() => {
    if (typeof window === "undefined") return "type";
    return new URLSearchParams(window.location.search).get("mode") === "upload"
      ? "upload"
      : "type";
  });
  const [level, setLevel] = useState<YearLevel>("Year 7");
  const [questionText, setQuestionText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<QuestionAnalysisResult | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState("");

  function chooseMode(nextMode: InputMode) {
    setMode(nextMode);
    setAnalysis(null);
    setError("");
  }

  async function analyseQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "type" && !questionText.trim()) {
      setError("Type a question or choose one of the examples.");
      return;
    }
    if (mode === "upload" && !file) {
      setError("Choose an image before continuing.");
      return;
    }

    setError("");
    setIsAnalysing(true);
    try {
      const imageDataUrl = file ? await readImage(file) : undefined;
      const response = await fetch("/api/tutor/analyse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questionText,
          level,
          imageDataUrl,
          imageName: file?.name,
        }),
      });

      if (!response.ok) {
        throw new Error("The AI tutor is temporarily unavailable.");
      }

      const result = (await response.json()) as QuestionAnalysisResult;
      setAnalysis(result);
    } catch {
      const fallback = await demoTutorEngine.analyseQuestion({
        questionText,
        subject: "Mathematics",
        level,
        imageName: file?.name,
      });
      setAnalysis({
        ...fallback,
        note: `${fallback.note} The secure AI service was unavailable, so SolvePath used its built-in guided example.`,
      });
    } finally {
      setIsAnalysing(false);
    }
  }

  function resetWorkspace() {
    setAnalysis(null);
    setQuestionText("");
    setFile(null);
    setError("");
  }

  if (analysis) {
    return (
      <div className="page-stack">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Guided workspace</p>
            <h1>Work through the question</h1>
            <p className="page-intro">{analysis.note}</p>
          </div>
          <button
            className="button button-secondary"
            onClick={resetWorkspace}
            type="button"
          >
            Add another question
          </button>
        </section>
        <section className="panel runner-panel">
          <div className="step-strip" aria-label="Question help steps">
            <span>1 · Add</span>
            <span className="step-active">2 · Understand</span>
            <span className="step-active">3 · Solve</span>
            <span>4 · Practise</span>
          </div>
          <QuestionRunner key={analysis.question.id} question={analysis.question} />
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Homework help</p>
          <h1>Bring in a maths question</h1>
          <p className="page-intro">
            Upload a clear image or type the question. SolvePath guides the
            thinking before showing an explanation.
          </p>
        </div>
      </section>

      <section className="panel solve-panel">
        <div className="step-strip" aria-label="Question help steps">
          <span className="step-active">1 · Add</span>
          <span>2 · Understand</span>
          <span>3 · Solve</span>
          <span>4 · Practise</span>
        </div>

        <div className="tab-list" role="tablist" aria-label="Question input method">
          <button
            aria-selected={mode === "type"}
            className={mode === "type" ? "tab-button tab-active" : "tab-button"}
            onClick={() => chooseMode("type")}
            role="tab"
            type="button"
          >
            Type a question
          </button>
          <button
            aria-selected={mode === "upload"}
            className={mode === "upload" ? "tab-button tab-active" : "tab-button"}
            onClick={() => chooseMode("upload")}
            role="tab"
            type="button"
          >
            Upload an image
          </button>
        </div>

        <form className="solve-form" onSubmit={analyseQuestion}>
          <div className="form-grid form-grid-single">
            <label>
              <span>Year level</span>
              <select
                onChange={(event) => setLevel(event.target.value as YearLevel)}
                value={level}
              >
                {yearLevels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          {mode === "type" ? (
            <>
              <label className="field-stack" htmlFor="question-text">
                <span>Question</span>
                <textarea
                  id="question-text"
                  onChange={(event) => setQuestionText(event.target.value)}
                  placeholder="For example: Solve 2x + 5 = 17"
                  rows={6}
                  value={questionText}
                />
              </label>
              <div className="sample-row" aria-label="Example questions">
                <span>Try an example:</span>
                <button
                  onClick={() => {
                    setQuestionText("Solve 2x + 5 = 17.");
                  }}
                  type="button"
                >
                  Linear equation
                </button>
                <button
                  onClick={() => {
                    setQuestionText("What is 25% of 80?");
                  }}
                  type="button"
                >
                  Percentage
                </button>
              </div>
            </>
          ) : (
            <label className="upload-field">
              <input
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                type="file"
              />
              <span className="upload-mark" aria-hidden="true">
                +
              </span>
              <strong>{file ? file.name : "Choose a homework image"}</strong>
              <small>PNG, JPG or WebP · one clear question per image</small>
            </label>
          )}

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <p>
              Images are sent securely for analysis only after you press Start.
              Remove names, school details and student IDs before uploading.
            </p>
            <button
              className="button button-primary"
              disabled={isAnalysing}
              type="submit"
            >
              {isAnalysing ? "Analysing…" : "Start guided help"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function readImage(file: File): Promise<string> {
  if (file.size > 8 * 1024 * 1024) {
    return Promise.reject(new Error("Image is larger than 8 MB."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
