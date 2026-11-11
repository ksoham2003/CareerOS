import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Link2, PencilRuler } from "lucide-react";
import { summarizeBrandingChecklist } from "@/lib/milestone-four";

const checklist = [
  { label: "Resume headline", complete: true },
  { label: "LinkedIn profile", complete: true },
  { label: "GitHub profile", complete: false },
  { label: "Portfolio case study", complete: false },
  { label: "Target role alignment", complete: false },
];

export default function BrandingPage() {
  const summary = summarizeBrandingChecklist(checklist);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 4 · Career branding</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Career branding</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">This workspace focuses on the professional evidence you need to signal readiness: resume, portfolio, LinkedIn, and project narratives grounded in actual outcomes.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><BriefcaseBusiness size={14} />Progress</div>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.completion}%</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">brand checklist complete</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Link2 size={14} />Active gaps</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.nextActions.length}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">items still to build</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><PencilRuler size={14} />Focus</div>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#edf0ee]">{summary.nextActions[0] ?? "Brand kit complete"}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">next blocker to resolve</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Checklist</h2>
        <div className="mt-4 space-y-3">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#101313] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-md border ${item.complete ? "border-[#355542] bg-[#15241a] text-[#8ad6aa]" : "border-[#3a3c3a] bg-[#141713] text-[#8b938e]"}`}>
                  <CheckCircle2 size={14} />
                </span>
                <span className="text-[11px] text-[#dfe7e3]">{item.label}</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.1em] text-[#75807a]">{item.complete ? "Ready" : "Pending"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Next branded materials</h2>
        <ul className="mt-4 space-y-3 text-[11px] leading-6 text-[#9aa29d]">
          <li>• Upgrade the GitHub profile with a clear project overview and a concise summary of your impact.</li>
          <li>• Add at least one case study that explains why the system was built and what trade-offs were made.</li>
          <li>• Align each resume line to an outcome proven by a project, assessment, or measurable result.</li>
        </ul>
        <Link href="/dashboard/interviews" className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Open interview prep <ArrowRight size={12} /></Link>
      </section>
    </div>
  );
}
