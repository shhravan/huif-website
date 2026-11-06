# huif-website

Experimental scroll-driven intro: you "walk through" a Sanchi-style torana (gate) as you scroll, and the stupa is revealed behind it.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and scroll.

## Where things live

- `components/GateIntro.tsx`: the pinned scroll section and the GSAP ScrollTrigger timeline (all timing is here).
- `components/Gate.tsx`: the gate as a layered SVG. Each part (pillars, architraves, finials) is its own `data-layer` group.
- `components/Sanctuary.tsx`: the stupa, ground and sun glow behind the gate.
- `app/globals.css`: placeholder brand colours and fonts as CSS variables at the top of the file.

## Swapping in brand assets

- Colours and fonts: edit the variables in `:root` in `app/globals.css`.
- Logo stupa: replace the `data-layer="stupa"` group in `Sanctuary.tsx` (same 1200×1000 coordinate space; the base sits at y ≈ 900, centred on x = 600).
- Gate: if the logo has its own torana, replace the groups in `Gate.tsx` but keep the `data-layer` names so the animation still targets them.

Users with "reduce motion" turned on get a static hero with no pinned scroll.
