import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui";
import { BRAND } from "@/lib/brand";
import { BLOG_POSTS } from "@/lib/data";

export default function Blog() {
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const rest = BLOG_POSTS.filter((p) => p !== featured);
  const readLabel = (m: number) => `${m} min read`;
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="bg-surface-subtle border-b border-slate-100">
        <div className="bf-container py-9 sm:py-14">
          <p className="eyebrow">Blog</p>
          <h1 className="max-w-[640px] text-[1.75rem] sm:text-[2.5rem] font-bold leading-[1.1] text-slate-900">Wellness notes from the team</h1>
          <p className="mt-3.5 max-w-[560px] text-base leading-relaxed text-slate-600">Simple, practical articles on everyday health — written by {BRAND.distributorName} and {BRAND.teamName} members.</p>
        </div>
      </section>

      <section className="pt-12">
        <div className="bf-container">
          <article className="card hover-lift grid gap-0 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className={`media ${featured.media} relative min-h-[240px]`}><div className="media-pattern" /></div>
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2.5">
                <span className="text-[0.6875rem] font-bold tracking-[0.06em] uppercase text-brand-700 bg-brand-50 rounded-full px-2.5 py-1">Featured</span>
                <span className="text-xs font-semibold text-slate-500">{featured.category}</span>
              </div>
              <h2 className="mt-3.5 text-2xl sm:text-[1.75rem] font-bold leading-tight text-slate-900">{featured.title}</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-600">{featured.excerpt}</p>
              <div className="flex items-center gap-3 mt-5 text-[0.8125rem] text-slate-500">
                <span className="font-semibold text-slate-700">{featured.author}</span><span>·</span><span>{featured.date}</span><span>·</span><span>{readLabel(featured.readMins)}</span>
              </div>
              <div className="mt-[22px]"><Button href="/book" variant="primary" size="md">Read Article</Button></div>
            </div>
          </article>
        </div>
      </section>

      <section className="pt-10 pb-16">
        <div className="bf-container">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Latest articles</h2>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {rest.map((p) => (
              <article key={p.slug} className="card hover-lift flex flex-col">
                <div className={`media ${p.media} relative h-[170px]`}><div className="media-pattern" />
                  <span className="absolute top-3 left-3 text-[0.6875rem] font-bold tracking-[0.04em] uppercase text-slate-900 bg-white/90 rounded-full px-2.5 py-1">{p.category}</span>
                </div>
                <div className="p-[18px] flex flex-col flex-1">
                  <h3 className="text-[1.0625rem] font-bold leading-tight text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate-600">{p.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{p.author}</span><span>·</span><span>{p.date}</span>
                    <span className="ml-auto font-semibold text-slate-400">{readLabel(p.readMins)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
