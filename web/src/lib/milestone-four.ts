export type InterviewRubric = {
  structure: number;
  correctness: number;
  communication: number;
  tradeoffs: number;
};

export type BrandingItem = {
  label: string;
  complete: boolean;
};

export function scoreInterviewAnswer(rubric: InterviewRubric) {
  const total = Math.round(
    (rubric.structure * 0.25) +
    (rubric.correctness * 0.3) +
    (rubric.communication * 0.2) +
    (rubric.tradeoffs * 0.25),
  );

  const focusAreas = Object.entries({
    structure: rubric.structure,
    correctness: rubric.correctness,
    communication: rubric.communication,
    tradeoffs: rubric.tradeoffs,
  })
    .filter(([, score]) => score < 60)
    .map(([key]) => key);

  return {
    total,
    focusAreas,
  };
}

export function summarizeBrandingChecklist(items: BrandingItem[]) {
  const complete = items.filter((item) => item.complete).length;
  const completion = items.length === 0 ? 0 : Math.round((complete / items.length) * 100);
  const nextActions = items.filter((item) => !item.complete).map((item) => item.label);

  return {
    completion,
    nextActions,
  };
}
