import { connection } from "next/server";
import { BarChart3, BookOpenText, Clock3 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { summarizeStudySessions } from "@/lib/milestone-three";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const user = await requireUser();
  await connection();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const [sessions, studyAreas] = await Promise.all([
    prisma.studySession.findMany({ where: { userId: user.id, completedAt: { gte: weekStart } } }),
    prisma.studyPlanItem.findMany({ where: { userId: user.id } }),
  ]);
  const summary = summarizeStudySessions(sessions);
  const reportCards = [
    { title: "Logged focus time", value: `${summary.totalMinutes} min`, description: "Completed study sessions in the past 7 days.", icon: Clock3 },
    { title: "Completed sessions", value: `${summary.sessionCount}`, description: "Sessions you recorded in the past 7 days.", icon: BarChart3 },
    { title: "Saved study areas", value: `${studyAreas.length}`, description: "Topics and time targets in your plan.", icon: BookOpenText },
  ];
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 3 · Reports & analytics</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Reports & analytics</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">These totals come from saved study sessions and study areas. No activity is inferred.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {reportCards.map(({ title, value, description, icon: Icon }) => (
          <article key={title} className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5">
            <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Icon size={14} />{title}</div>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{value}</p>
            <p className="mt-2 text-[10px] leading-5 text-[#7a847d]">{description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Study data window</h2>
        {sessions.length === 0 && studyAreas.length === 0 ? <p className="mt-4 text-[11px] leading-6 text-[#9aa29d]">No study data has been saved yet.</p> : <p className="mt-4 text-[11px] leading-6 text-[#9aa29d]">This report includes {summary.sessionCount} completed sessions and {studyAreas.length} saved study areas. Other report types are not available until their records exist.</p>}
      </section>
    </div>
  );
}
