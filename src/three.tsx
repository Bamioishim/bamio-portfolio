import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function headPoints(n: number) {
  const out: number[] = []
  const rnd = () => Math.random() * 2 - 1
  while (out.length / 3 < n) {
    const x = rnd(), y = rnd(), z = rnd()
    const r = Math.hypot(x, y, z); if (r === 0) continue
    const ux = x / r, uy = y / r, uz = z / r
    const part = Math.random()
    if (part < 0.62) { // skull/face shell
      let px = ux * 0.78, py = uy * 1.0 + 0.55, pz = uz * 0.9
      if (uz > 0.55 && uy > -0.3 && uy < 0.2) pz += 0.12 * (1 - Math.abs(uy + 0.05) * 4) * (1 - Math.abs(ux) * 3) // nose
      if (uy < -0.2) { px *= 0.85 + uy * 0.2; pz *= 0.9 } // jaw taper
      out.push(px, py, pz)
    } else if (part < 0.75) { // neck
      const a = Math.random() * Math.PI * 2, h = Math.random()
      out.push(Math.cos(a) * 0.36, -0.35 - h * 0.55, Math.sin(a) * 0.34)
    } else { // shoulders
      const a = Math.random() * Math.PI * 2, s = Math.random()
      out.push(Math.cos(a) * (0.5 + s * 1.2), -0.95 - s * s * 0.5 + Math.random() * 0.05, Math.sin(a) * 0.45)
    }
  }
  return new Float32Array(out)
}

function Head() {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => headPoints(mobile ? 3500 : 9000), [])
  useFrame(({ pointer, clock }) => {
    const p = ref.current; if (!p) return
    const t = reduced ? 0 : clock.elapsedTime
    p.rotation.y = THREE.MathUtils.lerp(p.rotation.y, Math.sin(t * 0.15) * 0.5 + pointer.x * 0.5, 0.04)
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, -pointer.y * 0.2, 0.04)
  })
  return <points ref={ref}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
    <pointsMaterial color="#FF5A1F" size={mobile ? 0.022 : 0.016} sizeAttenuation transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
  </points>
}

export function ParticleHead({ active }: { active: boolean }) {
  return <Canvas dpr={[1, 1.5]} frameloop={active && !reduced ? 'always' : 'demand'} camera={{ position: [0, 0.1, 3.6], fov: 40 }} gl={{ antialias: false, powerPreference: 'low-power' }}>
    <Head /></Canvas>
}

const vert = `uniform float uT; varying float vH; varying vec2 vUv;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){vUv=uv;vec3 p=position;float d=sin(p.x*0.9+p.y*0.35+uT*0.05)*0.45+n(p.xy*0.6+uT*0.02)*0.5+sin(p.x*2.3-p.y*0.8)*0.12;
p.z+=d;vH=d;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`
const frag = `uniform float uT; varying float vH; varying vec2 vUv;
void main(){float sweep=smoothstep(0.35,0.,abs(vUv.x-fract(uT*0.03)*1.6+0.3));
vec3 base=mix(vec3(0.035,0.03,0.028),vec3(0.13,0.07,0.04),clamp(vH,0.,1.));
vec3 col=base+vec3(1.,0.35,0.12)*sweep*0.10*clamp(vH+0.3,0.,1.);
col*=smoothstep(0.,0.35,vUv.y);gl_FragColor=vec4(col,1.);}`

function DunePlane() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uT: { value: 0 } }), [])
  useFrame((_, dt) => { if (mat.current && !reduced) mat.current.uniforms.uT.value += dt })
  return <mesh rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -1.2, 0]}>
    <planeGeometry args={[22, 12, mobile ? 80 : 160, mobile ? 40 : 90]} />
    <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
  </mesh>
}

export function Dunes({ active }: { active: boolean }) {
  return <Canvas dpr={[1, 1.25]} frameloop={active && !reduced ? 'always' : 'demand'} camera={{ position: [0, 1.2, 6], fov: 45 }} gl={{ antialias: false, powerPreference: 'low-power' }}>
    <color attach="background" args={['#0A0A0A']} /><DunePlane /></Canvas>
}
export default { ParticleHead, Dunes }
