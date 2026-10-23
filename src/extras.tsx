import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ParticleHead = lazy(() => import('./three').then(m => ({ default: m.ParticleHead })))
const Dunes = lazy(() => import('./three').then(m => ({ default: m.Dunes })))

function useInView<T extends HTMLElement>(margin = '200px') {
  const ref = useRef<T>(null); const [seen, setSeen] = useState(false); const [vis, setVis] = useState(false)
  useEffect(() => { const io = new IntersectionObserver(([e]) => { setVis(e.isIntersecting); if (e.isIntersecting) setSeen(true) }, { rootMargin: margin })
    if (ref.current) io.observe(ref.current); return () => io.disconnect() }, [margin])
  return { ref, seen, vis }
}

export function Studio() {
  const { ref, seen, vis } = useInView<HTMLDivElement>()
  return <section ref={ref} className="stagger relative mx-auto mt-6 grid max-w-[1360px] items-center gap-6 overflow-hidden rounded-[28px] bg-ink p-6 md:grid-cols-2 md:p-12">
    <div className="relative z-10">
      <p className="reveal mb-3 text-[11px] uppercase tracking-[0.18em] text-orange">Studio</p>
      <h2 className="reveal text-[clamp(34px,5vw,72px)] font-medium leading-[0.95] text-white">Ideas in,<br />sites out.</h2>
      <p className="reveal mt-5 max-w-sm text-[14px] text-mute">A one-person studio from Lagos. I take a rough idea, shape it with the best tools around, and ship something people enjoy using.</p>
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
        <path fill="#140904" d="M175 60c48-8 92 22 98 74 4 30-2 52 8 70 8 14 2 24-8 26l-2 30c-2 18-16 26-34 26l-4 46c60 10 120 40 152 80 14 18 20 60 20 108H-15c0-50 8-90 24-108 32-36 92-66 148-78l2-58c-30-20-52-56-54-100-2-60 24-108 70-116z" />
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
  const word = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => gsap.from(word.current!.querySelectorAll('span'), { yPercent: 110, stagger: 0.06, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: word.current, start: 'top 85%' } }))
    return () => ctx.revert()
  }, [])
  return <section ref={ref} className="relative mx-auto mt-6 h-[640px] max-w-[1360px] overflow-hidden rounded-[28px] bg-ink">
    <div className="absolute inset-0 opacity-90">{seen && <Suspense fallback={null}><Dunes active={vis} /></Suspense>}</div>
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
      <div className="relative flex items-center justify-center">
        <div className="halo absolute aspect-square w-[min(78vw,520px)] rounded-full" aria-hidden />
        <h2 ref={word} className="relative overflow-hidden text-[clamp(64px,16vw,220px)] font-semibold leading-none text-white">
          {'BAMIO'.split('').map((c, i) => <span key={i} className="inline-block">{c}</span>)}</h2>
      </div>
      {children}
    </div>
  </section>
}
