/**
 * Atmosphere behind the gate: ground, a path leading through, and a soft sunrise glow
 * centred on the opening. Shares the gate's coordinate system (viewBox 0 0 1200 1000).
 */
export default function Backdrop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 1000" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--sun)" stopOpacity="0.95" />
          <stop offset="45%" stopColor="var(--sun)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--sun)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g data-layer="sun">
        <circle cx={600} cy={820} r={300} fill="url(#sun)" />
      </g>

      <g data-layer="ground">
        <rect x={-6000} y={900} width={13200} height={6000} fill="var(--ground)" />
        <polygon points="570,900 630,900 900,2000 300,2000" fill="var(--path)" />
      </g>
    </svg>
  );
}
