import assert from "node:assert/strict";
import test from "node:test";
import { summarizeSkillReadiness } from "../src/lib/milestone-two";

test("skill readiness summaries identify the weakest area and overall confidence", () => {
  const summary = summarizeSkillReadiness([
    { name: "DSA", score: 82, evidence: "Solved 18 arrays and graphs problems" },
    { name: "Backend", score: 68, evidence: "Built one CRUD service" },
    { name: "System design", score: 41, evidence: "Explained a basic architecture" },
    { name: "Communication", score: 74, evidence: "Delivered two mock walkthroughs" },
  ]);

  assert.equal(summary.overall, 66);
  assert.equal(summary.focusArea, "System design");
  assert.deepEqual(summary.strongAreas.map((item) => item.name), ["DSA", "Communication"]);
  assert.equal(summary.gaps[0].name, "System design");
});

test("summary handles empty data without breaking", () => {
  const summary = summarizeSkillReadiness([]);
  assert.equal(summary.overall, 0);
  assert.equal(summary.focusArea, "Assess first");
  assert.deepEqual(summary.strongAreas, []);
  assert.deepEqual(summary.gaps, []);
});
