import { GraduationCap, Clock, Users, Heart } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui";
import { BRAND } from "@/lib/brand";

const CATEGORIES = [
  { media: "m-immunity", title: "Immune support", desc: "Daily supplements that support your body's natural defences." },
  { media: "m-digestive", title: "Digestive wellness", desc: "Teas and blends that promote comfortable, healthy digestion." },
  { media: "m-energy", title: "Energy & vitality", desc: "Coffees and tonics that promote everyday energy and focus." },
  { media: "m-skincare", title: "Skincare", desc: "Gentle skincare that supports a healthy, natural glow." },
];
const WHY = [
  { Icon: GraduationCap, cls: "bg-brand-50 text-brand-600", title: "Mentorship & training", desc: `Learn the products and how to share them, with hands-on guidance from ${BRAND.distributorName} and senior members.` },
  { Icon: Clock, cls: "bg-sky-50 text-sky-600", title: "Flexible schedule", desc: "Build around your work, studies, or family. You choose how much time to give each week." },
  { Icon: Users, cls: "bg-earth-50 text-earth-600", title: "Supportive community", desc: "Weekly meet-ups, a WhatsApp group, and teammates who cheer each other on." },
  { Icon: Heart, cls: "bg-[#fdecf3] text-accent-berry", title: "Personal growth", desc: "Grow your confidence, communication, and knowledge of everyday wellness." },
];
const STEP_COLORS = ["bg-brand-500", "bg-sky-500", "bg-earth-500", "bg-accent-berry"];
const STEPS = [
  { title: "Book a session", desc: "Pick a date and time slot on the Book page — it takes under a minute." },
  { title: "Attend training", desc: `Meet ${BRAND.distributorName} in person and learn about the products and the team.` },
  { title: "Get set up", desc: "If it feels right, register as a member and join the team community." },
  { title: "Start sharing wellness", desc: "Share products you believe in, with your mentor supporting every step." },
];
const TESTIMONIALS = [
  { q: "The training made everything simple. I came in knowing nothing about the products and left feeling ready to share them with my neighbours.", n: "Josephine A.", s: "Member since 2025", ini: "JA", cls: "bg-brand-50 text-brand-700" },
  { q: "What I love most is the community. Someone always checks on you, celebrates your wins, and helps when a week is slow.", n: "Samuel M.", s: "Member since 2024", ini: "SM", cls: "bg-sky-50 text-sky-700" },
  { q: "I joined for the products and stayed for the people. My mentor still calls every week to see how I'm doing.", n: "Ruth N.", s: "Member since 2025", ini: "RN", cls: "bg-earth-50 text-earth-700" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="bg-surface-subtle border-b border-slate-100">
        <div className="bf-container py-10 sm:py-16">
          <p className="eyebrow">About</p>
          <h1 className="max-w-[680px] text-[1.75rem] sm:text-[2.75rem] font-bold leading-[1.1] text-slate-900">Wellness that works — shared by a team that cares</h1>
          <p className="mt-4 max-w-[600px] text-[1.0625rem] leading-relaxed text-slate-600">Learn what BF Suma is, why members join {BRAND.teamName}, and exactly how getting started works.</p>
        </div>
      </section>

      <section className="pt-16">
        <div className="bf-container">
          <p className="eyebrow">About the brand</p>
          <h2 className="text-2xl font-bold text-slate-900">What is BF Suma?</h2>
          <p className="mt-2.5 max-w-[640px] text-[0.9375rem] leading-relaxed text-slate-600">BF Suma is a health and wellness brand offering supplements, skincare, and wellness beverages across Africa. Every product is designed to support everyday health — never to replace medical care.</p>
          <div className="grid gap-4 mt-7 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
            {CATEGORIES.map((c) => (
              <div key={c.title} className="card hover-lift">
                <div className={`media ${c.media} h-[140px]`}><div className="media-pattern" /></div>
                <div className="p-4"><h3 className="text-base font-bold text-slate-900">{c.title}</h3><p className="mt-1.5 text-[0.8125rem] leading-relaxed text-slate-600">{c.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16">
        <div className="bf-container">
          <p className="eyebrow">Why join</p>
          <h2 className="text-2xl font-bold text-slate-900">A team that grows together</h2>
          <p className="mt-2.5 max-w-[640px] text-[0.9375rem] leading-relaxed text-slate-600">Joining {BRAND.teamName} is about community, learning, and sharing wellness — at a pace that fits your life.</p>
          <div className="grid gap-4 mt-7 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {WHY.map(({ Icon, cls, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200/90 rounded-xl shadow-soft p-[22px]">
                <div className={`flex items-center justify-center w-11 h-11 rounded-[10px] ${cls}`}><Icon size={22} /></div>
                <h3 className="mt-3.5 text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
          <p className="disclaimer mt-4 max-w-[640px]">Joining is an opportunity to learn and share wellness. Results vary from person to person and no income is guaranteed.</p>
        </div>
      </section>

      <section className="pt-16">
        <div className="bf-container">
          <div className="card p-6 sm:p-10">
            <p className="eyebrow">How it works</p>
            <h2 className="text-2xl font-bold text-slate-900">From curious to confident, in four steps</h2>
            <div className="grid gap-6 mt-7 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
              {STEPS.map((s, i) => (
                <div key={s.title} className="flex flex-col gap-2.5">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${STEP_COLORS[i]}`}>{i + 1}</div>
                  <h3 className="text-[0.9375rem] font-bold text-slate-900">{s.title}</h3>
                  <p className="text-[0.8125rem] leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-7"><Button href="/book" variant="brand" size="lg">Book a Training Session</Button></div>
          </div>
        </div>
      </section>

      <section className="pt-16 pb-16">
        <div className="bf-container">
          <p className="eyebrow">From the team</p>
          <h2 className="text-2xl font-bold text-slate-900">What members say</h2>
          <div className="grid gap-4 mt-7 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
            {TESTIMONIALS.map((t) => (
              <figure key={t.n} className="m-0 bg-white border border-slate-200/90 rounded-xl shadow-soft p-[22px] flex flex-col gap-3.5">
                <blockquote className="m-0 text-[0.9375rem] leading-relaxed text-slate-700">&ldquo;{t.q}&rdquo;</blockquote>
                <figcaption className="flex items-center gap-2.5 mt-auto">
                  <span className={`flex items-center justify-center w-[38px] h-[38px] rounded-full font-bold text-[0.8125rem] ${t.cls}`}>{t.ini}</span>
                  <span className="flex flex-col"><span className="text-sm font-bold text-slate-900">{t.n}</span><span className="text-xs text-slate-500">{t.s}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
