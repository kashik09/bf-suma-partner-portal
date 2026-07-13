"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashHeader from "@/components/DashHeader";
import { cn } from "@/components/ui";
import { BRAND, initials } from "@/lib/brand";
import { getMember, getLeaderboard, type Member, type LeaderRow } from "@/lib/data";

const AUTH = "bfsuma-demo-auth";
const TINTS = ["bg-brand-50 text-brand-700", "bg-sky-50 text-sky-700", "bg-earth-50 text-earth-700", "bg-[#fdecf3] text-accent-berry"];
const RANK_BG = ["bg-accent-sun", "bg-slate-400", "bg-earth-500"];

export default function Leaderboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [all, setAll] = useState<LeaderRow[]>([]);

  useEffect(() => {
    let ok = false; try { ok = localStorage.getItem(AUTH) === "1"; } catch {}
    if (!ok) { router.replace("/dashboard"); return; }
    (async () => { const [m, l] = await Promise.all([getMember(), getLeaderboard()]); setMember(m); setAll(l); setReady(true); })();
  }, [router]);

  if (!ready || !member) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <DashHeader active="leaderboard" memberInitials={initials(member.name)} />
      <main className="bf-container pt-6 pb-12 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900">Team leaderboard</h1>
          <p className="mt-1.5 text-sm text-slate-500">Top referrers across {BRAND.teamName} this week.</p>
        </div>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
          {all.slice(0, 3).map((l, i) => (
            <div key={l.name} className={cn("flex flex-col items-center gap-2 rounded-xl shadow-soft p-[22px] border",
              l.is_you ? "bg-brand-50 border-brand-200" : "bg-white border-slate-200/90")}>
              <span className={cn("flex items-center justify-center w-[26px] h-[26px] rounded-full text-white text-xs font-bold", RANK_BG[i])}>{i + 1}</span>
              <span className={cn("flex items-center justify-center w-[52px] h-[52px] rounded-full font-bold text-base", TINTS[i % TINTS.length])}>{initials(l.name)}</span>
              <span className="text-[0.9375rem] font-bold text-slate-900 text-center">{l.name} {l.is_you && "(you)"}</span>
              <span className="text-xs text-slate-500">{l.referrals} referrals</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl shadow-soft overflow-hidden">
          <div className="px-5 py-[18px] border-b border-slate-100"><h2 className="text-[0.9375rem] font-bold text-slate-900">Full ranking</h2></div>
          <div className="flex flex-col">
            {all.map((l, i) => (
              <div key={l.name} className={cn("flex items-center gap-3 px-5 py-3 border-b border-slate-100", l.is_you && "bg-brand-50")}>
                <span className={cn("flex items-center justify-center w-[26px] h-[26px] rounded-full shrink-0 text-xs font-bold", i === 0 ? "bg-accent-sun text-white" : "bg-slate-100 text-slate-500")}>{i + 1}</span>
                <span className={cn("flex items-center justify-center w-[34px] h-[34px] rounded-full shrink-0 font-bold text-xs", TINTS[i % TINTS.length])}>{initials(l.name)}</span>
                <span className="flex-1 text-sm font-semibold text-slate-900 truncate">{l.name} {l.is_you && "(you)"}</span>
                <span className="text-sm font-bold text-brand-600">{l.referrals}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="disclaimer m-0">Live data from your bf-suma database. No income is guaranteed or implied.</p>
      </main>
    </div>
  );
}
