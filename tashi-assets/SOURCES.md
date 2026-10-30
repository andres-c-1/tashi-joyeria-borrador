# Asset provenance — Tashi local landing

These files were downloaded from Tashi's publicly served website solely for the local Tashi concept. Confirm reuse rights and obtain higher-resolution originals before public launch. No files were changed on Tashi's site.

| Local file | Original Tashi URL |
| --- | --- |
| `logo.webp` | https://tashijoyeria.com/wp-content/uploads/2025/01/Asset-1-png.webp |
| `logo-light.webp` | https://tashijoyeria.com/wp-content/uploads/2025/01/Asset-2-png.webp |
| `logo-wordmark-light.webp` | Derivado local de `logo.webp`: se conservaron los píxeles opacos y se recolorearon a marfil para el header y footer del landing. |
| `dual-gems.webp` | https://tashijoyeria.com/wp-content/uploads/2025/04/75-1-png.webp |
| `dual-gems-render.png` | Render transparente del anillo Dual Gems entregado por la usuaria en la conversación; imagen estática protagonista del hero. |
| `ring-reference-view-1.png` | Vista de referencia del anillo entregada por la usuaria; conservada localmente para futuras revisiones. |
| `ring-reference-view-2.png` | Vista de referencia del anillo entregada por la usuaria; conservada localmente para futuras revisiones. |
| `ring-reference-view-3.png` | Vista de referencia del anillo entregada por la usuaria; conservada localmente para futuras revisiones. |
| `emerald-band.webp` | https://tashijoyeria.com/wp-content/uploads/2025/04/74-1-png.webp |
| `blue-heart.webp` | https://tashijoyeria.com/wp-content/uploads/2025/04/134-1.webp |
| `sapphire-ring.webp` | https://tashijoyeria.com/wp-content/uploads/2026/01/IMG_6912-scaled.webp |
| `chain-heart.webp` | https://tashijoyeria.com/wp-content/uploads/2026/01/TASHI17409RC.webp |
| `emerald-earrings.webp` | https://tashijoyeria.com/wp-content/uploads/2026/01/50A84370-C886-4BC2-B088-40050D00E9C8.webp |
| `clavo-bracelet.webp` | https://tashijoyeria.com/wp-content/uploads/2025/04/43-1.webp |
| `tennis-bracelet.webp` | https://tashijoyeria.com/wp-content/uploads/2026/07/78BD24DB-CA79-45C2-AC50-C8E9A9A8B011.webp |
| `story.webp` | https://tashijoyeria.com/wp-content/uploads/2025/01/469740739_18004572026700201_6724113919415499056_n-1-768x957.webp |
| `worn.webp` | https://tashijoyeria.com/wp-content/uploads/2025/01/469438238_18003989663700201_3777482712951901428_n-768x958.webp |
| `domaine.ttf` | https://tashijoyeria.com/wp-content/uploads/2025/01/Domaine-Display-Condensed-Regular.ttf |
| `sweet-sans.ttf` | https://tashijoyeria.com/wp-content/uploads/2025/01/SweetSansPro-Medium.ttf |

## Catálogo local

The 145 product images in `catalogo/` were downloaded from Tashi's public product pages on 2026-10-23, converted to WebP (maximum 1000 px, quality 82; 3.42 MB total), and renamed with their product slugs. Names, categories, descriptions and product URLs were read from the same public pages; no prices were copied. The complete per-piece mapping is in [`catalogo/FUENTES.csv`](catalogo/FUENTES.csv).

Category indexes used for the crawl:

- https://tashijoyeria.com/product-category/anillos/
- https://tashijoyeria.com/product-category/cadenas/
- https://tashijoyeria.com/product-category/dijes/
- https://tashijoyeria.com/product-category/aretes/
- https://tashijoyeria.com/product-category/topos/
- https://tashijoyeria.com/product-category/pulseras/
- https://tashijoyeria.com/product-category/argollas/
- https://tashijoyeria.com/product-category/candongas/
- https://tashijoyeria.com/product-category/nodrizas/
- https://tashijoyeria.com/product-category/rosarios/

The catalog is a local reference archive. Product photography, names and descriptions remain Tashi's; reuse rights are not confirmed. Replace them with licensed originals before any public launch.

Contact number from https://tashijoyeria.com/contacto/ : +57 302 656 6565. The WhatsApp link based on it is not verified against a business account.


## Three.js

	ashi-assets/vendor/three/ contiene three.module.min.js r170 y BufferGeometryUtils.js (MIT, ver LICENSE-three.txt). El modelo 3D del anillo es una reconstrucción procedural propia desde las vistas de referencia.
