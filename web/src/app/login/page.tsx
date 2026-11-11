import { redirect } from "next/navigation";
import { ArrowRight, KeyRound, LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;
  const message = params.error === "throttled" ? "Too many attempts. Wait a little before trying again." : params.error === "credentials" ? "Email or password is incorrect." : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090b0b] px-4 py-10">
      <section className="w-full max-w-[390px] rounded-xl border border-white/[0.08] bg-[#0d1010] p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-3"><span className="brand-mark"><KeyRound size={17} /></span><span className="text-[15px] font-semibold tracking-[-0.03em]">career<span className="text-[#69d6a5]">OS</span></span></div>
        <div className="mb-6"><div className="mb-2 flex items-center gap-2 text-[10px] font-medium text-[#82cba0]"><LockKeyhole size={12} />PRIVATE OWNER ACCESS</div><h1 className="text-xl font-semibold tracking-[-0.035em] text-[#e5e9e6]">Welcome back</h1><p className="mt-2 text-xs leading-5 text-[#8a938e]">Sign in to your private career workspace.</p></div>
        {message && <p role="alert" className="mb-4 rounded-md border border-[#623f39] bg-[#211411] px-3 py-2 text-[11px] text-[#e7a599]">{message}</p>}
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          <label className="block text-[11px] font-medium text-[#b8c0bb]">Email<input required autoComplete="username" type="email" name="email" className="mt-2 h-10 w-full rounded-md border border-white/[0.09] bg-[#090b0b] px-3 text-xs text-[#e2e7e3] outline-none focus:border-[#55866a]" /></label>
          <label className="block text-[11px] font-medium text-[#b8c0bb]">Password<input required autoComplete="current-password" type="password" name="password" className="mt-2 h-10 w-full rounded-md border border-white/[0.09] bg-[#090b0b] px-3 text-xs text-[#e2e7e3] outline-none focus:border-[#55866a]" /></label>
          <button type="submit" className="button-primary flex h-10 w-full items-center justify-center gap-2">Sign in <ArrowRight size={14} /></button>
        </form>
        <p className="mt-5 border-t border-white/[0.06] pt-4 text-[10px] leading-5 text-[#707973]">No public registration. Provision the single owner using the secure CLI setup documented in the README.</p>
      </section>
    </main>
  );
}
