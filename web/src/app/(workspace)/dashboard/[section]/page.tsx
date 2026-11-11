import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleDashed, LockKeyhole } from "lucide-react";

const sections: Record<string, { title: string; description: string; milestone: string; scope: string[] }> = {
  planner: { title: "Daily planner", description: "Create your own study areas, set time targets, and record completed sessions.", milestone: "Milestone 2", scope: ["Owner-saved study areas", "Completed-session history", "Totals from recorded activity"] },
  learning: { title: "Learning academy", description: "Review the study areas you have saved in your private plan.", milestone: "Milestone 2", scope: ["Owner-entered topics", "Planned time targets", "Session history linked to study areas"] },
  skills: { title: "Skill intelligence", description: "Track proficiency from assessments and practical evidence—not from watching a course alone.", milestone: "Milestone 2", scope: ["Evidence-backed skill assessments", "Weaknesses and next actions", "Confidence and evidence freshness"] },
  projects: { title: "Project lab", description: "Move portfolio projects from problem definition through deployed, explainable engineering work.", milestone: "Milestone 3", scope: ["ResolveAI, CodeMind AI, and AI Mock Interview", "Milestones, tasks, and technical decisions", "Transparent quality review"] },
  branding: { title: "Career branding", description: "Build a verifiable resume, professional profile, and portfolio grounded in your actual work.", milestone: "Milestone 5", scope: ["Resume versions and job-description matching", "LinkedIn, GitHub, and portfolio checklists", "No fabricated achievements"] },
  interviews: { title: "Interview preparation", description: "Practice technical and behavioral interviews with clear rubrics and evidence-based feedback.", milestone: "Milestone 4", scope: ["Timed practice and question bank", "DSA, system design, and behavioral rubrics", "Separate subjective review from verified execution"] },
  jobs: { title: "JobRadar", description: "Track verified opportunities and applications in one owner-controlled pipeline.", milestone: "Milestone 5", scope: ["Manual job entry and verified links", "Resume matching and skill gaps", "Application statuses and follow-ups"] },
  companies: { title: "Company intelligence", description: "Keep sourced company research, interview information, and compensation estimates distinguishable.", milestone: "Milestone 5", scope: ["Research sources and last-verified dates", "Separate facts from estimates", "Career and readiness fit"] },
  productivity: { title: "Productivity", description: "Review completed focus sessions recorded in your private workspace.", milestone: "Milestone 3", scope: ["Saved focus sessions", "Seven-day actual-time totals", "No inferred activity"] },
  coach: { title: "AI career coach", description: "Get continuity-aware recommendations grounded in your authorized learning and career records.", milestone: "Milestone 6", scope: ["Optional provider-backed AI", "Explainable recommendations with feedback", "Safe unavailable state without an API key"] },
  reports: { title: "Reports & analytics", description: "Review progress calculated from persisted study, assessments, projects, and applications.", milestone: "Milestone 3", scope: ["Weekly and monthly evidence summaries", "Real-data charts and CSV exports", "No decorative or invented statistics"] },
  settings: { title: "Settings", description: "Manage your private owner profile and account security.", milestone: "Milestone 1", scope: ["Career profile and editable goals", "Optional study preferences", "Password and active sessions"] },
  profile: { title: "Career profile", description: "Set up your current experience and target so CareerOS can personalize your workspace.", milestone: "Milestone 1", scope: ["Education, experience, and current skills", "Career goals and target compensation", "Optional preparation preferences"] },
  roadmap: { title: "12-month roadmap", description: "A flexible preparation outline that adapts to your demonstrated strengths and gaps.", milestone: "Milestone 1", scope: ["Foundation through job search phases", "Assessments can reorder focus", "No senior-level readiness assumptions"] },
};

export default async function CareerSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const content = sections[section];

  if (!content) {
    return <div className="mx-auto max-w-2xl rounded-xl border border-white/[0.08] bg-[#0d1010] p-8"><p className="text-xs text-[#8d9691]">This section isn&apos;t available.</p><Link className="mt-4 inline-flex items-center gap-2 text-xs text-[#9bd9b7]" href="/dashboard"><ArrowLeft size={14} />Back to command center</Link></div>;
  }

  const isFoundation = content.milestone === "Milestone 1";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-[11px] text-[#858e89] hover:text-[#d4dbd6]"><ArrowLeft size={14} />Command center</Link>
      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-6 sm:p-8">
        <div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#354039] bg-[#151a17] text-[#87cba2]"><CircleDashed size={18} /></span><div><div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#849089]"><LockKeyhole size={11} />Private workspace <span className="text-[#4d5650]">·</span>{content.milestone}</div><h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e2e7e3]">{content.title}</h1><p className="mt-2 max-w-xl text-xs leading-6 text-[#929b96]">{content.description}</p></div></div>
        <div className="mt-8 rounded-lg border border-[#343125] bg-[#17150f] px-4 py-3"><p className="text-[11px] font-medium text-[#d9c68e]">{isFoundation ? "Profile setup is next in the foundation milestone." : `${content.milestone} · planned, not implemented yet`}</p><p className="mt-1 text-[10px] leading-5 text-[#918a72]">This page is intentionally not presenting sample data or inactive controls as working features. Implementation progress is tracked in DEVELOPMENT_STATUS.md.</p></div>
        <div className="mt-6"><h2 className="mb-3 text-[11px] font-semibold text-[#cbd1cd]">Planned capabilities</h2><ul className="space-y-3">{content.scope.map((item) => <li key={item} className="flex items-center gap-3 text-[11px] text-[#9ba49e]"><span className="h-1 w-1 rounded-full bg-[#70c896]" />{item}</li>)}</ul></div>
        <Link className="mt-8 inline-flex items-center gap-2 rounded-md border border-white/[0.09] px-3 py-2 text-[10px] font-medium text-[#b8c0bb] hover:bg-white/[0.04]" href="/dashboard">Return to dashboard <ArrowRight size={13} /></Link>
      </section>
    </div>
  );
}
