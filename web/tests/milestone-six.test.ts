import assert from "node:assert/strict";
import test from "node:test";
import { summarizeCoachSignals, summarizeCoverage } from "../src/lib/milestone-six";

test("coach summaries surface the strongest recommendation and the blocking gap", () => {
  const summary = summarizeCoachSignals([
    { label: "Skill gap", score: 82 },
    { label: "Portfolio gap", score: 56 },
    { label: "Interview readiness", score: 68 },
  ]);

  assert.equal(summary.topRecommendation, "Skill gap");
  assert.equal(summary.blocker, "Portfolio gap");
});

test("coverage summaries track readiness and missing system areas accurately", () => {
  const summary = summarizeCoverage([
    { label: "Learning", ready: true },
    { label: "Projects", ready: false },
    { label: "Branding", ready: true },
    { label: "Job search", ready: false },
  ]);

  assert.equal(summary.readyCount, 2);
  assert.equal(summary.missingCount, 2);
  assert.deepEqual(summary.missingAreas, ["Projects", "Job search"]);
});
