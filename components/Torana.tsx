import { asset } from "@/lib/asset";

/**
 * The east gateway (torana) of the Great Stupa at Sanchi: a real photograph, cut out
 * from its background, perspective-corrected, with the real paving at its base kept and
 * feathered into the scene's paving. See CREDITS.md and scripts/build_assets.py.
 *
 * Image geometry (fractions of the image box):
 *   aspect 0.6265 · eye-level line 75.3% down · walk-through opening centre 49.1% / 62.8%
 */
export default function Torana({ className = "" }: { className?: string }) {
  const src = asset("/gate/torana-2400.webp");
  const srcLarge = asset("/gate/torana-3200.webp");
  const srcSmall = asset("/gate/torana-1400.webp");
  return (
    <div className={`torana ${className}`}>
      <img
        className="torana__img"
        src={src}
        srcSet={`${srcSmall} 1400w, ${src} 2400w, ${srcLarge} 3200w`}
        // larger than its on-screen size on purpose: the gate is zoomed ~9x during the walk-through
        sizes="(orientation: portrait) 96vw, 160vh"
        alt="The carved east gateway of the Great Stupa at Sanchi"
        draggable={false}
        fetchPriority="high"
      />
    </div>
  );
}
