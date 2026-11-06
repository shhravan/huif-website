import { asset } from "@/lib/asset";

/**
 * Behind the gate: a real sky (Poly Haven pure-sky photographs, CC0) over red-sandstone
 * paving rendered in true perspective from a real texture (Poly Haven, CC0), with the
 * same eye height and horizon as the gate photo (horizon 76% down the frame; object-position
 * keeps it there at any screen size). Two lightings: blue hour (dawn) and morning (day).
 * See scripts/render_plate.py.
 */
function Plate({ name, className }: { name: "dawn" | "day"; className: string }) {
  const big = asset(`/scene/${name}-2880.webp`);
  const small = asset(`/scene/${name}-1600.webp`);
  return <img className={`scene__plate ${className}`} src={big} srcSet={`${small} 1600w, ${big} 2880w`} sizes="100vw" alt="" draggable={false} />;
}

export function ScenePlate() {
  return (
    <div className="scene__back" aria-hidden="true">
      <Plate name="dawn" className="scene__plate--dawn" />
      <Plate name="day" className="scene__plate--day" />
      <div className="scene__haze" />
    </div>
  );
}

/** Soft sunrise warmth over the whole scene. */
export function SceneGrades() {
  return (
    <div className="scene__grades" aria-hidden="true">
      <div className="scene__warm" />
    </div>
  );
}
