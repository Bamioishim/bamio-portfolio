import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { Drawer } from 'vaul'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Studio, Portal, DuneFooter } from './extras'
import { ArrowUpRight, Menu, Mail, Bell, AtSign, Sparkles, X } from 'lucide-react'
gsap.registerPlugin(ScrollTrigger)
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const spring = { type: 'spring', stiffness: 400, damping: 28 } as const

const projects = [
  { n: 'Soft Landing', y: "'26", t: 'Web', isNew: true }, { n: 'BrainDump', y: "'26", t: 'Web' },
  { n: 'RedTeam Demo', y: "'26", t: 'Web' }, { n: 'Night Posters', y: "'25", t: 'Visual' },
  { n: 'Orange Series', y: "'25", t: 'Visual' }, { n: 'Lagos Grid', y: "'25", t: 'Web' },
  { n: 'Type Studies', y: "'24", t: 'Visual' }, { n: 'Signal Deck', y: "'24", t: 'Web' },
]
const stack = [['Lovable','Web build'],['Manus','Web build'],['Render','Hosting'],['GitHub','Code'],['GSAP','Motion'],['Lenis','Scroll'],['Figma','Visual design'],['Replit','Web build']]
const features = [['Builder Weekly',"'26"],['Lagos Tech Notes',"'25"],['Devpost Picks',"'26"],['Design Daily',"'25"]]
const channels = [['X','Visual design'],['LinkedIn','Web design'],['GitHub','Code'],['TikTok','Visual design'],['Instagram','Visual design']]
const clients = ['Qloo','Sui','Hydra','Burrowpad','IBNAi','OmniRush','Aqua0','Data Labs']

function useSmooth() {
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])
}

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 })
  const [big, setBig] = useState(false)
  useEffect(() => {
    const m = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); setBig(!!(e.target as HTMLElement).closest('a,button')) }
    window.addEventListener('mousemove', m); return () => window.removeEventListener('mousemove', m)
  }, [x, y])
  return <motion.div className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] rounded-full bg-orange mix-blend-difference"
    style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }} animate={{ width: big ? 48 : 10, height: big ? 48 : 10 }} transition={spring} />
}

function Intro() {
  const [show, setShow] = useState(!reduced)
  useEffect(() => { const t = setTimeout(() => setShow(false), 900); return () => clearTimeout(t) }, [])
  return <AnimatePresence>{show && <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-orange"
    initial={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
    <h1 className="text-5xl font-semibold text-ink">BAMIO</h1></motion.div>}</AnimatePresence>
}

function SplitText({ text, className }: { text: string; className?: string }) {
  return <span className={className} aria-label={text}>{text.split('').map((c, i) =>
    <span key={i} className="inline-block overflow-hidden align-bottom"><motion.span aria-hidden className="inline-block"
      initial={{ y: reduced ? 0 : '110%' }} animate={{ y: 0 }} transition={{ delay: 1 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      {c === ' ' ? '\u00A0' : c}</motion.span></span>)}</span>
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const o = { v: 0 }
    const st = ScrollTrigger.create({ trigger: ref.current, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: to, duration: reduced ? 0 : 1.6, ease: 'power3.out', onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(o.v) + suffix } }) })
    return () => st.kill()
  }, [to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

function Magnetic({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 18 }), sy = useSpring(y, { stiffness: 300, damping: 18 })
  return <motion.button className={className} style={{ x: sx, y: sy }} onClick={onClick}
    onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.35) }}
    onMouseLeave={() => { x.set(0); y.set(0) }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring}>{children}</motion.button>
}

function Spotlight({ children }: { children: React.ReactNode }) {
  const [p, setP] = useState({ x: 50, y: 50, o: 0 })
  return <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141413] p-6"
    onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top, o: 1 }) }}
    onMouseLeave={() => setP(s => ({ ...s, o: 0 }))}>
    <div className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ opacity: p.o,
      background: `radial-gradient(280px circle at ${p.x}px ${p.y}px, rgba(255,90,31,.18), transparent 70%)` }} />
    <div className="relative">{children}</div></div>
}

function Silhouette() {
  return <svg viewBox="0 0 400 520" className="absolute bottom-0 left-1/2 w-[115%] -translate-x-1/2" aria-hidden>
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#1a0d07"/><stop offset=".7" stopColor="#120905"/><stop offset="1" stopColor="#3a1608"/></linearGradient></defs>
    <path fill="url(#g)" d="M175 60c48-8 92 22 98 74 4 30-2 52 8 70 8 14 2 24-8 26l-2 30c-2 18-16 26-34 26l-4 46c60 10 120 40 152 80 14 18 20 60 20 108H-15c0-50 8-90 24-108 32-36 92-66 148-78l2-58c-30-20-52-56-54-100-2-60 24-108 70-116z"/></svg>
}

