# Working on this repo

## Git
- Commit as the owner, so the work counts on their GitHub contribution graph:
  `git config user.name "Shravan Lad"` and `git config user.email "99530931+shhravan@users.noreply.github.com"`.
- Work lands on `main` by default: commit there (or merge into it with a merge commit, never a squash) and push `main`.
  Pushing `main` deploys the site (`.github/workflows/pages.yml`) to https://shhravan.github.io/huif-website/.

## Tests
- `npm test`: the Opening script's order (fast unit tests, tests/opening.test.ts).
- `npm run test:browser`: checks on the built site (run `npm run build` first). Both run before every deploy.

## How to work
- Make the smallest change that fully works, and say what you skipped. Exception: when exploring a design, offer real alternatives.
- Check with tests or measurements; take at most one screenshot, at the end.
- Every fixed bug gets a test the same day.
