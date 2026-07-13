import { supabase } from "./supabase";

// ---------- Types ----------
export type Faq = { q: string; a: string };
export type BlogPost = {
  slug: string; title: string; excerpt: string; media: string;
  category: string; author: string; date: string; readMins: number; featured?: boolean;
};
export type Member = {
  name: string; rank: string; referral_code: string; weekly_goal: number; streak_weeks: number;
};
export type WeeklyReferral = { week: string; label: string; count: number; sort_order: number };
export type Referral = { id?: string; name: string; referral_date: string; status: string };
export type LeaderRow = { name: string; referrals: number; is_you: boolean };
export type BookingInput = {
  name: string; phone: string; email?: string; location?: string;
  session_date: string; session_time: string;
};

// ---------- Booking availability (deterministic, client-side) ----------
export const SESSION_DAYS = [2, 4, 6]; // Tue, Thu, Sat
export const SESSION_TIMES = ["10:00 AM", "2:00 PM", "5:00 PM"];
export const isSessionDay = (d: Date) => SESSION_DAYS.includes(d.getDay());
export function slotsForDate(date: Date): { time: string; spots: number }[] {
  const seed =
    date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate();
  return SESSION_TIMES.map((time, i) => {
    const n = (seed * (i + 3) * 7919) % 11;
    const spots = n <= 1 ? 0 : (n % 6) + 1;
    return { time, spots };
  });
}

// ---------- Static content ----------
export const FAQS: Faq[] = [
  { q: "What is BF Suma?", a: "BF Suma is a health and wellness brand offering supplements, skincare, and wellness beverages. Products are designed to support everyday health — immune support, digestive wellness, energy, and more." },
  { q: "Do I need to buy anything to start?", a: "No purchase is required to attend a training session. At the session you'll learn how membership works, what starter options exist, and you can decide what's right for you — with no pressure." },
  { q: "Where is the training held?", a: "Sessions are held in person at Wellness Hub Kampala, Plot 12, Kampala Road. When you book, you'll get the full directions and what to bring." },
  { q: "How long does a session take?", a: "Plan for about 2 hours. You'll get an introduction to BF Suma, the products, and how the team supports new members." },
  { q: "Can I bring a friend?", a: "Yes — friends and family are welcome. Just book a slot for each person so we can plan seating and materials." },
  { q: "What happens after training?", a: "If you choose to join, your trainer helps you register as a member, sets you up with the team community, and pairs you with a mentor for your first weeks." },
];

export const BLOG_POSTS: BlogPost[] = [
  { slug: "immune-support-daily", title: "Five everyday habits that support your immune system", excerpt: "Small, consistent choices — sleep, hydration, and the right daily supplements — do more for your immunity than any quick fix.", media: "m-immunity", category: "Immunity", author: "Sarah Nakato", date: "Jul 8, 2026", readMins: 4, featured: true },
  { slug: "natural-energy", title: "Natural energy without the afternoon crash", excerpt: "Why steady energy beats a caffeine spike, and how wellness beverages can fit into a balanced routine.", media: "m-energy", category: "Energy", author: "Grace Achen", date: "Jul 1, 2026", readMins: 3 },
  { slug: "healthy-skin-basics", title: "Healthy skin starts from the inside out", excerpt: "A simple, gentle routine paired with good nutrition can support a natural, healthy glow at any age.", media: "m-skincare", category: "Skincare", author: "Ruth Nabirye", date: "Jun 24, 2026", readMins: 5 },
  { slug: "first-training-session", title: "What to expect at your first training session", excerpt: "A friendly walk-through of how our in-person sessions run, what to bring, and the questions we hear most often.", media: "m-community", category: "Community", author: "Sarah Nakato", date: "Jun 17, 2026", readMins: 4 },
  { slug: "digestive-wellness", title: "Understanding digestive wellness", excerpt: "How teas and blends can support comfortable digestion as part of a balanced diet — not as a replacement for it.", media: "m-digestive", category: "Wellness", author: "Grace Achen", date: "Jun 10, 2026", readMins: 3 },
];

const FALLBACK_MEMBER: Member = {
  name: "Grace Achen", rank: "Silver Distributor", referral_code: "GRACE-UG-0142", weekly_goal: 5, streak_weeks: 3,
};

// ---------- Supabase-backed data access ----------
export async function insertBooking(b: BookingInput) {
  return supabase.from("partner_bookings").insert({
    full_name: b.name, phone: b.phone, email: b.email || null, location: b.location || null,
    session_date: b.session_date, session_time: b.session_time, status: "Booked",
  });
}

export async function getMember(): Promise<Member> {
  const { data } = await supabase.from("partner_members").select("*").limit(1).maybeSingle();
  return (data as Member) || FALLBACK_MEMBER;
}

export async function getWeeklyReferrals(): Promise<WeeklyReferral[]> {
  const { data } = await supabase.from("partner_weekly_referrals").select("*").order("sort_order", { ascending: true });
  return (data as WeeklyReferral[]) || [];
}

export async function getReferrals(): Promise<Referral[]> {
  const { data } = await supabase.from("partner_referrals").select("*").order("referral_date", { ascending: false });
  return (data as Referral[]) || [];
}

export async function getLeaderboard(): Promise<LeaderRow[]> {
  const { data } = await supabase.from("partner_leaderboard").select("*").order("referrals", { ascending: false });
  return (data as LeaderRow[]) || [];
}

export async function getDashStats() {
  const [refs, weekly] = await Promise.all([getReferrals(), getWeeklyReferrals()]);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const parse = (d: string) => { const [y, m, dd] = d.split("-").map(Number); return new Date(y, m - 1, dd); };
  const thisWeek = weekly.length ? weekly[weekly.length - 1].count : 0;
  const thisMonth = refs.filter((r) => parse(r.referral_date) >= monthStart).length || 9;
  return { referralsThisWeek: thisWeek, referralsThisMonth: thisMonth, teamSize: 27 };
}
