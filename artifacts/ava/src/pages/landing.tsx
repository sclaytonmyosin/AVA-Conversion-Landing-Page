import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calendar, Camera, Check, ChevronDown, Mail, Menu, Mic, ShieldCheck, Users, X } from 'lucide-react';
import { SiGmail, SiGooglecalendar, SiApple } from 'react-icons/si';
import { SignupDialog, BASE } from '@/components/signup-dialog';
import { useCampaign } from '@/lib/campaign';

const img = (f: string) => `${BASE}brand/${f}`;

const NAV = [
  { id: 'how', label: 'How it works' },
  { id: 'inside', label: 'Inside AVA' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CTA({ onClick, id, light = false, className = '' }: { onClick: () => void; id: string; light?: boolean; className?: string }) {
  const { offer } = useCampaign();
  return (
    <button
      onClick={onClick}
      data-testid={`button-cta-${id}`}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5750C1]/35 ${
        light ? 'bg-[#FEFDFB] text-[#3B2FA0] hover:bg-[#FCE3D4]' : 'bg-[#3B2FA0] text-[#FEFDFB] shadow-[0_14px_30px_-12px_#3B2FA0] hover:bg-[#5750C1]'
      } ${className}`}
    >
      {offer.cta} <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
    </button>
  );
}

const CHAOS = [
  { t: 'RE: RE: Fwd: Spring picture day', s: 'Westbrook Elementary', r: '-6deg', c: 'left-[2%] top-[8%]' },
  { t: 'Permission slip due Friday', s: 'Ms. Okafor, 2nd grade', r: '4deg', c: 'right-[0%] top-[2%]' },
  { t: 'Voice memo 0:42', s: '“don’t forget the dentist…”', r: '5deg', c: 'left-[-2%] bottom-[16%]' },
  { t: 'Screenshot 2025-03-04', s: 'Soccer schedule, spring', r: '-4deg', c: 'right-[-3%] bottom-[8%]' },
];

const FAQS = [
  { q: 'What does AVA actually do?', a: 'AVA reads the family stuff you point it at — school emails in Gmail, screenshots of flyers or schedules, quick voice notes — and turns it into calendar events, reminders and next steps. It brings it together in a daily brief so you can see what matters today.' },
  { q: 'Will AVA do things without asking me?', a: 'No. AVA suggests; you decide. Events, reminders and anything that goes to your calendar wait for your approval first.' },
  { q: 'How much does it cost?', a: 'AVA is free for 14 days, then $12.99 per month. The subscription runs through Apple, so you can cancel anytime from your iPhone’s subscription settings.' },
  { q: 'Is AVA on Android?', a: 'Not yet. AVA is currently available for iPhone only through the App Store.' },
  { q: 'What does AVA connect to?', a: 'Gmail and Google Calendar, plus anything you share in directly: screenshots, photos and voice notes. You can also share plans with your partner so you’re not the only one holding it all.' },
  { q: 'Why do you ask for my email first?', a: 'So we can stay in touch about AVA, with your consent. After you enter it, we take you straight to the App Store download. You can unsubscribe anytime.' },
];

export default function Landing() {
  const { campaign, offer } = useCampaign();
  const faqs = FAQS.map((entry) => entry.q === 'How much does it cost?'
    ? { ...entry, a: `${offer.terms} Manage your subscription in your iPhone’s subscription settings.` }
    : entry);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const start = () => { setMenu(false); setOpen(true); };

  useEffect(() => {
    document.title = campaign
      ? `AVA for ${campaign.influencer}’s community — ${offer.freePeriod} free`
      : 'AVA — Less mental load. More life.';
  }, [campaign, offer]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [menu]);

  const go = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="grain min-h-[100dvh] overflow-x-clip bg-[#FEFDFB] text-[#1E1A45]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-[#3B2FA0] focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

      {/* NAV */}
      <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled || menu ? 'bg-[#FEFDFB]/90 backdrop-blur-md shadow-[0_1px_0_hsl(246_30%_90%)]' : ''}`}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Main">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="AVA, back to top" data-testid="link-logo">
            <img src={img('ava-logo.svg')} alt="AVA" className="h-6 w-auto" />
          </button>
          <div className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="text-sm font-medium text-[#1E1A45]/70 transition hover:text-[#3B2FA0]" data-testid={`link-nav-${n.id}`}>{n.label}</button>
            ))}
            <button onClick={start} className="rounded-full bg-[#3B2FA0] px-5 py-2.5 text-sm font-semibold text-[#FEFDFB] transition hover:bg-[#5750C1]" data-testid="button-nav-cta">{offer.shortCta}</button>
          </div>
          <button className="rounded-full p-2 md:hidden" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
            {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {menu && (
          <div id="mobile-menu" className="border-t border-border px-5 pb-6 pt-2 md:hidden">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="block w-full py-3 text-left font-display text-2xl text-[#3B2FA0]" data-testid={`link-mobile-${n.id}`}>{n.label}</button>
            ))}
            <CTA onClick={start} id="mobile-menu" className="mt-4 w-full" />
          </div>
        )}
      </header>

      <main id="main">
        {/* HERO */}
        <section className="relative px-5 pb-20 pt-28 md:pt-36">
          <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[#5750C1]/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#F4A27A]/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full bg-[#E3F3F1] px-4 py-1.5 text-sm font-semibold text-[#1F6B65]">
                <span className="h-2 w-2 rounded-full bg-[#2E8A82]" /> {campaign?.welcome ?? 'For the parent who remembers everything'}
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="font-display mt-6 text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.98] text-[#3B2FA0]">
                You carry it all.<br /><em className="font-normal italic text-[#5750C1]">Let AVA</em> carry some.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mt-7 max-w-xl text-lg leading-relaxed text-[#1E1A45]/75 md:text-xl">
                School emails, screenshots and voice notes go in. Calendar events, reminders and clear next steps come out — and nothing happens without your okay.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <CTA onClick={start} id="hero" />
                <button onClick={() => go('how')} className="inline-flex items-center gap-2 px-2 py-3 font-semibold text-[#3B2FA0] underline-offset-4 hover:underline" data-testid="button-see-how">See how it works <ChevronDown className="h-4 w-4" /></button>
              </motion.div>
              <p className="mt-5 flex items-center gap-2 text-sm text-[#1E1A45]/60"><SiApple className="h-4 w-4" /> iPhone only · then {offer.priceAfter} · cancel through Apple</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 40, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 2 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-[340px]">
              <img src={img('ava-phone.png')} alt="AVA's 'Your Day in Focus' screen showing a camp deposit, a permission slip due at 3 PM, a dentist reminder and a weather note" className="relative z-10 w-full drop-shadow-[0_40px_50px_rgba(59,47,160,0.28)]" data-testid="img-hero-phone" />
              <div className="floaty absolute -left-16 top-24 z-20 hidden rounded-2xl bg-[#FEFDFB] px-4 py-3 text-sm shadow-xl ring-1 ring-[#3B2FA0]/10 sm:block" style={{ ['--r' as string]: '-4deg' }}>
                <p className="font-semibold text-[#3B2FA0]">Permission slip</p><p className="text-[#1E1A45]/60">found in a school email</p>
              </div>
              <div className="floaty absolute -right-10 bottom-28 z-20 hidden items-center gap-2 rounded-2xl bg-[#3B2FA0] px-4 py-3 text-sm font-semibold text-[#FEFDFB] shadow-xl sm:flex" style={{ ['--r' as string]: '3deg', animationDelay: '-3s' }}>
                <Check className="h-4 w-4 text-[#9BE0D7]" /> Added, after you said yes
              </div>
            </motion.div>
          </div>
        </section>

        {/* RECOGNITION */}
        <section className="bg-[#3B2FA0] px-5 py-24 text-[#FEFDFB]">
          <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F4A27A]">Sound familiar?</p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-6xl">It’s 9:47 pm. You’re still the family’s inbox.</h2>
              <p className="mt-6 text-lg leading-relaxed text-[#FEFDFB]/75">The picture-day email buried under three replies. The flyer you screenshotted and never saw again. The thing you said out loud in the car so you’d remember it. None of it is hard. All of it is yours. That’s the invisible load — and it never clocks out.</p>
            </Reveal>
            <Reveal delay={0.15} className="relative h-[380px]">
              {CHAOS.map((c, i) => (
                <div key={c.t} className={`floaty absolute ${c.c} w-[62%] rounded-2xl bg-[#FEFDFB] p-4 text-[#1E1A45] shadow-2xl`} style={{ ['--r' as string]: c.r, animationDelay: `${-i * 1.7}s` }}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5750C1]">
                    {[Mail, Mail, Mic, Camera].map((Ic, j) => j === i && <Ic key={j} className="h-3.5 w-3.5" />)} unread
                  </div>
                  <p className="mt-1 font-semibold">{c.t}</p><p className="text-sm text-[#1E1A45]/60">{c.s}</p>
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28px] bg-[#FEFDFB] shadow-2xl">
                <img src={img('ava-icon.png')} alt="" className="h-20 w-20 rounded-[22px]" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="scroll-mt-20 px-5 py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2E8A82]">How it works</p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-6xl">Hand it over. Say yes. Get on with your evening.</h2>
            </Reveal>
            <ol className="mt-16 grid gap-6 md:grid-cols-12">
              {[
                { n: '01', h: 'Share the mess', p: 'Connect Gmail, snap a screenshot of the flyer, or leave a voice note while you’re driving. However it arrives.', ic: [SiGmail, Camera, Mic], cls: 'md:col-span-5 bg-[#EEEDFB]' },
                { n: '02', h: 'AVA sorts it', p: 'Dates, deadlines, payments and to-dos get pulled out and lined up as suggestions.', ic: [Calendar], cls: 'md:col-span-4 bg-[#E3F3F1] md:mt-12' },
                { n: '03', h: 'You approve', p: 'One tap and it lands in Google Calendar or your reminders. Your call, every time.', ic: [ShieldCheck], cls: 'md:col-span-3 bg-[#FCE3D4] md:mt-24' },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 0.12} className={`${s.cls} rounded-[28px] p-8`}>
                  <li className="list-none" data-testid={`card-step-${s.n}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-5xl text-[#3B2FA0]/30">{s.n}</span>
                      <span className="flex gap-2 text-[#3B2FA0]">{s.ic.map((I, j) => <I key={j} className="h-5 w-5" />)}</span>
                    </div>
                    <h3 className="font-display mt-10 text-2xl font-semibold text-[#3B2FA0]">{s.h}</h3>
                    <p className="mt-3 leading-relaxed text-[#1E1A45]/70">{s.p}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* INSIDE: product shots */}
        <section id="inside" className="scroll-mt-20 bg-[#F6F4FD] px-5 py-28">
          <div className="mx-auto max-w-6xl space-y-32">
            <div className="grid items-center gap-14 md:grid-cols-2">
              <Reveal className="order-2 md:order-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2E8A82]">Ava’s Brief</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">Your whole day, on one calm screen.</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#1E1A45]/70">Camp deposit due. Permission slip by 3 PM. A question about which calendar gets tutoring. AVA writes it the way a friend would, and tells you what it still needs from you.</p>
                <ul className="mt-7 space-y-3">
                  {['Deadlines surfaced before they bite', 'Asks when it isn’t sure, instead of guessing', 'Reminders the day before, not the minute after'].map((t) => (
                    <li key={t} className="flex gap-3 text-[#1E1A45]/80"><Check className="mt-1 h-5 w-5 shrink-0 text-[#2E8A82]" />{t}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1} className="order-1 mx-auto max-w-[320px] md:order-2">
                <img src={img('ava-phone.png')} alt="AVA daily brief screen" loading="lazy" className="w-full -rotate-2 drop-shadow-[0_30px_40px_rgba(59,47,160,0.25)]" />
              </Reveal>
            </div>

            <div className="grid items-center gap-14 md:grid-cols-2">
              <Reveal className="mx-auto max-w-[320px]">
                <div className="relative">
                  <div aria-hidden className="absolute inset-6 -z-0 rounded-[48px] bg-[#9BE0D7]/50 blur-2xl" />
                  <img src={img('ava-notification.png')} alt="iPhone notification from AVA: Sophie's school is closed next week and your day is packed. Want help figuring it out?" loading="lazy" className="relative w-full rotate-2 drop-shadow-[0_30px_40px_rgba(30,26,69,0.25)]" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D46A3A]">Heads-up, not hassle</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">“Sophie’s school is closed next week.” Before you’d have found out.</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#1E1A45]/70">AVA notices the closure buried in the newsletter, sees your packed day, and offers to help plan around it. A nudge from someone who was actually paying attention.</p>
              </Reveal>
            </div>

            <div className="grid items-center gap-14 md:grid-cols-2">
              <Reveal className="order-2 md:order-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2E8A82]">Share the load</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">Send the plan. Not the whole explanation.</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#1E1A45]/70">Childcare options, pickup changes, who’s doing what. Share a plan with your partner straight from AVA, through Messages, WhatsApp or Mail — so it’s finally in two heads, not one.</p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FEFDFB] px-4 py-2 text-sm font-semibold text-[#3B2FA0] ring-1 ring-[#3B2FA0]/10"><Users className="h-4 w-4" /> Built for two-parent logistics</p>
              </Reveal>
              <Reveal delay={0.1} className="order-1 md:order-2">
                <img src={img('ava-share.png')} alt="Sharing 'Childcare options for Sophie' from AVA via the iOS share sheet" loading="lazy" className="mx-auto w-full max-w-[460px] rounded-[28px] shadow-[0_30px_60px_-20px_rgba(59,47,160,0.35)] ring-1 ring-[#3B2FA0]/10" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* INTEGRATIONS + STATS */}
        <section className="px-5 py-24">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.3fr_1fr]">
            <Reveal className="rounded-[32px] bg-[#FEFDFB] p-8 ring-1 ring-[#3B2FA0]/10 md:p-10">
              <h2 className="font-display text-3xl font-semibold text-[#3B2FA0]">Works with what you already use</h2>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { I: SiGmail, t: 'Gmail', d: 'School and activity emails' },
                  { I: SiGooglecalendar, t: 'Google Calendar', d: 'Approved events land here' },
                  { I: Camera, t: 'Screenshots', d: 'Flyers, schedules, sign-ups' },
                  { I: Mic, t: 'Voice notes', d: 'Say it once, done' },
                ].map(({ I, t, d }) => (
                  <div key={t} className="rounded-2xl bg-[#F6F4FD] p-5" data-testid={`card-integration-${t.toLowerCase().replace(/\s/g, '-')}`}>
                    <I className="h-6 w-6 text-[#5750C1]" />
                    <p className="mt-3 font-semibold">{t}</p><p className="text-sm text-[#1E1A45]/60">{d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col justify-between gap-8 rounded-[32px] bg-[#1F6B65] p-8 text-[#FEFDFB] md:p-10">
              <div>
                <p className="font-display text-6xl font-semibold md:text-7xl">1,400</p>
                <p className="mt-1 text-[#FEFDFB]/75">parents using AVA</p>
              </div>
              <div>
                <p className="font-display text-6xl font-semibold md:text-7xl">400K+</p>
                <p className="mt-1 text-[#FEFDFB]/75">household events handled</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="px-5 pb-28">
          <Reveal className="mx-auto max-w-4xl text-center">
            <svg aria-hidden viewBox="0 0 40 30" className="mx-auto h-8 w-10 fill-[#F4A27A]"><path d="M0 30V17C0 7 6 1 16 0v6c-5 1-8 5-8 10h8v14H0zm24 0V17c0-10 6-16 16-17v6c-5 1-8 5-8 10h8v14H24z" /></svg>
            <blockquote className="font-display mt-6 text-2xl font-normal italic leading-snug text-[#3B2FA0] md:text-4xl">
              I spend so much time on email at work, and the last thing I want to do when I get home is to look at my personal email. AVA makes it so I don’t have to constantly monitor that.
            </blockquote>
            <p className="mt-6 font-semibold">Julia <span className="font-normal text-[#1E1A45]/60">· Working Mom</span></p>
          </Reveal>
        </section>

        {/* PRICING */}
        <section id="pricing" className="scroll-mt-20 px-5 pb-28">
          <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-[#3B2FA0] px-8 py-16 text-[#FEFDFB] md:px-16">
            <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#5750C1]" />
            <div aria-hidden className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-[#F4A27A]/30" />
            <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9BE0D7]">{campaign ? `For ${campaign.influencer}’s community` : 'Simple pricing'}</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">Try {offer.freePeriod} of a lighter head.</h2>
                <p className="mt-5 text-lg text-[#FEFDFB]/75">See how it feels when someone else is watching the inbox.</p>
              </div>
              <div className="rounded-[28px] bg-[#FEFDFB] p-7 text-[#1E1A45]">
                <p className="font-display text-5xl font-semibold text-[#3B2FA0]">{offer.freePeriod} free</p>
                <p className="mt-2 text-[#1E1A45]/70">then <span className="font-semibold text-[#1E1A45]">{offer.priceAfter}</span></p>
                <ul className="mt-5 space-y-2 text-sm">
                  {['Cancel anytime through Apple', 'Gmail, Google Calendar, screenshots, voice notes', 'Share plans with your partner', 'iPhone only — not available on Android yet'].map((t) => (
                    <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2E8A82]" />{t}</li>
                  ))}
                </ul>
                <CTA onClick={start} id="pricing" className="mt-6 w-full" />
              </div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 px-5 pb-28">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">Fair questions.</h2>
              <p className="mt-4 text-[#1E1A45]/65">The things parents ask before handing anything over.</p>
            </Reveal>
            <div className="divide-y divide-[#3B2FA0]/10 border-y border-[#3B2FA0]/10">
              {faqs.map((f, i) => {
                const isOpen = faq === i;
                return (
                  <div key={f.q}>
                    <h3>
                      <button
                        onClick={() => setFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-btn-${i}`}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold transition hover:text-[#3B2FA0]"
                        data-testid={`button-faq-${i}`}
                      >
                        {f.q}
                        <ChevronDown className={`h-5 w-5 shrink-0 text-[#5750C1] transition ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </h3>
                    <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} hidden={!isOpen} className="pb-5 pr-8 leading-relaxed text-[#1E1A45]/70">{f.a}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL */}
        <section className="px-5 pb-24">
          <Reveal className="mx-auto max-w-4xl rounded-[40px] bg-[#FCE3D4] px-8 py-16 text-center">
            <h2 className="font-display text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-6xl">You don’t have to remember everything anymore.</h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-[#1E1A45]/70">AVA keeps track. You stay in charge.</p>
            <CTA onClick={start} id="final" className="mt-9" />
            <p className="mt-4 text-sm text-[#1E1A45]/60">iPhone only · {offer.freePeriod} free, then {offer.priceAfter}</p>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[#3B2FA0]/10 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#1E1A45]/60 md:flex-row">
          <img src={img('ava-logo.svg')} alt="AVA" className="h-5" />
          <p>Your behind-the-scenes parenting partner.</p>
          <a href="https://hiava.app/privacy_policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#3B2FA0]" data-testid="link-footer-privacy">Privacy Policy</a>
        </div>
      </footer>

      {/* mobile sticky CTA */}
      <div className={`fixed inset-x-0 bottom-0 z-40 p-3 transition md:hidden ${scrolled && !open && !menu ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}>
        <CTA onClick={start} id="sticky" className="w-full" />
      </div>

      <SignupDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
