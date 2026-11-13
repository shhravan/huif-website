# Design identity

The decided look of the Launch page. Every section uses these values; nothing here is redecided per section. Content decisions live in `BRIEF.md`, terms in `GLOSSARY.md`.

## Kept from the existing site

- The Logo, top left, as it is now (`public/brand/logo-cream.webp` on photographs, `logo-marine.webp` on light grounds).
- The Gate walk-through and its code (`components/GateIntro.tsx`, `Scene.tsx`, `Torana.tsx`), the content file `content/site.ts`, and the static export to GitHub Pages.

## Type

- **Display:** Eczar 400, never bold. Seven sizes, all tokens in `app/globals.css`: small 16, body 19, lead 22, sub 29, title 44, head 64, display 89 (at 1440px; each scales down to 16 / 17 / 18 / 22 / 26 / 36 / 42 on a 390px phone, so display always outranks head). Display with −0.03em tracking, headings with −0.02em. Only the footer wordmark and two phone labels set their own size.
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
| Inverse ground | `#042d62` Marine | About (the Sea Link), Theme, Programme, the footer; one Marine everywhere |
| Inverse surface | `#173d6d` | The unselected day tab on the Programme, one step up from Marine; sessions are stone boxes with Marine text |
| Inverse text | `#f0efeb` | Text on Marine (11.7:1) |
| Inverse muted | `#a7b4c8` | Notes on Marine (6.4:1) |

On photographs and Marine, the button inverts to stone with a Marine label. Photographs carry every other colour.

## Feel

Classy through restraint: two colours, very large regular-weight type, one idea per screen, generous space. Sections alternate stone and Marine (Context stone, About Marine, Theme Marine after the carts photograph, Panels stone, Programme Marine, then the footer). Each section has its own composition: the centred statement (Context), picture beside text (About), a sticky heading beside a ledger (Questions), the timetable (Programme), a full-screen photograph (Invitation). No gradients except the legibility shade on the opening photograph, no shadows, no dividers, no captions.

The Programme is the one soft surface: its sessions are stone cards with 14px corners (10px on phones), and the day switch is a pill with a stone marker that slides to the chosen day.

Motion follows `better-ui`: buttons press to 0.96 over 150ms; sections enter once with opacity, 4px blur and 12px rise over 300ms, 100ms apart; nothing moves under reduced motion.

## Photographs

Two of the team's: the carts, full width, above the Theme; and the Sea Link at night, sampled into about 21,000 points drawn crisp at device pixels across the whole About section. The bridge stays still; impulses of light run along it, each lighting a short stretch of one lane of points and travelling on. Nothing follows the cursor (no movement under reduced motion; paused off screen). Points behind the text are drawn faint. After the Gate there is no photograph: the sky softens into the page and the story's first heading appears in Marine. No captions, credits or video.
