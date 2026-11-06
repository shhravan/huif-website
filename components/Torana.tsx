import { asset } from "@/lib/asset";

/**
 * The east gateway (torana) of the Great Stupa at Sanchi: a real photograph, cut out
 * from its background so it can stand in our own sky.
 *
 * Photo: "Front View of Gate" by Photo Dharma, CC BY 2.0 (Wikimedia Commons).
 * Edited: background removed, colour warmed. See CREDITS.md.
 *
 * Aspect ratio 0.682 (w/h). The centre of the walk-through opening sits at
 * 49.1% across and 68.3% down; GateIntro/GateOutro scale around that point.
 *
 * `.torana__shade` is a copy of the gate's silhouette (via CSS mask) filled with the
 * night colour, so the stone can be darkened for night and lit for dawn cheaply.
 */
export default function Torana({ className = "" }: { className?: string }) {
  const src = asset("/gate/torana-2400.webp");
  const srcSmall = asset("/gate/torana-1400.webp");
  return (
    <div className={`torana ${className}`} style={{ ["--torana-mask" as string]: `url(${srcSmall})` }}>
      <img
        className="torana__img"
        src={src}
        srcSet={`${srcSmall} 1400w, ${src} 2400w`}
        sizes="(orientation: portrait) 90vw, 60vh"
        alt="The carved east gateway of the Great Stupa at Sanchi"
        draggable={false}
        fetchPriority="high"
      />
      <div className="torana__shade" aria-hidden="true" />
    </div>
  );
}
