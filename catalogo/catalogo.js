(() => {
  "use strict";

  const data = JSON.parse(document.querySelector("#catalog-data").textContent);
  const grid = document.querySelector("#catalog-grid");
  const searchInput = document.querySelector("#catalog-search");
  const toolbar = document.querySelector(".cat-toolbar");
  const header = document.querySelector(".cat-header");
  const countOutput = document.querySelector("#catalog-count");
  const emptyState = document.querySelector("#catalog-empty");
  const clearButton = document.querySelector("#clear-filters");
  const filters = [...document.querySelectorAll(".cat-filter")];
  const chapters = [...document.querySelectorAll(".chapter")];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const narrowSearch = matchMedia("(max-width: 600px)");
  let activeCategory = "Todos";
  let lastTrigger = null;

  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .trim();

  let toolbarFrame = 0;

  function updateToolbarVisibility() {
    toolbarFrame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const nearBottom = max > 700 && window.scrollY > 600 && window.scrollY >= max - 360;
    const focused = toolbar.contains(document.activeElement);
    toolbar.classList.toggle("is-hidden", nearBottom && !focused);
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function queueToolbarVisibility() {
    if (!toolbarFrame) toolbarFrame = requestAnimationFrame(updateToolbarVisibility);
  }

  function applyFilters({ scroll = false } = {}) {
    const query = normalize(searchInput.value);
    let total = 0;

    document.querySelectorAll(".plate").forEach((plate) => {
      const categoryMatch = activeCategory === "Todos" || plate.dataset.category === activeCategory;
      const searchMatch = !query || normalize(plate.dataset.search).includes(query);
      const show = categoryMatch && searchMatch;
      plate.hidden = !show;
      if (show) total += 1;
    });

    chapters.forEach((chapter) => {
      const plates = [...chapter.querySelectorAll(".plate")];
      const shown = plates.filter((plate) => !plate.hidden).length;
      chapter.hidden = shown === 0;
      const count = chapter.querySelector(".chapter-count");
      if (count) count.textContent = String(query ? shown : plates.length);
    });

    // Alternate background bands over the categories that are actually visible.
    chapters
      .filter((chapter) => !chapter.hidden)
      .forEach((chapter, i) => chapter.classList.toggle("is-band", i % 2 === 1));

    countOutput.textContent = `${total} ${total === 1 ? "pieza" : "piezas"}`;
    emptyState.hidden = total !== 0;

    if (scroll && total > 0) {
      const firstChapter = chapters.find((chapter) => !chapter.hidden);
      firstChapter?.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  /* ---------- active filter indicator ---------- */
  const filterRow = document.querySelector(".cat-filters");
  const indicator = document.createElement("span");
  indicator.className = "cat-filter-indicator";
  indicator.setAttribute("aria-hidden", "true");
  filterRow.append(indicator);
  filterRow.classList.add("has-indicator");

  function moveIndicator() {
    const active = filters.find((item) => item.classList.contains("is-active"));
    if (!active) return;
    indicator.style.transform = `translateX(${active.offsetLeft}px) scaleX(${active.offsetWidth / 100})`;
  }

  /* ---------- cards: fade in once as they enter the viewport ---------- */
  const plates = [...document.querySelectorAll(".plate")];
  const revealer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            const entering = entries
              .filter((entry) => entry.isIntersecting)
              .map((entry) => entry.target)
              .sort((a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft);
            entering.forEach((plate, i) => {
              plate.style.setProperty("--d", `${Math.min(i, 4) * 50}ms`);
              plate.classList.add("is-in");
              revealer.unobserve(plate);
            });
          },
          { rootMargin: "0px 0px -40px 0px" }
        )
      : null;
  if (revealer) {
    document.documentElement.classList.add("js-reveal");
    plates.forEach((plate) => revealer.observe(plate));
  }

  function fadeShownPlates() {
    if (reducedMotion.matches) return;
    plates
      .filter((plate) => !plate.hidden && plate.classList.contains("is-in"))
      .forEach((plate) =>
        plate.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out" })
      );
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeCategory = filter.dataset.filter;
      filters.forEach((item) => {
        const isActive = item === filter;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      moveIndicator();
      applyFilters({ scroll: activeCategory !== "Todos" });
      fadeShownPlates();
    });
  });

  moveIndicator();
  window.addEventListener("resize", moveIndicator);
  document.fonts?.ready.then(moveIndicator);

  function setSearchPlaceholder() {
    searchInput.placeholder = narrowSearch.matches
      ? "Buscar una joya"
      : "Buscar: esmeralda, cadena, corazón…";
  }

  setSearchPlaceholder();
  narrowSearch.addEventListener("change", setSearchPlaceholder);

  searchInput.addEventListener("input", () => applyFilters());
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchInput.value) {
      searchInput.value = "";
      applyFilters();
    }
  });

  clearButton.addEventListener("click", () => {
    activeCategory = "Todos";
    searchInput.value = "";
    filters.forEach((filter) => {
      const isActive = filter.dataset.filter === "Todos";
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    moveIndicator();
    applyFilters();
    searchInput.focus();
  });

  /* ---------- detail sheet ---------- */
  const dialog = document.querySelector("#piece-dialog");
  const image = document.querySelector("#piece-image");
  const ref = document.querySelector("#piece-ref");
  const category = document.querySelector("#piece-category");
  const title = document.querySelector("#piece-title");
  const materials = document.querySelector("#piece-materials");
  const description = document.querySelector("#piece-description");
  const quote = document.querySelector("#piece-quote");
  const previous = document.querySelector("#piece-prev");
  const next = document.querySelector("#piece-next");
  const closeButton = document.querySelector("[data-close]");
  let currentIndex = 0;

  function renderPiece(index) {
    const item = data[index];
    if (!item) return;
    currentIndex = index;
    image.src = item.image;
    image.width = item.w || 800;
    image.height = item.h || 800;
    image.alt = `${item.name} de Tashi`;
    ref.textContent = item.ref;
    category.textContent = item.category;
    title.textContent = item.name;
    materials.textContent = item.materials;
    // Only show the catalog description when it says more than the materials line.
    const text = (item.description || "").trim();
    description.hidden = text.length < 40;
    description.textContent = text;
    quote.href = `../index.html?pieza=${encodeURIComponent(item.name)}&ref=${encodeURIComponent(item.ref)}#cotizar`;
    previous.disabled = index === 0;
    next.disabled = index === data.length - 1;
  }

  function openPiece(index, trigger) {
    lastTrigger = trigger || null;
    renderPiece(index);
    if (!dialog.open) dialog.showModal();
  }

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open]");
    if (!trigger) return;
    openPiece(Number(trigger.dataset.open), trigger);
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (lastTrigger) lastTrigger.focus();
  });

  const visual = document.querySelector(".piece-visual img");
  const copy = document.querySelector(".piece-copy");

  // Step to a neighbouring piece; content slides slightly in the direction of travel.
  function stepPiece(direction) {
    const target = currentIndex + direction;
    if (target < 0 || target > data.length - 1) return;
    renderPiece(target);
    const shift = reducedMotion.matches ? 0 : direction * 12;
    const frames = [
      { opacity: 0, transform: `translateX(${shift}px)` },
      { opacity: 1, transform: "translateX(0)" },
    ];
    const timing = { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" };
    visual.animate(frames, timing);
    copy.animate([{ opacity: 0 }, { opacity: 1 }], timing);
  }

  previous.addEventListener("click", () => stepPiece(-1));
  next.addEventListener("click", () => stepPiece(1));

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepPiece(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepPiece(1);
    }
  });

  /* ---------- search entry points ---------- */
  const query = new URLSearchParams(location.search).get("q");
  if (query) {
    searchInput.value = query;
    applyFilters();
    const revealToolbar = () => {
      const header = document.querySelector(".cat-header");
      const top = toolbar.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, top);
      root.style.scrollBehavior = previous;
    };
    const afterFonts = () => requestAnimationFrame(revealToolbar);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(afterFonts, afterFonts);
    } else {
      afterFonts();
    }
  } else {
    applyFilters();
    // Category shortcuts from the landing (#capitulo-anillos) open the catalog filtered.
    const chapter = location.hash.startsWith("#capitulo-") && document.querySelector(location.hash);
    const filter = chapter && filters.find((item) => item.dataset.filter === chapter.dataset.chapter);
    if (filter) filter.click();
  }

  window.addEventListener("scroll", queueToolbarVisibility, { passive: true });
  window.addEventListener("resize", queueToolbarVisibility);
  updateToolbarVisibility();

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing =
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select") || target.isContentEditable);
    if (event.key === "/" && !typing) {
      event.preventDefault();
      toolbar.classList.remove("is-hidden");
      searchInput.focus({ preventScroll: true });
    }
  });
})();
