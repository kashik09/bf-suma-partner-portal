import Link from "next/link";
import React from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

type Variant = "brand" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  brand: "bg-brand-500 text-white hover:bg-brand-600",
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-white/10 text-white border border-white/55 backdrop-blur-sm hover:bg-white/20",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};
const SIZE: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-[18px] text-[0.9375rem]",
  lg: "h-12 px-[22px] text-base",
};

export function btnClass(variant: Variant = "brand", size: Size = "md", full = false) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold no-underline cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed",
    VARIANT[variant], SIZE[size], full && "w-full"
  );
}

type ButtonProps = {
  variant?: Variant; size?: Size; full?: boolean; href?: string;
  external?: boolean; className?: string; children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "brand", size = "md", full, href, external, className, children, ...rest }: ButtonProps) {
  const cls = cn(btnClass(variant, size, full), className);
  if (href) {
    if (external) return <a href={href} target="_blank" rel="noopener" className={cls}>{children}</a>;
    return <Link href={href} className={cls}>{children}</Link>;
  }
  return <button className={cls} {...rest}>{children}</button>;
}

export function Badge({ variant, children }: { variant: "info" | "warning" | "success" | "neutral"; children: React.ReactNode }) {
  return <span className={cn("badge", `badge-${variant}`)}>{children}</span>;
}

export function StatsCard({ label, value, trend, icon, tint }: {
  label: string; value: string | number; trend?: string; icon: React.ReactNode;
  tint: "brand" | "sky" | "earth" | "berry";
}) {
  const tintCls = {
    brand: "bg-brand-50 text-brand-600",
    sky: "bg-sky-50 text-sky-600",
    earth: "bg-earth-50 text-earth-600",
    berry: "bg-[#fdecf3] text-accent-berry",
  }[tint];
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-soft p-[18px] flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between gap-2.5">
        <span className="text-[0.8125rem] font-semibold text-slate-500">{label}</span>
        <span className={cn("flex items-center justify-center w-[38px] h-[38px] rounded-[10px] shrink-0", tintCls)}>{icon}</span>
      </div>
      <span className="text-[1.75rem] font-bold text-slate-900 leading-tight">{value}</span>
      {trend ? <span className="text-xs text-slate-400 font-semibold">{trend}</span> : null}
    </div>
  );
}
