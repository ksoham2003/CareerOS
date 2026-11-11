import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { updateProfileAction } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const inputClass = "mt-1.5 h-9 w-full rounded-md border border-white/[0.09] bg-[#090b0b] px-3 text-xs text-[#e2e7e3] outline-none focus:border-[#55866a]";
const labelClass = "block text-[10px] font-medium text-[#aeb7b1]";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const user = await requireUser();
  const [profile, params] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId: user.id } }),
    searchParams,
  ]);
  if (!profile) redirect("/dashboard/settings");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Milestone 1 · Your foundation</p><h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Career profile</h1><p className="mt-2 text-xs leading-5 text-[#8d9691]">Keep your starting point and career goal current. This information stays in your private workspace.</p></div>
      {params.saved && <p role="status" className="flex items-center gap-2 rounded-md border border-[#31543e] bg-[#101b14] px-3 py-2 text-[11px] text-[#a8d7b8]"><CheckCircle2 size={14} />Profile saved.</p>}
      {params.error && <p role="alert" className="rounded-md border border-[#623f39] bg-[#211411] px-3 py-2 text-[11px] text-[#e7a599]">Some fields were invalid; please review and try again.</p>}
      <form action={updateProfileAction} className="space-y-5 rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-7">
        <section><h2 className="mb-4 text-xs font-semibold text-[#dfe4e0]">Current snapshot</h2><div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Name<input className={inputClass} name="fullName" defaultValue={profile.fullName ?? ""} maxLength={100} /></label>
          <label className={labelClass}>Education<input className={inputClass} required name="education" defaultValue={profile.education} maxLength={160} /></label>
          <label className={labelClass}>Current employer<input className={inputClass} required name="currentEmployer" defaultValue={profile.currentEmployer} maxLength={120} /></label>
          <label className={labelClass}>Experience (months)<input className={inputClass} required type="number" min="0" max="600" name="experienceMonths" defaultValue={profile.experienceMonths} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Previous experience<input className={inputClass} name="previousExperience" defaultValue={profile.previousExperience} maxLength={500} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Current skills <span className="font-normal text-[#737c77]">(comma-separated)</span><input className={inputClass} name="skills" defaultValue={profile.skills.join(", ")} maxLength={1000} /></label>
          <label className={`${labelClass} sm:col-span-2`}>AI experience<input className={inputClass} name="aiExperience" defaultValue={profile.aiExperience} maxLength={500} /></label>
        </div></section>
        <section className="border-t border-white/[0.06] pt-5"><h2 className="mb-4 text-xs font-semibold text-[#dfe4e0]">Preparation preferences</h2><div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Primary coding language<input className={inputClass} name="primaryLanguage" defaultValue={profile.primaryLanguage ?? ""} maxLength={40} /></label>
          <label className={labelClass}>Secondary development language<input className={inputClass} name="secondaryLanguage" defaultValue={profile.secondaryLanguage ?? ""} maxLength={40} /></label>
          <label className={labelClass}>AI language<input className={inputClass} name="aiLanguage" defaultValue={profile.aiLanguage ?? ""} maxLength={40} /></label>
          <label className={labelClass}>DSA level<input className={inputClass} name="dsaLevel" defaultValue={profile.dsaLevel ?? ""} maxLength={40} /></label>
          <label className={labelClass}>Daily preparation time (minutes)<input className={inputClass} type="number" min="0" max="720" name="dailyMinutes" defaultValue={profile.dailyMinutes ?? ""} /></label>
          <label className={labelClass}>Preparation start date<input className={inputClass} type="date" name="journeyStart" defaultValue={profile.journeyStart?.toISOString().slice(0, 10) ?? ""} /></label>
        </div></section>
        <section className="border-t border-white/[0.06] pt-5"><h2 className="mb-4 text-xs font-semibold text-[#dfe4e0]">Career objective</h2><div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Target role<input className={inputClass} required name="careerObjective" defaultValue={profile.careerObjective} maxLength={160} /></label>
          <label className={labelClass}>Target compensation (LPA)<input className={inputClass} required type="number" min="1" max="10000" name="targetSalaryLpa" defaultValue={profile.targetSalaryLpa} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Target company types<input className={inputClass} name="targetCompanies" defaultValue={profile.targetCompanies} maxLength={500} /></label>
          <p className="text-[10px] leading-5 text-[#747d77] sm:col-span-2">Targets guide planning; they do not represent an assessment of your current readiness or a salary guarantee.</p>
        </div></section>
        <div className="flex justify-end border-t border-white/[0.06] pt-4"><button type="submit" className="button-primary">Save profile</button></div>
      </form>
    </div>
  );
}
