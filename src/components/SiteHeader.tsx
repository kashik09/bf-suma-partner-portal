"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button, cn } from "./ui";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkCls = (href: string) =>
    cn(
      "px-3 py-2 rounded-lg text-sm font-medium no-underline transition",
      isActive(href) ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    );

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="bf-container flex items-center gap-4 h-16">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.svg" alt="BF Suma" width={130} height={34} className="h-[34px] w-auto" priority />
        </Link>
        <nav aria-label="Main" className="hidden md:flex gap-1 flex-1 justify-center">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={linkCls(n.href)}>{n.label}</Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className={linkCls("/dashboard")}>Member Login</Link>
          <Button href="/book" variant="primary" size="md">Book a Session</Button>
        </div>
        <div className="flex md:hidden items-center gap-2 flex-1 justify-end">
          <Button href="/book" variant="primary" size="sm">Book</Button>
          <button type="button" aria-label="Menu" onClick={() => setOpen((v) => !v)} className="p-2.5 text-slate-700">
            <Menu size={24} />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="md:hidden flex flex-col px-4 pb-4 pt-2 gap-0.5 bg-white border-t border-slate-100">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn(linkCls(n.href), "text-base py-3.5")} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
          <Link href="/dashboard" className="text-base py-3.5 px-3 text-brand-700 font-medium">Member Login</Link>
        </nav>
      )}
    </header>
  );
}
