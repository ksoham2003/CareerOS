import { connection } from "next/server";
import { ArrowRight, BookOpenText } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SkillsPage() {
  const user = await requireUser();
  await connection();
  const studyAreas = await prisma.studyPlanItem.findMany({
    where: { userId: user.id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 2 · Skill intelligence</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Skill intelligence</h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9691]">Skill assessments are not available yet. Saved study areas are shown below without presenting them as proficiency evidence.</p>
      </div>

      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-6">
        <div className="flex items-center justify-between"><div><h2 className="text-[13px] font-semibold text-[#dfe4e0]">Saved study areas</h2><p className="mt-1 text-[10px] text-[#7a847d]">{studyAreas.length} areas · not skill assessments</p></div><Link href="/dashboard/planner" className="inline-flex items-center gap-2 text-[10px] font-medium text-[#9ad4b0] hover:text-white">Edit study plan <ArrowRight size={12} /></Link></div>
        {studyAreas.length === 0 ? <p className="mt-5 rounded-lg border border-dashed border-white/[0.1] px-4 py-10 text-center text-[11px] text-[#78817c]">No study areas saved.</p> : <ul className="mt-4 divide-y divide-white/[0.06]">{studyAreas.map((area) => <li key={area.id} className="flex items-center gap-3 py-3"><BookOpenText size={14} className="shrink-0 text-[#8ad6aa]" /><span className="min-w-0 flex-1 truncate text-xs text-[#dfe7e3]">{area.title}</span><span className="text-[10px] text-[#8a948e]">{area.category}</span><span className="text-[10px] text-[#8a948e]">{area.plannedMinutes} min</span></li>)}</ul>}
      </section>
    </div>
  );
}
