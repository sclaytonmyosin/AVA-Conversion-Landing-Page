import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ArrowLeft, Check, ChevronDown, Clock, Gift as GiftIcon, Heart, Info, Lock, Mail, Mic, Camera, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BASE } from '@/components/signup-dialog';

const img = (f: string) => `${BASE}brand/${f}`;

function useMeta() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Give her less to carry — Gift AVA';
    const tags: Array<[string, string, string]> = [
      ['name', 'description', 'A gift for the person who remembers everything. AVA turns school emails, screenshots and voice notes into a shared family plan, so the mental load lives in two heads, not one.'],
      ['property', 'og:title', 'Give her less to carry — Gift AVA'],
      ['property', 'og:description', 'Not one more thing to manage. A little more room to breathe. The family assistant that helps share the invisible load.'],
      ['property', 'og:type', 'website'],
      ['property', 'og:image', new URL(img('ava-phone.png'), window.location.origin).href],
      ['name', 'twitter:card', 'summary_large_image'],
    ];
    const restore: Array<() => void> = [];
    tags.forEach(([attr, key, val]) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (el) {
        const old = el.getAttribute('content');
        el.setAttribute('content', val);
        const node = el;
        restore.push(() => (old === null ? node.removeAttribute('content') : node.setAttribute('content', old)));
      } else {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        el.setAttribute('content', val);
        el.dataset.giftMeta = '';
        document.head.appendChild(el);
        const node = el;
        restore.push(() => node.remove());
      }
    });
    return () => { document.title = prevTitle; restore.forEach((r) => r()); };
  }, []);
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const LOAD = [
  { t: 'Picture day is Thursday', s: 'buried in a reply-all', ic: Mail },
  { t: 'Camp deposit, $85 by Friday', s: 'screenshot from the group chat', ic: Camera },
  { t: 'Call the dentist back', s: 'said out loud in the car', ic: Mic },
  { t: 'Permission slip, signed', s: 'due 3 PM tomorrow', ic: Mail },
  { t: 'School closed next week', s: 'page 2 of the newsletter', ic: Mail },
  { t: 'Who has pickup Tuesday?', s: 'nobody has asked yet', ic: Mic },
  { t: 'Soccer moved to Saturday', s: 'flyer on the fridge', ic: Camera },
  { t: 'Grandma’s birthday card', s: 'remembered at 11:02 pm', ic: Clock },
];

const GIFT_FAQ = [
  { q: 'What does she actually receive?', a: 'The intended experience: a personal card with your message and her name, plus a simple way to get started with AVA on her iPhone. Exact gift terms, including length and how it is redeemed, are still being finalized.' },
  { q: 'Is this a hint that she should be more organized?', a: 'No, and your message can say so. AVA is about sharing the load, not managing her. Plans she makes in AVA can be sent straight to you, so your part gets clearer too.' },
  { q: 'Will AVA do things on her behalf without asking?', a: 'No. AVA suggests; she decides. Events and reminders wait for her approval before anything lands on a calendar.' },
  { q: 'What does it need to work?', a: 'An iPhone. AVA works with Gmail and Google Calendar, plus screenshots, photos and voice notes shared in directly. It isn’t on Android yet.' },
];

const MAX_MSG = 280;
const PROMPT_LABELS = ['Less to carry', 'Two heads', 'Breathing room'];
const PROMPTS = [
  'You hold so much for all of us. This is me trying to carry more of it with you.',
  'I want the family plans in two heads, not just yours. Send me my part.',
  'Here’s to a little more room to breathe, and fewer 11 pm reminders.',
];

