import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function renderRoute(worker, path) {
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  return response;
}

test("renders development preview metadata", async () => {
  const worker = await loadWorker();
  const response = await renderRoute(worker, "/");

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders every core learning route", async () => {
  const worker = await loadWorker();
  const routes = [
    ["/", "Student workspace"],
    ["/solve", "Homework help"],
    ["/practice", "Practice"],
    ["/mistakes", "Mistake book"],
    ["/progress", "Progress"],
  ];

  for (const [path, expectedText] of routes) {
    const response = await renderRoute(worker, path);
    assert.equal(response.status, 200, `${path} should return 200`);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
    );
    assert.match(await response.text(), new RegExp(expectedText, "i"));
  }
});
