export type SkillSignal = {
  name: string;
  score: number;
  evidence: string;
};

export function summarizeSkillReadiness(skills: SkillSignal[]) {
  const safeSkills = skills.filter((skill) => Number.isFinite(skill.score) && skill.score >= 0 && skill.score <= 100);
  const overall = safeSkills.length === 0
    ? 0
    : Math.round(safeSkills.reduce((sum, skill) => sum + skill.score, 0) / safeSkills.length);

  const gaps = [...safeSkills]
    .filter((skill) => skill.score < 70)
    .sort((a, b) => a.score - b.score);

  const strongAreas = [...safeSkills]
    .filter((skill) => skill.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    overall,
    focusArea: gaps[0]?.name ?? "Assess first",
    strongAreas,
    gaps,
    nextAction: gaps[0]
      ? `Priority: improve ${gaps[0].name.toLowerCase()} with one evidence-backed exercise.`
      : "Current strengths are above the baseline; keep adding evidence.",
  };
}

