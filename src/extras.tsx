import { BODY, LIT, SHAPE_T } from './bamio-shape'
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ParticleHeadL = lazy(() => import('./three').then(m => ({ default: m.ParticleHead })))
const DunesL = lazy(() => import('./three').then(m => ({ default: m.Dunes })))

class GLBoundary extends Component<{ children: ReactNode }, { bad: boolean }> {
  state = { bad: false }
  static getDerivedStateFromError() { return { bad: true } }
  componentDidCatch() {}
  render() { return this.state.bad ? null : this.props.children }
}
const glOK = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } })()
const ParticleHead = (p: { active: boolean }) => glOK ? <GLBoundary><ParticleHeadL {...p} /></GLBoundary> : null
const Dunes = (p: { active: boolean }) => glOK ? <GLBoundary><DunesL {...p} /></GLBoundary> : null

function useInView<T extends HTMLElement>(margin = '200px') {
  const ref = useRef<T>(null); const [seen, setSeen] = useState(false); const [vis, setVis] = useState(false)
  useEffect(() => { const io = new IntersectionObserver(([e]) => { setVis(e.isIntersecting); if (e.isIntersecting) setSeen(true) }, { rootMargin: margin })
    if (ref.current) io.observe(ref.current); return () => io.disconnect() }, [margin])
  return { ref, seen, vis }
}

export function Studio() {
  const { ref, seen, vis } = useInView<HTMLDivElement>()
  return <section ref={ref} className="dark-scope stagger relative mx-auto mt-6 grid max-w-[1360px] items-center gap-6 overflow-hidden rounded-[28px] bg-ink p-6 md:grid-cols-2 md:p-12">
    <div className="relative z-10">
      <p className="reveal mb-3 text-[11px] uppercase tracking-[0.18em] text-orange">Studio</p>
      <h2 className="reveal text-[clamp(34px,5vw,72px)] font-medium leading-[0.95] text-white">Ideas in,<br />sites out.</h2>
      <p className="reveal mt-5 max-w-sm text-[14px] text-mute">A one-person studio. I take a rough idea, shape it with the best tools around, and ship something people enjoy using.</p>
    </div>
    <div className="relative h-[340px] md:h-[520px]">
      {seen && <Suspense fallback={null}><ParticleHead active={vis} /></Suspense>}
    </div>
  </section>
}

export function Portal() {
  const wrap = useRef<HTMLDivElement>(null), head = useRef<SVGSVGElement>(null), world = useRef<HTMLDivElement>(null), txt = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced) { gsap.set(world.current, { clipPath: 'circle(150% at 50% 38%)' }); gsap.set(head.current, { opacity: 0 }); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: 'top top', end: '+=140%', scrub: 0.6, pin: true } })
      tl.to(head.current, { scale: 9, transformOrigin: '50% 30%', ease: 'power2.in' }, 0)
        .fromTo(world.current, { clipPath: 'circle(0% at 50% 38%)' }, { clipPath: 'circle(150% at 50% 38%)', ease: 'power2.in' }, 0.25)
        .to(head.current, { opacity: 0, duration: 0.2 }, 0.8)
        .from(txt.current!.children, { y: 40, opacity: 0, stagger: 0.08, duration: 0.3 }, 0.75)
    })
    return () => ctx.revert()
  }, [])
  return <section ref={wrap} className="relative mt-6 h-screen overflow-hidden bg-orange">
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="absolute top-10 text-[11px] uppercase tracking-[0.18em] text-ink/70">Scroll to step inside</p>
      <svg ref={head} viewBox="0 0 400 520" className="h-[70vh] will-change-transform" aria-hidden>
        <g transform={SHAPE_T}><path fill="#140904" d={BODY} /><path fill="#3a1608" d={LIT} /></g>
      </svg>
    </div>
    <div ref={world} className="absolute inset-0 flex items-center justify-center" style={{ clipPath: 'circle(0% at 50% 38%)',
      background: 'radial-gradient(120% 80% at 50% 110%, #2a0f05 0%, #8a2c0c 35%, #E2541C 60%, #F6A35C 85%, #FBD3A0 100%)' }}>
      <div ref={txt} className="px-6 text-center text-ink">
        <p className="text-[11px] uppercase tracking-[0.2em]">Inside the head</p>
        <h2 className="mt-3 text-[clamp(40px,8vw,120px)] font-medium leading-[0.9]">Warm ideas,<br />quiet details.</h2>
        <p className="mx-auto mt-5 max-w-md text-[14px] text-ink/70">Every project starts here: a feeling first, then the build.</p>
      </div>
    </div>
  </section>
}

export function DuneFooter({ children }: { children?: React.ReactNode }) {
  const { ref, seen, vis } = useInView<HTMLElement>()
  const word = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced || !word.current) return
    try {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: word.current, start: 'top 85%' } })
        tl.from(word.current!.querySelectorAll('.sl'), { yPercent: 105, duration: 1, stagger: 0.08, ease: 'power3.out' })
          .fromTo(word.current!.querySelector('.sig'), { strokeDashoffset: 900, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, '-=0.4')
          .to(word.current!.querySelector('.sig'), { fillOpacity: 1, duration: 0.6 }, '-=0.3')
      }, word)
      return () => ctx.revert()
    } catch { /* content stays visible */ }
  }, [])
  return <section ref={ref} className="relative mx-auto mt-6 h-[640px] max-w-[1360px] overflow-hidden rounded-[28px] bg-ink dark-scope">
    <div className="absolute inset-0 opacity-90">{seen && <Suspense fallback={null}><Dunes active={vis} /></Suspense>}</div>
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
      <div className="relative flex items-center justify-center">
        <div className="halo absolute aspect-square w-[min(78vw,520px)] rounded-full" aria-hidden />
        <div ref={word} className="relative text-center">
          <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-mute">Available 2026</p>
          <h2 className="font-serifd text-[clamp(44px,8.5vw,112px)] italic leading-[0.95] tracking-[-0.02em] text-white" style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400 }}>
            <span className="block overflow-hidden pb-1"><span className="sl block">Let's build</span></span>
            <span className="block overflow-hidden pb-2"><span className="sl block">something <span className="text-orange">good.</span></span></span>
          </h2>
          <svg viewBox="0 0 300 110" className="mx-auto mt-4 h-[70px] w-[200px] md:h-[90px] md:w-[250px]" aria-label="Bamio signature">
            <text className="sig" x="150" y="78" textAnchor="middle" fill="#D9D6CF" stroke="#D9D6CF" strokeWidth="0.8" strokeDasharray="900" strokeDashoffset="0"
              style={{ fontFamily: '"Mrs Saint Delafield", "Snell Roundhand", cursive', fontSize: 84 }}>Bamio</text>
          </svg>
        </div>
      </div>
      {children}
    </div>
  </section>
}
