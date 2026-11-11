export type ProjectStage = "Research" | "Build" | "Review";

export type ProjectSignal = {
  name: string;
  stage: ProjectStage | string;
  owner?: string;
};

export type WeeklyFocusEntry = {
  day: string;
  plannedMinutes: number;
  actualMinutes: number;
};

export type StudySessionActivity = {
  category: string;
  durationMinutes: number;
  completedAt: Date;
};

export function summarizeProjectPipeline(projects: ProjectSignal[]) {
  const byStage = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.stage] = (acc[project.stage] ?? 0) + 1;
    return acc;
  }, {});

  const activeCount = projects.filter((project) => project.stage === "Build").length;
  const nextPriority = projects.find((project) => project.stage === "Build")?.name ?? projects[0]?.name ?? "None";

  return {
    byStage,
    activeCount,
    nextPriority,
  };
}

export function summarizeWeeklyFocus(entries: WeeklyFocusEntry[]) {
  const totalPlanned = entries.reduce((sum, entry) => sum + entry.plannedMinutes, 0);
  const totalActual = entries.reduce((sum, entry) => sum + entry.actualMinutes, 0);
  const adherence = totalPlanned === 0 ? 0 : Math.min(100, Math.round((totalActual / totalPlanned) * 100));

  const lowestDay = entries.reduce<WeeklyFocusEntry | null>((lowest, entry) => {
    if (!lowest || entry.actualMinutes < lowest.actualMinutes) {
      return entry;
    }
    return lowest;
  }, null)?.day ?? "N/A";

  return {
    totalPlanned,
    totalActual,
    adherence,
    lowestDay,
  };
}

export function summarizeStudySessions(sessions: StudySessionActivity[], now = new Date()) {
  const weekStart = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const recentSessions = sessions.filter((session) => {
    const completedAt = session.completedAt.getTime();
    return completedAt >= weekStart && completedAt <= now.getTime();
  });
  const categoryMinutes = recentSessions.reduce<Record<string, number>>((totals, session) => {
    totals[session.category] = (totals[session.category] ?? 0) + session.durationMinutes;
    return totals;
  }, {});
  const totalMinutes = recentSessions.reduce((total, session) => total + session.durationMinutes, 0);

  return {
    totalMinutes,
    sessionCount: recentSessions.length,
    averageMinutes: recentSessions.length === 0 ? 0 : Math.round(totalMinutes / recentSessions.length),
    focusCategory: Object.entries(categoryMinutes).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "No activity",
    categoryMinutes,
  };
}
