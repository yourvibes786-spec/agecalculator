# TODO - Footer cleanup (single Footer.astro)

- [ ] Remove old footer markup from `src/components/AgeCalculator.astro`
  - [ ] Remove the “Privacy Footer” block inside the form
  - [ ] Remove the bottom “Footer block” `<footer>...</footer>`
- [ ] Verify each page renders exactly one footer via `<Footer />`
  - [ ] `src/pages/index.astro`
  - [ ] `src/pages/about.astro`
  - [ ] `src/pages/contact.astro`
  - [ ] `src/pages/privacy.astro`
  - [ ] `src/pages/terms.astro`
  - [ ] `src/pages/404.astro`
  - [ ] `src/pages/500.astro`
- [ ] Search for any remaining `<footer` markup in the listed files
- [ ] Run `npm` build check (optional) to ensure Astro compiles
