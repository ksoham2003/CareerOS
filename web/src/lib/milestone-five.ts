export type CompanyFitInputs = {
  roleFit: number;
  growth: number;
  compensation: number;
  processFit: number;
};

export type JobEntry = {
  company: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected" | string;
};

export function scoreCompanyFit(inputs: CompanyFitInputs) {
  const total = Math.round(
    (inputs.roleFit + inputs.growth + inputs.compensation + inputs.processFit) / 4,
  );

  let decision: "Strong" | "Consider" | "Pass" = "Pass";
  if (total >= 80) decision = "Strong";
  else if (total >= 60) decision = "Consider";

  return {
    total,
    decision,
  };
}

export function summarizeJobPipeline(entries: JobEntry[]) {
  const summary = {
    appliedCount: entries.filter((entry) => entry.status === "Applied").length,
    inFlight: entries.filter((entry) => entry.status === "Applied" || entry.status === "Interview").length,
    nextFollowUp: entries.find((entry) => entry.status === "Interview")?.company ?? entries.find((entry) => entry.status === "Applied")?.company ?? "None",
  };

  return summary;
}