function GiftCard({ to, from, msg }: { to: string; from: string; msg: string }) {
  const name = to.trim() || 'Her name';
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#FCE3D4] p-7 text-[#1E1A45] shadow-[0_30px_60px_-24px_rgba(30,26,69,0.5)] md:p-9" data-testid="card-gift-preview">
      <div aria-hidden className="absolute inset-y-0 right-14 w-8 bg-[#F4A27A]/50" />
      <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F4A27A]/40" />
      <div className="relative flex items-center justify-between">
        <img src={img('ava-logo.svg')} alt="AVA" className="h-5 w-auto" />
        <span className="rounded-full bg-[#FEFDFB]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A4A22]">A gift</span>
      </div>
      <p className="font-display relative mt-10 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1] text-[#3B2FA0]" data-testid="text-gift-card-recipient">
        For {name},<br /><em className="font-normal italic text-[#D46A3A]">less to carry.</em>
      </p>
      <p className="relative mt-6 min-h-[4.5rem] whitespace-pre-line break-words text-lg leading-relaxed text-[#1E1A45]/80" data-testid="text-gift-card-message">
        {msg.trim() || 'Your message will appear here.'}
      </p>
      <div className="relative mt-8 flex items-end justify-between gap-4 border-t border-[#9A4A22]/15 pt-5">
        <p className="font-display text-xl italic text-[#3B2FA0]" data-testid="text-gift-card-sender">With love, {from.trim() || 'you'}</p>
        <img src={img('ava-icon.png')} alt="" className="h-11 w-11 rounded-[12px] shadow-md" />
      </div>
    </div>
  );
}

