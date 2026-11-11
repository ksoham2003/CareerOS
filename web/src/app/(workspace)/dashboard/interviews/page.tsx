import Link from "next/link";
import { ArrowRight, BrainCircuit, MessageSquareText, TimerReset, Trophy } from "lucide-react";
import { scoreInterviewAnswer } from "@/lib/milestone-four";

const samples = [
  { title: "System design loop", score: scoreInterviewAnswer({ structure: 85, correctness: 72, communication: 80, tradeoffs: 48 }), tag: "Design" },
  { title: "Backend API review", score: scoreInterviewAnswer({ structure: 80, correctness: 90, communication: 78, tradeoffs: 70 }), tag: "Backend" },
  { title: "Behavioral narrative", score: scoreInterviewAnswer({ structure: 76, correctness: 74, communication: 88, tradeoffs: 82 }), tag: "Behavioral" },
];

export default function InterviewsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 4 · Interview prep</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Interview preparation</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Practice with rubrics tied to structure, correctness, communication, and trade-off reasoning—so feedback reflects actual ability, not vague impressions.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><BrainCircuit size={14} />Answered</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">3</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">mock rounds</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Trophy size={14} />Best score</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{Math.max(...samples.map((item) => item.score.total))}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">current peak</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><TimerReset size={14} />Focus area</div>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#edf0ee]">tradeoffs</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">most common weak spot</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><MessageSquareText size={14} />Feedback</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">4</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">rubric signals</p>
        </div>
      </section>

      <section className="space-y-4">
        {samples.map((sample) => (
          <article key={sample.title} className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7d8782]">{sample.tag}</p>
                <h2 className="mt-2 text-lg font-semibold text-[#edf0ee]">{sample.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#364b43] bg-[#101d17] px-2 py-1 text-[9px] text-[#9ad4b0]">{sample.score.total}/100</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-white/[0.05] bg-[#101313] p-3">
                <p className="text-[10px] text-[#7a847d]">Main focus area:</p>
                <p className="mt-2 text-sm text-[#dfe7e3]">{sample.score.focusAreas[0] ?? "balanced"}</p>
              </div>
              <div className="rounded-lg border border-white/[0.05] bg-[#101313] p-3">
                <p className="text-[10px] text-[#7a847d]">Outcome:</p>
                <p className="mt-2 text-sm text-[#dfe7e3]">{sample.score.total >= 75 ? "Strong" : sample.score.total >= 60 ? "Developing" : "Needs work"}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Interview rubric</h2>
        <ul className="mt-4 space-y-3 text-[11px] leading-6 text-[#9aa29d]">
          <li>• Structure: did the answer begin clearly and stay organized?</li>
          <li>• Correctness: were the technical claims accurate and justified?</li>
          <li>• Communication: was the rationale calm, clear, and easy to follow?</li>
          <li>• Trade-offs: did the response explain why choices were made and what alternatives were rejected?</li>
        </ul>
        <Link href="/dashboard/branding" className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Review branding state <ArrowRight size={12} /></Link>
      </section>
    </div>
  );
}
