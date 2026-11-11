import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, ArrowUpRight, CalendarDays, Circle, Clock3, Compass, Plus, Sparkles, Target, TrendingUp } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeStudySessions } from "@/lib/milestone-three";

const metrics = [
  { label: "Study time", value: "—", detail: "No sessions logged in 7 days", icon: Clock3 },
  { label: "DSA solved", value: "—", detail: "No problem attempts logged", icon: Target },
  { label: "Skills assessed", value: "—", detail: "No assessments logged", icon: TrendingUp },
  { label: "Projects tracked", value: "—", detail: "No projects logged", icon: Compass },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await prisma.userProfile.findUnique({ where: { userId: user.id } });
  await connection();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const sessions = await prisma.studySession.findMany({
    where: { userId: user.id, completedAt: { gte: weekStart } },
    orderBy: { completedAt: "desc" },
  });
  const planItems = await prisma.studyPlanItem.findMany({
    where: { userId: user.id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  const activity = summarizeStudySessions(sessions);
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(now);
  const localHour = Number(new Intl.DateTimeFormat("en-IN", { hour: "2-digit", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(now));
  const greeting = localHour < 12 ? "Good morning" : localHour < 17 ? "Good afternoon" : "Good evening";
  const goal = profile?.careerObjective ?? "Career objective not set";
  const salary = profile?.targetSalaryLpa;
  const plannedMinutes = planItems.reduce((total, item) => total + item.plannedMinutes, 0);
  const dashboardMetrics = metrics.map((metric, index) => index === 0
    ? { ...metric, value: `${activity.totalMinutes}`, detail: `${activity.sessionCount} sessions in the past 7 days` }
    : metric);

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#7b8580]"><CalendarDays size={13} />{today}</div>
          <h1 className="text-[26px] font-semibold tracking-[-0.045em] text-[#edf0ee] sm:text-[30px]">{greeting}{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}<span className="text-[#70d6a5]">.</span></h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#8d9691]">A focused path from your current role to <span className="text-[#cbd1cd]">{goal}</span>. Your baseline comes first; readiness grows only with evidence.</p>
        </div>
        <Link href="/dashboard/profile" className="button-primary inline-flex w-fit items-center gap-2"><Plus size={15} />Set up your profile</Link>
      </section>

      <section className="goal-banner relative overflow-hidden rounded-xl border border-[#254436] bg-[#0e1712] px-5 py-5 sm:px-6">
        <div className="goal-orb" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#70cb9c]"><Sparkles size={12} />North star</div><h2 className="text-lg font-semibold tracking-[-0.025em] text-[#e2e9e4]">{salary ? `₹${salary} LPA+` : "Compensation target not set"} <span className="px-1 text-[#52655a]">/</span> {goal}</h2><p className="mt-1.5 text-xs text-[#8a9990]">{profile?.journeyStart ? `Preparation started ${profile.journeyStart.toLocaleDateString("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" })}` : "Preparation start date not set"}</p></div>
          <Link className="inline-flex items-center gap-2 text-xs font-medium text-[#a6dfbf] hover:text-white" href="/dashboard/roadmap">Explore your roadmap <ArrowRight size={14} /></Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {dashboardMetrics.map(({ label, value, detail, icon: Icon }) => <article key={label} className="metric-card rounded-xl border border-white/[0.07] bg-[#0d1010] p-4 sm:p-5"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#939b97]">{label}</span><Icon size={15} className="text-[#67716b]" /></div><div className="mt-4 flex items-baseline gap-2"><span className="text-[27px] font-semibold tracking-[-0.05em] text-[#e3e7e4]">{value}</span></div><p className="mt-1 text-[10px] text-[#737c77]">{detail}</p></article>)}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-xl border border-white/[0.07] bg-[#0d1010]">
          <div className="flex items-start justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6"><div><h2 className="text-[13px] font-semibold text-[#dfe4e0]">Your study plan</h2><p className="mt-1 text-[10px] text-[#78817c]">Saved topics and time targets</p></div><Link href="/dashboard/planner" className="text-[10px] font-medium text-[#93c9a9] hover:text-white">Edit plan <ArrowUpRight size={12} className="ml-1 inline" /></Link></div>
          <div className="divide-y divide-white/[0.055] px-5 sm:px-6">{planItems.length === 0 ? <p className="py-8 text-center text-[11px] text-[#78817c]">No study areas saved yet.</p> : planItems.map((item) => <div key={item.id} className="flex items-center gap-3 py-4"><div className="min-w-0 flex-1"><h3 className="text-xs font-medium text-[#d7dcd9]">{item.title}</h3><p className="mt-1 text-[10px] text-[#76807a]">{item.category}</p></div><span className="shrink-0 text-[10px] text-[#9ba49e]">{item.plannedMinutes} min</span></div>)}</div>
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5 sm:px-6"><span className="text-[10px] text-[#78817c]">{plannedMinutes} min planned · {activity.totalMinutes} min completed in 7 days</span><Link href="/dashboard/planner" className="text-[10px] font-medium text-[#8bd4aa]">Open planner <ArrowRight size={12} className="ml-1 inline" /></Link></div>
        </section>

        <section className="rounded-xl border border-white/[0.07] bg-[#0d1010]">
          <div className="flex items-start justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6"><div><h2 className="text-[13px] font-semibold text-[#dfe4e0]">Assessments</h2><p className="mt-1 text-[10px] text-[#78817c]">No assessment records yet</p></div></div>
          <div className="px-5 py-8 text-center sm:px-6"><p className="text-xs text-[#a1aaa5]">Assessment tracking is not available yet.</p><p className="mt-1 text-[10px] text-[#6f7873]">No readiness scores or skill areas are assumed.</p></div>
          <div className="border-t border-white/[0.06] px-5 py-4 sm:px-6"><Link href="/dashboard/skills" className="text-[10px] font-medium text-[#8bd4aa]">View skills <ArrowRight size={12} className="ml-1 inline" /></Link></div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-white/[0.07] bg-[#0d1010] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-[13px] font-semibold text-[#dfe4e0]">Recent study sessions</h2><p className="mt-1 text-[10px] text-[#78817c]">Activity saved in your workspace</p></div><span className="text-[10px] text-[#7c8580]">{activity.totalMinutes} min in 7 days</span></div>{sessions.length === 0 ? <p className="py-10 text-center text-[11px] text-[#78817c]">No study sessions logged in the past 7 days.</p> : <ul className="mt-3 divide-y divide-white/[0.05]">{sessions.slice(0, 5).map((session) => <li key={session.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-xs font-medium text-[#d7dcd9]">{session.title}</p><p className="mt-1 text-[10px] text-[#76807a]">{session.category} · {session.completedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}</p></div><span className="shrink-0 text-[10px] text-[#9ba49e]">{session.durationMinutes} min</span></li>)}</ul>}</section>
        <section className="rounded-xl border border-white/[0.07] bg-[#0d1010] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-[13px] font-semibold text-[#dfe4e0]">Study plan status</h2><p className="mt-1 text-[10px] text-[#78817c]">Based on your saved plan</p></div><Sparkles size={14} className="text-[#70cb9c]" /></div><div className="mt-5 rounded-lg border border-white/[0.06] bg-[#101313] p-4">{planItems[0] ? <><div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#80c99f]">First saved study area</div><p className="mt-2 text-sm font-medium text-[#e2e7e4]">{planItems[0].title}</p><p className="mt-1 text-[10px] text-[#7d867f]">{planItems[0].category} · {planItems[0].plannedMinutes} planned minutes</p></> : <><p className="text-xs text-[#b8c0bb]">You have not added a study area yet.</p><p className="mt-1 text-[10px] text-[#7d867f]">Add your own topic and time target to start your plan.</p></>}<Link href="/dashboard/planner" className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#355542] bg-[#17251c] px-3 py-2 text-[10px] font-medium text-[#b4e2c6] hover:bg-[#1d3024]">Open planner <ArrowRight size={12} /></Link></div></section>
      </div>
      <p className="flex items-center justify-center gap-2 pb-1 text-[9px] text-[#545d58]"><Circle size={6} className="fill-[#65c992] text-[#65c992]" />CareerOS is in private setup · metrics populate from your own activity</p>
    </div>
  );
}
