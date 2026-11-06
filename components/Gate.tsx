/**
 * Stylised Sanchi-style torana (gateway), drawn in a flat, logo-like vector style.
 *
 * Coordinate system: viewBox 0 0 1200 1000. The walk-through opening sits between
 * the pillars (x 460–740) under the bottom architrave (y > 560). GateIntro scales the
 * whole SVG around that opening, so the viewer seems to pass through it.
 *
 * Every major part is its own <g data-layer="…"> so it can be animated separately.
 * Colours come from CSS variables (see globals.css), which makes re-branding easy.
 */

const ARCH_X1 = 200;
const ARCH_X2 = 1000;
const PILLAR_L = 380; // left pillar x (width 80)
const PILLAR_R = 740; // right pillar x (width 80)
const PILLAR_W = 80;

function Volute({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className="g-stone" />
      <circle cx={cx} cy={cy} r={r * 0.72} className="g-line" />
      <circle cx={cx} cy={cy} r={r * 0.46} className="g-line" />
      <circle cx={cx} cy={cy} r={r * 0.2} className="g-carve" />
    </g>
  );
}

function PillarBlock({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={PILLAR_W} height={h} className="g-stone" />
      <rect x={x + 8} y={y + 8} width={PILLAR_W - 16} height={h - 16} className="g-line" />
      <circle cx={x + PILLAR_W / 2} cy={y + h / 2} r={Math.min(h, PILLAR_W) * 0.18} className="g-line" />
    </g>
  );
}

function Architrave({ y, h, layer }: { y: number; h: number; layer: string }) {
  const cy = y + h / 2;
  return (
    <g data-layer={layer}>
      {/* main beam */}
      <rect x={ARCH_X1} y={y} width={ARCH_X2 - ARCH_X1} height={h} rx={4} className="g-stone" />
      {/* carved relief band */}
      <rect x={ARCH_X1 + 30} y={y + 10} width={ARCH_X2 - ARCH_X1 - 60} height={h - 20} className="g-line" />
      {/* small frieze figures in the central panel */}
      {Array.from({ length: 9 }).map((_, i) => {
        const fx = PILLAR_L + PILLAR_W + 22 + i * 26;
        return <rect key={i} x={fx} y={y + 20} width={12} height={h - 40} rx={6} className="g-carve-soft" />;
      })}
      {/* outer frieze, left and right of the pillars */}
      {[ARCH_X1 + 60, ARCH_X1 + 100, ARCH_X1 + 140].map((fx) => (
        <circle key={fx} cx={fx} cy={cy} r={h * 0.16} className="g-carve-soft" />
      ))}
      {[ARCH_X2 - 60, ARCH_X2 - 100, ARCH_X2 - 140].map((fx) => (
        <circle key={fx} cx={fx} cy={cy} r={h * 0.16} className="g-carve-soft" />
      ))}
      {/* spiral ends */}
      <Volute cx={ARCH_X1} cy={cy} r={h / 2 + 6} />
      <Volute cx={ARCH_X2} cy={cy} r={h / 2 + 6} />
      {/* pillars pass through the beam */}
      <PillarBlock x={PILLAR_L} y={y - 4} h={h + 8} />
      <PillarBlock x={PILLAR_R} y={y - 4} h={h + 8} />
    </g>
  );
}

function Struts({ y, h, layer }: { y: number; h: number; layer: string }) {
  return (
    <g data-layer={layer}>
      {[515, 590, 665].map((x) => (
        <g key={x}>
          <rect x={x} y={y} width={20} height={h} className="g-stone" />
          <line x1={x + 10} y1={y + 6} x2={x + 10} y2={y + h - 6} className="g-line" />
        </g>
      ))}
      <PillarBlock x={PILLAR_L} y={y} h={h} />
      <PillarBlock x={PILLAR_R} y={y} h={h} />
    </g>
  );
}

