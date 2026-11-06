/**
 * What's behind the gate: ground, a path leading in, a soft sunrise glow and the stupa.
 * Shares the gate's coordinate system (viewBox 0 0 1200 1000) so the stupa lines up
 * with the opening. Placeholder art; swap the stupa for the one from the logo later.
 */
export default function Sanctuary({ className }: { className?: string }) {
  const railPosts = Array.from({ length: 23 }, (_, i) => 466 + i * 12);
  return (
    <svg className={className} viewBox="0 0 1200 1000" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--sun)" stopOpacity="0.95" />
          <stop offset="45%" stopColor="var(--sun)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--sun)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dome" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--stupa-shade)" />
          <stop offset="55%" stopColor="var(--stupa)" />
          <stop offset="100%" stopColor="var(--stupa-shade)" />
        </linearGradient>
      </defs>

      <g data-layer="sun">
        <circle cx={600} cy={800} r={260} fill="url(#sun)" />
      </g>

      <g data-layer="ground">
        <rect x={-6000} y={900} width={13200} height={6000} fill="var(--ground)" />
        <polygon points="560,900 640,900 900,2000 300,2000" fill="var(--path)" />
      </g>

      <g data-layer="stupa">
        {/* chhatra (stacked umbrellas) */}
        <rect x={598} y={716} width={4} height={52} fill="var(--stupa-line)" />
        <ellipse cx={600} cy={748} rx={26} ry={4} fill="var(--stupa-line)" />
        <ellipse cx={600} cy={735} rx={20} ry={3.5} fill="var(--stupa-line)" />
        <ellipse cx={600} cy={723} rx={14} ry={3} fill="var(--stupa-line)" />
        {/* harmika */}
        <rect x={582} y={764} width={36} height={20} fill="var(--stupa)" stroke="var(--stupa-line)" strokeWidth={2} />
        <line x1={582} y1={772} x2={618} y2={772} stroke="var(--stupa-line)" strokeWidth={1.5} />
        {/* anda (dome) */}
        <path d="M500 872 A 100 90 0 0 1 700 872 Z" fill="url(#dome)" />
        <path d="M512 846 A 100 90 0 0 1 688 846" fill="none" stroke="var(--stupa-line)" strokeWidth={1.5} opacity={0.5} />
        {/* medhi (drum) */}
        <rect x={486} y={868} width={228} height={20} fill="var(--stupa)" stroke="var(--stupa-line)" strokeWidth={2} />
        {/* vedika (railing) */}
        <line x1={462} y1={884} x2={738} y2={884} stroke="var(--stupa-line)" strokeWidth={2} />
        <line x1={462} y1={892} x2={738} y2={892} stroke="var(--stupa-line)" strokeWidth={2} />
        {railPosts.map((x) => (
          <rect key={x} x={x} y={878} width={4} height={22} fill="var(--stupa-line)" />
        ))}
      </g>
    </svg>
  );
}
