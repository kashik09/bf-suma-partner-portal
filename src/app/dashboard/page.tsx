"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, Calendar, Users, Award, Flame, Share2, ChevronRight } from "lucide-react";
import DashHeader from "@/components/DashHeader";
import { Button, StatsCard } from "@/components/ui";
import { BRAND } from "@/lib/brand";
import { initials } from "@/lib/brand";
import { getMember, getWeeklyReferrals, getReferrals, getLeaderboard, getDashStats, type Member, type WeeklyReferral } from "@/lib/data";

const AUTH = "bfsuma-demo-auth";

export default function Dashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => { try { setAuthed(localStorage.getItem(AUTH) === "1"); } catch { setAuthed(false); } }, []);
  if (authed === null) return null;
  return authed ? <DashboardView /> : <LoginView onLogin={() => setAuthed(true)} />;
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState(false);
  const submit = () => {
    if (!email.trim() || !pw) { setErr(true); return; }
    try { localStorage.setItem(AUTH, "1"); } catch {}
    onLogin();
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Link href="/" className="flex mb-7"><Image src="/logo.svg" alt="BF Suma" width={150} height={40} className="h-10 w-auto" /></Link>
      <div className="w-full max-w-[400px] bg-white border border-slate-200/90 rounded-2xl shadow-card p-6 sm:p-8">
        <h1 className="text-[1.375rem] font-bold text-slate-900">Member login</h1>
        <p className="mt-2 mb-[22px] text-sm leading-relaxed text-slate-600">Sign in to track your weekly referrals and team progress.</p>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5"><span className="text-[0.8125rem] font-semibold text-slate-700">Email</span>
            <input type="email" className={`bf-input${err ? " invalid" : ""}`} value={email} placeholder="you@example.com" onChange={(e) => { setEmail(e.target.value); setErr(false); }} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-[0.8125rem] font-semibold text-slate-700">Password</span>
            <input type="password" className={`bf-input${err ? " invalid" : ""}`} value={pw} placeholder="••••••••" onChange={(e) => { setPw(e.target.value); setErr(false); }} />
            {err && <span role="alert" className="text-xs text-danger">Enter your email and password to continue</span>}</label>
          <Button variant="primary" size="lg" full onClick={submit}>Sign In</Button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-400 text-center">Demo build — any email and password will sign you in.</p>
      </div>
      <Link href="/" className="mt-5 text-[0.8125rem] text-slate-500 hover:text-slate-800">← Back to public site</Link>
    </div>
  );
}

