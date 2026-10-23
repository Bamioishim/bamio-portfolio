import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import avatar from './avatar-points.json'

// Bamio's likeness sampled from the cleaned avatar: [x, y, z, brightness] per dot
function avatarPoints(step: number) {
  const a = avatar as number[], n = Math.floor(a.length / 4 / step)
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3)
  const base = new THREE.Color('#FF5A1F')
  for (let i = 0; i < n; i++) {
    const j = i * step * 4, b = a[j + 3]
    pos.set([a[j] + (Math.random() - .5) * .006, a[j + 1], a[j + 2] + (Math.random() - .5) * .04], i * 3)
    col.set([base.r * b, base.g * b, base.b * b], i * 3)
  }
  return { pos, col }
}

const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Head() {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => avatarPoints(1), [])
  useFrame(({ pointer, clock }) => {
    const p = ref.current; if (!p) return
    const t = reduced ? 0 : clock.elapsedTime
    p.rotation.y = THREE.MathUtils.lerp(p.rotation.y, Math.sin(t * 0.15) * 0.3 + pointer.x * 0.3, 0.04)
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, -pointer.y * 0.2, 0.04)
  })
  return <points ref={ref}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /><bufferAttribute attach="attributes-color" args={[col, 3]} /></bufferGeometry>
    <pointsMaterial vertexColors size={mobile ? 0.02 : 0.014} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
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
