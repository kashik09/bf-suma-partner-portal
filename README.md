# BF Suma Partner Portal

Marketing site + member dashboard for an independent BF Suma distributor team
(Team Vitality, Kampala), built with **Next.js (App Router) + TypeScript +
Tailwind CSS + Supabase**.

## Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 3 (design tokens in `tailwind.config.ts`)
- Supabase (`@supabase/supabase-js`), Row-Level Security
- `lucide-react` icons

## Pages (`src/app`)
- `/` Home · `/about` · `/blog` · `/faq`
- `/book` — booking flow (calendar + slots, writes to `partner_bookings`)
- `/dashboard` — member login + overview (live KPIs, weekly chart, goal ring)
- `/referrals` — referral list with status filters
- `/leaderboard` — team ranking

## Backend (Supabase project `bf-suma`)
Tables: `partner_bookings`, `partner_members`, `partner_referrals`,
`partner_weekly_referrals`, `partner_leaderboard`. Public access uses the anon
key and is gated by RLS (anon may insert bookings and read dashboard reference
data only).

## Getting started
```bash
npm install
cp .env.example .env.local   # already provided locally with the anon key
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Deploy to Vercel (framework auto-detected as Next.js).

> `legacy-static/` holds the original static HTML prototype and can be deleted.