export default function GiftPage() {
  useMeta();
  const reduce = useReducedMotion();
  const [handed, setHanded] = useState<number[]>([]);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [msg, setMsg] = useState(PROMPTS[0]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const phoneY = useTransform(scrollYProgress, [0, 0.3], [0, reduce ? 0 : -60]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  const toggle = (i: number) => setHanded((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]));
  const handAll = () => setHanded(handed.length === LOAD.length ? [] : LOAD.map((_, i) => i));
  const left = LOAD.length - handed.length;

  return (
    <div className="grain min-h-[100dvh] overflow-x-clip bg-[#FEFDFB] text-[#1E1A45]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-[#3B2FA0] focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

      <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'bg-[#FEFDFB]/90 shadow-[0_1px_0_hsl(246_30%_90%)] backdrop-blur-md' : ''}`}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Gift">
          <Link href="/" aria-label="AVA home" data-testid="link-gift-logo"><img src={img('ava-logo.svg')} alt="AVA" className="h-6 w-auto" /></Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/" className="hidden text-sm font-medium text-[#1E1A45]/70 transition hover:text-[#3B2FA0] sm:inline" data-testid="link-gift-explore-nav">Explore AVA</Link>
            <button onClick={() => go('personalize')} className="inline-flex items-center gap-2 rounded-full bg-[#3B2FA0] px-5 py-2.5 text-sm font-semibold text-[#FEFDFB] transition hover:bg-[#5750C1] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5750C1]/35" data-testid="button-gift-nav">
              <GiftIcon className="h-4 w-4" /> Gift AVA
            </button>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="relative px-5 pb-24 pt-32 md:pt-40">
          <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-[#F4A27A]/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-[#9BE0D7]/30 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full bg-[#FCE3D4] px-4 py-1.5 text-sm font-semibold text-[#9A4A22]">
                <Heart className="h-3.5 w-3.5 fill-current" /> A gift for the one who remembers everything
              </motion.p>
              <motion.h1 initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="font-display mt-7 text-[clamp(3rem,8vw,6.25rem)] font-semibold leading-[0.95] text-[#3B2FA0]">
                Give her<br /><em className="font-normal italic text-[#D46A3A]">less</em> to carry.
              </motion.h1>
              <motion.p initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mt-8 max-w-xl text-lg leading-relaxed text-[#1E1A45]/75 md:text-xl">
                She already has enough things. What she rarely gets is room. AVA turns the school emails, screenshots and voice notes she keeps track of into one clear, shared plan, so the family’s logistics finally live in two heads instead of one.
              </motion.p>
              <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button onClick={() => go('personalize')} className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#3B2FA0] px-7 py-4 text-base font-semibold text-[#FEFDFB] shadow-[0_14px_30px_-12px_#3B2FA0] transition hover:bg-[#5750C1] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5750C1]/35" data-testid="button-gift-hero">
                  <GiftIcon className="h-5 w-5" /> Gift AVA <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </button>
                <button onClick={() => go('load')} className="inline-flex items-center gap-2 px-2 py-3 font-semibold text-[#3B2FA0] underline-offset-4 hover:underline" data-testid="button-gift-why">Why this, not flowers <ChevronDown className="h-4 w-4" /></button>
              </motion.div>
            </div>
            <motion.div style={{ y: phoneY }} initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative mx-auto w-full max-w-[330px]">
              <div aria-hidden className="absolute inset-x-6 -bottom-6 top-10 rounded-[56px] bg-[#FCE3D4]" />
              {/* gift ribbon */}
              <div aria-hidden className="absolute inset-y-0 left-1/2 z-0 w-10 -translate-x-1/2 bg-[#F4A27A]/60" />
              <img src={img('ava-phone.png')} alt="AVA's 'Your Day in Focus' screen showing a camp deposit, a permission slip due at 3 PM and a dentist reminder" className="relative z-10 w-full -rotate-2 drop-shadow-[0_40px_50px_rgba(59,47,160,0.28)]" data-testid="img-gift-hero-phone" />
              <div className="floaty absolute -left-14 top-20 z-20 hidden rounded-2xl bg-[#FEFDFB] px-4 py-3 text-sm shadow-xl ring-1 ring-[#3B2FA0]/10 sm:block" style={{ ['--r' as string]: '-5deg' }}>
                <p className="font-semibold text-[#3B2FA0]">One less thing</p><p className="text-[#1E1A45]/60">to hold in her head</p>
              </div>
              <div className="floaty absolute -right-8 bottom-24 z-20 hidden items-center gap-2 rounded-2xl bg-[#1F6B65] px-4 py-3 text-sm font-semibold text-[#FEFDFB] shadow-xl sm:flex" style={{ ['--r' as string]: '4deg', animationDelay: '-3s' }}>
                <Share2 className="h-4 w-4 text-[#9BE0D7]" /> Shared with you, too
              </div>
            </motion.div>
          </div>
        </section>

        {/* THE LOAD — interactive */}
        <section id="load" className="scroll-mt-20 bg-[#3B2FA0] px-5 py-28 text-[#FEFDFB]">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F4A27A]">What she’s holding right now</p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-6xl">None of it is hard. All of it is hers.</h2>
              <p className="mt-6 text-lg leading-relaxed text-[#FEFDFB]/75">The invisible load isn’t one big task. It’s a hundred small ones that never clock out. Tap a few to imagine keeping track of them with AVA.</p>
              <p className="mt-3 text-sm text-[#FEFDFB]/75">Illustration only. These example tasks aren’t sent to AVA or completed for you.</p>
            </Reveal>
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Things on her mind">
              {LOAD.map((l, i) => {
                const on = handed.includes(i);
                const Ic = l.ic;
                return (
                  <motion.button
                    key={l.t}
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    className={`group relative rounded-2xl p-5 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F4A27A]/60 ${on ? 'bg-[#1F6B65] text-[#FEFDFB]' : 'bg-[#FEFDFB] text-[#1E1A45] hover:-translate-y-1'}`}
                    data-testid={`button-load-${i}`}
                  >
                    <div className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${on ? 'text-[#9BE0D7]' : 'text-[#5750C1]'}`}>
                      <span className="inline-flex items-center gap-1.5"><Ic className="h-3.5 w-3.5" /> {on ? 'In the shared plan' : 'On her mind'}</span>
                      {on && <Check className="h-4 w-4" />}
                    </div>
                    <p className={`mt-2 font-semibold ${on ? 'line-through decoration-[#9BE0D7]/70' : ''}`}>{l.t}</p>
                    <p className={`text-sm ${on ? 'text-[#FEFDFB]/65' : 'text-[#1E1A45]/60'}`}>{l.s}</p>
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display text-2xl md:text-3xl" aria-live="polite" data-testid="text-load-count">
                {left === 0 ? <>Her mind, a little quieter.</> : <>{left} {left === 1 ? 'thing' : 'things'} still on her mind.</>}
              </p>
              <button onClick={handAll} className="rounded-full bg-[#FEFDFB]/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-[#FEFDFB]/25 transition hover:bg-[#FEFDFB]/20" data-testid="button-load-all">
                {handed.length === LOAD.length ? 'Reset illustration' : 'Imagine a shared plan'}
              </button>
            </div>
          </div>
        </section>

        {/* REFRAME */}
        <section className="px-5 py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="font-display text-center text-[clamp(2rem,5vw,4rem)] font-normal leading-[1.1] text-[#3B2FA0]">
                Most gifts become <span className="italic text-[#D46A3A]">one more thing</span> to find a place for.<br className="hidden md:block" /> This one gives a little room back.
              </p>
            </Reveal>
            <div className="mt-20 grid gap-6 md:grid-cols-12">
              <Reveal className="rounded-[32px] bg-[#F6F4FD] p-8 md:col-span-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1E1A45]/50">The usual gift</p>
                <ul className="mt-6 space-y-4 text-lg text-[#1E1A45]/60">
                  {['Lovely for an evening', 'Needs a place, a vase, a thank-you', 'Monday looks exactly the same'].map((t) => <li key={t} className="border-b border-[#3B2FA0]/10 pb-4 last:border-0">{t}</li>)}
                </ul>
              </Reveal>
              <Reveal delay={0.12} className="relative overflow-hidden rounded-[32px] bg-[#FCE3D4] p-8 md:col-span-7 md:-mt-6">
                <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F4A27A]/40" />
                <p className="relative text-sm font-semibold uppercase tracking-[0.16em] text-[#9A4A22]">The gift of less</p>
                <ul className="relative mt-6 space-y-4 text-lg">
                  {['Deadlines surfaced before they sneak up', 'Plans she can send you instead of explaining', 'Every suggestion waits for her yes', 'Monday, with more breathing room'].map((t) => (
                    <li key={t} className="flex gap-3 border-b border-[#9A4A22]/15 pb-4 last:border-0"><Check className="mt-1 h-5 w-5 shrink-0 text-[#1F6B65]" />{t}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PRODUCT STORY */}
        <section className="bg-[#F6F4FD] px-5 py-28">
          <div className="mx-auto max-w-6xl space-y-32">
            <div className="grid items-center gap-14 md:grid-cols-2">
              <Reveal className="order-2 md:order-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2E8A82]">Morning</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">Her day, already sorted when she picks up her phone.</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#1E1A45]/70">AVA’s Brief pulls the camp deposit, the permission slip and the dentist reminder out of wherever they were hiding, and lays them out on one calm screen.</p>
              </Reveal>
              <Reveal delay={0.1} className="order-1 mx-auto max-w-[300px] md:order-2">
                <img src={img('ava-phone.png')} alt="AVA daily brief screen" loading="lazy" className="w-full rotate-2 drop-shadow-[0_30px_40px_rgba(59,47,160,0.25)]" />
              </Reveal>
            </div>
            <div className="grid items-center gap-14 md:grid-cols-2">
              <Reveal className="mx-auto max-w-[300px]">
                <div className="relative">
                  <div aria-hidden className="absolute inset-6 rounded-[48px] bg-[#F4A27A]/40 blur-2xl" />
                  <img src={img('ava-notification.png')} alt="iPhone notification from AVA: Sophie's school is closed next week and your day is packed. Want help figuring it out?" loading="lazy" className="relative w-full -rotate-2 drop-shadow-[0_30px_40px_rgba(30,26,69,0.25)]" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D46A3A]">Midweek</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">The heads-up she usually gives everyone else.</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#1E1A45]/70">A school closure on page two of the newsletter. AVA notices, sees the packed week, and offers to help plan around it, before it becomes a scramble.</p>
              </Reveal>
            </div>
            <div className="grid items-center gap-14 md:grid-cols-2">
              <Reveal className="order-2 md:order-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2E8A82]">Your part</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">This is where you come in.</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#1E1A45]/70">AVA lets her send the plan straight to you, through Messages, WhatsApp or Mail. Childcare options, pickup changes, who’s doing what. The gift only works if you pick it up.</p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FEFDFB] px-4 py-2 text-sm font-semibold text-[#3B2FA0] ring-1 ring-[#3B2FA0]/10"><Share2 className="h-4 w-4" /> Shared load, not delegated load</p>
              </Reveal>
              <Reveal delay={0.1} className="order-1 md:order-2">
                <img src={img('ava-share.png')} alt="Sharing 'Childcare options for Sophie' from AVA via the iOS share sheet" loading="lazy" className="mx-auto w-full max-w-[440px] rounded-[28px] shadow-[0_30px_60px_-20px_rgba(59,47,160,0.35)] ring-1 ring-[#3B2FA0]/10" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* PROMISES */}
        <section className="px-5 py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2E8A82]">A gift that respects her</p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-6xl">Support, not supervision.</h2>
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                { I: ShieldCheck, h: 'She stays in charge', p: 'AVA suggests. Nothing lands on a calendar without her approval.', c: 'bg-[#E3F3F1]' },
                { I: Lock, h: 'Her inbox, her call', p: 'She chooses what AVA connects to, and can change her mind.', c: 'bg-[#EEEDFB] md:translate-y-8' },
                { I: Sparkles, h: 'Not a hint', p: 'This isn’t “you should be more organized.” It’s “you shouldn’t have to do it alone.”', c: 'bg-[#FCE3D4] md:translate-y-16' },
              ].map(({ I, h, p, c }, i) => (
                <Reveal key={h} delay={i * 0.1} className={`${c} rounded-[28px] p-8`}>
                  <I className="h-6 w-6 text-[#3B2FA0]" />
                  <h3 className="font-display mt-8 text-2xl font-semibold text-[#3B2FA0]">{h}</h3>
                  <p className="mt-3 leading-relaxed text-[#1E1A45]/70">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="px-5 pb-28 pt-12">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="font-display text-[clamp(2.25rem,6vw,4.75rem)] font-normal italic leading-[1.05] text-[#3B2FA0]">
              Less to carry.<br />More room to <span className="text-[#D46A3A]">breathe</span>.<br />A lighter home for everyone in it.
            </p>
          </Reveal>
        </section>

        {/* PERSONALIZE */}
        <section id="personalize" className="scroll-mt-20 px-5 pb-28">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-[#3B2FA0] px-6 py-14 text-[#FEFDFB] md:px-14 md:py-16">
            <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#5750C1]" />
            <div aria-hidden className="absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-[#F4A27A]/25" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9BE0D7]">Make it personal</p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">Say it in your own words.</h2>
              <p className="mt-4 max-w-xl text-lg text-[#FEFDFB]/75">A few lines from you, so she knows exactly why you chose this.</p>
            </div>
            <div className="relative mt-12 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
              <form onSubmit={(e) => { e.preventDefault(); setPreviewOpen(true); }} className="space-y-5 rounded-[28px] bg-[#FEFDFB] p-6 text-[#1E1A45] md:p-8" aria-label="Personalize your gift" data-testid="form-gift-personalize">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold">Her first name</span>
                    <input value={to} onChange={(e) => setTo(e.target.value.slice(0, 40))} placeholder="Maya" autoComplete="off" className="mt-2 w-full rounded-2xl border border-[#3B2FA0]/15 bg-[#F6F4FD] px-4 py-3 outline-none transition focus:border-[#5750C1] focus:ring-4 focus:ring-[#5750C1]/15" data-testid="input-gift-recipient" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold">Your first name</span>
                    <input value={from} onChange={(e) => setFrom(e.target.value.slice(0, 40))} placeholder="Daniel" autoComplete="off" className="mt-2 w-full rounded-2xl border border-[#3B2FA0]/15 bg-[#F6F4FD] px-4 py-3 outline-none transition focus:border-[#5750C1] focus:ring-4 focus:ring-[#5750C1]/15" data-testid="input-gift-sender" />
                  </label>
                </div>
                <label className="block">
                  <span className="flex items-baseline justify-between text-sm font-semibold">Your message <span className="font-normal text-[#1E1A45]/50" data-testid="text-gift-message-count">{msg.length}/{MAX_MSG}</span></span>
                  <textarea value={msg} onChange={(e) => setMsg(e.target.value.slice(0, MAX_MSG))} rows={5} className="mt-2 w-full resize-none rounded-2xl border border-[#3B2FA0]/15 bg-[#F6F4FD] px-4 py-3 leading-relaxed outline-none transition focus:border-[#5750C1] focus:ring-4 focus:ring-[#5750C1]/15" data-testid="input-gift-message" />
                </label>
                <div>
                  <p className="text-sm font-semibold">Or start from one of these</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PROMPTS.map((p, i) => (
                      <button type="button" key={i} onClick={() => setMsg(p)} className={`rounded-full px-3.5 py-1.5 text-sm transition ${msg === p ? 'bg-[#3B2FA0] text-[#FEFDFB]' : 'bg-[#FCE3D4] text-[#9A4A22] hover:bg-[#F4A27A]/40'}`} data-testid={`button-gift-prompt-${i}`}>{PROMPT_LABELS[i]}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3B2FA0] px-6 py-4 font-semibold text-[#FEFDFB] shadow-[0_14px_30px_-12px_#3B2FA0] transition hover:bg-[#5750C1] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5750C1]/35" data-testid="button-gift-preview">
                  <GiftIcon className="h-5 w-5" /> Preview gift <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
                <p className="flex items-start gap-2 rounded-2xl bg-[#E3F3F1] px-4 py-3 text-xs leading-relaxed text-[#1F6B65]" data-testid="text-gift-design-notice">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Design preview: nothing is purchased or sent, and nothing you type leaves this page.
                </p>
              </form>
              <div className="lg:sticky lg:top-28">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#FEFDFB]/60">Live preview</p>
                <GiftCard to={to} from={from} msg={msg} />
              </div>
            </div>
          </Reveal>
        </section>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-h-[92dvh] max-w-lg overflow-y-auto rounded-[28px] border-0 bg-[#FEFDFB] p-6 sm:rounded-[28px]" data-testid="dialog-gift-preview">
            <DialogHeader>
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FCE3D4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#9A4A22]" data-testid="status-gift-preview-label">
                <Info className="h-3.5 w-3.5" /> Design preview — no purchase made or gift sent
              </p>
              <DialogTitle className="font-display pt-2 text-2xl font-semibold text-[#3B2FA0]">How {to.trim() || 'she'} would see it</DialogTitle>
              <DialogDescription className="text-[#1E1A45]/65">This is a visual mock of the gift card. It isn’t saved or delivered anywhere.</DialogDescription>
            </DialogHeader>
            <GiftCard to={to} from={from} msg={msg} />
            <button onClick={() => setPreviewOpen(false)} className="mt-2 w-full rounded-full px-6 py-3.5 font-semibold text-[#3B2FA0] ring-1 ring-[#3B2FA0]/20 transition hover:bg-[#EEEDFB]" data-testid="button-gift-preview-edit">Keep editing</button>
          </DialogContent>
        </Dialog>

        {/* FAQ */}
        <section className="px-5 pb-28">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-5xl">Before you give it.</h2>
              <p className="mt-4 text-[#1E1A45]/65">What the gift is meant to feel like. Final terms are still being confirmed.</p>
            </Reveal>
            <div className="divide-y divide-[#3B2FA0]/10 border-y border-[#3B2FA0]/10">
              {GIFT_FAQ.map((f, i) => {
                const isOpen = faq === i;
                return (
                  <div key={f.q}>
                    <h3>
                      <button onClick={() => setFaq(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={`gfaq-${i}`} id={`gfaq-btn-${i}`} className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold transition hover:text-[#3B2FA0]" data-testid={`button-gift-faq-${i}`}>
                        {f.q}<ChevronDown className={`h-5 w-5 shrink-0 text-[#5750C1] transition ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </h3>
                    <div id={`gfaq-${i}`} role="region" aria-labelledby={`gfaq-btn-${i}`} hidden={!isOpen} className="pb-5 pr-8 leading-relaxed text-[#1E1A45]/70">{f.a}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL */}
        <section className="px-5 pb-24">
          <Reveal className="mx-auto max-w-4xl rounded-[40px] bg-[#FCE3D4] px-8 py-16 text-center">
            <h2 className="font-display text-4xl font-semibold leading-tight text-[#3B2FA0] md:text-6xl">She’s been holding it all. You can hold some too.</h2>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => go('personalize')} className="inline-flex items-center gap-2 rounded-full bg-[#3B2FA0] px-7 py-4 font-semibold text-[#FEFDFB] transition hover:bg-[#5750C1]" data-testid="button-gift-final"><GiftIcon className="h-5 w-5" /> Gift AVA</button>
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-4 font-semibold text-[#3B2FA0] underline-offset-4 hover:underline" data-testid="link-gift-back"><ArrowLeft className="h-4 w-4" /> Back to AVA</Link>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[#3B2FA0]/10 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#1E1A45]/60 md:flex-row">
          <Link href="/" data-testid="link-gift-footer-home"><img src={img('ava-logo.svg')} alt="AVA home" className="h-5" /></Link>
          <p>Your behind-the-scenes parenting partner.</p>
          <a href="https://hiava.app/privacy_policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#3B2FA0]" data-testid="link-gift-footer-privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
