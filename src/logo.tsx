export const SHARD_TOP = 'M21.26,0 L83.26,0 L95.86,16 L91.12,38.3 L10.63,50 Z M36.86,16 L73.86,16 L77.01,20 L75.09,29 L32.78,35.2 Z'
export const SHARD_BOT = 'M8.93,58 L95.61,45.4 L87.4,84 L68.0,100 L0.0,100 Z M25.97,67.2 L72.42,60.4 L68.25,80 L64.61,83 L22.61,83 Z'
export function Mark({ className = '', top = 'currentColor', bot = '#EE6636' }: { className?: string; top?: string; bot?: string }) {
  return <svg viewBox="-4 -4 114 108" className={className} aria-hidden><path className="shard-top" fill={top} fillRule="evenodd" d={SHARD_TOP} /><path className="shard-bot" fill={bot} fillRule="evenodd" d={SHARD_BOT} /></svg>
}