/** Simple elephant silhouette facing right, drawn in a 70×60 box. */
function Elephant({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const t = flip ? `translate(${x + 70 * s} ${y}) scale(${-s} ${s})` : `translate(${x} ${y}) scale(${s})`;
  return (
    <g transform={t}>
      {[8, 20, 36, 46].map((lx) => (
        <rect key={lx} x={lx} y={34} width={9} height={24} rx={2} className="g-stone" />
      ))}
      <ellipse cx={30} cy={26} rx={26} ry={17} className="g-stone" />
      <circle cx={53} cy={20} r={13} className="g-stone" />
      <path d="M60 26 C 68 34, 66 46, 64 56 L 58 56 C 60 46, 60 38, 54 32 Z" className="g-stone" />
      <ellipse cx={47} cy={22} rx={6} ry={9} className="g-carve-soft" />
      <circle cx={57} cy={16} r={1.6} className="g-carve" />
    </g>
  );
}

function Capital({ x }: { x: number }) {
  // x = pillar left edge; capital spans slightly wider than the pillar
  return (
    <g>
      <rect x={x - 26} y={548} width={PILLAR_W + 52} height={14} className="g-stone" />
      <Elephant x={x - 24} y={488} s={1} flip />
      <Elephant x={x + PILLAR_W - 46} y={488} s={1} />
    </g>
  );
}

function Pillar({ x, layer }: { x: number; layer: string }) {
  const top = 562;
  const panels = 5;
  const ph = (1000 - top) / panels;
  return (
    <g data-layer={layer}>
      {/* upper stub between bottom architrave and capital */}
      <rect x={x} y={460} width={PILLAR_W} height={40} className="g-stone" />
      <Capital x={x} />
      {Array.from({ length: panels }).map((_, i) => (
        <PillarBlock key={i} x={x} y={top + i * ph} h={ph} />
      ))}
    </g>
  );
}

function Finials() {
  const spokes = 12;
  return (
    <g data-layer="finials">
      {/* central dharma chakra */}
      <rect x={588} y={110} width={24} height={22} className="g-stone" />
      <circle cx={600} cy={78} r={38} className="g-stone" />
      <circle cx={600} cy={78} r={30} className="g-line" />
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i / spokes) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={600 + Math.cos(a) * 7}
            y1={78 + Math.sin(a) * 7}
            x2={600 + Math.cos(a) * 30}
            y2={78 + Math.sin(a) * 30}
            className="g-line"
          />
        );
      })}
      <circle cx={600} cy={78} r={7} className="g-carve" />
      {/* triratna finials above each pillar */}
      {[PILLAR_L + PILLAR_W / 2, PILLAR_R + PILLAR_W / 2].map((cx) => (
        <g key={cx}>
          <rect x={cx - 8} y={96} width={16} height={36} className="g-stone" />
          <path
            d={`M${cx - 26} 100 C ${cx - 30} 72, ${cx - 14} 66, ${cx - 10} 82 L ${cx} 54 L ${cx + 10} 82 C ${cx + 14} 66, ${cx + 30} 72, ${cx + 26} 100 Z`}
            className="g-stone"
          />
          <circle cx={cx} cy={88} r={5} className="g-carve" />
        </g>
      ))}
    </g>
  );
}

function Figures() {
  return (
    <g data-layer="figures">
      {/* elephants standing on the outer ends of the lower beams */}
      <Elephant x={236} y={334} s={0.8} flip />
      <Elephant x={908} y={334} s={0.8} />
      <Elephant x={250} y={204} s={0.8} flip />
      <Elephant x={894} y={204} s={0.8} />
    </g>
  );
}

export default function Gate({ className, decorative = false }: { className?: string; decorative?: boolean }) {
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img", "aria-label": "A carved stone gateway (torana)" };
  return (
    <svg className={className} viewBox="0 0 1200 1000" overflow="visible" {...a11y}>
      <Struts y={200} h={60} layer="struts-upper" />
      <Struts y={330} h={60} layer="struts-lower" />
      <Figures />
      <Architrave y={130} h={70} layer="arch-top" />
      <Architrave y={260} h={70} layer="arch-mid" />
      <Architrave y={390} h={70} layer="arch-bottom" />
      <Pillar x={PILLAR_L} layer="pillar-left" />
      <Pillar x={PILLAR_R} layer="pillar-right" />
      <Finials />
    </svg>
  );
}
