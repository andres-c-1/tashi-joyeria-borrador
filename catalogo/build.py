"""Genera catalogo/index.html a partir de template.html y piezas.json.

Uso: python catalogo/build.py
"""
import html
import json
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent


def slug(text):
    text = unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode()
    return "-".join(text.lower().split())


def card(item, index):
    name = html.escape(item["name"])
    search = html.escape(" ".join([item["name"], item["category"], item["materials"], item.get("description") or ""]).lower())
    return f"""<article class="plate" data-category="{html.escape(item['category'])}" data-index="{index}" data-search="{search}">
  <button class="plate-button" type="button" data-open="{index}" aria-haspopup="dialog" aria-label="Ver {name}">
    <span class="plate-media"><img src="{item['image']}" width="{item.get('w', 800)}" height="{item.get('h', 800)}" alt="{name} de Tashi" loading="lazy" decoding="async"></span>
    <span class="plate-name">{name}</span>
    <span class="plate-materials">{html.escape(item['materials'])}</span>
  </button>
</article>"""


def main():
    data = json.loads((HERE / "piezas.json").read_text(encoding="utf-8"))
    categories = list(dict.fromkeys(item["category"] for item in data))

    chips = [f'<button class="cat-filter is-active" type="button" data-filter="Todos" aria-pressed="true">Todos</button>']
    chapters = []
    for n, category in enumerate(categories):
        items = [(i, item) for i, item in enumerate(data) if item["category"] == category]
        label = html.escape(category)
        chips.append(f'<button class="cat-filter" type="button" data-filter="{label}" aria-pressed="false">{label} <span>{len(items)}</span></button>')
        cards = "".join(card(item, i) for i, item in items)
        chapters.append(f"""<section class="chapter" id="capitulo-{slug(category)}" data-chapter="{label}" aria-labelledby="chapter-{n}">
  <header class="chapter-head"><h2 id="chapter-{n}">{label}</h2><span class="chapter-count">{len(items)}</span></header>
  <div class="chapter-grid">{cards}</div>
</section>""")

    page = (HERE / "template.html").read_text(encoding="utf-8")
    page = (page.replace("{{COUNT}}", str(len(data)))
                .replace("{{CHIPS}}", "\n        ".join(chips))
                .replace("{{CHAPTERS}}", "\n      ".join(chapters))
                .replace("{{DATA_JSON}}", json.dumps(data, ensure_ascii=False).replace("</", "<\\/")))
    (HERE / "index.html").write_text(page, encoding="utf-8")
    print(f"catalogo/index.html: {len(data)} piezas, {len(categories)} categorías")


if __name__ == "__main__":
    main()