function Ring({ done, target }: { done: number; target: number }) {
  const pct = Math.min(1, done / target); const circ = 2 * Math.PI * 64;
  return (
    <div className="relative w-[150px] h-[150px]">
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="75" cy="75" r="64" fill="none" stroke="#E9F7EF" strokeWidth="13" />
        <circle cx="75" cy="75" r="64" fill="none" stroke="#1E9E5A" strokeWidth="13" strokeLinecap="round" strokeDasharray={`${(pct * circ).toFixed(1)} ${circ.toFixed(1)}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[1.75rem] font-bold text-slate-900 leading-none">{done}<span className="text-base font-medium text-slate-400"> / {target}</span></span>
        <span className="mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-slate-500">referrals</span>
      </div>
    </div>
  );
}

function DashboardView() {
  const [member, setMember] = useState<Member | null>(null);
  const [weekly, setWeekly] = useState<WeeklyReferral[]>([]);
  const [refCount, setRefCount] = useState(0);
  const [stats, setStats] = useState({ referralsThisWeek: 0, referralsThisMonth: 0, teamSize: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const [m, w, r, s] = await Promise.all([getMember(), getWeeklyReferrals(), getReferrals(), getDashStats()]);
      setMember(m); setWeekly(w); setRefCount(r.length); setStats(s);
    })();
  }, []);

  if (!member) return (<div className="min-h-screen flex flex-col"><DashHeader active="overview" memberInitials="GA" /><main className="bf-container py-10"><p className="text-sm text-slate-400">Loading your dashboard…</p></main></div>);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const goalDone = stats.referralsThisWeek, goalTarget = member.weekly_goal;
  const goalMsg = goalDone >= goalTarget ? "Goal reached — brilliant week!" : `${goalTarget - goalDone} more ${goalTarget - goalDone === 1 ? "referral" : "referrals"} to hit this week's goal`;
  const maxCount = Math.max(1, ...weekly.map((w) => w.count));
  const now = new Date();
  const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-UG", { month: "short", day: "numeric" });

  const copy = () => {
    const link = `https://bfsuma.example/join?ref=${member.referral_code || "DEMO"}`;
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(link).then(done).catch(done); else done();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashHeader active="overview" memberInitials={initials(member.name)} />
      <main className="bf-container pt-6 pb-12 flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3.5">
          <div>
            <h1 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900">{greeting}, {member.name.split(" ")[0]}</h1>
            <p className="mt-1.5 text-sm text-slate-500">Week of {fmt(monday)} – {fmt(sunday)}, {now.getFullYear()} · {member.rank}</p>
          </div>
          <Button variant="brand" size="md" onClick={copy}><Share2 size={16} />{copied ? "Link copied!" : "Refer someone"}</Button>
        </div>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          <StatsCard label="Referrals this week" value={goalDone} trend={`goal ${goalTarget} / week`} icon={<UserPlus size={22} />} tint="brand" />
          <StatsCard label="Referrals this month" value={stats.referralsThisMonth} icon={<Calendar size={22} />} tint="sky" />
          <StatsCard label="Total team size" value={stats.teamSize} trend="+2 this month" icon={<Users size={22} />} tint="earth" />
          <StatsCard label="Current rank" value={member.rank.split(" ")[0]} icon={<Award size={22} />} tint="berry" />
        </div>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-soft p-[22px] flex flex-col items-center gap-3.5">
            <h2 className="self-start text-[0.9375rem] font-bold text-slate-900">Weekly goal</h2>
            <Ring done={goalDone} target={goalTarget} />
            <p className="m-0 text-sm text-slate-600 text-center">{goalMsg}</p>
            <span className="inline-flex items-center gap-1.5 bg-earth-50 text-earth-700 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold"><Flame size={15} />{member.streak_weeks}-week streak</span>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-soft p-[22px] flex flex-col gap-4 [grid-column:span_2] min-w-0">
            <div className="flex items-baseline justify-between gap-2.5 flex-wrap">
              <h2 className="text-[0.9375rem] font-bold text-slate-900">Referrals per week</h2>
              <span className="text-xs text-slate-400">Last 8 weeks</span>
            </div>
            <div className="flex items-end gap-[clamp(6px,2%,18px)] h-[180px]">
              {weekly.map((w, i) => {
                const current = i === weekly.length - 1;
                const h = Math.max(8, Math.round((w.count / maxCount) * 130));
                return (
                  <div key={w.week} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full min-w-0">
                    <span className={`text-xs font-bold ${current ? "text-brand-600" : "text-slate-400"}`}>{w.count}</span>
                    <div title={`${w.count} referrals, week of ${w.label}`} className={`w-full max-w-[44px] rounded-t-lg ${current ? "bg-brand-500" : "bg-brand-100"}`} style={{ height: h }} />
                    <span className="text-[0.6875rem] text-slate-400 whitespace-nowrap">{w.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          <Link href="/referrals" className="hover-lift no-underline flex items-center gap-3.5 bg-white border border-slate-200/90 rounded-xl shadow-soft px-5 py-[18px]">
            <span className="flex items-center justify-center w-[42px] h-[42px] rounded-[10px] bg-brand-50 text-brand-600 shrink-0"><Users size={22} /></span>
            <span className="flex-1 min-w-0"><span className="block text-[0.9375rem] font-bold text-slate-900">Your referrals</span><span className="block text-[0.8125rem] text-slate-500">{refCount} people · track their status</span></span>
            <ChevronRight size={18} className="text-slate-400" />
          </Link>
          <Link href="/leaderboard" className="hover-lift no-underline flex items-center gap-3.5 bg-white border border-slate-200/90 rounded-xl shadow-soft px-5 py-[18px]">
            <span className="flex items-center justify-center w-[42px] h-[42px] rounded-[10px] bg-[#fdf0dc] text-accent-sun shrink-0"><Award size={22} /></span>
            <span className="flex-1 min-w-0"><span className="block text-[0.9375rem] font-bold text-slate-900">Team leaderboard</span><span className="block text-[0.8125rem] text-slate-500">See how the team is doing this week</span></span>
            <ChevronRight size={18} className="text-slate-400" />
          </Link>
        </div>

        <p className="disclaimer m-0">Live data from your bf-suma database. Referral numbers reflect bookings made with your personal link — no income is guaranteed or implied.</p>
      </main>
    </div>
  );
}
