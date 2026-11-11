import assert from "node:assert/strict";
import test from "node:test";
import { scoreCompanyFit, summarizeJobPipeline } from "../src/lib/milestone-five";

test("company fit scores reward role match while penalising mismatches", () => {
  const score = scoreCompanyFit({
    roleFit: 88,
    growth: 72,
    compensation: 80,
    processFit: 54,
  });

  assert.equal(score.total, 74);
  assert.deepEqual(score.decision, "Consider");
});

test("job summariser tracks application momentum and follow-up requirements", () => {
  const summary = summarizeJobPipeline([
    { company: "Northstar", status: "Applied" },
    { company: "Crest", status: "Interview" },
    { company: "Atlas", status: "Applied" },
    { company: "Flux", status: "Offer" },
  ]);

  assert.equal(summary.appliedCount, 2);
  assert.equal(summary.inFlight, 3);
  assert.equal(summary.nextFollowUp, "Crest");
});
