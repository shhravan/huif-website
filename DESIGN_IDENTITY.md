# Design identity

The decided look of the Launch page. Every section uses these values; nothing here is redecided per section. Content decisions live in `BRIEF.md`, terms in `GLOSSARY.md`.

## Kept from the existing site

- The Logo, top left, as it is now (`public/brand/logo-cream.webp` on photographs, `logo-marine.webp` on light grounds).
- The Gate walk-through and its code (`components/GateIntro.tsx`, `Scene.tsx`, `Torana.tsx`), the content file `content/site.ts`, and the static export to GitHub Pages.

## Type

- **Display:** Eczar 400, never bold. Five sizes only: 16, 19, 26, 64 and up to 120px. Display at 120px with −0.03em tracking, headings at 64px with −0.02em.
- **Text:** Mukta 400 for reading, 500 for buttons and navigation. Body 17–19px.
- Both faces are by Indian type designers and cover Devanagari.
- Sentence case everywhere. Times use tabular figures.

## Colour

Two colours, stone and Marine, each with one muted step, modelled on the restraint of stellarmanagement.com and dwell.au. Components use only the semantic tokens in `app/globals.css`.

| Role | Colour | Use |
| --- | --- | --- |
| Ground | `#f0efeb` stone | Light sections, the top bar |
| Text | `#042d62` Marine | All text on stone; the button fill |
| Muted text | `#4a5a72` | Labels and notes on stone (6.1:1) |
| Inverse ground | `#042d62` Marine | Theme |
| Deep ground | `#021d42` | Footer |
| Inverse text | `#f0efeb` | Text on Marine (11.7:1) |
| Inverse muted | `#a7b4c8` | Notes on Marine (6.4:1) |

On photographs and Marine, the button inverts to stone with a Marine label. Photographs carry every other colour.

## Feel

Classy through restraint: two colours, very large regular-weight type, one idea per screen, generous space. Each section has its own composition: the centred statement (Context), picture beside text (About), a sticky heading beside a ledger (Questions), the timetable (Programme), a full-screen photograph (Invitation). No gradients except the legibility shade on the opening photograph, no shadows, no dividers, no captions.

Motion follows `better-ui`: buttons press to 0.96 over 150ms; sections enter once with opacity, 4px blur and 12px rise over 300ms, 100ms apart; nothing moves under reduced motion.

## Photographs

Two of the team's: the Taj Mahal Palace beside About; the carts, full width, above the Theme. After the Gate there is no photograph: the sky softens into the page and the story's first heading appears in Marine. No captions, credits or video.
