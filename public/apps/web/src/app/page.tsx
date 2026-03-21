import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { LocationHero } from '@/components/location/LocationHero'
import { Logo } from '@/components/ui/Logo'
import { AuthGuard } from '@/components/auth/AuthGuard'

const CATEGORIES = [
  { label: 'Rice Dishes',   icon: '🍚', href: '/restaurants?category=rice' },
  { label: 'Soups',         icon: '🍲', href: '/restaurants?category=soups' },
  { label: 'Swallow',       icon: '🫓', href: '/restaurants?category=swallow' },
  { label: 'Suya & Grills', icon: '🔥', href: '/restaurants?category=suya' },
  { label: 'Pepper Soup',   icon: '🌶️', href: '/restaurants?category=pepper-soup' },
  { label: 'Snacks',        icon: '🫔', href: '/restaurants?category=snacks' },
  { label: 'Drinks',        icon: '🥤', href: '/restaurants?category=drinks' },
  { label: 'Desserts',      icon: '🍮', href: '/restaurants?category=desserts' },
]

const SPECIAL_OFFERS = [
  {
    pct: '30%',
    title: 'Special Discount',
    sub: 'Discount Guaranteed!',
    label: 'Valid until 30 Nov',
    bg: 'from-[var(--gold)] to-amber-600',
    food: '🍲',
  },
  {
    pct: '15%',
    title: 'On Suya & Grills',
    sub: 'Every Weekend',
    label: 'Sat & Sun only',
    bg: 'from-orange-600 to-red-500',
    food: '🔥',
  },
  {
    pct: '20%',
    title: 'Free Delivery',
    sub: 'On Orders over ₦5,000',
    label: 'No code needed',
    bg: 'from-emerald-700 to-teal-600',
    food: '🛵',
  },
]

const RECOMMENDED = [
  { name: 'Egusi Soup & Pounded Yam', rating: '4.9', time: '25 min', price: '₦3,500', tag: 'Popular', food: '🍲' },
  { name: 'Jollof Rice & Chicken',    rating: '4.8', time: '20 min', price: '₦2,800', tag: 'Top Pick', food: '🍚' },
  { name: 'Suya Platter (500g)',      rating: '4.9', time: '15 min', price: '₦4,000', tag: 'Hot 🔥',  food: '🥩' },
  { name: 'Ofe Onugbu & Fufu',        rating: '4.7', time: '30 min', price: '₦3,200', tag: 'Fresh',   food: '🫕' },
]

const WHAT_WE_SERVE = [
  {
    icon: '🍲',
    title: 'Traditional Soups',
    desc: 'Egusi, Efo Riro, Gbegiri, Ogbono, Oha — cooked fresh by local bukas and home chefs.',
  },
  {
    icon: '🔥',
    title: 'Suya & Grills',
    desc: 'Spicy yaji-marinated beef, chicken, and ram suya grilled over open flame.',
  },
  {
    icon: '🍚',
    title: 'Rice Dishes',
    desc: 'Party jollof, coconut rice, ofada rice, fried rice — the full Nigerian spread.',
  },
  {
    icon: '🫓',
    title: 'Swallow & Sides',
    desc: 'Pounded yam, amala, fufu, eba — paired with your favourite soups.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', icon: '📍', title: 'Set your location', desc: 'Tell us where you are in Lagos, Abuja, Port Harcourt, or anywhere across Nigeria.' },
  { step: '02', icon: '🍽️', title: 'Pick your food',    desc: 'Browse Nigerian restaurants and choose from hundreds of authentic dishes.' },
  { step: '03', icon: '🛵', title: 'Get it delivered',   desc: 'Your hot meal arrives at your door — fast, fresh, and full of flavour.' },
]

