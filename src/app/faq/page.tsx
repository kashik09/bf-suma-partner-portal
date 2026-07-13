"use client";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button, cn } from "@/components/ui";
import { BRAND, waLink } from "@/lib/brand";
import { FAQS } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="bg-surface-subtle border-b border-slate-100">
        <div className="bf-container py-9 sm:py-14">
          <p className="eyebrow">FAQ</p>
          <h1 className="max-w-[640px] text-[1.75rem] sm:text-[2.5rem] font-bold leading-[1.1] text-slate-900">Common questions</h1>
          <p className="mt-3.5 max-w-[560px] text-base leading-relaxed text-slate-600">Everything you might want to know before booking a training session.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="bf-container max-w-[820px]">
          <div className="flex flex-col gap-2.5">
            {FAQS.map((f, i) => (
              <div key={f.q} className="bg-white border border-slate-200/90 rounded-xl shadow-soft overflow-hidden">
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
                  className="w-full flex items-center justify-between gap-3 border-none bg-transparent cursor-pointer px-[18px] py-4 text-left">
                  <span className="text-[0.9375rem] font-semibold text-slate-900">{f.q}</span>
                  <ChevronDown size={18} className={cn("text-slate-500 shrink-0 transition-transform", open === i && "rotate-180")} />
                </button>
                {open === i && <p className="m-0 px-[18px] pb-4 text-sm leading-relaxed text-slate-600">{f.a}</p>}
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white border border-slate-200/90 rounded-2xl shadow-soft p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Still have a question?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Message {BRAND.distributorName} directly — we&apos;re happy to help.</p>
            </div>
            <Button href={waLink()} external variant="brand" size="md"><MessageCircle size={17} />Chat with us</Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
