import { qs, qsa, on, delegate } from "./lib/dom.js";
import { applyThemeIcons } from "./lib/icons.js";
import { copyText } from "./lib/copy.js";

const root = document.documentElement;
const body = document.body;
const iconBase = new URL("/assets/icons/", window.location.origin);
const bannerBase = new URL("/assets/banners/", window.location.origin);

const text = {
  tagline: "Wir helfen Katzen in Not",
  menuToggle: "Menü",
  navHome: "Startseite",
  navReports: "Berichte",
  navDates: "Termine",
  navActivities: "Unsere Aktivitäten",
  navMembership: "Mitgliedschaft",
  navDonate: "Spenden",
  navTips: "Tipps",
  navContact: "Kontakt",
  navActivitiesToggle: "Untermenü umschalten",
  legalImpressum: "Impressum",
  legalPrivacy: "Datenschutz",
  footerRights: "© 2026 Katzenfreunde Bietigheim-Bissingen e.V. Alle Rechte vorbehalten.",
  modalTitle: "PDF Vorschau",
  modalClose: "Schließen",
  copyEmail: "E-Mail kopieren",
  themeAria: "Farbmodus wechseln",
  termHeroTitle: "Termine im Überblick",
  termHeroText:
    "Alle aktuellen Flohmarkt- und Aktionstermine finden Sie hier gesammelt. Bei kurzfristigen Änderungen kontaktieren Sie uns bitte direkt.",
  termLocation: "Ort",
  termTime: "Zeit",
  termHint: "Hinweis",
  termLocationVal: "Ku(h)riosum am Kronenplatz, Bietigheim-Bissingen",
  termTimeVal: "Samstags ab 10:00 Uhr (laut Terminliste)",
  termHintVal: "Termine können sich kurzfristig ändern.",
  termDatesTitle: "Flohmarkttermine 2022",
  termDatesText: "Alle Flohmarkttermine beginnen samstags um 10:00 Uhr und enden gegen 14:00 Uhr.",
  termNov: "05. November",
  termDec: "03. Dezember",
  termDateTime: "Samstag, 10:00 - 14:00 Uhr",
  termPlaceTitle: "Standort",
  termPlaceText:
    "Unsere Stände finden Sie regelmäßig am Ku(h)riosum in Bietigheim-Bissingen. Für Rückfragen können Sie uns telefonisch oder per E-Mail erreichen.",
  termInfoTitle: "Wichtige Hinweise",
  termInfoText:
    "Der Erlös des Flohmarkts kommt ausschließlich dem Tierschutz zugute. Mitgliedsbeiträge und Spenden allein reichen für die medizinische Versorgung unserer Pfleglinge nicht aus.",
  termInfoText2:
    "Wir freuen uns über Ihren Besuch am Stand und über jede Unterstützung durch Einkäufe oder eine Mitgliedschaft.",
  termContactBtn: "Kontakt für Rückfragen",
  toastCopied: "Kopiert: ",
  toastCopyFailed: "Kopieren nicht möglich. Wert: ",
  toastDoc: "Datei wird heruntergeladen.",
};

const factItems = [
  "Bis zu 2.000.000 Straßenkatzen - mitten in Deutschland.",
  "99 % sind krank, wenn Hilfe sie erreicht.",
  "Bis zu 75 % der Straßen-Kitten sterben vor 6 Monaten.",
  "71 % der Tierschutzvereine: Die Population wächst weiter.",
  "84 % der aufgenommenen Kitten: von der Straße.",
  "Das Leid bleibt unsichtbar - bis es zu spät ist.",
];

function t(key) {
  return text[key] || key;
}

function applyText() {
  qsa("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = t(key);
    if (value) el.textContent = value;
  });

  qsa("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    const value = t(key);
    if (value) el.setAttribute("aria-label", value);
  });

  const themeToggle = qs("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", t("themeAria"));
  }
}

