import { Component, StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
class Root extends Component<{ children: ReactNode }, { err: string | null }> {
  state = { err: null as string | null }
  static getDerivedStateFromError(e: unknown) { return { err: String(e) } }
  componentDidCatch() { document.documentElement.style.overflow = '' }
  render() {
    if (this.state.err) return <div style={{ padding: 24, color: '#F3EEE6', font: '16px system-ui' }}>Something went wrong loading the page. <a style={{ color: '#FF5A1F' }} href={location.pathname + '?r=' + Date.now()}>Reload</a></div>
    return this.props.children
  }
}
createRoot(document.getElementById('root')!).render(<StrictMode><Root><App /></Root></StrictMode>)
