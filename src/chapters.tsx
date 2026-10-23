import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const chapters = [
  { n: '01', k: 'Soft Landing', y: "'26", h: 'Landing softly', c: 'A relocation guide that matches you with neighbourhoods and places that fit your taste.',
    g: 'radial-gradient(at 18% 22%,#F2B87A 0,transparent 55%),radial-gradient(at 82% 18%,#E8743B 0,transparent 50%),radial-gradient(at 70% 85%,#8A4B2A 0,transparent 55%),radial-gradient(at 20% 80%,#D9A066 0,transparent 50%),#C9673A' },
  { n: '02', k: 'BrainDump', y: "'26", h: 'Empty the head', c: 'A web build from my 2026 run of shipping ideas fast.',
    g: 'radial-gradient(at 25% 20%,#C8D49A 0,transparent 55%),radial-gradient(at 80% 30%,#6E8B4E 0,transparent 50%),radial-gradient(at 60% 90%,#2F4A2C 0,transparent 55%),radial-gradient(at 10% 75%,#A9B778 0,transparent 50%),#55703F' },
  { n: '03', k: 'RedTeam Demo', y: "'26", h: 'Break it first', c: 'A web demo built and shipped in 2026.',
    g: 'radial-gradient(at 20% 25%,#F0A08A 0,transparent 55%),radial-gradient(at 85% 20%,#B8322A 0,transparent 50%),radial-gradient(at 65% 85%,#5E1A16 0,transparent 55%),radial-gradient(at 15% 85%,#D9664E 0,transparent 50%),#8E2A22' },
  { n: '04', k: 'Night Posters', y: "'25", h: 'After dark', c: 'Visual work: a poster series made in 2025, alongside the Orange Series.',
    g: 'radial-gradient(at 22% 18%,#E9C46A 0,transparent 55%),radial-gradient(at 80% 25%,#B5652B 0,transparent 50%),radial-gradient(at 70% 88%,#3B2A1A 0,transparent 55%),radial-gradient(at 15% 80%,#8C5A2B 0,transparent 50%),#6B4423' },
  { n: '05', k: 'Hackathons', y: 'Now', h: 'Seven and counting', c: 'Seven hackathons so far, building ideas end to end and shipping them fast.',
    g: 'radial-gradient(at 20% 20%,#F3D9B1 0,transparent 55%),radial-gradient(at 85% 30%,#C98B5B 0,transparent 50%),radial-gradient(at 60% 90%,#7A4E36 0,transparent 55%),radial-gradient(at 10% 80%,#E3B58A 0,transparent 50%),#B07A54' },
]

export function Chapters() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const prev = useRef(0)
  useEffect(() => {
    const el = root.current; if (!el) return
    const q = gsap.utils.selector(el)
    if (prev.current === active) { gsap.set(q('.cp'), { yPercent: 100 }); gsap.set(q(`.cp${active}`), { yPercent: 0 }); gsap.set(q('.ct'), { yPercent: 110, opacity: 0 }); gsap.set(q(`.ct${active}`), { yPercent: 0, opacity: 1 }); return }
    const from = prev.current; prev.current = active
    const d = reduced ? 0 : 0.9, e = 'expo.inOut'
    gsap.killTweensOf(q('.cp,.ct'))
    q('.cp').forEach((p, i) => { if (i !== from && i !== active) gsap.set(p, { yPercent: 100 }) })
    gsap.fromTo(q(`.cp${from}`), { yPercent: 0 }, { yPercent: -100, duration: d, ease: e })
    gsap.fromTo(q(`.cp${active}`), { yPercent: 100 }, { yPercent: 0, duration: d, ease: e })
    gsap.to(q(`.ct${from}`), { yPercent: -110, opacity: 0, duration: d * .4, ease: 'power2.in', stagger: .02 })
    gsap.fromTo(q(`.ct${active}`), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d * .8, ease: 'power3.out', delay: d * .4, stagger: .05 })
  }, [active])
  const cur = chapters[active]
  return <section id="chapters" ref={root} className="chapters relative mt-3 overflow-hidden rounded-[28px] p-5 md:mt-8 md:p-10">
    <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
    <div className="relative mb-6 flex items-end justify-between gap-4">
      <div><p className="text-[11px] uppercase tracking-[0.18em] text-[#B4471A] chapters-accent">Chapters</p>
        <h2 className="ch-ink text-[clamp(28px,4vw,52px)] font-medium leading-none">The work, in order.</h2></div>
      <p className="ch-mute hidden max-w-[260px] text-right text-[13px] md:block">Hover a chapter. Each one rises in, the last one leaves through the top.</p>
    </div>
    <div className="relative flex flex-col gap-2 md:h-[560px] md:flex-row">
      {/* panel stage */}
      <div className="relative order-first h-[300px] overflow-hidden rounded-[20px] md:order-none md:h-auto md:flex-[3.2]">
        {chapters.map((c, i) => <div key={c.n} className={`cp cp${i} absolute inset-0`} style={{ background: c.g }} aria-hidden>
          <div className="mesh absolute inset-[-20%]" style={{ background: c.g, filter: 'blur(40px)', opacity: .7 }} /></div>)}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute inset-0 text-white" aria-live="polite">
          {chapters.map((c, i) => <div key={c.n} className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8" aria-hidden={i !== active}>
            <div className="overflow-hidden"><p className={`ct ct${i} text-[12px] uppercase tracking-[0.18em] text-white/80`}>Chapter {c.n} · {c.k}</p></div>
            <div className="overflow-hidden"><h3 className={`ct ct${i} text-[clamp(34px,5vw,72px)] font-medium leading-[0.95]`}>{c.h}</h3></div>
            <div className="overflow-hidden"><p className={`ct ct${i} mt-2 max-w-md text-[14px] text-white/85`}>{c.c}</p></div>
          </div>)}
        </div>
        <span className="sr-only">{cur.k}</span>
      </div>
      {/* columns */}
      {chapters.map((c, i) => {
        const on = i === active
        return <button key={c.n} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={on}
          className={`ch-col group relative flex items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition-[flex-grow,background-color,border-color] duration-500 ease-[cubic-bezier(.76,0,.24,1)] md:flex-col md:items-start md:justify-between md:py-6 ${on ? 'ch-on md:flex-[1.3]' : 'md:flex-[.55]'}`}>
          <span className="ch-mute font-display text-[13px]">{c.n}</span>
          <span className="ch-ink font-display text-[18px] font-medium leading-tight md:[writing-mode:vertical-rl] md:rotate-180 md:text-[22px]">{c.k}</span>
          <span className="ch-mute ml-auto text-[12px] md:ml-0">{c.y}</span>
          <span className={`absolute bottom-0 left-5 right-5 h-[2px] origin-left rounded bg-[#B4471A] transition-transform duration-500 md:bottom-3 ${on ? 'scale-x-100' : 'scale-x-0'}`} />
        </button>
      })}
    </div>
  </section>
}
