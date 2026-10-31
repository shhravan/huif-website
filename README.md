# Harvard India Conference 2027 website

Static site for the first Harvard India Conference held in India (March 2027), led by Harvard undergraduates. No build step or dependencies.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Edit content

- `index.html`: all copy. Search for `TODO` to find every placeholder (dates, venue, speakers, schedule, team, sponsors, FAQ, contact email, social links, registration link, footer disclaimer).
- `styles.css`: colors are CSS variables at the top (`--crimson`, etc.).
- `script.js`: mobile menu, schedule tabs, and the countdown. Set `data-date` on the `<section class="hero">` (e.g. `2027-03-20T09:00:00+05:30`) to turn the countdown on.

## Deploy

Any static host works. Point it at the repo root with no build command (Vercel, Netlify, Cloudflare Pages, or GitHub Pages).
