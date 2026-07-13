import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { BRAND, VENUE, waLink } from "@/lib/brand";
import { Button } from "./ui";

export default function SiteFooter() {
  return (
    <footer className="bf-footer">
      <div className="bf-container pt-12 pb-8">
        <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <div>
            <Image src="/logo.svg" alt="BF Suma" width={140} height={38} className="h-[38px] w-auto bg-white rounded-lg px-2.5 py-1.5" />
            <p className="mt-3.5 text-sm leading-relaxed text-slate-200/75 max-w-[320px]">
              {BRAND.teamName} — an independent BF Suma distributor team led by {BRAND.distributorName}, sharing wellness across Uganda.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-white">Explore</p>
            {[["/about","About BF Suma"],["/book","Book a Session"],["/blog","Blog"],["/faq","FAQ"],["/dashboard","Member Login"]].map(([h,l]) => (
              <Link key={h} href={h} className="text-[0.8125rem] text-slate-200/70 no-underline hover:text-white transition">{l}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-white">Get in touch</p>
            <span className="inline-flex items-center gap-2 text-[0.8125rem] text-slate-200/70"><MapPin size={14} />{VENUE.name}, Kampala</span>
            <span className="inline-flex items-center gap-2 text-[0.8125rem] text-slate-200/70"><Phone size={14} />{BRAND.whatsappNumber}</span>
            <div className="mt-2.5"><Button href={waLink()} external variant="brand" size="md"><MessageCircle size={17} />Chat with us</Button></div>
          </div>
        </div>
        <div className="border-t border-slate-200/15 mt-8 pt-4 flex flex-wrap gap-2 justify-between text-xs text-slate-200/55">
          <span>© 2026 {BRAND.teamName}. Independent BF Suma distributor.</span>
          <span className="max-w-[560px]">BF Suma products support general wellness and are not intended to diagnose, treat, cure, or prevent any disease. No income is guaranteed.</span>
        </div>
      </div>
    </footer>
  );
}
