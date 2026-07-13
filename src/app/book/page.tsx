"use client";
import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, MapPin, BookOpen, Check } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button, cn } from "@/components/ui";
import { BRAND, VENUE, waLink } from "@/lib/brand";
import { isSessionDay, slotsForDate, insertBooking } from "@/lib/data";

type Step = "pick" | "form" | "confirmed";
const LOCATIONS = ["Kampala Central", "Wakiso", "Entebbe", "Mukono", "Jinja", "Other"];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayMidnight = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
const dateLabel = (s: string | null) => {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-UG", { weekday: "long", month: "short", day: "numeric" });
};

export default function BookPage() {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("pick");
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "Kampala Central" });
  const [errors, setErrors] = useState({ name: false, phone: false });
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [booked, setBooked] = useState<{ first: string; dateLabel: string; time: string } | null>(null);

  const curYM = now.getFullYear() * 12 + now.getMonth();
  const calYM = calYear * 12 + calMonth;
  const prevDisabled = calYM <= curYM;
  const nextDisabled = calYM >= curYM + 2;
  const monthLabel = new Date(calYear, calMonth, 1).toLocaleDateString("en-UG", { month: "long", year: "numeric" });

  const shiftMonth = (delta: number) => {
    const d = new Date(calYear, calMonth + delta, 1);
    setCalYear(d.getFullYear()); setCalMonth(d.getMonth());
  };

  const buildCells = () => {
    const t = todayMidnight();
    const max = new Date(t); max.setDate(max.getDate() + 45);
    const first = new Date(calYear, calMonth, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: { key: string; day: number | null; iso?: string; available?: boolean; selected?: boolean; past?: boolean }[] = [];
    for (let i = 0; i < offset; i++) cells.push({ key: `e${i}`, day: null });
    for (let d = 1; d <= days; d++) {
      const date = new Date(calYear, calMonth, d);
      const s = iso(date);
      const available = isSessionDay(date) && date >= t && date <= max;
      cells.push({ key: s, day: d, iso: s, available, selected: s === selectedISO, past: date < t });
    }
    return cells;
  };

  const slots = (() => {
    if (!selectedISO) return [];
    const [y, m, d] = selectedISO.split("-").map(Number);
    return slotsForDate(new Date(y, m - 1, d));
  })();

  const submit = async () => {
    const errName = form.name.trim().length < 2;
    const errPhone = form.phone.replace(/[^0-9]/g, "").length < 9;
    if (errName || errPhone) { setErrors({ name: errName, phone: errPhone }); return; }
    setErrors({ name: false, phone: false }); setSubmitting(true); setSaveError("");
    const { error } = await insertBooking({
      name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
      location: form.location, session_date: selectedISO!, session_time: selectedTime!,
    });
    setSubmitting(false);
    if (error) { setSaveError(`Could not save your booking — please try again. (${error.message})`); return; }
    setBooked({ first: form.name.trim().split(" ")[0], dateLabel: dateLabel(selectedISO), time: selectedTime! });
    setStep("confirmed");
  };

  const reset = () => {
    setStep("pick"); setSelectedISO(null); setSelectedTime(null);
    setForm({ name: "", phone: "", email: "", location: "Kampala Central" }); setBooked(null); setSaveError("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="bg-surface-subtle border-b border-slate-100">
        <div className="bf-container py-9 sm:py-14">
          <p className="eyebrow">Book a session</p>
          <h1 className="max-w-[640px] text-[1.75rem] sm:text-[2.5rem] font-bold leading-[1.1] text-slate-900">Reserve your free training slot</h1>
          <p className="mt-3.5 max-w-[560px] text-base leading-relaxed text-slate-600">In-person sessions with {BRAND.distributorName} at {VENUE.name} — Tuesdays, Thursdays &amp; Saturdays. No purchase required to attend.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="bf-container">
          <div className="card shadow-card">
            {step === "pick" && (
              <div className="grid gap-0 [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
                <div className="p-5 sm:p-8 border-r border-slate-100">
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-base font-bold text-slate-900">{monthLabel}</h3>
                    <div className="flex gap-1.5">
                      <button type="button" aria-label="Previous month" disabled={prevDisabled} onClick={() => shiftMonth(-1)} className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:text-slate-300"><ChevronLeft size={18} /></button>
                      <button type="button" aria-label="Next month" disabled={nextDisabled} onClick={() => shiftMonth(1)} className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:text-slate-300"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-1.5">
                    {["Mo","Tu","We","Th","Fr","Sa","Su"].map((x) => <span key={x} className="text-center text-[0.6875rem] font-bold text-slate-400 uppercase">{x}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {buildCells().map((c) => c.day === null ? <span key={c.key} /> : (
                      <button key={c.key} type="button" disabled={!c.available}
                        aria-label={`${c.available ? "Choose " : ""}${monthLabel} ${c.day}`}
                        onClick={() => { setSelectedISO(c.iso!); setSelectedTime(null); }}
                        className={cn("h-10 rounded-lg border-none flex items-center justify-center text-sm",
                          c.selected ? "bg-brand-500 text-white font-bold" :
                          c.available ? "bg-brand-50 text-brand-700 font-semibold cursor-pointer" :
                          c.past ? "text-slate-300" : "text-slate-400")}>{c.day}</button>
                    ))}
                  </div>
                  <p className="mt-3.5 flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-[3px] bg-brand-100 inline-block" />Training day — tap a green date to see times</p>
                </div>
                <div className="p-5 sm:p-8 flex flex-col">
                  {selectedISO ? (
                    <>
                      <h3 className="mb-1 text-base font-bold text-slate-900">{dateLabel(selectedISO)}</h3>
                      <p className="mb-4 text-[0.8125rem] text-slate-500">{VENUE.duration} · in person</p>
                      <div className="flex flex-col gap-2">
                        {slots.map((s) => {
                          const selected = s.time === selectedTime;
                          const full = s.spots === 0;
                          return (
                            <button key={s.time} type="button" disabled={full} onClick={() => setSelectedTime(s.time)}
                              className={cn("flex items-center justify-between gap-3 w-full h-12 px-4 rounded-lg text-[0.9375rem] font-semibold border transition",
                                selected ? "bg-brand-500 text-white border-brand-500" :
                                full ? "bg-slate-50 text-slate-400 border-slate-300 cursor-not-allowed" : "bg-white text-slate-900 border-slate-300 cursor-pointer")}>
                              <span>{s.time}</span>
                              <span className={cn("text-xs font-semibold", full ? "text-slate-400" : selected ? "text-white/85" : "text-brand-600")}>
                                {full ? "Full" : `${s.spots} ${s.spots === 1 ? "spot" : "spots"} left`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-[18px]"><Button variant="primary" size="lg" full disabled={!selectedTime} onClick={() => selectedTime && setStep("form")}>Continue</Button></div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-2.5 py-6 text-slate-400">
                      <Calendar size={36} strokeWidth={1.6} />
                      <p className="m-0 text-sm max-w-[220px] leading-relaxed">Select a date on the calendar to see available times</p>
                    </div>
                  )}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <span className="inline-flex items-start gap-2 text-[0.8125rem] text-slate-600"><MapPin size={15} className="text-brand-600 mt-0.5 shrink-0" />{VENUE.name}, {VENUE.address}</span>
                    <span className="inline-flex items-start gap-2 text-[0.8125rem] text-slate-600"><BookOpen size={15} className="text-brand-600 mt-0.5 shrink-0" />Bring a notebook, pen, and your national ID</span>
                  </div>
                </div>
              </div>
            )}

            {step === "form" && (
              <div className="p-5 sm:p-8 max-w-[560px]">
                <button type="button" onClick={() => setStep("pick")} className="inline-flex items-center gap-1.5 border-none bg-transparent cursor-pointer text-[0.8125rem] font-semibold text-slate-500 hover:text-slate-800 p-0"><ChevronLeft size={15} />Change date or time</button>
                <div className="inline-flex items-center gap-2 my-3.5 bg-brand-50 text-brand-700 rounded-full px-3.5 py-2 text-[0.8125rem] font-semibold"><Calendar size={15} />{dateLabel(selectedISO)} · {selectedTime}</div>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.8125rem] font-semibold text-slate-700">Full name *</span>
                    <input className={cn("bf-input", errors.name && "invalid")} value={form.name} placeholder="e.g. Amina Kirabo"
                      onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: false }); }} />
                    {errors.name && <span role="alert" className="text-xs text-danger">Please enter your name</span>}
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.8125rem] font-semibold text-slate-700">Phone number *</span>
                    <input type="tel" className={cn("bf-input", errors.phone && "invalid")} value={form.phone} placeholder="+256 7XX XXX XXX"
                      onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: false }); }} />
                    {errors.phone && <span role="alert" className="text-xs text-danger">Please enter a valid phone number</span>}
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.8125rem] font-semibold text-slate-700">Email <span className="font-normal text-slate-400">(optional)</span></span>
                    <input type="email" className="bf-input" value={form.email} placeholder="you@example.com" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.8125rem] font-semibold text-slate-700">Where are you based?</span>
                    <select className="bf-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                      {LOCATIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </label>
                  {saveError && <p className="m-0 text-[0.8125rem] text-danger">{saveError}</p>}
                  <div className="mt-1">
                    <Button variant="brand" size="lg" full disabled={submitting} onClick={submit}>{submitting ? "Booking…" : "Confirm Booking"}</Button>
                    <p className="mt-2.5 text-xs text-slate-400 text-center">We&apos;ll send a reminder by SMS or WhatsApp. No purchase required.</p>
                  </div>
                </div>
              </div>
            )}

            {step === "confirmed" && booked && (
              <div className="p-7 sm:p-12 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 text-brand-600"><Check size={30} strokeWidth={2.4} /></div>
                <h3 className="mt-[18px] text-[1.375rem] font-bold text-slate-900">You&apos;re booked, {booked.first}!</h3>
                <p className="mt-2 max-w-[400px] text-[0.9375rem] leading-relaxed text-slate-600">We&apos;ve reserved your seat. {BRAND.distributorName} will confirm by phone before the session.</p>
                <div className="mt-6 w-full max-w-[420px] bg-surface-subtle border border-slate-200 rounded-xl p-5 flex flex-col gap-3 text-left">
                  <span className="flex items-center gap-2.5 text-sm text-slate-700"><Calendar size={16} className="text-brand-600" /><strong className="font-bold text-slate-900">{booked.dateLabel}</strong>&nbsp;at&nbsp;<strong className="font-bold text-slate-900">{booked.time}</strong></span>
                  <span className="flex items-start gap-2.5 text-sm text-slate-700"><MapPin size={16} className="text-brand-600 mt-0.5 shrink-0" />{VENUE.name}, {VENUE.address}</span>
                  <span className="flex items-start gap-2.5 text-sm text-slate-700"><BookOpen size={16} className="text-brand-600 mt-0.5 shrink-0" />Bring a notebook, pen, and your national ID or passport</span>
                </div>
                <div className="flex gap-2.5 mt-6 flex-wrap justify-center">
                  <Button href={waLink()} external variant="brand" size="md">Chat on WhatsApp</Button>
                  <Button variant="ghost" size="md" onClick={reset}>Book another slot</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
