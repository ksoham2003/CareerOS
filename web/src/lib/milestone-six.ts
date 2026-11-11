export type CoachSignal = {
  label: string;
  score: number;
};

export type CoverageItem = {
  label: string;
  ready: boolean;
};

export function summarizeCoachSignals(signals: CoachSignal[]) {
  const sorted = [...signals].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const blocker = [...signals].sort((a, b) => a.score - b.score)[0];

  return {
    topRecommendation: strongest?.label ?? "Assess first",
    blocker: blocker?.label ?? "Assess first",
  };
}

export function summarizeCoverage(items: CoverageItem[]) {
  const readyCount = items.filter((item) => item.ready).length;
  const missingAreas = items.filter((item) => !item.ready).map((item) => item.label);

  return {
    readyCount,
    missingCount: missingAreas.length,
    missingAreas,
  };
}
