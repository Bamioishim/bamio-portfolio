import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)

// Liquid buttons: track cursor for the blob gradient, short ripple on tap
document.addEventListener('pointermove', e => {
  const el = (e.target as Element)?.closest?.('.liquid') as HTMLElement | null
  if (!el) return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--lx', `${((e.clientX - r.left) / r.width) * 100}%`)
  el.style.setProperty('--ly', `${((e.clientY - r.top) / r.height) * 100}%`)
}, { passive: true })
document.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') return
  const el = (e.target as Element)?.closest?.('.liquid') as HTMLElement | null
  if (!el) return
  el.classList.remove('tap'); void el.offsetWidth; el.classList.add('tap')
  setTimeout(() => el.classList.remove('tap'), 600)
}, { passive: true })
