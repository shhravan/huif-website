import { asset } from "@/lib/asset";

/**
 * Behind the gate: a real sky (Poly Haven pure-sky photograph, CC0) over red-sandstone
 * paving rendered in true perspective from a real texture (Poly Haven, CC0), with the
 * same eye height and horizon as the gate photo (horizon 76% down the frame; object-position
 * keeps it there at any screen size). Shown in its natural daylight colours.
 * See scripts/render_plate.py.
 */
export function ScenePlate() {
  const big = asset("/scene/day-2880.webp");
  const small = asset("/scene/day-1600.webp");
  return (
    <div className="scene__back" aria-hidden="true">
      <img className="scene__plate" src={big} srcSet={`${small} 1600w, ${big} 2880w`} sizes="100vw" alt="" draggable={false} />
      <div className="scene__haze" />
    </div>
  );
}
