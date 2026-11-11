import { connection } from "next/server";
import { CalendarRange, Clock3, ListChecks, Target, Trash2 } from "lucide-react";
import { createStudyPlanItemAction, deleteStudyPlanItemAction, logStudySessionAction } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { summarizeStudySessions } from "@/lib/milestone-three";
import { prisma } from "@/lib/prisma";

export default async function PlannerPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  await connection();
  const planItems = await prisma.studyPlanItem.findMany({
    where: { userId: user.id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  const plannedMinutes = planItems.reduce((total, item) => total + item.plannedMinutes, 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const sessions = await prisma.studySession.findMany({
    where: { userId: user.id, completedAt: { gte: weekStart } },
    orderBy: { completedAt: "desc" },
  });
  const activity = summarizeStudySessions(sessions);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 2 · Daily planner</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Study planner</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Your study areas and time targets are saved to your private workspace. Nothing is prefilled.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Clock3 size={14} />Planned time</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{plannedMinutes}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">minutes</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><Target size={14} />Study areas</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{planItems.length}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">saved by you</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><CalendarRange size={14} />Weekly rhythm</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{activity.sessionCount}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">sessions in 7 days</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-4">
          <div className="flex items-center gap-2 text-[10px] text-[#7f8a84]"><ListChecks size={14} />Actual time</div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#edf0ee]">{activity.totalMinutes}</p>
          <p className="mt-1 text-[10px] text-[#7a847d]">minutes in 7 days</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
          <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Your study plan</h2>
          <p className="mt-1 text-[10px] leading-5 text-[#78817c]">Add the topics you want to study and set your own time target.</p>
          {params.error === "plan" && <p role="alert" className="mt-3 text-[11px] text-[#f0a18d]">Enter a topic, focus area, and a valid time target.</p>}
          {params.saved === "plan" && <p role="status" className="mt-3 text-[11px] text-[#8bd4aa]">Study area saved.</p>}
          {params.saved === "deleted" && <p role="status" className="mt-3 text-[11px] text-[#8bd4aa]">Study area removed.</p>}
          <form action={createStudyPlanItemAction} className="mt-4 space-y-3">
            <label className="block text-[10px] text-[#9aa29d]">Topic
              <input name="title" required maxLength={120} className="field mt-1.5 w-full" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-[10px] text-[#9aa29d]">Focus area
                <input name="category" required maxLength={80} className="field mt-1.5 w-full" />
              </label>
              <label className="block text-[10px] text-[#9aa29d]">Planned minutes
                <input name="plannedMinutes" type="number" min={1} max={720} step={1} required className="field mt-1.5 w-full" />
              </label>
            </div>
            <button type="submit" className="button-primary">Add study area</button>
          </form>
          <ul className="mt-5 divide-y divide-white/[0.06]">
            {planItems.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
              <div className="min-w-0"><p className="truncate text-xs font-medium text-[#dfe4e0]">{item.title}</p><p className="mt-1 text-[10px] text-[#7d867f]">{item.category} · {item.plannedMinutes} min</p></div>
              <form action={deleteStudyPlanItemAction}><input type="hidden" name="itemId" value={item.id} /><button type="submit" className="icon-button" aria-label={`Remove ${item.title}`} title="Remove study area"><Trash2 size={14} /></button></form>
            </li>)}
          </ul>
          {planItems.length === 0 && <p className="mt-4 text-[10px] text-[#78817c]">Your saved study areas will appear here.</p>}
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
          <h2 className="text-[13px] font-semibold text-[#dfe4e0]">Log completed study</h2>
          <p className="mt-1 text-[10px] leading-5 text-[#78817c]">Only completed work contributes to actual-time totals.</p>
          {params.error === "invalid" && <p role="alert" className="mt-3 text-[11px] text-[#f0a18d]">Review the session details and try again.</p>}
          {params.saved === "1" && <p role="status" className="mt-3 text-[11px] text-[#8bd4aa]">Study session saved.</p>}
          <form action={logStudySessionAction} className="mt-4 space-y-3">
            <label className="block text-[10px] text-[#9aa29d]">Session title
              <input name="title" required minLength={3} maxLength={120} className="field mt-1.5 w-full" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-[10px] text-[#9aa29d]">Focus area
                <input name="category" required maxLength={40} className="field mt-1.5 w-full" />
              </label>
              <label className="block text-[10px] text-[#9aa29d]">Minutes
                <input name="durationMinutes" type="number" min={5} max={720} step={1} required className="field mt-1.5 w-full" />
              </label>
            </div>
            {planItems.length > 0 && <label className="block text-[10px] text-[#9aa29d]">Link to study area <span className="text-[#69736d]">(optional)</span>
              <select name="studyPlanItemId" defaultValue="" className="field mt-1.5 w-full"><option value="">No linked study area</option>{planItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
            </label>}
            <label className="block text-[10px] text-[#9aa29d]">Notes <span className="text-[#69736d]">(optional)</span>
              <textarea name="notes" maxLength={1000} rows={3} className="field mt-1.5 w-full resize-y" />
            </label>
            <button type="submit" className="button-primary">Save session</button>
          </form>
          <div className="flex items-end justify-between gap-3">
            <div><h3 className="text-xs font-semibold text-[#dfe4e0]">Recent activity</h3><p className="mt-1 text-[10px] text-[#78817c]">{activity.totalMinutes} minutes logged in the past 7 days</p></div>
            <span className="text-[10px] text-[#8bd4aa]">{activity.sessionCount} sessions</span>
          </div>
          {sessions.length === 0 ? <p className="mt-5 rounded-lg border border-dashed border-white/[0.1] px-4 py-8 text-center text-[11px] text-[#78817c]">Your completed sessions will appear here.</p> : (
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {sessions.slice(0, 20).map((session) => <li key={session.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                <div className="min-w-0"><p className="truncate text-xs font-medium text-[#dfe4e0]">{session.title}</p><p className="mt-1 text-[10px] text-[#7d867f]">{session.category} · {session.completedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</p></div>
                <span className="shrink-0 text-[10px] text-[#9aa29d]">{session.durationMinutes} min</span>
              </li>)}
            </ul>
          )}
        </div>
      </section>

    </div>
  );
}
