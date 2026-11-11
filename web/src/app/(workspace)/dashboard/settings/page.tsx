import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { changePasswordAction } from "@/app/actions";

const fieldClass = "mt-1.5 h-10 w-full rounded-md border border-white/[0.09] bg-[#090b0b] px-3 text-xs text-[#e2e7e3] outline-none focus:border-[#55866a]";
const labelClass = "block text-[10px] font-medium text-[#aeb7b1]";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ passwordChanged?: string; passwordError?: string }> }) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d8981]">Account</p><h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#e5e9e6]">Settings</h1><p className="mt-2 text-xs leading-5 text-[#8d9691]">Manage security and your private workspace preferences.</p></div>
      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-7"><div className="flex items-center gap-3"><span className="rounded-lg border border-[#354039] bg-[#151a17] p-2 text-[#87cba2]"><ShieldCheck size={17} /></span><div><h2 className="text-xs font-semibold text-[#dfe4e0]">Private owner account</h2><p className="mt-1 text-[10px] text-[#78817c]">No public registration · password-protected owner login</p></div></div><p className="mt-4 text-[10px] leading-5 text-[#7c8580]">Sessions expire after 14 days. Changing your password revokes all current sessions and starts a fresh session in this browser.</p></section>
      <section className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><KeyRound size={16} className="text-[#87cba2]" /><div><h2 className="text-xs font-semibold text-[#dfe4e0]">Change password</h2><p className="mt-1 text-[10px] text-[#78817c]">Use a password manager and choose at least 12 characters.</p></div></div>
        {params.passwordChanged && <p role="status" className="mb-4 flex items-center gap-2 rounded-md border border-[#31543e] bg-[#101b14] px-3 py-2 text-[11px] text-[#a8d7b8]"><CheckCircle2 size={14} />Password updated. Other sessions were signed out.</p>}
        {params.passwordError && <p role="alert" className="mb-4 rounded-md border border-[#623f39] bg-[#211411] px-3 py-2 text-[11px] text-[#e7a599]">{params.passwordError === "current" ? "Current password is incorrect." : "New passwords must match and be at least 12 characters."}</p>}
        <form action={changePasswordAction} className="space-y-4"><label className={labelClass}>Current password<input className={fieldClass} required type="password" name="currentPassword" autoComplete="current-password" /></label><label className={labelClass}>New password<input className={fieldClass} required minLength={12} type="password" name="newPassword" autoComplete="new-password" /></label><label className={labelClass}>Confirm new password<input className={fieldClass} required minLength={12} type="password" name="confirmation" autoComplete="new-password" /></label><div className="flex justify-end border-t border-white/[0.06] pt-4"><button className="button-primary" type="submit">Update password</button></div></form>
      </section>
    </div>
  );
}
