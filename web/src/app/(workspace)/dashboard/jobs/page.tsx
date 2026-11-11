import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Target } from "lucide-react";
import { summarizeJobPipeline } from "@/lib/milestone-five";

const jobs = [
  { company: "Northstar", status: "Applied" },
  { company: "Crest", status: "Interview" },
  { company: "Atlas", status: "Applied" },
  { company: "Flux", status: "Offer" },
];

export default function JobsPage() {
  const summary = summarizeJobPipeline(jobs);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 5 · JobRadar</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">JobRadar</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Track applications and prioritize follow-ups based on evidence, not optimism. Every company record remains tied to a real role and a real status change.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><BriefcaseBusiness size={14} />Applied</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.appliedCount}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">roles submitted</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Clock3 size={14} />In flight</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.inFlight}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">ongoing conversations</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Target size={14} />Follow-up</div>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#edf0ee]">{summary.nextFollowUp}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">next contact</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Building2 size={14} />Pipeline</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{jobs.length}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">tracked roles</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Application pipeline</h2>
        <div className="mt-4 space-y-3">
          {jobs.map((job) => (
            <div key={job.company} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#101313] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#e2e7e4]">{job.company}</p>
                <p className="mt-1 text-[10px] text-[#7d867f]">Role status tracked in owner workspace</p>
              </div>
              <span className="rounded-full border border-[#364b43] bg-[#101d17] px-2 py-1 text-[9px] text-[#9ad4b0]">{job.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Recommended operating rhythm</h2>
        <ul className="mt-4 space-y-3 text-[11px] leading-6 text-[#9aa29d]">
          <li>• Check the pipeline every 2–3 days and update the status only after an actual interaction or decision.</li>
          <li>• Prioritize follow-ups based on the interview stage, not the age of the application alone.</li>
          <li>• Keep each role tied to the actual company research and interview notes to avoid false positives.</li>
        </ul>
        <Link href="/dashboard/companies" className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Open company intelligence <ArrowRight size={12} /></Link>
      </section>
    </div>
  );
}
