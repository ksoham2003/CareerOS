import assert from "node:assert/strict";
import test from "node:test";
import { summarizeProjectPipeline, summarizeStudySessions, summarizeWeeklyFocus } from "../src/lib/milestone-three";

test("project pipeline summarises stage counts and readiness", () => {
  const summary = summarizeProjectPipeline([
    { name: "ResolveAI", stage: "Research" },
    { name: "CodeMind", stage: "Build" },
    { name: "AI Mock Interview", stage: "Build" },
    { name: "Portfolio refresh", stage: "Review" },
  ]);

  assert.deepEqual(summary.byStage, {
    Research: 1,
    Build: 2,
    Review: 1,
  });
  assert.equal(summary.activeCount, 2);
  assert.equal(summary.nextPriority, "CodeMind");
});

test("weekly focus summaries preserve evidence and cap at zero", () => {
  const summary = summarizeWeeklyFocus([
    { day: "Mon", plannedMinutes: 90, actualMinutes: 75 },
    { day: "Tue", plannedMinutes: 120, actualMinutes: 90 },
    { day: "Wed", plannedMinutes: 30, actualMinutes: 45 },
  ]);

  assert.equal(summary.totalPlanned, 240);
  assert.equal(summary.totalActual, 210);
  assert.equal(summary.adherence, 88);
  assert.equal(summary.lowestDay, "Wed");
});

test("study session summary includes only the last seven days and groups actual minutes", () => {
  const now = new Date("2026-11-11T12:00:00.000Z");
  const summary = summarizeStudySessions([
    { category: "DSA", durationMinutes: 45, completedAt: new Date("2026-11-11T10:00:00.000Z") },
    { category: "DSA", durationMinutes: 30, completedAt: new Date("2026-11-07T10:00:00.000Z") },
    { category: "Core CS", durationMinutes: 60, completedAt: new Date("2026-11-03T11:59:59.000Z") },
    { category: "Future", durationMinutes: 10, completedAt: new Date("2026-11-11T12:00:01.000Z") },
  ], now);

  assert.equal(summary.totalMinutes, 75);
  assert.equal(summary.sessionCount, 2);
  assert.equal(summary.averageMinutes, 38);
  assert.equal(summary.focusCategory, "DSA");
});
