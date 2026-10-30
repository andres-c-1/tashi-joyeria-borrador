# Tashi Joyería — sitio local

> **Borrador de diseño, no es el sitio oficial de Tashi Joyería.** Es una propuesta de rediseño para revisión. Las fotos, nombres y descripciones pertenecen a Tashi Joyería y provienen de su sitio público; no se confirmó su reutilización. No está indexado en buscadores.

Sitio estático independiente de **Tashi Joyería**, separado del proyecto Qatro. Incluye el landing editorial y el catálogo **El archivo**. No necesita React, TanStack, Supabase ni ninguna parte de Qatro.

## Abrir el sitio

En Windows, haz doble clic en **`iniciar.bat`**. Se abre:

<http://127.0.0.1:4173/>

También puedes ejecutar:

```powershell
python servir.py
```

El servidor local es la forma recomendada de verlo: las fuentes, las imágenes y el catálogo se cargan con rutas relativas.

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` o `/index.html` | Landing de Tashi |
| `/catalogo/index.html` | Catálogo completo, 145 piezas |
| `/catalogo/index.html?q=esmeralda#buscar` | Búsqueda dentro del catálogo |
| `/index.html?pieza=...&ref=...#cotizar` | Handoff de una pieza al formulario de cotización |
| `/tashi.html` | Alias de compatibilidad que redirige al landing |

## Estructura

```text
Tashi/
  index.html                 landing
  tashi.css                  estilos del landing
  tashi.js                   header, menú, carrusel, formulario
  tashi.html                 alias de compatibilidad
  catalogo/
    index.html               catálogo generado (145 piezas)
    catalogo.css             sistema visual de El archivo
    catalogo.js              búsqueda, filtros y ficha
    template.html            plantilla fuente del catálogo
    piezas.json              datos de las 145 piezas
    build.py                 regenera index.html: python catalogo/build.py
  tashi-assets/
    ...                      fuentes, logos, fotos y render del hero
    catalogo/                145 imágenes WebP + FUENTES.csv
    SOURCES.md               procedencia y advertencia de derechos
  docs/
    DESIGN.md                contrato visual
    PRODUCT.md               contexto del producto
    tashi-surface.md         brief de dirección
    capturas/qa/             capturas de verificación
  servir.py                  servidor local
  iniciar.bat                lanzador para Windows
```

## Qué se separó

- El landing, el catálogo, sus estilos, scripts, fuentes e imágenes.
- La documentación de diseño y producto específica de Tashi.
- Las capturas de verificación del rediseño.
- No se copió nada del SaaS de Qatro: rutas React, Supabase, motor, app autenticada, marketing de Qatro ni configuraciones del proyecto.
- El proyecto Qatro quedó sin archivos de Tashi; su portada vuelve a servir `public/qatro.html`.

## Anillo 3D

Un experimento en 3D (Three.js) quedó archivado en `_archivo-3d/`; el hero usa el render PNG aprobado.

## Antes de publicar

- **Derechos:** las fotos, nombres y descripciones provienen del sitio público de Tashi. La reutilización no está confirmada; reemplázalos por originales licenciados antes de un lanzamiento público.
- **WhatsApp:** el enlace usa `+57 302 656 6565`, el número publicado en la página de contacto de Tashi. No está verificado contra una cuenta de WhatsApp activa; no prometas que el número responde.
- **Sin tienda:** el catálogo es un archivo de referencia. No hay precios, carrito, checkout, stock ni reseñas.
- **Sin despliegue:** este paquete es local. No se publicó ni se sincronizó con Lovable ni con el sitio en vivo de Tashi.

## Verlo en línea (GitHub Pages)

1. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
2. Tras 1–2 minutos, queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.
3. Para quitarlo, pon el repositorio en privado o desactiva Pages.