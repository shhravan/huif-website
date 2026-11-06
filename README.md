# huif-website

Experimental scroll-driven intro: the site opens on a Sanchi-style torana (gate) and you "walk through" it as you scroll. On the other side the gate returns as a small logo mark above the title.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and scroll.

## Where things live

- `components/GateIntro.tsx`: the pinned scroll section and the GSAP ScrollTrigger timeline (all timing is here).
- `components/Gate.tsx`: the gate as a layered SVG. Each part (pillars, architraves, finials) is its own `data-layer` group.
- `components/Backdrop.tsx`: the ground, path and sunrise glow behind the gate.
- `app/globals.css`: placeholder brand colours and fonts as CSS variables at the top of the file.

## Swapping in brand assets

- Colours and fonts: edit the variables in `:root` in `app/globals.css`.
- Gate / logo: redraw the groups in `Gate.tsx` from the logo artwork, keeping the `data-layer` names so the animation still targets them. The same component is used for both the big gate and the small logo mark at the end.
- Name and tagline: in `GateIntro.tsx` (`.intro-name` at the start, `.hero__text` at the end).

Users with "reduce motion" turned on get the arrival state (logo mark + title) as a static hero, with no pinned scroll.
