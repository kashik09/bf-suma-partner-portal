"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashHeader from "@/components/DashHeader";
import { Badge, cn } from "@/components/ui";
import { initials } from "@/lib/brand";
import { getMember, getReferrals, type Member, type Referral } from "@/lib/data";

const AUTH = "bfsuma-demo-auth";
const BADGE: Record<string, "info" | "warning" | "success" | "neutral"> = { Booked: "info", Attended: "warning", Joined: "success" };
const TINTS = ["bg-brand-50 text-brand-700", "bg-sky-50 text-sky-700", "bg-earth-50 text-earth-700", "bg-[#fdecf3] text-accent-berry"];
const FILTERS = ["All", "Booked", "Attended", "Joined"];
const SUM = [
  { st: "Booked", cls: "text-sky-600" },
  { st: "Attended", cls: "text-earth-600" },
  { st: "Joined", cls: "text-brand-600" },
];

const fmt = (d: string) => { const [y, m, dd] = d.split("-").map(Number); return new Date(y, m - 1, dd).toLocaleDateString("en-UG", { month: "short", day: "numeric", year: "numeric" }); };

export default function Referrals() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [all, setAll] = useState<Referral[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let ok = false; try { ok = localStorage.getItem(AUTH) === "1"; } catch {}
    if (!ok) { router.replace("/dashboard"); return; }
    (async () => { const [m, r] = await Promise.all([getMember(), getReferrals()]); setMember(m); setAll(r); setReady(true); })();
  }, [router]);

  if (!ready || !member) return null;
  const filtered = all.filter((r) => filter === "All" || r.status === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <DashHeader active="referrals" memberInitials={initials(member.name)} />
      <main className="bf-container pt-6 pb-12 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900">Your referrals</h1>
          <p className="mt-1.5 text-sm text-slate-500">People who booked a session with your personal link.</p>
        </div>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
          {SUM.map((s) => (
            <div key={s.st} className="bg-white border border-slate-200/90 rounded-xl shadow-soft px-5 py-[18px]">
              <span className="block text-[1.75rem] font-bold leading-none text-slate-900">{all.filter((r) => r.status === s.st).length}</span>
              <span className={cn("block mt-1.5 text-xs font-semibold uppercase tracking-[0.04em]", s.cls)}>{s.st}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((k) => (
            <button key={k} type="button" onClick={() => setFilter(k)}
              className={cn("px-4 py-2 rounded-full cursor-pointer text-[0.8125rem] font-semibold border",
                filter === k ? "bg-brand-500 text-white border-brand-500" : "bg-white text-slate-600 border-slate-200")}>{k}</button>
          ))}
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl shadow-soft overflow-hidden">
          <div className="px-5 py-[18px] border-b border-slate-100 flex items-baseline justify-between gap-2.5">
            <h2 className="text-[0.9375rem] font-bold text-slate-900">{filter === "All" ? "All referrals" : filter}</h2>
            <span className="text-xs text-slate-400">{filtered.length} shown</span>
          </div>
          <div className="flex flex-col">
            {filtered.length === 0 ? (
              <p className="m-0 px-5 py-8 text-center text-sm text-slate-400">No referrals with this status yet.</p>
            ) : filtered.map((r, i) => (
              <div key={r.id ?? i} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100">
                <span className={cn("flex items-center justify-center w-9 h-9 rounded-full shrink-0 font-bold text-xs", TINTS[i % TINTS.length])}>{initials(r.name)}</span>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 truncate">{r.name}</span>
                  <span className="text-xs text-slate-400">{fmt(r.referral_date)}</span>
                </div>
                <Badge variant={BADGE[r.status] ?? "neutral"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </div>
        <p className="disclaimer m-0">Live data from your bf-suma database. No income is guaranteed or implied.</p>
      </main>
    </div>
  );
}
