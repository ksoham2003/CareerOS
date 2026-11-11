import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { scoreCompanyFit } from "@/lib/milestone-five";

const companies = [
  { name: "Northstar Labs", fit: scoreCompanyFit({ roleFit: 88, growth: 72, compensation: 80, processFit: 54 }) },
  { name: "Crest Systems", fit: scoreCompanyFit({ roleFit: 70, growth: 84, compensation: 76, processFit: 72 }) },
  { name: "Atlas Product", fit: scoreCompanyFit({ roleFit: 62, growth: 60, compensation: 68, processFit: 82 }) },
];

export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 5 · Company intelligence</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Company intelligence</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Keep company research grounded in source-backed notes: role fit, growth opportunity, compensation, and process quality are evaluated separately instead of bundled into one vague opinion.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {companies.map((company) => (
          <article key={company.name} className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#324437] bg-[#152119] text-[#8ad6aa]">
                  <Building2 size={16} />
                </span>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7e8783]">Fit score</p>
                  <h2 className="mt-1 text-lg font-semibold text-[#edf0ee]">{company.fit.total}</h2>
                </div>
              </div>
              <span className="rounded-full border border-[#364b43] bg-[#101d17] px-2 py-1 text-[9px] text-[#9ad4b0]">{company.fit.decision}</span>
            </div>

            <p className="mt-4 text-sm font-medium text-[#e2e7e4]">{company.name}</p>

            <div className="mt-4 space-y-2 text-[10px] text-[#7d867f]">
              <div className="flex items-center justify-between">
                <span>Role fit</span>
                <span>Strong</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Growth</span>
                <span>Balanced</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Compensation</span>
                <span>Healthy</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Research model</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/[0.06] bg-[#101313] p-4">
            <span className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Search size={14} />Source capture</span>
            <p className="mt-3 text-[11px] leading-6 text-[#9aa29d]">Document the source, date, and context of the signal before using it to make a decision.</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-[#101313] p-4">
            <span className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><CheckCircle2 size={14} />Fit evaluation</span>
            <p className="mt-3 text-[11px] leading-6 text-[#9aa29d]">Combine role alignment, growth outlook, and process honesty instead of trusting a single metric.</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-[#101313] p-4">
            <span className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><ShieldCheck size={14} />Evidence gate</span>
            <p className="mt-3 text-[11px] leading-6 text-[#9aa29d]">Only keep notes that can be supported by a real public source or a documented interview conversation.</p>
          </div>
        </div>
        <Link href="/dashboard/jobs" className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Review job radar <ArrowRight size={12} /></Link>
      </section>
    </div>
  );
}