export default function HomePage() {
  return (
    <AuthGuard>
      <Navbar />

      <main className="relative z-10">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden premium-grid-bg min-h-[520px] flex items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[var(--gold-bg)] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[var(--gold-bg)] rounded-full blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 flex flex-col lg:flex-row items-center gap-14 w-full">
            <div className="flex-1 text-center lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-4 py-2 mb-6">
                <span className="text-lg">🇳🇬</span>
                <span className="text-sm font-black text-[var(--text)] tracking-tight">
                  D<span className="text-[var(--gold)]">&</span>D
                </span>
                <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest border-l border-[var(--border)] pl-2">Nigeria</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-[var(--text)] leading-[1.05] tracking-tight">
                Authentic Nigerian<br />
                <span className="text-[var(--gold)]">food, delivered hot.</span>
              </h1>

              <p className="mt-5 text-[var(--text-2)] text-lg max-w-lg mx-auto lg:mx-0">
                From Mama Cee&apos;s egusi to Suya Spot&apos;s grills — order from the best Nigerian restaurants and get it delivered fast to your door.
              </p>

              <div className="mt-8">
                <LocationHero />
              </div>

              {/* Social proof */}
              <div className="mt-6 flex items-center gap-5 justify-center lg:justify-start text-sm text-[var(--text-3)] flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--gold)]">★★★★★</span>
                  <span>4.9 rating</span>
                </div>
                <span className="text-[var(--border)]">•</span>
                <span>Lagos · Abuja · PH</span>
                <span className="text-[var(--border)]">•</span>
                <span>30 min avg.</span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:flex flex-col items-center justify-center shrink-0">
              <div className="w-80 h-80 rounded-full bg-[var(--gold-bg)] border border-[var(--gold-border)] flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-[var(--gold-bg)] border border-[var(--gold-border)] flex items-center justify-center">
                  <span className="text-9xl select-none">🍲</span>
                </div>
              </div>
              <span className="absolute top-2 right-0 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🔥</span>
              <span className="absolute bottom-4 right-4 text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>🍚</span>
              <span className="absolute top-8 -left-4 text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.8s' }}>🫓</span>
              <div className="absolute -top-4 -right-10 bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-2.5" style={{ boxShadow: 'var(--shadow-md)' }}>
                <p className="text-xs text-[var(--text-3)]">Avg. delivery</p>
                <p className="text-lg font-black text-[var(--text)]">28 <span className="text-sm font-medium text-[var(--gold)]">min</span></p>
              </div>
              <div className="absolute -bottom-4 -left-10 bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-2.5" style={{ boxShadow: 'var(--shadow-md)' }}>
                <p className="text-xs text-[var(--text-3)]">Nigerian dishes</p>
                <p className="text-lg font-black text-[var(--text)]">100<span className="text-sm font-medium text-[var(--gold)]">+</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-[var(--text)]">What are you craving?</h2>
            <Link href="/restaurants" className="text-xs font-bold text-[var(--gold)] hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href}>
                <div className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)]/50 hover:bg-[var(--surface-2)] rounded-2xl p-3 flex flex-col items-center gap-2 transition-all cursor-pointer group" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="w-12 h-12 rounded-xl bg-[var(--gold-bg)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">{cat.icon}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-2)] group-hover:text-[var(--gold)] transition-colors text-center leading-tight">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Special Offers ── */}
        <section className="mx-auto max-w-7xl px-4 pb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-[var(--text)]">Special Offers</h2>
            <span className="text-xs font-bold text-[var(--gold)] bg-[var(--gold-bg)] border border-[var(--gold-border)] px-2.5 py-1 rounded-full">
              {SPECIAL_OFFERS.length} offers
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {SPECIAL_OFFERS.map((offer) => (
              <Link key={offer.pct} href="/restaurants" className="snap-start shrink-0 w-72 sm:w-80">
                <div className={`bg-gradient-to-br ${offer.bg} rounded-3xl p-5 text-white relative overflow-hidden hover:opacity-95 transition-opacity`} style={{ boxShadow: 'var(--shadow-md)' }}>
                  <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 select-none rotate-12">{offer.food}</div>
                  <div className="relative z-10">
                    <span className="text-5xl font-black leading-none">{offer.pct}</span>
                    <p className="font-black text-base mt-1 leading-tight">{offer.title}</p>
                    <p className="text-white/80 text-sm mt-0.5">{offer.sub}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold">
                      🎫 {offer.label}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Discount Guaranteed Banner ── */}
        <section className="mx-auto max-w-7xl px-4 pb-8">
          <Link href="/restaurants">
            <div className="bg-[var(--surface)] border border-[var(--gold-border)] rounded-3xl p-6 flex items-center gap-5 hover:border-[var(--gold)] transition-all group" style={{ boxShadow: 'var(--shadow-gold)' }}>
              <div className="w-16 h-16 bg-[var(--gold-bg)] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💸</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-[var(--text)] text-base group-hover:text-[var(--gold)] transition-colors">Discount Guaranteed!</p>
                <p className="text-sm text-[var(--text-3)] mt-0.5">Order now and save on every Nigerian meal. Limited time deals updated daily.</p>
              </div>
              <div className="shrink-0">
                <div className="px-4 py-2 bg-[var(--gold)] rounded-xl text-xs font-black text-[var(--gold-text)]">
                  Get Deal
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* ── Recommended For You ── */}
        <section className="mx-auto max-w-7xl px-4 pb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-[var(--text)]">Recommended For You 👋</h2>
            <Link href="/restaurants" className="text-xs font-bold text-[var(--gold)] hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {RECOMMENDED.map((item) => (
              <Link key={item.name} href="/restaurants">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--gold)]/50 transition-all group" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="h-28 bg-gradient-to-br from-[var(--gold-bg)] to-[var(--surface-2)] flex items-center justify-center relative">
                    <span className="text-5xl group-hover:scale-110 transition-transform">{item.food}</span>
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--gold)] text-[var(--gold-text)]">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-[var(--text)] text-sm leading-tight">{item.name}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-[var(--text-3)]">
                      <span className="text-[var(--gold)]">★</span>
                      <span>{item.rating}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-sm font-black text-[var(--gold)] mt-1">{item.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── What We Serve ── */}
        <section className="mx-auto max-w-7xl px-4 pb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-[var(--text)]">What we serve</h2>
            <p className="text-sm text-[var(--text-3)] mt-1">The full taste of Nigeria, right at your fingertips</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHAT_WE_SERVE.map((item) => (
              <Link key={item.title} href="/restaurants">
                <div className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)]/60 rounded-2xl p-5 flex flex-col gap-3 transition-all group hover:bg-[var(--surface-2)] cursor-pointer h-full" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <span className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <h3 className="font-black text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[var(--text-3)] leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── How it Works ── */}
        <section className="mx-auto max-w-7xl px-4 pb-10">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-[var(--text)]">How it works</h2>
              <p className="text-sm text-[var(--text-3)] mt-2">Order Nigerian food in three easy steps</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
              <div className="hidden sm:block absolute top-8 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-[var(--border)]" />
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center gap-3 relative">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--gold-bg)] border border-[var(--gold-border)] flex items-center justify-center z-10">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <span className="text-xs font-black text-[var(--gold)] tracking-widest">{step.step}</span>
                  <h3 className="font-black text-[var(--text)]">{step.title}</h3>
                  <p className="text-sm text-[var(--text-3)] leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Promo banners ── */}
        <section className="mx-auto max-w-7xl px-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/restaurants">
              <div className="bg-[var(--gold)] rounded-2xl p-6 flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer">
                <div>
                  <p className="text-2xl font-black text-[var(--gold-text)]">Free delivery</p>
                  <p className="text-sm mt-1 font-medium text-[var(--gold-text)]/80">On your first 3 orders</p>
                  <div className="mt-3 inline-block bg-white/20 text-[var(--gold-text)] text-xs font-bold px-3 py-1 rounded-full">
                    Order Now →
                  </div>
                </div>
                <span className="text-5xl">🛵</span>
              </div>
            </Link>
            <Link href="/restaurant/register">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between hover:border-[var(--gold)] hover:bg-[var(--gold-bg)] transition-all cursor-pointer group">
                <div>
                  <p className="text-2xl font-black text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">Own a restaurant?</p>
                  <p className="text-sm mt-1 font-medium text-[var(--text-2)]">Partner with D&amp;D and reach thousands of customers</p>
                  <div className="mt-3 inline-block bg-[var(--gold-bg)] border border-[var(--gold-border)] text-[var(--gold)] text-xs font-bold px-3 py-1 rounded-full">
                    List your restaurant →
                  </div>
                </div>
                <span className="text-5xl">🇳🇬</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="font-black text-[var(--text)]">D<span className="text-[var(--gold)]">&</span>D</span>
              <span className="text-xs text-[var(--text-3)] ml-1">🇳🇬 Nigeria</span>
            </div>
            <p className="text-sm text-[var(--text-3)]">© 2025 D&amp;D Premium Delivery. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-[var(--text-3)]">
              <a href="#" className="hover:text-[var(--gold)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--gold)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--gold)] transition-colors">Help</a>
              <Link href="/restaurant/register" className="hover:text-[var(--gold)] transition-colors font-semibold">List your restaurant</Link>
            </div>
          </div>
        </footer>
      </main>
    </AuthGuard>
  )
}
