# Working on this repo

## Git
- Commit as the owner, so the work counts on their GitHub contribution graph:
  `git config user.name "Shravan Lad"` and `git config user.email "99530931+shhravan@users.noreply.github.com"`.
- Work lands on `main` by default: commit there (or merge into it with a merge commit, never a squash) and push `main`.
  Pushing `main` deploys the site (`.github/workflows/pages.yml`) to https://shhravan.github.io/huif-website/.

## Tests
- `npm test`: the Opening script's order (fast unit tests, tests/opening.test.ts).
- `npm run test:browser`: checks on the built site (run `npm run build` first). Both run before every deploy.

## Working together (keeps sessions cheap)
- Check work with measurements (opacity, positions, overflow, pixel counts) first. Screenshot only the final state, downscaled, and only when it is a visual judgement.
- For a visual change with no clear spec, offer 2–3 options in words and let the owner pick before building.
- When feedback is vague ("it looks weird"), ask what and where (screen width, scroll position, element) before changing anything.
- Run review skills on one section at a time, not the whole site.
- Make the smallest change that fixes the problem. Stop long test runs once the answer is clear.
- At a natural milestone (a feature shipped), suggest starting a fresh session; this file, BRIEF.md and DESIGN_IDENTITY.md carry the context.
