# huif-website

Website for the Harvard Undergraduate India Forum (HUIF). This branch is an experiment with the landing page: you walk through a real photograph of the Sanchi torana as you scroll.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and scroll.

## How the landing page works

1. **Opening** (`components/GateIntro.tsx`): a title card on the real gate (full logo, the forum's name and one line). Scrolling turns to the gate and walks through it; on the other side the sky softens into the site's paper and the forum's statement appears. A slim bar (`components/SiteHeader.tsx`) then stays at the top with the logo, navigation and Register interest.
2. **Sections** (`app/page.tsx`): placeholders for now.
3. **Exit** (`components/GateOutro.tsx`): the gate comes back as you walk out backwards in the same daylight, with the "Become a Part" button.
4. **Footer** (`components/SiteFooter.tsx`).

The gate is a real photograph (see `CREDITS.md`), cut out of its background, perspective-corrected, with the real paving at its base kept: `public/gate/torana-*.webp`, rendered by `components/Torana.tsx`. Behind it, `components/Scene.tsx` shows a real sky over red-sandstone paving rendered in perspective to match the gate's camera: `public/scene/day-*.webp`, shown in its natural daylight colours throughout. `scripts/` holds the image-processing scripts for reference.

Brand colours and fonts (EB Garamond, Source Sans 3) are CSS variables at the top of `app/globals.css`. Site copy lives in `content/site.ts`, apart from the design code. The logo files are in `public/brand/`.

## Preview on GitHub Pages

`.github/workflows/pages.yml` builds a static export and deploys it to GitHub Pages on pushes to `main`, `claude/zen-maxwell-7q6usi`, or `claude/amazing-keller-8tk9px`. To turn it on (one time):

1. The repo must be public (GitHub Pages on private repos needs a paid plan).
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Settings → Environments → `github-pages` → Deployment branches: add `claude/zen-maxwell-7q6usi` (or `claude/amazing-keller-8tk9px` when deploying that branch) (by default only the default branch may deploy).
4. Re-run the "Deploy preview to GitHub Pages" workflow from the Actions tab.

The site will be at `https://<owner>.github.io/huif-website/`.

## Checks

```bash
npm ci
npm run lint
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/huif-website npm run build
npx playwright install chromium
```

Serve the exported site at the same base path before running the browser checks:

```bash
mkdir -p /tmp/huif-preview
ln -s "$PWD/out" /tmp/huif-preview/huif-website
python -m http.server 3200 --directory /tmp/huif-preview
```

In another terminal:

```bash
npm run test:site -- http://localhost:3200/huif-website/
npm run perf -- http://localhost:3200/huif-website/
```

Set `BROWSER_PATH` to use an existing Chromium executable. The performance check uses
4× CPU throttling and exits unsuccessfully if p95 exceeds 25ms or more than 10% of
frames exceed 25ms; compare results on the same machine.
