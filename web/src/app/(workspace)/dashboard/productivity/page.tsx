import { Activity, CalendarRange, Clock3, TrendingUp } from "lucide-react";
import { connection } from "next/server";
import { requireUser } from "@/lib/auth";
import { summarizeStudySessions } from "@/lib/milestone-three";
import { prisma } from "@/lib/prisma";

export default async function ProductivityPage() {
  const user = await requireUser();
  await connection();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const sessions = await prisma.studySession.findMany({
    where: { userId: user.id, completedAt: { gte: weekStart } },
    orderBy: { completedAt: "desc" },
  });
  const summary = summarizeStudySessions(sessions);
  const categories = Object.entries(summary.categoryMinutes).sort((left, right) => right[1] - left[1]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 3 · Productivity</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Productivity rhythm</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">A record of completed study sessions from the last 7 days. Only time you log is included.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Clock3 size={14} />Actual focus</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.totalMinutes}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">minutes</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Activity size={14} />Sessions</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.sessionCount}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">completed in 7 days</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><TrendingUp size={14} />Average session</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{summary.averageMinutes}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">minutes</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><CalendarRange size={14} />Main focus</div>
          <p className="mt-3 truncate text-lg font-semibold tracking-[-0.03em] text-[#edf0ee]">{summary.focusCategory}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">by logged minutes</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-[10px] text-[#7f8a84]"><CalendarRange size={14} />Focus by category · last 7 days</div>
        {categories.length === 0 ? <p className="rounded-lg border border-dashed border-white/[0.1] px-4 py-10 text-center text-[11px] text-[#78817c]">No sessions logged in the past 7 days.</p> : (
          <div className="space-y-4">
            {categories.map(([category, minutes]) => <div key={category}>
              <div className="mb-1.5 flex justify-between text-[11px]"><span className="text-[#cbd1cd]">{category}</span><span className="text-[#8d9691]">{minutes} min</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#1a201d]"><div className="h-full rounded-full bg-[#72cf9d]" style={{ width: `${Math.max(3, Math.round((minutes / summary.totalMinutes) * 100))}%` }} /></div>
            </div>)}
          </div>
        )}
      </section>
    </div>
  );
}
