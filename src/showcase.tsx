import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { glOK } from './extras'
const B = import.meta.env.BASE_URL
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PAGES = [
  ['Zeron', 'A daily pixel dungeon on $wif', 'https://zeron-game.vercel.app', 'zeron'],
  ['Embros', 'Crypto fee forecaster', 'https://embros.vercel.app', 'embros'],
  ['Soft Landing', 'Relocation guide that fits your taste', 'https://softlanding-mauve.vercel.app', 'softlanding'],
  ['BrainDump', 'Turn a messy head into a plan', 'https://braindump-ewew4u2s.manus.space', 'braindump'],
  ['ORI', 'One balance across chains', 'https://ori-preview.vercel.app', 'ori'],
  ['CMBG RUN', 'Meme-contest endless runner', 'https://cmbg-run.vercel.app', 'cmbg'],
].map(([t, d, u, k]) => ({ t, d, u, img: `${B}landings/${k}.webp` }))

const VIDEOS = [
  ['braindump', 'BrainDump', 'Launch demo with music'],
  ['zeron', 'Zeron', 'Real-time dungeon fights, on-chain loot'],
  ['cmbg', 'CMBG RUN', 'Gameplay clip for the CMBG meme contest'],
  ['aqua0', 'Aqua0 Season 0', 'Season launch announcement'],
  ['embros', 'Embros', 'Animated hero for the fee forecaster'],
  ['ori', 'ORI', 'Wallet app demo', true],
].map(([k, t, d, tall]) => ({ k: k as string, t: t as string, d: d as string, tall: !!tall }))

const PAD = 0.07, R = 0.11, TILT = 0.18, TURN = 1000, DWELL = 1300
const ease = (x: number) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

