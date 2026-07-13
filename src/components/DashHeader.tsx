"use client";
import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { cn } from "./ui";

const TABS = [
  { href: "/dashboard", label: "Overview", key: "overview" },
  { href: "/referrals", label: "Referrals", key: "referrals" },
  { href: "/leaderboard", label: "Leaderboard", key: "leaderboard" },
];

export default function DashHeader({ active, memberInitials }: { active: string; memberInitials: string }) {
  const logout = () => {
    try { localStorage.setItem("bfsuma-demo-auth", "0"); } catch {}
    window.location.href = "/dashboard";
  };
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="bf-container flex items-center gap-3 h-[60px]">
        <Link href="/" className="flex shrink-0"><Image src="/logo.svg" alt="BF Suma" width={115} height={30} className="h-[30px] w-auto" /></Link>
        <span className="text-xs font-bold tracking-[0.06em] uppercase text-brand-700 bg-brand-50 rounded-full px-2.5 py-1">{BRAND.teamName}</span>
        <div className="flex-1" />
        <span className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-brand-500 text-white font-bold text-[0.8125rem]">{memberInitials}</span>
        <button type="button" onClick={logout} className="text-[0.8125rem] font-semibold text-slate-500 hover:text-slate-800 px-2 py-2">Log out</button>
      </div>
      <div className="border-t border-slate-100">
        <nav aria-label="Dashboard" className="bf-container flex gap-1 h-12 items-stretch overflow-x-auto">
          {TABS.map((t) => (
            <Link key={t.key} href={t.href} aria-current={t.key === active ? "page" : undefined}
              className={cn("flex items-center px-3.5 text-sm font-semibold no-underline whitespace-nowrap border-b-2",
                t.key === active ? "text-brand-700 border-brand-500" : "text-slate-500 border-transparent")}>{t.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
