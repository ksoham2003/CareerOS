import assert from "node:assert/strict";
import test from "node:test";
import { scoreInterviewAnswer, summarizeBrandingChecklist } from "../src/lib/milestone-four";

test("interview scoring balances rubric categories and flags weak areas", () => {
  const score = scoreInterviewAnswer({
    structure: 85,
    correctness: 72,
    communication: 80,
    tradeoffs: 48,
  });

  assert.equal(score.total, 71);
  assert.deepEqual(score.focusAreas, ["tradeoffs"]);
});

test("branding overview groups completion and next blockers clearly", () => {
  const summary = summarizeBrandingChecklist([
    { label: "Resume headline", complete: true },
    { label: "LinkedIn profile", complete: true },
    { label: "GitHub profile", complete: false },
    { label: "Portfolio case study", complete: false },
  ]);

  assert.equal(summary.completion, 50);
  assert.deepEqual(summary.nextActions, ["GitHub profile", "Portfolio case study"]);
});
