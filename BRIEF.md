# Brief: the Launch page

What we are building now, what it says, and what it deliberately leaves out. Terms are defined in `GLOSSARY.md`.

## Sources of truth

- **`docs/website-content.md`**: final. The Theme, the About paragraph, the panels, their central questions and the Schedule. Where the panel list and the Schedule differ, the Schedule wins.
- **The narrative brief** (kept by the team, not in this repo): positioning, audience and tone. Its draft copy is a guide, not final wording.

## Facts

- Harvard Undergraduate India Forum 2027, Mumbai, 13–14 March 2027.
- Theme: India Uncharted: A Nation of Multitudes.
- 16 panels and 4 keynotes over two days, in two rooms.

## Audience

Primarily curious students and early-career professionals in India; open to anyone interested in India's future. Speakers, sponsors and press are secondary readers.

## Scope

One scrolling page, but carrying only what is confirmed.

| # | Section | Claim | Proof on the page |
| - | --- | --- | --- |
| 1 | Opening | The Forum, its Theme, Mumbai, 13–14 March 2027 | The Gate, the name and dates in large type, a "See the programme" button |
| 3 | Context | A country too complex for a single narrative | The narrative brief's opening lines |
| 4 | About | A forum to bring those perspectives together | The About paragraphs from `docs/website-content.md`; the facts |
| 5 | Questions | The questions are the Forum's identity | Five central questions, set as a ledger |
| 6 | Programme | Two days, two rooms, sixteen conversations | The Schedule as a timetable |
| 7 | Invitation | Join the conversation in Mumbai | Mumbai at dusk, the dates and the email address |
| 8 | Footer | A designed close | The name, the facts, navigation, the one required credit |

Photographs: one of the team's, used full screen (Mumbai at dusk). No captions or credits for the team's photographs.

Panel titles are shown as in the Schedule, without the "(Infra)" and "(AI)" tags. No panel count appears in headline copy.

## Deliberately left out

Registration and ticketing, speakers, statistics, audience breakdowns, press, sponsors, an email sign-up, and the India Conference at Harvard's history. Nothing is claimed that is not in the sources above.

## Process

All copy lives in one content file, separate from layout. Each section is built, screenshotted at phone and desktop width, and signed off before the next. Before shipping: phone, slow connection, accessibility and page weight.

## Shipping

`claude/amazing-keller-8tk9px` deploys to https://shhravan.github.io/huif-website/. Work happens on a working branch and is fast-forwarded there once the design-taste inspector shows 0 FAIL at 1440, 768 and 390 and the screenshots have been looked at.

## Open items

- The Day 1 closing slot reads "Closing keynote / Networking social", as in the Schedule; confirm whether these are one event or two.
- "Choose your room" (pick one panel per slot and see your own two days) as the page's one interactive element.

## Later phase

The fuller site from the narrative brief (Speakers, Attend, Venue & FAQ, Partners) once speakers, venue and ticketing are confirmed.
