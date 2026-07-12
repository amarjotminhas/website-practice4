# Meridian Interior Group — Demo Website

A **fictional**, production-structured marketing website for a made-up 100% employee-owned commercial interior construction firm. Built as a static site with no build step and no dependencies. CSS/JS/favicon are self-contained; photography is loaded from Unsplash's CDN (the only external requests), so an internet connection is needed for images to appear.

> ⚠️ **Fiction notice.** Meridian Interior Group and all of its people, projects, statistics, addresses, phone numbers, and emails are invented for design/demonstration purposes. It is not a real company and does not impersonate one. The layout is an original reinterpretation of common commercial-construction site patterns.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, stats, services, locations, portfolio, ESOP, insights, FAQ, CTA |
| `services.html` | Five sector deep-dives + preconstruction process |
| `projects.html` | Filterable portfolio (region × sector) |
| `locations.html` | Seven offices + stylized coverage map |
| `about.html` | Story/timeline, values, employee ownership, leadership, recognition |
| `contact.html` | Validated multi-field contact form + office details |
| `404.html` | Custom not-found page |

## Shared assets

- `assets/css/styles.css` — all design tokens, light/dark themes, and components
- `assets/js/main.js` — theme toggle (persisted), mobile nav, scroll reveal, portfolio filtering, blueprint thumbnail generator, hero canvas, and form validation
- `assets/favicon.svg` — meridian/coordinate mark
- `robots.txt`, `sitemap.xml` — SEO basics

## Design system

- **Concept:** surveyor / blueprint identity derived from the name "Meridian" (coordinate labels, hairline grids, generated floor-plan thumbnails).
- **Color:** warm concrete paper, structural ink, single copper accent (`#BD5B33`). Full light + dark theming via CSS custom properties.
- **Type:** grotesque display + sans body + monospace utility face (eyebrows, labels, coordinates).
- **A11y:** skip link, keyboard-focus styles, `aria-current` nav state, `prefers-reduced-motion` handling, semantic landmarks.

## Run locally

No build required — it's plain HTML/CSS/JS. Serve the folder over HTTP (needed so relative asset paths and the `fetch`-free JS resolve cleanly):

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000/>.

You can also just double-click `index.html` to open it directly in a browser.

## Deploy

Drop the whole folder onto any static host — Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3 + CloudFront, or any plain web server. No server-side code, environment variables, or database needed.

### To make it truly production for a real business, you would still:
1. Replace all fictional copy, names, and figures with real content.
2. Swap the Unsplash stock photos for licensed real project photography (self-host them under `assets/` for performance and reliability).
3. Wire the contact form to a backend or form service (e.g. Formspree, Netlify Forms) — currently it validates client-side and shows a success state without sending data.
4. Add real legal pages (Privacy Policy, Terms), analytics, and a proper domain.
5. Generate real Open Graph share images.
