"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/actions";
import {
  Activity, ArrowUpRight, BookOpen, BriefcaseBusiness, Building2, ChevronDown,
  Command, FolderKanban, Gauge, GraduationCap, LayoutDashboard, LogOut, Menu,
  MessageSquareText, Search, Settings2, Sparkles, Target, X,
} from "lucide-react";

const navigation = [
  { title: "WORKSPACE", items: [
    { label: "Command center", href: "/dashboard", icon: LayoutDashboard },
    { label: "Daily planner", href: "/dashboard/planner", icon: Target },
    { label: "Learning academy", href: "/dashboard/learning", icon: GraduationCap },
    { label: "Skill intelligence", href: "/dashboard/skills", icon: Gauge },
    { label: "Project lab", href: "/dashboard/projects", icon: FolderKanban },
  ] },
  { title: "CAREER", items: [
    { label: "Career branding", href: "/dashboard/branding", icon: BriefcaseBusiness },
    { label: "Interview prep", href: "/dashboard/interviews", icon: MessageSquareText },
    { label: "JobRadar", href: "/dashboard/jobs", icon: Search },
    { label: "Company intelligence", href: "/dashboard/companies", icon: Building2 },
  ] },
  { title: "INSIGHTS", items: [
    { label: "Productivity", href: "/dashboard/productivity", icon: Activity },
    { label: "AI career coach", href: "/dashboard/coach", icon: Sparkles },
    { label: "Reports & analytics", href: "/dashboard/reports", icon: BookOpen },
  ] },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090b0b] text-[#e7e9e8]">
      {menuOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-white/[0.07] bg-[#0c0f0f] transition-transform md:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[68px] items-center justify-between border-b border-white/[0.07] px-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark"><Command size={17} strokeWidth={2.2} /></span>
            <span className="text-[15px] font-semibold tracking-[-0.03em]">career<span className="text-[#69d6a5]">OS</span></span>
          </Link>
          <button aria-label="Close navigation" className="icon-button md:hidden" onClick={() => setMenuOpen(false)}><X size={17} /></button>
        </div>
        <div className="px-3 pt-4">
          <div className="workspace-switch flex w-full items-center gap-3 rounded-lg border border-white/[0.07] px-3 py-2.5 text-left">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#172821] text-[10px] font-semibold text-[#7ee0b2]">CS</span>
            <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-[#d9dcda]">Personal workspace</span><span className="mt-0.5 block text-[10px] text-[#747c78]">Private · owner only</span></span>
            <ChevronDown size={14} className="text-[#747c78]" />
          </div>
        </div>
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 pb-5 pt-5">
          {navigation.map((group) => (
            <div className="mb-6" key={group.title}>
              <p className="mb-2 px-2 text-[9px] font-semibold tracking-[0.14em] text-[#606864]">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
                  return <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`nav-item ${active ? "nav-item-active" : ""}`}><Icon size={16} strokeWidth={1.8} /><span>{label}</span>{label === "AI career coach" && <span className="ml-auto rounded border border-[#29513f] bg-[#112219] px-1.5 py-0.5 text-[8px] font-medium text-[#75d6a5]">BETA</span>}</Link>;
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/[0.07] p-3">
          <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)} className={`nav-item ${pathname === "/dashboard/settings" ? "nav-item-active" : ""}`}><Settings2 size={16} /><span>Settings</span><span className="ml-auto text-[10px] text-[#68706c]">⌘ ,</span></Link>
          <div className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#31513f] bg-[#15231a] text-[10px] font-semibold text-[#9bd9b7]">ME</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">Career owner</span><span className="mt-0.5 block text-[10px] text-[#717975]">SDE + AI Engineer</span></span>
            <ArrowUpRight size={14} className="text-[#68706c]" />
          </div>
          <form action={logoutAction}><button type="submit" className="nav-item w-full"><LogOut size={15} /><span>Sign out</span></button></form>
        </div>
      </aside>

      <div className="md:pl-[248px]">
        <header className="topbar sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#090b0b]/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button aria-label="Open navigation" className="icon-button md:hidden" onClick={() => setMenuOpen(true)}><Menu size={18} /></button>
            <span className="hidden text-xs text-[#737b77] sm:inline">Personal workspace</span><span className="hidden text-[#464c49] sm:inline">/</span><span className="text-xs font-medium text-[#cbd0cd]">{pathname === "/" || pathname === "/dashboard" ? "Command center" : pathname.split("/").at(-1)?.replaceAll("-", " ")}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3"><div className="hidden items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[10px] text-[#77807b] sm:flex"><Search size={12} /><span>Quick find</span><kbd className="ml-4 rounded border border-white/[0.08] px-1 py-0.5 text-[9px]">⌘ K</kbd></div><span className="h-1.5 w-1.5 rounded-full bg-[#63d39a] shadow-[0_0_10px_#63d39a80]" /><span className="text-[10px] text-[#8e9691]">Private mode</span></div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
