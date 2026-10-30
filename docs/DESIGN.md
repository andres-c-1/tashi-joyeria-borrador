---
name: Tashi Joyería
description: Joyería de oro de 18K presentada como vitrina interactiva nocturna; fotografía real del negocio.
colors:
  olive: "#4f5948"
  olive-deep: "#3d4836"
  ivory: "#f3ebd9"
  blue: "#597182"
  blue-deep: "#47596c"
  ivory-soft: "#e9e2d2"
  ink: "#30382b"
  line: "#cecbbd"
  stage: "#141810"
  stage-lift: "#1c2218"
  accent-blue: "#8ba0b5"
  sage-light: "#cfd9c3"
  card-surface: "#e2dacb"
  hover-ivory: "#fff8e8"
typography:
  display:
    fontFamily: "Domaine, Georgia, serif"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Sweet, Arial, sans-serif"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  flat: "0px"
  soft-control: "6px"
components:
  button-primary:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.flat}"
    padding: "16px 24px"
  button-on-dark:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.olive}"
    rounded: "{rounded.flat}"
---

## Overview
Local Tashi landing at `index.html`, presented as a nocturnal jeweler's showcase ("la vitrina"). The visitor arrives at a dark stage where the supplied photorealistic Dual Gems render sits beneath giant Domaine type. The image tilts in place only while the visitor moves the mouse over it. Sections alternate dark stage and ivory; nothing here mirrors Tashi's current website layout or any other web.

## Colors
Official Tashi palette leads: olive `#4f5948`, ivory `#f3ebd9`, blue-gray `#597182`. The dark stage tokens (`stage`, `stage-lift`) are deepened shades of the official ink for the vitrine; `accent-blue` and `sage-light` are light tints of the official blue/olive for dark backgrounds; `blue-deep` darkens the official blue for small text on ivory. Gold gradients, neon accents and generic e-commerce chrome stay out.

## Typography
Domaine Display Condensed sets the giant hero title, section headings, product names and quotes. Sweet Sans Pro sets navigation, labels and body copy. Both self-hosted in `tashi-assets/`.

## Layout
The hero is a full-viewport stage: rotating story phrase in the title, supplied jewel render beneath it, caption row and quote CTA below. Sections use generous 5.5% (≤ 7% mobile) gutters and switch backgrounds dark/light to pace the reading.

The fixed header centers the Tashi wordmark. Desktop places `Colección` (with a mega-menu) and `A medida` on the left; `Historia`, `Catálogo` and `Cotizar` sit on the right. Below 1000 px the wordmark moves left and a 44 px menu button opens a full-screen ivory index with numbered links and a WhatsApp CTA.

The collection section shows six category shortcuts (Anillos, Cadenas, Dijes, Aretes, Topos, Pulseras) as a slow, continuous horizontal rail (CSS linear loop, 80 s per cycle, ~25 px/s) of tall 3:4 cards with one photo and a piece count each. It pauses on hover or keyboard focus and has a visible Pausar/Reanudar control; with reduced motion it becomes a static, scrollable row; every tile opens `catalogo/index.html#capitulo-…` already filtered. A footer line names the smaller categories and links the full catalog. The landing presents; the catalog shows the pieces. The hero has one primary CTA plus "Ver de cerca"; the story phrase changes every 4.5 s and only once per phrase per session.

## Catalog
`catalogo/` is a calm product index, same fonts and palette. Short hero (title + one line), sticky search and category filters, one heading per category with its count, and a uniform 4/3/2-column grid of 4:5 photos with only name and materials. The detail dialog shows category, reference, materials, the catalog description when it adds information, the quote CTA and previous/next. Backgrounds: dark stage hero (as the landing), alternating warm bands per visible category, olive closing band. Motion is limited to: cards fade/rise 8px once on entering view (300ms, 50ms stagger), a sliding active-filter underline (250ms), a 160ms fade on filter change, and a 200ms slide between pieces in the dialog; reduced motion keeps only fades. No prices, cart or stock claims. Quote links hand the piece to `index.html?pieza=…&ref=…#cotizar`. Edit `template.html` or `piezas.json` and run `python catalogo/build.py`.

## Elevation & Depth
Depth comes from the supplied transparent product render, a restrained soft shadow and subtle mouse-driven perspective tilt. Do not invent views or ring details that are absent from the approved rendering. An experimental 3D ring is archived in `_archivo-3d/` (not used).

## Motion
Hero jewel has no idle motion: it tilts only in response to mouse position and eases back to its neutral pose when the pointer leaves. Reduced-motion and coarse-pointer devices keep the render still. The Spanish hero phrase cycles through brand storytelling lines every two seconds, with reduced-motion disabling the cycle.

## Shapes
Rectangular controls and crisp frames remain the default. Hero/header actions use a restrained 6px soft-control radius; no pill shapes, decorative glass, raised cards, or generic jewelry-gold gradients.

## Components
Primary CTA: olive rectangle with ivory copy; on dark surfaces reverse to ivory/olive. Secondary: underline links. The supplied ring rendering sits below the hero headline with optional detail zoom and cursor-rotation controls. Form fields are ivory-outlined inputs on dark; the submit button is ivory. The fixed header is transparent over the stage and becomes an ivory bar after 46 px of scroll; its mega-menu is an ivory panel with an intro column, three recommended pieces, a catalog search gateway and a full-catalog link. The catalog reuses rectangular buttons, 44 px minimum targets, a sticky toolbar, underline filters, numbered chapter heads and a paper detail sheet. Focus rings, keyboard navigation and reduced-motion support are required.

## Do's and Don'ts
- Use only confirmed product facts, approved real jewelry images and real contact channels.
- Preserve Tashi's typography, logo and palette; keep the jewel cutout faithful to the original photograph (no invented angles).
- The catalog is an archive, not a shop: never add prices, discounts, stock claims, reviews or sales counts.
- The WhatsApp link prepares a message; never promise the number is live.
- Do not edit, sync or deploy to Lovable or the live Tashi website.
