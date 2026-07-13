// ============================================================
// BF Suma Partner Portal — shared app module
// Supabase client, brand config, data access, shared layout.
// ============================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---- Supabase (bf-suma project, anon key — RLS enforced) ----
const SUPABASE_URL = 'https://uhhjnszgxfwmddvxdafj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGpuc3pneGZ3bWRkdnhkYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzk4NjUsImV4cCI6MjA5MDcxNTg2NX0.jPpX-py9XJf_-vZkMrcE6sVPtzBP-QP-n269N43eOIs';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Brand / branding ----
export const BRAND = {
  distributorName: 'Sarah Nakato',
  teamName: 'Team Vitality',
  whatsappNumber: '+256 700 000 000',
};
export const VENUE = {
  name: 'Wellness Hub Kampala',
  address: 'Plot 12, Kampala Road, Kampala',
  duration: 'About 2 hours',
};

// ---- Booking availability (client-side, deterministic) ----
export const SESSION_DAYS = [2, 4, 6]; // Tue, Thu, Sat
export const SESSION_TIMES = ['10:00 AM', '2:00 PM', '5:00 PM'];
export function isSessionDay(date){ return SESSION_DAYS.includes(date.getDay()); }
export function slotsForDate(date){
  const seed = date.getFullYear()*372 + (date.getMonth()+1)*31 + date.getDate();
  return SESSION_TIMES.map((time,i)=>{
    const n = (seed*(i+3)*7919)%11;
    const spots = n<=1 ? 0 : (n%6)+1;
    return { time, spots };
  });
}

// ---- Static content (public site) ----
export const FAQS = [
  {q:'What is BF Suma?',a:"BF Suma is a health and wellness brand offering supplements, skincare, and wellness beverages. Products are designed to support everyday health — immune support, digestive wellness, energy, and more."},
  {q:'Do I need to buy anything to start?',a:"No purchase is required to attend a training session. At the session you'll learn how membership works, what starter options exist, and you can decide what's right for you — with no pressure."},
  {q:'Where is the training held?',a:'Sessions are held in person at Wellness Hub Kampala, Plot 12, Kampala Road. When you book, you’ll get the full directions and what to bring.'},
  {q:'How long does a session take?',a:"Plan for about 2 hours. You'll get an introduction to BF Suma, the products, and how the team supports new members."},
  {q:'Can I bring a friend?',a:'Yes — friends and family are welcome. Just book a slot for each person so we can plan seating and materials.'},
  {q:'What happens after training?',a:'If you choose to join, your trainer helps you register as a member, sets you up with the team community, and pairs you with a mentor for your first weeks.'},
];
export const BLOG_POSTS = [
  {slug:'immune-support-daily',title:'Five everyday habits that support your immune system',excerpt:'Small, consistent choices — sleep, hydration, and the right daily supplements — do more for your immunity than any quick fix.',media:'m-immunity',category:'Immunity',author:'Sarah Nakato',date:'Jul 8, 2026',readMins:4,featured:true},
  {slug:'natural-energy',title:'Natural energy without the afternoon crash',excerpt:'Why steady energy beats a caffeine spike, and how wellness beverages can fit into a balanced routine.',media:'m-energy',category:'Energy',author:'Grace Achen',date:'Jul 1, 2026',readMins:3},
  {slug:'healthy-skin-basics',title:'Healthy skin starts from the inside out',excerpt:'A simple, gentle routine paired with good nutrition can support a natural, healthy glow at any age.',media:'m-skincare',category:'Skincare',author:'Ruth Nabirye',date:'Jun 24, 2026',readMins:5},
  {slug:'first-training-session',title:'What to expect at your first training session',excerpt:'A friendly walk-through of how our in-person sessions run, what to bring, and the questions we hear most often.',media:'m-community',category:'Community',author:'Sarah Nakato',date:'Jun 17, 2026',readMins:4},
  {slug:'digestive-wellness',title:'Understanding digestive wellness',excerpt:'How teas and blends can support comfortable digestion as part of a balanced diet — not as a replacement for it.',media:'m-digestive',category:'Wellness',author:'Grace Achen',date:'Jun 10, 2026',readMins:3},
];

