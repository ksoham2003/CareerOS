import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, BookOpenText } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LearningPage() {
  const user = await requireUser();
  await connection();
  const studyAreas = await prisma.studyPlanItem.findMany({
    where: { userId: user.id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    include: { studySessions: { orderBy: { completedAt: "desc" }, take: 1 } },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 2 · Learning academy</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Learning academy</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Your learning areas are the topics you add to your private study plan.</p>
      </div>

      {studyAreas.length === 0 ? <section className="rounded-xl border border-dashed border-white/[0.1] px-5 py-12 text-center"><BookOpenText size={20} className="mx-auto text-[#77827b]" /><p className="mt-3 text-sm font-medium text-[#dfe4e0]">No study areas yet</p><p className="mt-1 text-[11px] text-[#78817c]">Add your own topics and planned time in the planner.</p><Link href="/dashboard/planner" className="button-primary mt-4 inline-flex items-center gap-2">Open planner <ArrowRight size={13} /></Link></section> : (
        <section className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {studyAreas.map((area) => <article key={area.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3"><BookOpenText size={16} className="mt-0.5 shrink-0 text-[#8ad6aa]" /><div className="min-w-0"><h2 className="truncate text-sm font-semibold text-[#edf0ee]">{area.title}</h2><p className="mt-1 text-[10px] text-[#8a948e]">{area.category} · {area.plannedMinutes} planned minutes</p>{area.studySessions[0] && <p className="mt-1 text-[10px] text-[#6f7a73]">Last session: {area.studySessions[0].completedAt.toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" })}</p>}</div></div>
            <Link href="/dashboard/planner" className="inline-flex w-fit items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Open planner <ArrowRight size={12} /></Link>
          </article>)}
        </section>
      )}
    </div>
  );
}