const Row = ({ a, b, isNew }: { a: string; b: string; isNew?: boolean }) =>
  <motion.a href="#" className="reveal group flex items-center justify-between gap-4 py-[3px] text-[13px] text-mute hover:text-soft" whileHover={{ x: 4 }} transition={spring}>
    <span className="flex items-center gap-2">{a}{isNew && <span className="rounded bg-orange/20 px-1 text-[9px] uppercase text-orange">new</span>}</span>
    <span className="text-mute/70">{b}</span></motion.a>

const Col = ({ title, children }: { title: string; children: React.ReactNode }) =>
  <div className="stagger"><h3 className="reveal mb-2 font-body text-[13px] font-medium tracking-normal text-soft">{title}</h3>{children}</div>

export default function App() {
  useSmooth()
  const [filter, setFilter] = useState<'All' | 'Web' | 'Visual'>('All')
  const [listRef] = useAutoAnimate<HTMLDivElement>()
  const heroImg = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 80, damping: 20 }), py = useSpring(my, { stiffness: 80, damping: 20 })
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stagger').forEach(el => gsap.from(el.querySelectorAll('.reveal'), {
        y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 88%' } }))
      gsap.to(heroImg.current, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: heroImg.current, start: 'top top', end: 'bottom top', scrub: true } })
    })
    return () => ctx.revert()
  }, [])
  const book = () => toast('Session request received', { description: 'BAMIO will reply within 24 hours.', icon: <Sparkles size={16} /> })
  const shown = projects.filter(p => filter === 'All' || p.t === filter)

  return <>
    <Intro /><Cursor /><div className="grain" /><Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: '#141413', border: '1px solid #2a2927', fontFamily: 'Satoshi' } }} />
    <main className="mx-auto max-w-[1360px] p-3 md:p-8">
      <div className="overflow-hidden rounded-[28px] bg-ink p-2 shadow-2xl md:grid md:grid-cols-[minmax(320px,32%)_minmax(0,1fr)]">
        {/* Hero panel */}
        <section onMouseMove={e => { if (reduced) return; const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width - .5) * -18); my.set(((e.clientY - r.top) / r.height - .5) * -12) }} onMouseLeave={() => { mx.set(0); my.set(0) }} className="relative h-[78vh] min-h-[520px] overflow-hidden rounded-[22px] bg-orange md:sticky md:top-2 md:h-[calc(100vh-80px)]">
          <div className="blob absolute left-1/2 top-[30%] h-[62%] w-[95%] -translate-x-1/2" aria-hidden />
          <div ref={heroImg} className="absolute inset-0"><motion.div className="absolute inset-0" style={{ x: px, y: py }}><Silhouette /></motion.div></div>
          <div className="relative z-10 flex items-center justify-between p-6">
            <h1 className="text-[28px] font-semibold leading-none text-white"><SplitText text="BAMIO" /></h1>
            <Drawer.Root>
              <Drawer.Trigger asChild><motion.button whileTap={{ scale: .97 }} aria-label="Menu" className="rounded-full bg-black/20 p-2 text-white md:hidden"><Menu size={18} /></motion.button></Drawer.Trigger>
              <Drawer.Portal><Drawer.Overlay className="fixed inset-0 z-[65] bg-black/60" />
                <Drawer.Content className="fixed inset-x-0 bottom-0 z-[66] rounded-t-[24px] bg-[#141413] p-6 pb-10 outline-none">
                  <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20" />
                  <Drawer.Title className="mb-4 font-display text-2xl text-white">Menu</Drawer.Title>
                  {['Projects', 'Stack', 'Clients', 'Contact'].map(l => <Drawer.Close asChild key={l}><a href={'#' + l.toLowerCase()} className="flex items-center justify-between border-b border-white/10 py-4 text-lg text-soft">{l}<ArrowUpRight size={18} /></a></Drawer.Close>)}
                  <Drawer.Close asChild><button className="mt-6 flex items-center gap-2 text-sm text-mute"><X size={14} />Drag down or tap to close</button></Drawer.Close>
                </Drawer.Content></Drawer.Portal>
            </Drawer.Root>
          </div>
          <div className="absolute bottom-0 z-10 max-w-[300px] p-6 text-[14px] leading-snug text-white">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>Hallo, I'm Bamio.</motion.p>
            <motion.p className="text-white/75" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>I build my ideas, ship them fast, and talk about everything web.</motion.p>
          </div>
        </section>

        {/* Right side */}
        <section className="relative flex min-w-0 flex-col gap-16 p-5 pt-8 md:p-10">
          <div className="stagger grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[[Mail, 'Got a question?', 'Get in touch'], [Bell, 'Stay in the loop', 'Subscribe'], [AtSign, "I'm on socials", 'Follow me on x.com']].map(([I, a, b]) => {
              const Icon = I as typeof Mail
              return <motion.a key={a as string} href="#" className="reveal group block" whileHover={{ y: -2 }} transition={spring}>
                <span className="flex items-center gap-2 text-[13px] text-soft"><Icon size={13} className="text-orange" />{a as string}</span>
                <span className="text-[13px] text-mute group-hover:text-orange transition-colors duration-200">{b as string}</span></motion.a>
            })}
          </div>

          <h2 className="stagger text-[clamp(40px,6vw,88px)] font-medium leading-[0.92] text-white">
            <span className="reveal block">Websites that</span><span className="reveal block text-orange">feel good to touch.</span></h2>

          <div className="stagger grid grid-cols-3 gap-4 border-y border-white/10 py-8">
            {[[12, '+', 'Projects shipped'], [7, '', 'Hackathons'], [100, '%', 'Hand-tuned motion']].map(([n, s, l]) =>
              <div key={l as string} className="reveal"><div className="font-display text-[clamp(32px,4vw,56px)] font-medium tracking-tight text-white"><Counter to={n as number} suffix={s as string} /></div><div className="text-[12px] text-mute">{l}</div></div>)}
          </div>

          <div id="projects" className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="stagger">
              <div className="reveal mb-3 flex items-center gap-2">
                <h3 className="mr-auto font-body text-[13px] font-medium tracking-normal text-soft">Projects</h3>
                {(['All', 'Web', 'Visual'] as const).map(f => <motion.button key={f} onClick={() => setFilter(f)} whileTap={{ scale: .97 }} transition={spring}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] transition-colors duration-200 ${filter === f ? 'bg-orange text-ink' : 'bg-white/5 text-mute hover:text-soft'}`}>{f}</motion.button>)}
              </div>
              <div ref={listRef}>{shown.map(p => <Row key={p.n} a={p.n} b={p.y} isNew={p.isNew} />)}</div>
            </div>
            <Col title="Stack">{stack.map(([a, b]) => <Row key={a} a={a} b={b} />)}</Col>
            <Col title="Channels">{channels.map(([a, b]) => <Row key={a} a={a} b={b} />)}</Col>
            <Col title="Features">{features.map(([a, b]) => <Row key={a} a={a} b={b} />)}</Col>
            <div className="stagger lg:col-span-2"><div className="reveal">
              <Spotlight><p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-orange">Currently</p>
                <h3 className="mb-2 text-2xl font-medium text-white">Soft Landing</h3>
                <p className="max-w-md text-[14px] text-mute">A relocation guide that matches you with neighbourhoods and places that fit your taste. Move your mouse over this card.</p>
                <a href="https://softlandingapp.lovable.app" className="mt-4 inline-flex items-center gap-1 text-[13px] text-soft hover:text-orange">Visit site <ArrowUpRight size={14} /></a></Spotlight></div></div>
          </div>

          <div id="clients" className="stagger"><h3 className="reveal mb-4 font-body text-[13px] font-medium tracking-normal text-soft">Clients &amp; collabs</h3>
            <div className="reveal relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
              <div className="marquee flex w-max gap-12">{[...clients, ...clients].map((c, i) =>
                <span key={i} className="font-display text-[clamp(28px,3.5vw,44px)] font-medium text-white/80 hover:text-orange transition-colors duration-200">{c}</span>)}</div></div></div>

          <div id="contact" className="flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-end">
            <p className="max-w-xs text-[13px] text-mute">Have a business with no site, or one that feels stiff? Let's fix that.</p>
            <Magnetic onClick={book} className="shimmer rounded-full bg-orange px-6 py-3 text-[14px] font-medium text-ink">
              <span className="relative z-10 flex items-center gap-2">Book a session <ArrowUpRight size={16} /></span></Magnetic>
          </div>
        </section>
      </div>
      <Studio />
    </main>
    <Portal />
    <div className="p-3 md:p-8"><DuneFooter><p className="mt-8 text-[11px] text-mute/70">© 2026 BAMIO. Placeholder content.</p></DuneFooter></div>
  </>
}