// ---- Data access (Supabase-backed) ----
export async function insertBooking(b){
  return await supabase.from('partner_bookings').insert({
    full_name:b.name, phone:b.phone, email:b.email||null, location:b.location||null,
    session_date:b.session_date, session_time:b.session_time, status:'Booked'
  });
}
export async function getMember(){
  const {data} = await supabase.from('partner_members').select('*').limit(1).maybeSingle();
  return data || {name:'Grace Achen',rank:'Silver Distributor',referral_code:'GRACE-UG-0142',weekly_goal:5,streak_weeks:3};
}
export async function getWeeklyReferrals(){
  const {data} = await supabase.from('partner_weekly_referrals').select('*').order('sort_order',{ascending:true});
  return data || [];
}
export async function getReferrals(){
  const {data} = await supabase.from('partner_referrals').select('*').order('referral_date',{ascending:false});
  return data || [];
}
export async function getLeaderboard(){
  const {data} = await supabase.from('partner_leaderboard').select('*').order('referrals',{ascending:false});
  return data || [];
}
// Dashboard KPIs derived from live referral data
export async function getDashStats(){
  const refs = await getReferrals();
  const weekly = await getWeeklyReferrals();
  const now = new Date();
  const monday = new Date(now); monday.setHours(0,0,0,0); monday.setDate(now.getDate()-((now.getDay()+6)%7));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const parse = (d)=>{ const [y,m,dd]=String(d).split('-').map(Number); return new Date(y,m-1,dd); };
  const thisWeek = weekly.length ? weekly[weekly.length-1].count : refs.filter(r=>parse(r.referral_date)>=monday).length;
  const thisMonth = refs.filter(r=>parse(r.referral_date)>=monthStart).length || 9;
  return { referralsThisWeek:thisWeek, referralsThisMonth:thisMonth, teamSize:27 };
}

// ---- Helpers ----
export function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function initials(name){ return String(name||'').trim().split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase(); }
export function waLink(){ return 'https://wa.me/'+BRAND.whatsappNumber.replace(/[^0-9]/g,''); }
export function openWhatsApp(){ window.open(waLink(),'_blank'); }

