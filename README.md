# BF Suma Partner Portal

Static multi-page site for an independent BF Suma distributor team (Team Vitality, Kampala).
Public marketing pages plus a member dashboard, wired to a Supabase backend.

## Pages
- `index.html` — Home
- `about.html` — About / why join / how it works
- `book.html` — Book a training session (calendar + slots, writes to Supabase)
- `blog.html` — Wellness articles
- `faq.html` — FAQ accordion
- `dashboard.html` — Member login + overview (live KPIs, weekly chart, goal ring)
- `referrals.html` — Referral list with status filters
- `leaderboard.html` — Team leaderboard

## Backend
Supabase project `bf-suma`. Client config is in `app.js` (anon key, RLS-protected).
Tables: `partner_bookings`, `partner_members`, `partner_referrals`,
`partner_weekly_referrals`, `partner_leaderboard`.

## Deploy
Plain static files — deploy to Vercel (framework: Other, no build step).
