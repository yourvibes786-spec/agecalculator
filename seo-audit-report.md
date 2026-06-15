# SEO Audit Report — Age Calculator

**Date:** June 15, 2026
**Project:** Age Calculator (Astro)
**Domain:** https://agecalculatordob.pages.dev

---

## 1. Unique `<title>` tags per page

| Page | Title | Status |
|---|---|---|
| `/` | "Age Calculator Online – Calculate Exact Age by Date of Birth" | Unique |
| `/about/` | "About Us — Age Calculator \| Our Mission & Privacy Promise" | Unique |
| `/contact/` | "Contact Us — Age Calculator \| Get in Touch" | Unique |
| `/privacy/` | "Privacy Policy — Age Calculator \| 100% Local, No Data Collection" | Unique |
| `/terms/` | "Terms of Service — Age Calculator \| Usage Guidelines" | Unique |
| `/404/` | "Page Not Found — Age Calculator" | Unique |
| `/500/` | "Server Error — Age Calculator" | Unique |

**PASS** — All 7 pages have unique, descriptive title tags.

---

## 2. Meta descriptions per page

| Page | Description | Status |
|---|---|---|
| `/` | `Calculate your exact age instantly...` | Present |
| `/about/` | `Learn about the Age Calculator project...` | Present |
| `/contact/` | `Get in touch with the Age Calculator team...` | Present |
| `/privacy/` | `Privacy policy for the Age Calculator...` | Present |
| `/terms/` | `Terms of service for the Age Calculator...` | Present |
| `/404/` | `Oops! The page you are looking for could not be found.` | Present |
| `/500/` | `An unexpected error occurred...` | Present |

**PASS** — All 7 pages have a meta description.

---

## 3. Canonical URLs on all pages

| Page | Canonical | Status |
|---|---|---|
| `/` | `https://agecalculatordob.pages.dev/` | ✓ |
| `/about/` | `https://agecalculatordob.pages.dev/about/` | ✓ |
| `/contact/` | `https://agecalculatordob.pages.dev/contact/` | ✓ |
| `/privacy/` | `https://agecalculatordob.pages.dev/privacy/` | ✓ |
| `/terms/` | `https://agecalculatordob.pages.dev/terms/` | ✓ |
| `/404/` | `https://agecalculatordob.pages.dev/` (inherited from Layout) | ✓ |
| `/500/` | `https://agecalculatordob.pages.dev/` (inherited from Layout) | ✓ |

**PASS** — All pages have a canonical tag; error pages inherit the homepage canonical (acceptable).

---

## 4. H1 tags

| Page | H1 content | Status |
|---|---|---|
| `/` | "Discover your time on Earth." | ✓ |
| `/about/` | "About Age Calculator" | ✓ |
| `/contact/` | "Contact Us" | ✓ |
| `/privacy/` | "Privacy Policy" | ✓ |
| `/terms/` | "Terms of Service" | ✓ |
| `/404/` | "Page Not Found" | ✓ |
| `/500/` | "Something Went Wrong" | ✓ |

**PASS** — Every page has exactly one `<h1>`.

---

## 5. Internal links

| Source file | Links to | Status |
|---|---|---|
| `Footer.astro` | `/`, `/about/`, `/contact/`, `/privacy/`, `/terms/` | ✓ |
| `AgeCalculator.astro` (trust bar) | `/about/`, `/contact/`, `/privacy/`, `/terms/` | ✓ |
| `index.astro` (SEO content) | `/about/`, `/contact/`, `/privacy/`, `/terms/` | ✓ |
| `about.astro` | `/` (breadcrumb + back button) | ✓ |
| `contact.astro` | `/` (breadcrumb + back button) | ✓ |
| `privacy.astro` | `/` (breadcrumb + back button) | ✓ |
| `terms.astro` | `/` (breadcrumb + back button) | ✓ |
| `404.astro` | `/` (back button) | ✓ |
| `500.astro` | `/` (back button) | ✓ |

**PASS** — All internal `href` values resolve to existing pages. All use consistent trailing-slash format.

---

## 6. Sitemap.xml includes all public pages

| URL in sitemap | Status |
|---|---|
| `https://agecalculatordob.pages.dev/` | ✓ |
| `https://agecalculatordob.pages.dev/about/` | ✓ |
| `https://agecalculatordob.pages.dev/contact/` | ✓ |
| `https://agecalculatordob.pages.dev/privacy/` | ✓ |
| `https://agecalculatordob.pages.dev/terms/` | ✓ |

**PASS** — All 5 public pages included. 404/500 correctly excluded.

---

## 7. robots.txt validity

- ✓ `User-agent: *` with `Allow: /` — allows all crawlers
- ✓ `Sitemap:` URL points to existing `sitemap.xml`
- ✓ No syntax errors

**PASS**

---

## 8. Open Graph tags

| Property | Status |
|---|---|
| `og:type` | Present on all pages (`website` or `ogType` prop) |
| `og:url` | Present on all pages (= canonical) |
| `og:title` | Present on all pages (= title) |
| `og:description` | Present on all pages (= description) |
| `og:site_name` | Present (Layout: "Age Calculator") |
| `og:locale` | Present (Layout: `en_US`) |
| `og:image` | Present on all pages, but... |

**WARNING** — `og:image` is set to `https://agecalculatordob.pages.dev/og-image.png` on every page (via Layout default and passed prop on index.astro), but **the file `public/og-image.png` does not exist**. All social share previews will break. Create the image and place it at `public/og-image.png` (1200×630px recommended).

---

## 9. No broken internal routes

All internal routes resolve to existing `.astro` files:
- `/` → `index.astro` ✓
- `/about/` → `about.astro` ✓
- `/contact/` → `contact.astro` ✓
- `/privacy/` → `privacy.astro` ✓
- `/terms/` → `terms.astro` ✓

**PASS**

---

## 10. Additional issues found

**FAIL** — Error pages (`404.astro`, `500.astro`) inherit the `index, follow` robots meta from `Layout.astro:36`. They should use `noindex` to prevent Google from indexing them. Solution: either pass `robots="noindex"` as a Layout prop and conditionally render the meta tag, or set `<meta name="robots" content="noindex">` directly in the error page frontmatter.

---

## Summary

| # | Check | Result |
|---|---|---|
| 1 | Unique title tags | **PASS** |
| 2 | Meta descriptions | **PASS** |
| 3 | Canonical URLs | **PASS** |
| 4 | H1 tags | **PASS** |
| 5 | Internal links | **PASS** |
| 6 | Sitemap coverage | **PASS** |
| 7 | robots.txt | **PASS** |
| 8 | Open Graph tags | **WARNING** — `og-image.png` missing |
| 9 | Broken routes | **PASS** |
| 10 | Additional issues | **FAIL** — 404/500 pages have `index, follow`; should be `noindex` |

**1 FAIL, 1 WARNING** to fix before deployment.