function setupNavigation() {
  const navToggle = qs("[data-nav-toggle]");
  const navWrap = qs("[data-nav-wrap]");

  if (navToggle && navWrap) {
    on(navToggle, "click", () => {
      const isOpen = navWrap.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const dropdownItems = qsa(".has-dropdown");
  const setDropdownState = (item, open) => {
    item.classList.toggle("is-open", open);
    const toggle = item.querySelector(".nav-dropdown-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  };

  const closeAllDropdowns = () => {
    dropdownItems.forEach((item) => setDropdownState(item, false));
  };

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector(".nav-link--dropdown");
    if (!trigger) return;

    trigger.removeAttribute("aria-expanded");
    trigger.removeAttribute("aria-haspopup");

    let toggle = item.querySelector(".nav-dropdown-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "nav-dropdown-toggle";
      toggle.setAttribute("data-i18n-aria-label", "navActivitiesToggle");
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-expanded", "false");
      item.insertBefore(toggle, trigger.nextSibling);
    }

    on(toggle, "click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = item.classList.contains("is-open");
      closeAllDropdowns();
      setDropdownState(item, !isOpen);
    });

    on(toggle, "keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle.click();
    });

    on(trigger, "click", closeAllDropdowns);
    item.querySelectorAll(".submenu a").forEach((link) => on(link, "click", closeAllDropdowns));
  });

  on(document, "click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest(".has-dropdown")) return;
    closeAllDropdowns();
  });

  on(document, "keydown", (event) => {
    if (event.key === "Escape") closeAllDropdowns();
  });
}

function setupToplineFacts() {
  const topbars = qsa(".topline");
  if (!topbars.length) return;

  const theme = root.getAttribute("data-theme") || "light";
  const folder = theme === "dark" ? "light" : "dark";
  const dividerIcons = ["paw.svg", "cat.svg", "fish-bone.svg"];
  let lastDivider = "";

  const randomDividerIcon = () => {
    const candidates = dividerIcons.filter((file) => file !== lastDivider);
    const file = candidates[Math.floor(Math.random() * candidates.length)];
    lastDivider = file;
    return new URL(`${folder}/${file}`, iconBase).href;
  };

  const syncMarqueeSpeed = (topline) => {
    const track = topline.querySelector(".fact-marquee__track");
    const group = topline.querySelector(".fact-marquee__group");
    if (!track || !group) return;

    const groupWidth = group.getBoundingClientRect().width;
    if (!groupWidth) return;

    const pxPerSecond = 52;
    const durationSeconds = Math.max(32, Math.round(groupWidth / pxPerSecond));
    track.style.setProperty("--facts-duration", `${durationSeconds}s`);
  };

  const buildFactGroup = () => {
    const group = document.createElement("div");
    group.className = "fact-marquee__group";

    factItems.forEach((fact, index) => {
      if (index > 0) {
        const paw = document.createElement("img");
        paw.className = "fact-marquee__paw";
        paw.alt = "";
        paw.setAttribute("aria-hidden", "true");
        paw.src = randomDividerIcon();
        group.appendChild(paw);
      }

      const item = document.createElement("span");
      item.className = "fact-marquee__item";
      item.textContent = fact;
      group.appendChild(item);
    });

    return group;
  };

  topbars.forEach((topline) => {
    topline.removeAttribute("data-i18n");
    topline.classList.add("topline--facts");

    let marquee = topline.querySelector(".fact-marquee");
    if (!marquee) {
      topline.textContent = "";

      marquee = document.createElement("div");
      marquee.className = "fact-marquee";
      marquee.setAttribute("aria-hidden", "true");

      const track = document.createElement("div");
      track.className = "fact-marquee__track";
      track.appendChild(buildFactGroup());
      track.appendChild(buildFactGroup());
      marquee.appendChild(track);

      const sr = document.createElement("span");
      sr.className = "fact-marquee__sr";
      sr.textContent = factItems.join(" ");

      topline.appendChild(marquee);
      topline.appendChild(sr);
    }

    syncMarqueeSpeed(topline);
  });

  if (!setupToplineFacts._resizeBound) {
    setupToplineFacts._resizeBound = true;
    let raf = 0;

    on(
      window,
      "resize",
      () => {
        if (raf) window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(() => {
          qsa(".topline").forEach((topline) => syncMarqueeSpeed(topline));
        });
      },
      { passive: true }
    );
  }
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("site_theme", theme);
  applyText();
  setupToplineFacts();
  applyThemeIcons(theme, iconBase);
}