const VS = `attribute vec2 a;uniform float uC,uM,uFx,uFy;varying vec2 v;varying float th;
void main(){v=a;float x=a.x,z=0.,t=0.;if(uM>.5){float c=uC+${TILT.toFixed(2)}*(a.y-.5);float d=x-c;if(d>0.){t=d/${R};if(t<3.14159){x=c+${R}*sin(t);z=${R}*(1.-cos(t));}else{x=c-(d-3.14159*${R});z=${(2 * R).toFixed(2)};}}}
th=t;gl_Position=vec4((x*2.-1.)*uFx,(a.y*2.-1.)*uFy,-z*.4,1.-z*.9);}`
const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uT;uniform float uM,uC,uB,uA,uOn;uniform vec2 uPx;varying vec2 v;varying float th;
float rr(vec2 u){vec2 p=u*uPx,h=uPx*.5,q=abs(p-h)-(h-10.);return clamp(.5-(length(max(q,0.))-10.),0.,1.);}
void main(){vec4 c;float a=rr(v);
if(uM<.5){c=texture2D(uT,v);float d=v.x-(uC+${TILT.toFixed(2)}*(v.y-.5));float s=d>0.?.5*exp(-d/.16):.18*exp(d/.05);c.rgb*=1.-s*uOn;}
else{float b=uB*(.25+.75*clamp(th/1.5,0.,1.))*.012;vec2 o=vec2(b,b*1.6);
c=(texture2D(uT,v)*4.+texture2D(uT,v+vec2(o.x,0))+texture2D(uT,v-vec2(o.x,0))+texture2D(uT,v+vec2(0,o.y))+texture2D(uT,v-vec2(0,o.y))
+texture2D(uT,v+o)+texture2D(uT,v-o)+texture2D(uT,v+vec2(o.x,-o.y))+texture2D(uT,v-vec2(o.x,-o.y)))/12.;
float sh=th>0.?.78+.22*cos(min(th,3.14159)):1.;if(!gl_FrontFacing)c.rgb=mix(c.rgb,vec3(.94,.91,.86),.8)*(.8+.2*sin(min(th,3.14)));else c.rgb*=sh;a*=uA;}
gl_FragColor=vec4(c.rgb*a,a);}`

function glRenderer(cv: HTMLCanvasElement, imgs: HTMLImageElement[]) {
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true, preserveDrawingBuffer: true }); if (!gl) return null
  const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || 'sh'); return o }
  const pr = gl.createProgram()!; gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr) || 'link'); gl.useProgram(pr)
  const NX = 90, NY = 24, P: number[] = [], I: number[] = []
  for (let j = 0; j <= NY; j++) for (let i = 0; i <= NX; i++) P.push(i / NX, j / NY)
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const k = j * (NX + 1) + i; I.push(k, k + 1, k + NX + 1, k + 1, k + NX + 2, k + NX + 1) }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(P), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(I), gl.STATIC_DRAW)
  const al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0)
  const U = (n: string) => gl.getUniformLocation(pr, n)
  const u = { C: U('uC'), M: U('uM'), Fx: U('uFx'), Fy: U('uFy'), B: U('uB'), A: U('uA'), On: U('uOn'), Px: U('uPx') }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  const tex = imgs.map(im => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t)
    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); return t })
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL)
  const n = NX * NY * 6
  return (top: number, under: number, p: number) => {
    const dpr = Math.min(devicePixelRatio || 1, 2), w = cv.clientWidth, h = cv.clientHeight
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr) }
    gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const fx = 1 - PAD * 2 * (h / w) * 1.6, fy = 1 - PAD * 2
    gl.uniform1f(u.Fx, fx); gl.uniform1f(u.Fy, fy); gl.uniform2f(u.Px, w * fx, h * fy)
    const c = 1 + TILT / 2 + .01 - p * (1.25 + TILT)
    gl.uniform1f(u.C, c); gl.uniform1f(u.On, p > 0 ? Math.min(1, p * 6) : 0)
    if (p > 0) { gl.uniform1f(u.M, 0); gl.bindTexture(gl.TEXTURE_2D, tex[under]); gl.depthMask(false); gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0); gl.depthMask(true) }
    gl.uniform1f(u.M, 1); gl.uniform1f(u.B, Math.min(1, p * 2.2)); gl.uniform1f(u.A, 1 - Math.max(0, (p - .78) / .22))
    gl.bindTexture(gl.TEXTURE_2D, tex[top]); gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0)
  }
}

export function Landing() {
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null)
  const [idx, setIdx] = useState(0), [gl, setGl] = useState(false)
  const st = useRef({ i: 0, top: 0, under: 1, p: 0, from: 0, to: 0, t0: 0, dir: 0, rest: 0, hover: false, vis: false, drag: null as null | { x: number, p0: number, moved: boolean, dir: number }, draw: null as null | ((a: number, b: number, p: number) => void) })
  const dom = useRef<HTMLDivElement>(null)
  const N = PAGES.length
  useEffect(() => {
    const el = box.current!; const s = st.current; let raf = 0, started = false
    const paint = () => {
      if (s.draw) s.draw(s.top, s.under, s.p)
      else if (dom.current) { // CSS fallback
        dom.current.querySelectorAll<HTMLElement>('[data-i]').forEach(e => { const k = +e.dataset.i!
          const isTop = k === s.top, isUnder = k === s.under && s.p > 0
          e.style.zIndex = isTop ? '2' : isUnder ? '1' : '0'; e.style.visibility = isTop || isUnder ? 'visible' : 'hidden'
          e.style.transform = isTop && !reduced ? `perspective(1600px) rotateY(${s.p * 100}deg)` : ''
          e.style.opacity = isTop ? String(reduced ? 1 - s.p : 1 - Math.max(0, (s.p - .7) / .3)) : '1'; e.style.filter = isTop && !reduced ? `blur(${s.p * 4}px)` : '' }) }
    }
    const begin = (dir: number) => { if (s.dir) return; s.dir = dir; s.t0 = performance.now()
      if (dir > 0) { s.top = s.i; s.under = (s.i + 1) % N; s.from = s.p; s.to = 1 } else { s.top = (s.i - 1 + N) % N; s.under = s.i; s.from = s.p || 1; s.to = 0 } }
    const done = () => { if (s.dir > 0 && s.to === 1) s.i = s.under; else if (s.dir < 0 && s.to === 0) s.i = s.top
      s.dir = 0; s.p = 0; s.top = s.i; s.under = (s.i + 1) % N; s.rest = performance.now(); setIdx(s.i) }
    const loop = (now: number) => { raf = requestAnimationFrame(loop)
      if (s.drag) { paint(); return }
      if (s.dir) { const k = Math.min(1, (now - s.t0) / (TURN * Math.max(.35, Math.abs(s.to - s.from)))); s.p = s.from + (s.to - s.from) * ease(k); paint(); if (k >= 1) { done(); paint() } return }
      if (!s.hover && s.vis && now - s.rest > DWELL) begin(1)
    }
    ;(el as any)._turn = (d: number) => { if (!s.dir && !s.drag) begin(d) }
    const start = async () => { if (started) return; started = true
      const imgs = await Promise.all(PAGES.map(p => new Promise<HTMLImageElement>(r => { const im = new Image(); im.decoding = 'async'; im.onload = im.onerror = () => r(im); im.src = p.img })))
      if (glOK && !reduced && cv.current) try { s.draw = glRenderer(cv.current, imgs); if (s.draw) setGl(true) } catch (e) { console.warn('curl fallback', e); s.draw = null }
      s.rest = performance.now(); paint(); raf = requestAnimationFrame(loop) }
    const io = new IntersectionObserver(([e]) => { s.vis = e.isIntersecting; if (e.isIntersecting) start(); s.rest = performance.now() }, { rootMargin: '200px' })
    io.observe(el); const ro = new ResizeObserver(() => paint()); ro.observe(el)
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [N])
  const s = st.current
  const down = (e: React.PointerEvent) => { if (s.dir) return; s.drag = { x: e.clientX, p0: 0, moved: false, dir: 0 }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId) }
  const move = (e: React.PointerEvent) => { const d = s.drag; if (!d) return; const dx = e.clientX - d.x, w = box.current!.clientWidth
    if (Math.abs(dx) > 6) d.moved = true; if (!d.moved) return
    if (!d.dir) { d.dir = dx < 0 ? 1 : -1; if (d.dir > 0) { s.top = s.i; s.under = (s.i + 1) % N } else { s.top = (s.i - 1 + N) % N; s.under = s.i } }
    s.p = d.dir > 0 ? Math.min(1, Math.max(0, -dx / (w * .7))) : Math.min(1, Math.max(0, 1 - dx / (w * .7))) }
  const up = () => { const d = s.drag; s.drag = null; if (!d) return
    if (!d.moved) { window.open(PAGES[s.i].u, '_blank', 'noopener'); return }
    if (!d.dir) return
    s.dir = d.dir; s.t0 = performance.now(); s.from = s.p
    s.to = d.dir > 0 ? (s.p > .3 ? 1 : 0) : (s.p < .7 ? 0 : 1)
    if (d.dir > 0 && s.to === 0) s.dir = -2; if (d.dir < 0 && s.to === 1) s.dir = 2 }
  const turn = (d: number) => (box.current as any)?._turn?.(d)
  const cur = PAGES[idx]
  return <section id="landings" className="mx-3 mt-6 overflow-hidden rounded-[28px] bg-card p-6 md:mx-8 md:p-12">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-orange">Landing pages</p>
        <h2 className="text-[clamp(32px,5vw,64px)] font-medium leading-[0.95] text-fg">Pages that turn heads.</h2></div>
      <p className="max-w-[280px] text-[13px] text-mute">Live sites I designed and shipped. Drag or swipe to turn the page, click one to visit it.</p>
    </div>
    <div ref={box} className="relative mx-auto aspect-[16/10.6] w-full max-w-[1180px] touch-pan-y select-none"
      onPointerEnter={e => { if (e.pointerType === 'mouse') s.hover = true }} onPointerLeave={() => { s.hover = false; s.rest = performance.now(); if (s.drag) up() }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ cursor: 'grab' }} role="link" aria-label={`Open ${cur.t} live site`}>
      <div className="pointer-events-none absolute rounded-[10px] shadow-[0_30px_70px_-20px_rgba(0,0,0,.55),0_8px_24px_-8px_rgba(0,0,0,.35)]" style={{ inset: `${PAD * 100}% ${PAD * 100 * 1.6 * (10.6 / 16)}%` }} />
      <canvas ref={cv} className={`absolute inset-0 h-full w-full ${gl ? '' : 'hidden'}`} />
      {!gl && <div ref={dom} className="absolute" style={{ inset: `${PAD * 100}% ${PAD * 100 * 1.6 * (10.6 / 16)}%` }}>
        {PAGES.map((p, i) => <img key={p.t} data-i={i} src={p.img} alt={p.t} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full rounded-[10px] object-cover" style={{ transformOrigin: 'left center', visibility: i ? 'hidden' : 'visible' }} />)}</div>}
    </div>
    <div className="mx-auto mt-4 flex max-w-[1180px] items-center gap-3">
      <a href={cur.u} target="_blank" rel="noopener noreferrer" className="group mr-auto min-w-0"><span className="font-display text-[20px] font-medium text-fg group-hover:text-orange">{cur.t} <ArrowUpRight size={16} className="inline" /></span>
        <span className="block truncate text-[13px] text-mute">{cur.d}</span></a>
      <span className="whitespace-nowrap text-[12px] tabular-nums text-mute">{String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
      <button onClick={() => turn(-1)} aria-label="Previous page" className="rounded-full border border-fg/15 p-2 text-soft hover:border-orange hover:text-orange"><ChevronLeft size={16} /></button>
      <button onClick={() => turn(1)} aria-label="Next page" className="rounded-full border border-fg/15 p-2 text-soft hover:border-orange hover:text-orange"><ChevronRight size={16} /></button>
    </div>
  </section>
}

function VCard({ v, open }: { v: typeof VIDEOS[number], open: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => { const el = ref.current!; if (matchMedia('(hover: hover)').matches) return
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio > .6) el.play().catch(() => {}); else el.pause() }, { threshold: [0, .6, 1] })
    io.observe(el); return () => io.disconnect() }, [])
  return <button onClick={open} onMouseEnter={() => ref.current?.play().catch(() => {})} onMouseLeave={() => ref.current?.pause()}
    className="group text-left">
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-fg/10 bg-ink">
      <video ref={ref} src={`${B}videos/${v.k}.mp4`} poster={`${B}videos/${v.k}.webp`} muted loop playsInline preload="none"
        className={`h-full w-full ${v.tall ? 'object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-[1.02]`} />
      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange text-ink"><Play size={14} fill="currentColor" /></span>
    </div>
    <p className="mt-3 font-display text-[18px] font-medium text-fg group-hover:text-orange">{v.t}</p>
    <p className="text-[13px] text-mute">{v.d}</p>
  </button>
}