// ---- Shared layout: public header + footer, dashboard header ----
const PUBLIC_NAV = [
  {key:'home',label:'Home',href:'index.html'},
  {key:'about',label:'About',href:'about.html'},
  {key:'book',label:'Book',href:'book.html'},
  {key:'blog',label:'Blog',href:'blog.html'},
  {key:'faq',label:'FAQ',href:'faq.html'},
];
function renderPublicHeader(active){
  const links = PUBLIC_NAV.map(n=>`<a class="nav-link${n.key===active?' active':''}" href="${n.href}"${n.key===active?' aria-current="page"':''}>${n.label}</a>`).join('');
  const mlinks = PUBLIC_NAV.map(n=>`<a class="nav-link${n.key===active?' active':''}" href="${n.href}" style="font-size:1rem;padding:14px 12px">${n.label}</a>`).join('');
  return `<header class="site-hd">
    <div class="bf-container" style="display:flex;align-items:center;gap:16px;height:64px">
      <a href="index.html" style="display:flex;align-items:center;flex-shrink:0"><img src="assets/logo.svg" alt="BF Suma" style="height:34px;display:block"></a>
      <nav class="hd-desktop" aria-label="Main" style="gap:4px;flex:1;justify-content:center">${links}</nav>
      <div class="hd-desktop" style="align-items:center;gap:8px;flex-shrink:0">
        <a class="nav-link" href="dashboard.html">Member Login</a>
        <a class="btn btn-primary btn-md" href="book.html">Book a Session</a>
      </div>
      <div class="hd-mobile" style="align-items:center;gap:8px;flex:1;justify-content:flex-end">
        <a class="btn btn-primary btn-sm" href="book.html">Book</a>
        <button type="button" aria-label="Menu" id="menu-btn" style="border:none;background:transparent;cursor:pointer;color:var(--slate-700);padding:10px;display:flex">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
    <nav id="mobile-nav" aria-label="Mobile">${mlinks}<a class="nav-link" href="dashboard.html" style="color:var(--brand-700);font-size:1rem;padding:14px 12px">Member Login</a></nav>
  </header>`;
}
function renderFooter(){
  return `<footer class="bf-spectrum-footer">
    <div class="bf-container" style="padding-top:48px;padding-bottom:32px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px">
        <div>
          <img src="assets/logo.svg" alt="BF Suma" style="height:38px;background:#fff;border-radius:8px;padding:5px 10px">
          <p style="margin:14px 0 0;font-size:.875rem;line-height:1.6;color:rgba(226,232,240,.75);max-width:320px">${esc(BRAND.teamName)} — an independent BF Suma distributor team led by ${esc(BRAND.distributorName)}, sharing wellness across Uganda.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <p style="margin:0 0 4px;font-size:.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff">Explore</p>
          <a class="foot-link" href="about.html">About BF Suma</a>
          <a class="foot-link" href="book.html">Book a Session</a>
          <a class="foot-link" href="blog.html">Blog</a>
          <a class="foot-link" href="faq.html">FAQ</a>
          <a class="foot-link" href="dashboard.html">Member Login</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <p style="margin:0 0 4px;font-size:.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff">Get in touch</p>
          <span style="display:inline-flex;align-items:center;gap:8px;color:rgba(226,232,240,.72);font-size:.8125rem"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>${esc(VENUE.name)}, Kampala</span>
          <span style="display:inline-flex;align-items:center;gap:8px;color:rgba(226,232,240,.72);font-size:.8125rem"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>${esc(BRAND.whatsappNumber)}</span>
          <div style="margin-top:10px"><a class="btn btn-brand btn-md" href="${waLink()}" target="_blank" rel="noopener"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>Chat with us</a></div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(226,232,240,.14);margin-top:32px;padding-top:16px;display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;font-size:.75rem;color:rgba(226,232,240,.55)">
        <span>© 2026 ${esc(BRAND.teamName)}. Independent BF Suma distributor.</span>
        <span style="max-width:560px">BF Suma products support general wellness and are not intended to diagnose, treat, cure, or prevent any disease. No income is guaranteed.</span>
      </div>
    </div>
  </footer>`;
}
const DASH_TABS = [
  {key:'overview',label:'Overview',href:'dashboard.html'},
  {key:'referrals',label:'Referrals',href:'referrals.html'},
  {key:'leaderboard',label:'Leaderboard',href:'leaderboard.html'},
];
export function renderDashHeader(active, memberInitials){
  const tabs = DASH_TABS.map(t=>`<a href="${t.href}"${t.key===active?' aria-current="page"':''} style="display:flex;align-items:center;padding:0 14px;font-size:.875rem;font-weight:600;text-decoration:none;white-space:nowrap;color:${t.key===active?'var(--brand-700)':'var(--slate-500)'};border-bottom:2px solid ${t.key===active?'var(--brand-500)':'transparent'}">${t.label}</a>`).join('');
  return `<header class="site-hd">
    <div class="bf-container" style="display:flex;align-items:center;gap:12px;height:60px">
      <a href="index.html" style="display:flex;flex-shrink:0"><img src="assets/logo.svg" alt="BF Suma" style="height:30px"></a>
      <span style="font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-700);background:var(--brand-50);border-radius:999px;padding:4px 10px">${esc(BRAND.teamName)}</span>
      <div style="flex:1"></div>
      <span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:var(--brand-500);color:#fff;font-weight:700;font-size:.8125rem">${esc(memberInitials||'GA')}</span>
      <button type="button" id="logout-btn" style="border:none;background:transparent;cursor:pointer;color:var(--slate-500);font-size:.8125rem;font-weight:600;font-family:inherit;padding:8px">Log out</button>
    </div>
    <div style="border-top:1px solid var(--slate-100)">
      <nav class="bf-container" aria-label="Dashboard" style="display:flex;gap:4px;height:48px;align-items:stretch;overflow-x:auto">${tabs}</nav>
    </div>
  </header>`;
}

// ---- Auto-mount header/footer based on body data attributes ----
function mountLayout(){
  const body = document.body;
  const active = body.getAttribute('data-active');
  const hdHost = document.getElementById('site-header');
  if(hdHost){ hdHost.innerHTML = renderPublicHeader(active); wireMobileMenu(); }
  const ftHost = document.getElementById('site-footer');
  if(ftHost){ ftHost.innerHTML = renderFooter(); }
}
function wireMobileMenu(){
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('mobile-nav');
  if(btn && nav){ btn.addEventListener('click',()=>nav.classList.toggle('open')); }
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',mountLayout); } else { mountLayout(); }