function initTheme() {
  const storedTheme = localStorage.getItem("site_theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    setTheme(storedTheme);
  } else {
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  const themeToggle = qs("[data-theme-toggle]");
  if (!themeToggle) return;

  on(themeToggle, "click", () => {
    const current = root.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

function setupToasts() {
  const toast = qs("[data-toast]");
  if (!toast) return () => {};

  let timer = null;
  return (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  };
}

function setupCopy(showToast) {
  delegate("click", "[data-copy-email], [data-copy-text]", (event, target) => {
    if (target.tagName.toLowerCase() === "a") {
      event.preventDefault();
    }

    const value = target.getAttribute("data-copy-text") || target.getAttribute("data-copy-email");
    copyText(value)
      .then(() => showToast(t("toastCopied") + value))
      .catch(() => showToast(t("toastCopyFailed") + value));
  });
}

function normalizePdfUrl(url) {
  const value = (url || "").trim();
  if (!value || value === "#") return "";
  return value;
}

function buildInlinePdfPreviewUrl(url) {
  const value = normalizePdfUrl(url);
  if (!value) return "";
  const [base, hash = ""] = value.split("#", 2);
  const fragment = hash ? `${hash}&` : "";
  return `${base}#${fragment}view=FitH&toolbar=0&navpanes=0&pagemode=none`;
}

function setupInlinePdfPreviews() {
  const cards = qsa(".pdf-inline-card[data-pdf]");
  if (!cards.length) return;

  const maxConcurrentLoads = 2;
  let activeLoads = 0;
  const queue = [];

  const pumpQueue = () => {
    while (activeLoads < maxConcurrentLoads && queue.length) {
      const card = queue.shift();
      if (!card || card.getAttribute("data-pdf-preview-state") === "loaded") continue;

      const frame = qs(".pdf-inline-card__frame", card);
      const rawUrl = card.getAttribute("data-pdf") || card.getAttribute("href");
      const previewUrl = buildInlinePdfPreviewUrl(rawUrl);
      if (!frame || !previewUrl) {
        card.setAttribute("data-pdf-preview-state", "error");
        continue;
      }

      const title = (card.getAttribute("data-title") || t("modalTitle")).trim();
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", previewUrl);
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("title", `${title} Vorschau`);
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("tabindex", "-1");

      activeLoads += 1;
      card.setAttribute("data-pdf-preview-state", "loading");

      let finished = false;
      const finish = (state) => {
        if (finished) return;
        finished = true;
        activeLoads = Math.max(0, activeLoads - 1);
        card.setAttribute("data-pdf-preview-state", state);
        pumpQueue();
      };

      on(iframe, "load", () => finish("loaded"), { once: true });
      on(iframe, "error", () => finish("error"), { once: true });
      window.setTimeout(() => finish("loaded"), 5000);

      frame.innerHTML = "";
      frame.appendChild(iframe);
    }
  };

  const requestPreviewLoad = (card) => {
    const state = card.getAttribute("data-pdf-preview-state");
    if (state === "queued" || state === "loading" || state === "loaded") return;
    card.setAttribute("data-pdf-preview-state", "queued");
    queue.push(card);
    pumpQueue();
  };

  cards.forEach((card) => {
    const pdfUrl = normalizePdfUrl(card.getAttribute("data-pdf") || card.getAttribute("href"));
    const href = (card.getAttribute("href") || "").trim();
    if (pdfUrl && (!href || href === "#")) {
      card.setAttribute("href", pdfUrl);
    }

    on(card, "pointerenter", () => requestPreviewLoad(card), { passive: true });
    on(card, "focusin", () => requestPreviewLoad(card));
    on(card, "touchstart", () => requestPreviewLoad(card), {
      passive: true,
      once: true,
    });
  });

  if (!("IntersectionObserver" in window)) {
    cards.slice(0, 2).forEach((card) => requestPreviewLoad(card));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        requestPreviewLoad(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "180px 0px", threshold: 0.06 }
  );

  cards.forEach((card) => observer.observe(card));
}

function setupPdfModal(showToast) {
  const modal = qs("[data-pdf-modal]");
  const modalBackdrop = modal ? qs("[data-modal-backdrop]", modal) : null;
  const modalClose = modal ? qs("[data-modal-close]", modal) : null;
  const modalTitle = modal ? qs("[data-modal-title]", modal) : null;
  const modalFrame = modal ? qs("[data-modal-frame]", modal) : null;

  if (!modal || !modalTitle || !modalFrame) return;

  qsa(".pdf-preview[data-pdf]").forEach((link) => {
    const pdfUrl = (link.getAttribute("data-pdf") || "").trim();
    const href = (link.getAttribute("href") || "").trim();
    if (pdfUrl && (!href || href === "#")) {
      link.setAttribute("href", pdfUrl);
    }
  });

  const openPdf = (url, title) => {
    const pdfUrl = normalizePdfUrl(url);
    if (!pdfUrl) return;
    modalTitle.textContent = title || t("modalTitle");
    if (modalFrame.getAttribute("data-current-pdf") !== pdfUrl) {
      modalFrame.setAttribute("src", pdfUrl);
      modalFrame.setAttribute("data-current-pdf", pdfUrl);
    }
    modal.classList.add("open");
    body.style.overflow = "hidden";
  };

  const closePdf = () => {
    modal.classList.remove("open");
    body.style.overflow = "";
  };

  delegate("click", ".pdf-preview", (event, link) => {
    event.preventDefault();
    const url = link.getAttribute("data-pdf") || link.getAttribute("href");
    const title = link.getAttribute("data-title") || link.textContent.trim();
    openPdf(url, title);
  });

  if (modalBackdrop) on(modalBackdrop, "click", closePdf);
  if (modalClose) on(modalClose, "click", closePdf);

  on(document, "keydown", (event) => {
    if (event.key === "Escape") closePdf();
  });

  on(window, "pagehide", () => {
    modalFrame.setAttribute("src", "about:blank");
    modalFrame.removeAttribute("data-current-pdf");
  });

  qsa(".doc-download").forEach((link) => {
    on(link, "click", () => showToast(t("toastDoc")));
  });
}

function setupReveal() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const revealTargets = qsa(
    "main section, .hero__card, .activity-card, .date-card, .bank-item, .donation-impact-card, .media-tile, .home-intro, .home-impact, .home-cta"
  ).filter((el) => !el.closest("[data-pdf-modal]"));

  if (!revealTargets.length || !("IntersectionObserver" in window)) return;

  revealTargets.forEach((el, idx) => {
    if (!el.hasAttribute("data-reveal")) {
      el.setAttribute("data-reveal", "");
    }

    const siblings = el.parentElement
      ? Array.from(el.parentElement.children).filter(
          (node) => node.hasAttribute && node.hasAttribute("data-reveal")
        )
      : [];

    const siblingIndex = siblings.indexOf(el);
    const delay = siblingIndex > -1 ? Math.min(siblingIndex, 5) * 60 : (idx % 4) * 45;
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.requestAnimationFrame(() => {
            entry.target.classList.add("is-visible");
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

function observeOnce(targets, onIntersect, options = {}) {
  if (!targets.length) return;

  const threshold = options.threshold ?? 0.12;
  const rootMargin = options.rootMargin ?? "0px 0px -10% 0px";

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el, idx) => onIntersect(el, idx));
    return;
  }

  const order = new Map(targets.map((el, idx) => [el, idx]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = order.get(entry.target) ?? 0;
        window.requestAnimationFrame(() => onIntersect(entry.target, idx));
        observer.unobserve(entry.target);
      });
    },
    { threshold, rootMargin }
  );

  targets.forEach((el) => observer.observe(el));
}

function readMsVar(el, name) {
  const value = (el.style.getPropertyValue(name) || "").trim();
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function setupSectionUnderlines() {
  const targets = qsa(".schedule-section, .toc-card, .activity-overview");
  if (!targets.length) return;

  const activate = (el, idx = 0) => {
    if (el.classList.contains("section-underline-visible")) return;
    const revealDelay = readMsVar(el, "--reveal-delay");
    const stagger = Math.min(idx, 4) * 35;
    const delay = revealDelay + 120 + stagger;
    window.setTimeout(() => {
      el.classList.add("section-underline-visible");
    }, delay);
  };

  observeOnce(targets, activate, {
    threshold: 0.18,
    rootMargin: "0px 0px -12% 0px",
  });
}

function setupHeaderScroll() {
  let ticking = false;
  let isCompact = false;

  const enterThreshold = 72;
  const exitThreshold = 28;

  const update = () => {
    const y = window.scrollY || 0;
    if (!isCompact && y > enterThreshold) {
      isCompact = true;
    } else if (isCompact && y < exitThreshold) {
      isCompact = false;
    }
    body.classList.toggle("is-scrolled", isCompact);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  on(window, "scroll", onScroll, { passive: true });
}

async function resolveBannerFiles() {
  try {
    const response = await fetch("/assets/banners/banner-manifest.json", { cache: "force-cache" });
    if (!response.ok) throw new Error("manifest fetch failed");
    const items = await response.json();
    const files = items
      .map((item) => item && item.file)
      .filter((file) => typeof file === "string" && file.endsWith(".jpg"));
    if (files.length) return files;
  } catch (_) {
    // Keep silent and use fallback list.
  }

  return Array.from({ length: 25 }, (_, i) => `banner-${String(i + 1).padStart(2, "0")}.jpg`);
}

async function applyBannerImage() {
  const mode = body.getAttribute("data-banner-mode") || "none";
  if (mode !== "auto") return;

  const shell = qs(".page-shell--with-banner");
  if (!shell) return;

  const pageContent = qs(".page-content", shell);
  if (!pageContent) return;

  const splitTargets = Array.from(pageContent.children).filter(
    (el) => !el.classList.contains("page-banner")
  );
  if (splitTargets.length < 2) return;

  qsa(".page-banner[data-auto-banner]", pageContent).forEach((el) => el.remove());

  const files = await resolveBannerFiles();
  if (files.length < 4) return;
  const widthSets = [
    [34, 18, 27, 21],
    [21, 32, 18, 29],
    [29, 19, 34, 18],
    [18, 31, 23, 28],
    [26, 20, 36, 18],
  ];

  const shuffled = files.slice();
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  const picks = shuffled.slice(0, 4);
  const widths = widthSets[Math.floor(Math.random() * widthSets.length)];

  const banner = document.createElement("div");
  banner.className = "page-banner page-banner--inline";
  banner.setAttribute("aria-hidden", "true");
  banner.setAttribute("data-auto-banner", "true");

  picks.forEach((file, idx) => {
    const tile = document.createElement("span");
    tile.className = "page-banner__tile";
    tile.style.setProperty("--tile-grow", String(widths[idx] || 25));

    const img = document.createElement("img");
    img.src = new URL(file, bannerBase).href;
    img.alt = "";
    img.loading = idx === 0 ? "eager" : "lazy";
    img.decoding = "async";

    tile.appendChild(img);
    banner.appendChild(tile);
  });

  const insertAt = Math.min(
    splitTargets.length - 1,
    Math.max(1, Math.floor(splitTargets.length / 2))
  );
  pageContent.insertBefore(banner, splitTargets[insertAt]);
}

function setupClickPaw() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selector = "button, .btn, .icon-btn, .icon-link, .theme-toggle, .main-nav a, .submenu a";
  delegate("pointerdown", selector, (event) => {
    const paw = document.createElement("span");
    paw.className = "paw-click";
    paw.style.left = `${event.clientX}px`;
    paw.style.top = `${event.clientY}px`;
    body.appendChild(paw);

    setTimeout(() => paw.remove(), 600);
  });
}

function boot() {
  setupNavigation();
  initTheme();

  const showToast = setupToasts();
  setupCopy(showToast);
  setupInlinePdfPreviews();
  setupPdfModal(showToast);
  setupHeaderScroll();
  applyBannerImage();
  setupReveal();
  setupSectionUnderlines();
  setupClickPaw();
}

boot();