export function Videos() {
  const [o, setO] = useState<number | null>(null)
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && setO(null); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  const v = o === null ? null : VIDEOS[o]
  return <section id="videos" className="mx-3 mt-6 rounded-[28px] bg-card p-6 md:mx-8 md:p-12">
    <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-orange">Video</p>
    <h2 className="mb-8 text-[clamp(32px,5vw,64px)] font-medium leading-[0.95] text-fg">Things that move.</h2>
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{VIDEOS.map((x, i) => <VCard key={x.k} v={x} open={() => setO(i)} />)}</div>
    {v && <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setO(null)} role="dialog" aria-label={v.t}>
      <div className="relative w-full max-w-[1100px]" onClick={e => e.stopPropagation()}>
        <video src={`${B}videos/${v.k}.mp4`} poster={`${B}videos/${v.k}.webp`} controls autoPlay playsInline className="max-h-[80vh] w-full rounded-2xl bg-black" />
        <div className="mt-3 flex items-center justify-between text-white"><span><b className="font-display text-[18px] font-medium">{v.t}</b> <span className="text-[13px] text-white/70">· {v.d}</span></span>
          <button onClick={() => setO(null)} aria-label="Close" className="rounded-full border border-white/25 p-2 hover:border-orange hover:text-orange"><X size={16} /></button></div>
      </div></div>}
  </section>
}
