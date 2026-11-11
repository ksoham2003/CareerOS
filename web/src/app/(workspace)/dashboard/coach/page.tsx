import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, Sparkles, Target } from "lucide-react";
import { summarizeCoachSignals, summarizeCoverage } from "@/lib/milestone-six";

const signals = [
  { label: "Skill gap", score: 82 },
  { label: "Portfolio gap", score: 56 },
  { label: "Interview readiness", score: 68 },
];

const coverage = [
  { label: "Learning", ready: true },
  { label: "Projects", ready: false },
  { label: "Branding", ready: true },
  { label: "Job search", ready: false },
];

export default function CoachPage() {
  const coach = summarizeCoachSignals(signals);
  const system = summarizeCoverage(coverage);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 6 · AI career coach</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">AI career coach</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Recommendations stay grounded in your visible evidence and the current state of your preparation across skills, projects, branding, and job search.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Sparkles size={14} />Top recommendation</div>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#edf0ee]">{coach.topRecommendation}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">highest confidence action</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Target size={14} />Blocking gap</div>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#edf0ee]">{coach.blocker}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">needs immediate attention</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Bot size={14} />System health</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{system.readyCount}/{coverage.length}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">areas ready</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Current coach guidance</h2>
        <div className="mt-4 space-y-3">
          {signals.map((signal) => (
            <div key={signal.label} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#101313] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#e2e7e4]">{signal.label}</p>
                <p className="mt-1 text-[10px] text-[#7d867f]">Evidence-based assessment signal</p>
              </div>
              <span className="rounded-full border border-[#364b43] bg-[#101d17] px-2 py-1 text-[9px] text-[#9ad4b0]">{signal.score}/100</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Coverage map</h2>
        <div className="mt-4 space-y-3">
          {coverage.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#101313] px-4 py-3">
              <span className="text-[11px] text-[#dfe7e3]">{item.label}</span>
              <span className={`rounded-full border px-2 py-1 text-[9px] ${item.ready ? "border-[#355542] bg-[#15241a] text-[#8ad6aa]" : "border-[#3a3c3a] bg-[#141713] text-[#8b938e]"}`}>
                {item.ready ? "Ready" : "Missing"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-[#2e3d34] bg-[#121c18] p-4 text-[11px] leading-6 text-[#a5d8b3]">
          <span className="inline-flex items-center gap-2"><BrainCircuit size={14} />AI recommendations will appear only when the system has sufficient evidence and a valid provider configuration.</span>
        </div>

        <Link href="/dashboard/reports" className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Review evidence pipeline <ArrowRight size={12} /></Link>
      </section>
    </div>
  );
}
