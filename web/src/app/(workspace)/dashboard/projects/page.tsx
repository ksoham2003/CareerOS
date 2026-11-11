import Link from "next/link";
import { ArrowRight, Circle, FolderKanban, Rocket, Sparkles, Target } from "lucide-react";
import { summarizeProjectPipeline } from "@/lib/milestone-three";

const projects = [
  { name: "ResolveAI", stage: "Research", owner: "Problem framing", detail: "Define the user problem, outcome metrics, and validation seams before build work begins." },
  { name: "CodeMind", stage: "Build", owner: "Core logic", detail: "Ship the AI-assisted coding workflow and keep the implementation explainable and testable." },
  { name: "AI Mock Interview", stage: "Build", owner: "Practice loop", detail: "Turn interviews into structured practice runs with evidence and clear feedback rubrics." },
  { name: "Portfolio refresh", stage: "Review", owner: "Proof points", detail: "Connect work to measurable outcomes and sharpen the narrative behind each deliverable." },
];

export default function ProjectsPage() {
  const summary = summarizeProjectPipeline(projects);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 3 · Project lab</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Project lab</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Work is tracked as real product progress: framing, building, and reviewing evidence before highlighting a project as finished.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><FolderKanban size={14} />Open work</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{projects.length}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">active entries</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Rocket size={14} />In build</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.byStage.Build ?? 0}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">projects shipping now</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Target size={14} />Focus</div>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#edf0ee]">{summary.nextPriority}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">next priority</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Sparkles size={14} />Momentum</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.activeCount}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">non-review tasks</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.name} className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7d8782]">{project.stage}</p>
                <h2 className="mt-2 text-lg font-semibold text-[#edf0ee]">{project.name}</h2>
              </div>
              <span className="rounded-full border border-[#364b43] bg-[#101d17] px-2 py-1 text-[9px] text-[#9ad4b0]">{project.owner}</span>
            </div>

            <p className="mt-4 text-[11px] leading-6 text-[#9aa29d]">{project.detail}</p>

            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
              <span className="flex items-center gap-2 text-[10px] text-[#728078]"><Circle size={7} className="fill-[#69d19d] text-[#69d19d]" />Tracking active</span>
              <Link href="/dashboard/reports" className="inline-flex items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Review outcomes <ArrowRight size={12} /></Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
