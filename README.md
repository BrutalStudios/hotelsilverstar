# Silver Star - Luxury Banquet Hall Website (Amravati)

A fast, SEO-optimized, 3D-styled marketing website for **Silver Star Celebration Hall**,
Rahatgaon Road, Amravati, Maharashtra. Built as a single static page, no build step,
no framework. Just open `index.html`.

## Structure

```
SilverStar/
├── index.html             # The whole website (all sections)
├── assets/
│   ├── css/styles.css      # Design system & styles
│   ├── js/main.js          # 3D star-field + all interactions
│   ├── favicon.svg         # Scalable star favicon
│   ├── silver-star-logo.jpg# Real logo (from the Instagram profile)
│   └── images/             # Photos (SEO-friendly filenames)
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── README.md
```

## Run it locally

Double-click `index.html`, **or** serve it (recommended, so maps/fonts behave):

```bash
cd SilverStar
python3 -m http.server 8080
# then open http://localhost:8080
```

## Photos & logo (mostly real)

The hero, About, all three Spaces cards, the full Gallery and the closing CTA now use
**genuine high-resolution Silver Star photos** (1400px, sourced from the venue's
Booking.com listing): the 8,000 sq ft banquet hall, the atrium with the over-pool bridge,
the grand entrance, the reception, lounge seating and a luxury guest room. The nav/footer
**logo** is the real logo taken from the [Instagram profile](https://www.instagram.com/silverstar.amravati/).

The only stock images left are the six **occasion cards** (Weddings, Receptions, Sangeet,
Engagement, Birthday, Corporate), which illustrate event *types* rather than the venue.
To replace any image, drop your own file into `assets/images/` using the **same filename**.

## Before you publish - confirm these

| What | Where | Notes |
|------|-------|-------|
| **Phone number** `7744948027` | `index.html` (search `7744948027`) + `assets/js/main.js` (`WHATSAPP`) | Used for call links **and** the WhatsApp enquiry form. Update both places if it changes. |
| **Email** `silverstar.reservations@gmail.com` | `index.html` | Confirm this is monitored. |
| **Domain** `https://www.silverstaramravati.com/` | `index.html` (canonical/OG), `robots.txt`, `sitemap.xml` | Replace with the real domain so SEO tags + social previews work. |
| **Reviews** | `index.html` -> `#reviews` + JSON-LD | These are **real Google reviews** (4.6 stars / 270+ reviews) captured from the venue's Google listing, with a "Read them all on Google" link and matching `AggregateRating`/`Review` structured data. They are a snapshot, so refresh them occasionally, or add a free live widget (Trustindex/Elfsight) to keep them auto-updating. |
| **Facts** (8,000 sq ft, 50 rooms, terrace lawn, over-pool bridge, sound-proof DJ) | `#stats`, `#about`, `#spaces`, `#amenities`, JSON-LD | Taken from the venue's own Instagram bio. Adjust if any detail changes. |
| **Map pin** | `#contact` link + JSON-LD `hasMap` | Uses the venue's real Google Maps link (`maps.app.goo.gl/AU8w5ExR8ZX4ToH77`). The embedded map searches by name; for a pixel-perfect pin paste a Maps "embed" iframe and set `latitude`/`longitude` in the JSON-LD. |

## SEO included

- Optimized `<title>` and meta description targeting *"banquet hall in Amravati",
  "wedding venue Amravati", "marriage hall Rahatgaon road"*.
- Open Graph + Twitter Card tags (rich link previews on WhatsApp/Facebook/Instagram),
  with image dimensions for reliable large cards.
- **Structured data (JSON-LD):** `EventVenue` + `LocalBusiness` (address, geo, phone,
  hours, real amenities, social profiles, slogan) and a `FAQPage`, eligible for Google
  rich results. No fake review/rating markup.
- Semantic HTML5, single `<h1>`, descriptive `alt` text on every image, lazy-loading.
- `robots.txt`, `sitemap.xml`, `canonical`, `theme-color`, web manifest, SVG favicon.
- `lang="en-IN"` and `geo.*` meta for local search.

### Recommended next SEO steps
1. Point the real domain and update all URLs (see table above).
2. Create / claim the **Google Business Profile** for Silver Star and make the
   name/address/phone match this site **exactly**.
3. Submit `sitemap.xml` in **Google Search Console**.
4. Validate structured data at <https://search.google.com/test/rich-results>.

## The "3D look"

- A live **Three.js** golden/silver star-field drifts in 3D behind the page and reacts
  to mouse movement (auto-disabled for reduced-motion users and on WebGL failure, with
  the page still looking great).
- **3D tilt** on the venue/event cards, parallax hero, glassmorphism nav, animated gold
  gradient text, scroll-reveal animations, animated counters and a gallery lightbox.

## Accessibility & performance
- Keyboard-navigable: skip link, focus states, lightbox focus-trap + arrow keys + ESC,
  Escape closes the mobile menu, accessible form validation.
- Respects `prefers-reduced-motion`; pausable testimonial slider.
- All images lazy-loaded except the hero; no heavy frameworks.

## Notes
- No em dashes are used anywhere in the site copy.
- Real venue photos courtesy of the Silver Star Booking.com listing; logo from the
  official Instagram profile. Swap in your own originals anytime for the sharpest result.
