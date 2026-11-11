import Link from "next/link";
import { redirect } from "next/navigation";
import { Apple, ArrowDownToLine, ArrowRight, BookOpenText, BrainCircuit, BriefcaseBusiness, FolderKanban, MonitorDown, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const featureCards = [
  { title: "Learning academy", text: "Structured DSA, Java, CS, systems, and AI reinforcement in one workspace.", icon: BookOpenText },
  { title: "Project lab", text: "Track product work from ideation to execution with evidence-backed milestones.", icon: FolderKanban },
  { title: "Career system", text: "Blend interventions across branding, interviews, job targeting, and opportunity tracking.", icon: BriefcaseBusiness },
  { title: "AI coach", text: "Use explainable recommendations grounded in your actual progress and blockers.", icon: BrainCircuit },
];

const desktopDownloads = [
  { label: "Windows", href: "/download/windows", icon: MonitorDown },
  { label: "macOS", href: "/download/macos", icon: Apple },
  { label: "Linux", href: "/download/linux", icon: Terminal },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[#090b0b] text-[#e7e9e8]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="brand-mark"><Sparkles size={17} /></span>
            <span className="text-[15px] font-semibold tracking-[-0.03em]">career<span className="text-[#69d6a5]">OS</span></span>
          </div>
          <Link href="/login" className="button-primary inline-flex items-center gap-2">Private owner login <ArrowRight size={14} /></Link>
        </header>

        <section className="grid gap-8 rounded-2xl border border-white/[0.08] bg-[#0d1010] p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2d413a] bg-[#12201a] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8fd4a8]">
              <ShieldCheck size={12} /> Private single-owner system
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] text-[#edf0ee] sm:text-5xl">Build your career with real evidence, not guesswork.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#98a29d]">CareerOS is the private operating system for job preparation: learning paths, skill baselines, project evidence, interview practice, application tracking, and coaching recommendations tied to your actual progress.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="button-primary inline-flex items-center gap-2">Open workspace <ArrowRight size={14} /></Link>
              <Link href="/download/windows" className="inline-flex items-center gap-2 rounded-md border border-[#355542] bg-[#17251c] px-3 py-2 text-[10px] font-medium text-[#b4e2c6] hover:bg-[#1d3024]">Download for Windows <ArrowDownToLine size={14} /></Link>
              <Link href="/dashboard/learning" className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[10px] font-medium text-[#dfe7e3] hover:bg-white/[0.04]">Explore learning path</Link>
            </div>
          </div>
              {desktopDownloads.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-md border border-[#355542] bg-[#17251c] px-3 py-2 text-[10px] font-medium text-[#b4e2c6] hover:bg-[#1d3024]"><Icon size={14} />{label}<ArrowDownToLine size={13} /></Link>)}
          <div className="rounded-xl border border-white/[0.07] bg-[#0b0f0e] p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8782]">Operating rhythm</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-lg border border-white/[0.06] bg-[#111615] p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#80c99f]">01</p>
                <p className="mt-2 text-sm font-medium text-[#edf0ee]">Assess with evidence</p>
                <p className="mt-1 text-[10px] leading-5 text-[#7d867f]">Start from real baselines in DSA, system design, communication, and projects.</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#111615] p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#80c99f]">02</p>
                <p className="mt-2 text-sm font-medium text-[#edf0ee]">Improve with structure</p>
                <p className="mt-1 text-[10px] leading-5 text-[#7d867f]">Keep each study block and project milestone tied to measurable momentum.</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#111615] p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#80c99f]">03</p>
                <p className="mt-2 text-sm font-medium text-[#edf0ee]">Target roles intentionally</p>
                <p className="mt-1 text-[10px] leading-5 text-[#7d867f]">Use company fit, interview readiness, and portfolio evidence to make better decisions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-white/[0.08] bg-[#0d1010] p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#324437] bg-[#152119] text-[#8ad6aa]">
                <Icon size={16} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#edf0ee]">{title}</h3>
              <p className="mt-2 text-[11px] leading-6 text-[#8f9a95]">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
