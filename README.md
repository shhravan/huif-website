# huif-website

Website for the Harvard Undergraduate India Forum (HUIF). This branch is an experiment with the landing page: you walk through a real photograph of the Sanchi torana as you scroll.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and scroll.

## How the landing page works

1. **Entrance** (`components/GateIntro.tsx`): the torana at night. Scrolling walks you through its opening while dawn breaks. Then "Harvard Undergraduate" and "India Forum" slide in from opposite sides and meet.
2. **Sections** (`app/page.tsx`): placeholders for now.
3. **Exit** (`components/GateOutro.tsx`): the gate comes back as you walk out backwards, at dusk, with the "Become a Part" button.
4. **Footer** (`components/SiteFooter.tsx`).

The gate is a real photograph (see `CREDITS.md`), cut out of its background and saved as `public/gate/torana-2400.webp` (desktop) and `torana-1400.webp` (mobile). `components/Torana.tsx` renders it; the darker "night" look is a masked overlay, so there is only one image to download.

Brand colours and fonts are CSS variables at the top of `app/globals.css`.

## Preview on GitHub Pages

`.github/workflows/pages.yml` builds a static export and deploys it to GitHub Pages on every push to this branch. To turn it on (one time):

1. The repo must be public (GitHub Pages on private repos needs a paid plan).
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Settings → Environments → `github-pages` → Deployment branches: add `claude/amazing-keller-8tk9px` (by default only the default branch may deploy).
4. Re-run the "Deploy preview to GitHub Pages" workflow from the Actions tab.

The site will be at `https://<owner>.github.io/huif-website/`.
