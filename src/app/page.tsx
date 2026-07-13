import { Check, Users } from "lucide-react";
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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="media m-hero absolute inset-0"><div className="media-pattern" /></div>
        <div className="bf-container relative py-14 sm:py-24 lg:py-28">
          <p className="mb-3.5 inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] uppercase text-white bg-brand-500/30 border border-brand-500/55 rounded-full px-3.5 py-1.5">{BRAND.teamName} · Kampala, Uganda</p>
          <h1 className="max-w-[620px] text-[2rem] sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white">Start your BF Suma journey with {BRAND.distributorName}</h1>
          <p className="mt-[18px] max-w-[480px] text-base sm:text-lg leading-relaxed text-white/85">Join a supportive wellness community. Learn about BF Suma products, get hands-on training, and grow at your own pace — with a mentor beside you.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Button href="/book" variant="brand" size="lg">Book a Training Session</Button>
            <Button href="/about" variant="secondary" size="lg">Learn More</Button>
          </div>
          <div className="flex flex-wrap gap-[18px] mt-8">
            {["Free in-person training", "No purchase needed to attend", "Sessions 3× a week"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2 text-[0.8125rem] text-white/85"><Check size={16} className="text-brand-200" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16">
        <div className="bf-container">
          <p className="eyebrow">Shop by category</p>
          <h2 className="text-2xl font-bold text-slate-900">Wellness for every day</h2>
          <p className="mt-2.5 max-w-[640px] text-[0.9375rem] leading-relaxed text-slate-600">BF Suma products support everyday health — never a replacement for medical care.</p>
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
          <div className="card grid gap-7 items-center [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            <div className="p-6 sm:p-10">
              <p className="eyebrow">Why join</p>
              <h2 className="text-2xl font-bold text-slate-900">A team that grows together</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-600">Mentorship, a flexible schedule, and a community that cheers each other on. Joining {BRAND.teamName} is about learning and sharing wellness — at a pace that fits your life.</p>
              <ul className="list-none mt-[18px] p-0 flex flex-col gap-2.5">
                {["Hands-on mentorship & training", "Flexible around work, study or family", "A supportive team community"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-slate-700"><Check size={18} className="text-brand-600" />{t}</li>
                ))}
              </ul>
              <div className="mt-6"><Button href="/about" variant="primary" size="md">Why Join Us</Button></div>
            </div>
            <div className="media m-wellness relative min-h-[260px] h-full"><div className="media-pattern" /><Users size={72} className="relative text-white" strokeWidth={1.5} /></div>
          </div>
        </div>
      </section>

      <section className="pt-16">
        <div className="bf-container">
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
        </div>
      </section>

      <section className="pt-16">
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

      <section className="py-16">
        <div className="bf-container">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="media m-veg absolute inset-0"><div className="media-pattern" /></div>
            <div className="relative p-7 sm:p-12 max-w-[560px]">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to learn more in person?</h2>
              <p className="mt-3 text-base leading-relaxed text-white/85">Book a free training session with {BRAND.distributorName}. No purchase needed — just come, learn, and decide what&apos;s right for you.</p>
              <div className="mt-6"><Button href="/book" variant="brand" size="lg">Book a Training Session</Button></div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
