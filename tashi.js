(() => {
  "use strict";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const stageHint = document.querySelector("#stage-hint");
  const header = document.querySelector("#header");
  const jewel = document.querySelector("#jewel-zoom");
  const jewelImage = document.querySelector("#jewel-img");
  const detailToggle = document.querySelector("#detail-toggle");
  const motionToggle = document.querySelector("#motion-toggle");
  let rotationPaused = false;
  if ((!finePointer.matches || reducedMotion.matches) && stageHint) stageHint.hidden = true;
  if (!finePointer.matches && motionToggle) motionToggle.hidden = true;

  /* ---------- still jewel, rotated only by deliberate mouse movement ---------- */
  if (jewel && jewelImage && finePointer.matches && !reducedMotion.matches) {
    const motionTokens = getComputedStyle(document.documentElement);
    const perspective =
      Number.parseFloat(motionTokens.getPropertyValue("--hero-perspective")) || 900;
    const limitX = Number.parseFloat(motionTokens.getPropertyValue("--hero-tilt-limit-x")) || 11;
    const limitY = Number.parseFloat(motionTokens.getPropertyValue("--hero-tilt-limit-y")) || 16;
    const settle = Number.parseFloat(motionTokens.getPropertyValue("--hero-tilt-settle")) || 72;
    const frameCap =
      Number.parseFloat(motionTokens.getPropertyValue("--hero-tilt-frame-cap")) || 40;
    const epsilon =
      Number.parseFloat(motionTokens.getPropertyValue("--hero-tilt-epsilon")) || 0.025;
    const artworkScale =
      Number.parseFloat(motionTokens.getPropertyValue("--hero-artwork-scale")) || 1.08;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let tiltFrame = 0;
    let previousFrame = 0;
    const renderTilt = (timestamp) => {
      const delta = previousFrame ? Math.min(timestamp - previousFrame, frameCap) : 16.7;
      previousFrame = timestamp;
      const blend = 1 - Math.exp(-delta / settle);
      currentX += (targetX - currentX) * blend;
      currentY += (targetY - currentY) * blend;
      if (Math.abs(targetX - currentX) < epsilon && Math.abs(targetY - currentY) < epsilon) {
        currentX = targetX;
        currentY = targetY;
        tiltFrame = 0;
        previousFrame = 0;
        jewelImage.style.transform =
          currentX === 0 && currentY === 0
            ? ""
            : `perspective(${perspective}px) rotateX(${(-currentY * limitX).toFixed(2)}deg) rotateY(${(currentX * limitY).toFixed(2)}deg) scale(${artworkScale})`;
        return;
      }
      jewelImage.style.transform = `perspective(${perspective}px) rotateX(${(-currentY * limitX).toFixed(2)}deg) rotateY(${(currentX * limitY).toFixed(2)}deg) scale(${artworkScale})`;
      tiltFrame = requestAnimationFrame(renderTilt);
    };
    const aimTilt = (x, y) => {
      targetX = x;
      targetY = y;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(renderTilt);
    };
    jewel.addEventListener("pointermove", (event) => {
      if (rotationPaused || jewel.classList.contains("is-3d") || jewel.classList.contains("is-detail")) return;
      const rect = jewel.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      aimTilt(x, y);
    });
    jewel.addEventListener("pointerleave", () => aimTilt(0, 0));
    jewel.addEventListener("tiltreset", () => aimTilt(0, 0));
  }
  detailToggle &&
    detailToggle.addEventListener("click", () => {
      const detail = jewel.classList.toggle("is-detail");
      detailToggle.setAttribute("aria-pressed", String(detail));
      detailToggle.querySelector("span").textContent = detail
        ? "Ver pieza completa"
        : "Ver de cerca";
      if (detail) jewel.dispatchEvent(new Event("tiltreset"));
    });
  motionToggle &&
    motionToggle.addEventListener("click", () => {
      rotationPaused = !rotationPaused;
      jewel && jewel.dispatchEvent(new Event("tiltreset"));
      motionToggle.setAttribute("aria-pressed", String(rotationPaused));
      motionToggle.setAttribute(
        "aria-label",
        rotationPaused ? "Activar giro con el cursor" : "Pausar giro con el cursor",
      );
      motionToggle.querySelector("use").setAttribute("href", rotationPaused ? "#play" : "#pause");
    });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && jewel && jewel.classList.contains("is-detail")) {
      jewel.classList.remove("is-detail");
      detailToggle.setAttribute("aria-pressed", "false");
      detailToggle.querySelector("span").textContent = "Ver de cerca";
      detailToggle.focus();
    }
  });

  /* ---------- rotating Spanish hero phrase ---------- */
  const heroWord = document.querySelector("#hero-word");
  if (heroWord && !reducedMotion.matches && document.documentElement.animate) {
    const phrases = ["un legado.", "tu historia.", "tu esencia.", "un recuerdo."];
    const sessionKey = "tashi-hero-phrases-v1";
    let seen = new Set();
    try {
      const saved = JSON.parse(sessionStorage.getItem(sessionKey) || "null");
      if (Array.isArray(saved))
        seen = new Set(
          saved.filter((index) => Number.isInteger(index) && index >= 0 && index < phrases.length),
        );
    } catch {}
    let phraseIndex = seen.size ? Math.max(...seen) : 0;
    if (!seen.size) seen.add(phraseIndex);
    heroWord.textContent = phrases[phraseIndex];
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify([...seen]));
    } catch {}
    const curve = "cubic-bezier(.23,1,.32,1)";
    const phraseTimer = setInterval(() => {
      if (document.hidden) return;
      const nextIndex = phrases.findIndex((_, index) => !seen.has(index));
      if (nextIndex < 0) {
        clearInterval(phraseTimer);
        return;
      }
      const exit = heroWord.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(-110%)", opacity: 0 },
        ],
        { duration: 300, easing: curve },
      );
      exit.onfinish = () => {
        phraseIndex = nextIndex;
        seen.add(phraseIndex);
        try {
          sessionStorage.setItem(sessionKey, JSON.stringify([...seen]));
        } catch {}
        heroWord.textContent = phrases[phraseIndex];
        heroWord.animate(
          [
            { transform: "translateY(110%)", opacity: 0 },
            { transform: "translateY(0)", opacity: 1 },
          ],
          { duration: 440, easing: curve },
        );
      };
    }, 4500);
  }

  /* ---------- header + navigation ---------- */
  function updateHeader() {
    header && header.classList.toggle("scrolled", scrollY > 46);
  }
  updateHeader();
  addEventListener("scroll", updateHeader, { passive: true });

  const collectionItem = document.querySelector(".nav-collection");
  const collectionTrigger = document.querySelector("#collection-trigger");
  const collectionMenu = document.querySelector("#collection-menu");
  function setCollectionOpen(open) {
    if (!collectionTrigger || !collectionMenu) return;
    collectionTrigger.setAttribute("aria-expanded", String(open));
    collectionMenu.hidden = !open;
  }
  collectionTrigger &&
    collectionTrigger.addEventListener("click", () => {
      setCollectionOpen(collectionMenu.hidden);
    });
  collectionTrigger &&
    collectionTrigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setCollectionOpen(true);
        collectionMenu.querySelector("a")?.focus();
      }
    });
  document.addEventListener("pointerdown", (event) => {
    if (collectionItem && !collectionItem.contains(event.target)) setCollectionOpen(false);
  });
  collectionMenu &&
    collectionMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setCollectionOpen(false);
    });

  function installCollectionSearch(inputSelector, itemSelector, emptySelector) {
    const input = document.querySelector(inputSelector);
    const items = [...document.querySelectorAll(itemSelector)];
    const empty = document.querySelector(emptySelector);
    if (!input || !empty) return;
    const normalize = (value) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es");
    input.addEventListener("input", () => {
      const query = normalize(input.value.trim());
      let matches = 0;
      items.forEach((item) => {
        const found = normalize(item.dataset.search || item.textContent).includes(query);
        item.hidden = !found;
        if (found) matches++;
      });
      empty.hidden = matches > 0;
    });
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const query = input.value.trim();
      location.href = `catalogo/index.html${query ? `?q=${encodeURIComponent(query)}#buscar` : "#buscar"}`;
    });
  }
  installCollectionSearch("#collection-search", ".mega-piece", "#collection-no-results");

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-nav");
  const pageMain = document.querySelector("#contenido");
  const pageFooter = document.querySelector(".footer");
  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    header?.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-open", open);
    if (pageMain) pageMain.inert = open;
    if (pageFooter) pageFooter.inert = open;
    if (open) requestAnimationFrame(() => menu.querySelector("a")?.focus());
  }
  menuButton && menuButton.addEventListener("click", () => setMenu(menu.hidden));
  menu &&
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && collectionMenu && !collectionMenu.hidden) {
      setCollectionOpen(false);
      collectionTrigger.focus();
      return;
    }
    if (event.key === "Escape" && menu && !menu.hidden) {
      setMenu(false);
      menuButton.focus();
    }
  });
  matchMedia("(min-width:1001px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  /* ---------- scroll reveals ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -34px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- slow category rail: pause control ---------- */
  const rail = document.querySelector("#category-rail");
  const railPause = document.querySelector("#rail-pause");
  railPause &&
    railPause.addEventListener("click", () => {
      const paused = rail.classList.toggle("is-paused");
      railPause.setAttribute("aria-pressed", String(paused));
      railPause.querySelector("use").setAttribute("href", paused ? "#play" : "#pause");
      railPause.querySelector("span").textContent = paused ? "Reanudar" : "Pausar";
    });

  /* ---------- quote flow ---------- */
  const piece = document.querySelector("#piece");
  const form = document.querySelector("#quote-form");
  const status = document.querySelector("#form-status");
  const params = new URLSearchParams(location.search);
  const requestedPiece = params.get("pieza");
  const requestedRef = params.get("ref");
  if (requestedPiece && piece) {
    const match = [...piece.options].find(
      (option) => option.value.toLocaleLowerCase("es") === requestedPiece.toLocaleLowerCase("es"),
    );
    const idea = document.querySelector("#idea");
    if (match) {
      piece.value = match.value;
    } else {
      piece.value = "Otra pieza del catálogo";
      const reference = requestedRef ? ` (${requestedRef})` : "";
      if (idea && !idea.value.trim())
        idea.value = `Me interesa esta pieza del catálogo: ${requestedPiece}${reference}.`;
    }
  }
  document.querySelectorAll("[data-piece]").forEach((link) => {
    link.addEventListener("click", () => {
      piece.value = link.dataset.piece;
      status.textContent = "";
    });
  });
  form &&
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const idea = document.querySelector("#idea").value.trim();
      const message = `Hola, Tashi. Me gustaría cotizar: ${piece.value}.${idea ? `\n\nMi idea: ${idea}` : ""}`;
      const url = `https://wa.me/573026566565?text=${encodeURIComponent(message)}`;
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Abrir mi mensaje en WhatsApp";
      status.replaceChildren(
        document.createTextNode("Tu mensaje está preparado. Si WhatsApp no se abrió, "),
        link,
        document.createTextNode("."),
      );
      link.click();
    });
})();
