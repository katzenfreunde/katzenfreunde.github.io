(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navWrap = document.querySelector("[data-nav-wrap]");
  const root = document.documentElement;
  const scriptEl = document.querySelector("script[src*='scripts/main.js']");
  const iconBase = scriptEl ? new URL("../assets/icons/", scriptEl.src) : new URL("assets/icons/", window.location.href);
  const bannerBase = scriptEl ? new URL("../assets/banners/", scriptEl.src) : new URL("assets/banners/", window.location.href);

  if (navToggle && navWrap) {
    navToggle.addEventListener("click", function () {
      const isOpen = navWrap.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const dropdownItems = Array.from(document.querySelectorAll(".has-dropdown"));
  function setDropdownState(item, open) {
    item.classList.toggle("is-open", open);
    const toggle = item.querySelector(".nav-dropdown-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
    }
  }

  function closeAllDropdowns() {
    dropdownItems.forEach(function (item) {
      setDropdownState(item, false);
    });
  }

  dropdownItems.forEach(function (item) {
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

    toggle.addEventListener("click", function (event) {
      const isOpen = item.classList.contains("is-open");
      event.preventDefault();
      event.stopPropagation();
      closeAllDropdowns();
      setDropdownState(item, !isOpen);
    });

    toggle.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle.click();
    });

    trigger.addEventListener("click", function () {
      closeAllDropdowns();
    });

    item.querySelectorAll(".submenu a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeAllDropdowns();
      });
    });
  });

  document.addEventListener("click", function (event) {
    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest(".has-dropdown")) return;
    closeAllDropdowns();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

  const text = {
    tagline: "Wir helfen Katzen in Not",
    brandTagline: "Hilfe fuer notleidende Katzen seit 1991",
    menuToggle: "Menue",
    navHome: "Startseite",
    navReports: "Berichte",
    navDates: "Termine",
    navActivities: "Unsere Aktivitaeten",
    navMembership: "Mitgliedschaft",
    navDonate: "Spenden",
    navTips: "Tipps",
    navContact: "Kontakt",
    navActivitiesToggle: "Untermenue umschalten",
    legalImpressum: "Impressum",
    legalPrivacy: "Datenschutz",
    footerRights: "© 2026 Katzenfreunde Bietigheim-Bissingen e.V. Alle Rechte vorbehalten.",
    modalTitle: "PDF Vorschau",
    modalDownload: "Download",
    modalClose: "Schliessen",
    copyEmail: "E-Mail kopieren",
    themeAria: "Farbmodus wechseln",
    termHeroTitle: "Termine im Ueberblick",
    termHeroText: "Alle aktuellen Flohmarkt- und Aktionstermine finden Sie hier gesammelt. Bei kurzfristigen Aenderungen kontaktieren Sie uns bitte direkt.",
    termLocation: "Ort",
    termTime: "Zeit",
    termHint: "Hinweis",
    termLocationVal: "Ku(h)riosum am Kronenplatz, Bietigheim-Bissingen",
    termTimeVal: "Samstags ab 10:00 Uhr (laut Terminliste)",
    termHintVal: "Termine koennen sich kurzfristig aendern.",
    termTocTitle: "Inhaltsuebersicht",
    termTocDates: "Flohmarkttermine",
    termTocPlace: "Standort",
    termTocInfo: "Wichtige Hinweise",
    termDatesTitle: "Flohmarkttermine 2022",
    termDatesText: "Alle Flohmarkttermine beginnen samstags um 10:00 Uhr und enden gegen 14:00 Uhr.",
    termNov: "05. November",
    termDec: "03. Dezember",
    termDateTime: "Samstag, 10:00 - 14:00 Uhr",
    termPlaceTitle: "Standort",
    termPlaceText: "Unsere Staende finden Sie regelmaessig am Ku(h)riosum in Bietigheim-Bissingen. Fuer Rueckfragen koennen Sie uns telefonisch oder per E-Mail erreichen.",
    termInfoTitle: "Wichtige Hinweise",
    termInfoText: "Der Erloes des Flohmarkts kommt ausschliesslich dem Tierschutz zugute. Mitgliedsbeitraege und Spenden allein reichen fuer die medizinische Versorgung unserer Pfleglinge nicht aus.",
    termInfoText2: "Wir freuen uns ueber Ihren Besuch am Stand und ueber jede Unterstuetzung durch Einkaeufe oder eine Mitgliedschaft.",
    termContactBtn: "Kontakt fuer Rueckfragen",
    toastCopied: "Kopiert: ",
    toastCopyFailed: "Kopieren nicht moeglich. Wert: ",
    toastEmailCopied: "E-Mail-Adresse kopiert: ",
    toastEmailFailed: "Kopieren nicht moeglich. Adresse: ",
    toastDoc: "DOC-Datei wird heruntergeladen."
  };

  function t(key) {
    return text[key] || key;
  }

  const factItems = [
    "Bis zu 2.000.000 Stra\u00dfenkatzen - mitten in Deutschland.",
    "99 % sind krank, wenn Hilfe sie erreicht.",
    "Bis zu 75 % der Stra\u00dfen-Kitten sterben vor 6 Monaten.",
    "71 % der Tierschutzvereine: Die Population w\u00e4chst weiter.",
    "84 % der aufgenommenen Kitten: von der Stra\u00dfe.",
    "Das Leid bleibt unsichtbar - bis es zu sp\u00e4t ist."
  ];

  function setupToplineFacts() {
    const topbars = Array.from(document.querySelectorAll(".topline"));
    if (!topbars.length) return;

    const theme = root.getAttribute("data-theme") || "light";
    // The facts bar background uses an inverted contrast, so icon folder selection is reversed here.
    const folder = theme === "dark" ? "light" : "dark";
    const dividerIcons = ["paw.svg", "cat.svg", "fish-bone.svg"];
    let lastDivider = "";
    function syncMarqueeSpeed(topline) {
      const track = topline.querySelector(".fact-marquee__track");
      const group = topline.querySelector(".fact-marquee__group");
      if (!track || !group) return;
      const groupWidth = group.getBoundingClientRect().width;
      if (!groupWidth) return;
      const pxPerSecond = 52;
      const durationSeconds = Math.max(32, Math.round(groupWidth / pxPerSecond));
      track.style.setProperty("--facts-duration", durationSeconds + "s");
    }

    function randomDividerIcon() {
      const candidates = dividerIcons.filter(function (file) {
        return file !== lastDivider;
      });
      const file = candidates[Math.floor(Math.random() * candidates.length)];
      lastDivider = file;
      return new URL(folder + "/" + file, iconBase).href;
    }

    function buildFactGroup() {
      const group = document.createElement("div");
      group.className = "fact-marquee__group";

      factItems.forEach(function (fact, idx) {
        if (idx > 0) {
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
    }

    topbars.forEach(function (topline) {
      topline.removeAttribute("data-i18n");
      topline.classList.add("topline--facts");

      if (!topline.querySelector(".fact-marquee")) {
        topline.textContent = "";

        const marquee = document.createElement("div");
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
      } else {
        topline.querySelectorAll(".fact-marquee__paw").forEach(function (paw) {
          paw.src = randomDividerIcon();
        });
      }
      syncMarqueeSpeed(topline);
    });

    if (!setupToplineFacts._resizeBound) {
      setupToplineFacts._resizeBound = true;
      let raf = 0;
      window.addEventListener("resize", function () {
        if (raf) window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(function () {
          document.querySelectorAll(".topline").forEach(function (topline) {
            syncMarqueeSpeed(topline);
          });
        });
      }, { passive: true });
    }
  }

  function applyText() {
    root.setAttribute("lang", "de");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const value = t(key);
      if (value) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-aria-label");
      const value = t(key);
      if (value) el.setAttribute("aria-label", value);
    });

    const themeToggle = document.querySelector("[data-theme-toggle]");
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", t("themeAria"));
    }
  }

  function applyBannerImage() {
    const shell = document.querySelector(".page-shell--with-banner");
    if (!shell) return;

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const excludedPages = new Set(["termine.html", "kontakt.html", "kontakt-formular.html"]);
    if (excludedPages.has(page)) return;

    const widthSets = [
      [34, 18, 27, 21],
      [21, 32, 18, 29],
      [29, 19, 34, 18],
      [18, 31, 23, 28],
      [26, 20, 36, 18]
    ];

    const files = Array.from({
      length: 32
    }, function (_, i) {
      return "banner-" + String(i + 1).padStart(2, "0") + ".jpg";
    });

    const pageContent = shell.querySelector(".page-content");
    if (!pageContent) return;

    const splitTargets = Array.from(pageContent.children).filter(function (el) {
      return !el.classList.contains("page-banner");
    });
    if (splitTargets.length < 2) return;

    pageContent.querySelectorAll(".page-banner[data-auto-banner]").forEach(function (el) {
      el.remove();
    });

    function pickUniqueFiles(count) {
      const pool = files.slice();
      for (let i = pool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = pool[i];
        pool[i] = pool[j];
        pool[j] = tmp;
      }
      return pool.slice(0, count);
    }

    function buildBanner() {
      const banner = document.createElement("div");
      banner.className = "page-banner page-banner--inline";
      banner.setAttribute("aria-hidden", "true");
      banner.setAttribute("data-auto-banner", "true");

      const picks = pickUniqueFiles(4);
      const widths = widthSets[Math.floor(Math.random() * widthSets.length)];

      picks.forEach(function (file, idx) {
        const tile = document.createElement("span");
        tile.className = "page-banner__tile";
        tile.style.setProperty("--tile-grow", String(widths[idx] || 25));

        const img = document.createElement("img");
        img.src = new URL(file, bannerBase).href;
        img.alt = "";
        img.loading = idx < 2 ? "eager" : "lazy";
        img.decoding = "async";

        tile.appendChild(img);
        banner.appendChild(tile);
      });

      return banner;
    }

    const insertAt = Math.min(splitTargets.length - 1, Math.max(1, Math.floor(splitTargets.length / 2)));
    const banner = buildBanner();
    pageContent.insertBefore(banner, splitTargets[insertAt]);
  }

  function iconFolderForTheme(theme) {
    return theme === "dark" ? "dark" : "light";
  }

  function ensureIconElement(target) {
    let icon = target.querySelector(".icon-glyph");
    if (!icon) {
      icon = document.createElement("img");
      icon.className = "icon-glyph";
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      target.textContent = "";
      target.appendChild(icon);
    }
    return icon;
  }

  function setThemeIcon(target, fileName, folder) {
    const icon = ensureIconElement(target);
    icon.src = new URL(folder + "/" + fileName + ".svg", iconBase).href;
  }

  function applyThemeIcons(theme) {
    const folder = iconFolderForTheme(theme);
    const themeToggle = document.querySelector("[data-theme-toggle]");
    if (themeToggle) {
      const themeIcon = theme === "dark" ? "moon" : "sun";
      setThemeIcon(themeToggle, themeIcon, folder);
    }

    document.querySelectorAll(".icon-link[href^='tel:']").forEach(function (el) {
      setThemeIcon(el, "phone", folder);
    });

    document.querySelectorAll(".icon-btn[data-copy-email]").forEach(function (el) {
      setThemeIcon(el, "mail", folder);
    });

    document.querySelectorAll(".copy-inline").forEach(function (el) {
      setThemeIcon(el, "copy", folder);
    });

    document.querySelectorAll(".icon-link[href*='wa.me']").forEach(function (el) {
      setThemeIcon(el, "brand-whatsapp", folder);
    });

    document.querySelectorAll(".icon-link[href*='facebook.com']").forEach(function (el) {
      setThemeIcon(el, "brand-facebook", folder);
    });

    document.querySelectorAll("[data-modal-close]").forEach(function (el) {
      setThemeIcon(el, "x", folder);
    });

    document.querySelectorAll(".doc-download").forEach(function (el) {
      if (!el.querySelector(".icon-glyph")) {
        const icon = document.createElement("img");
        icon.className = "icon-glyph";
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");
        el.prepend(icon);
      }
      const img = el.querySelector(".icon-glyph");
      img.src = new URL(folder + "/download.svg", iconBase).href;
    });
  }

  const themeToggle = document.querySelector("[data-theme-toggle]");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("site_theme", theme);
    applyText();
    setupToplineFacts();
    applyThemeIcons(theme);
  }

  const storedTheme = localStorage.getItem("site_theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    setTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const now = root.getAttribute("data-theme") || "light";
      setTheme(now === "dark" ? "light" : "dark");
    });
  }

  const toast = document.querySelector("[data-toast]");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function copyText(textToCopy) {
    if (!textToCopy) return Promise.reject(new Error("no text"));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(textToCopy);
    }

    const el = document.createElement("textarea");
    el.value = textToCopy;
    el.setAttribute("readonly", "");
    el.className = "hidden";
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(el);
      return Promise.resolve();
    } catch (err) {
      document.body.removeChild(el);
      return Promise.reject(err);
    }
  }

  document.querySelectorAll("[data-copy-email], [data-copy-text]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      if (el.tagName.toLowerCase() === "a") event.preventDefault();
      const value = el.getAttribute("data-copy-text") || el.getAttribute("data-copy-email");
      copyText(value)
        .then(function () {
          showToast(t("toastCopied") + value);
        })
        .catch(function () {
          showToast(t("toastCopyFailed") + value);
        });
    });
  });

  const modal = document.querySelector("[data-pdf-modal]");
  const modalBackdrop = modal ? modal.querySelector("[data-modal-backdrop]") : null;
  const modalClose = modal ? modal.querySelector("[data-modal-close]") : null;
  const modalTitle = modal ? modal.querySelector("[data-modal-title]") : null;
  const modalFrame = modal ? modal.querySelector("[data-modal-frame]") : null;
  const modalDownload = modal ? modal.querySelector("[data-modal-download]") : null;

  function openPdf(url, title) {
    if (!modal || !modalFrame || !modalTitle) return;
    modalTitle.textContent = title || t("modalTitle");
    modalFrame.setAttribute("src", url + "#view=FitH");
    if (modalDownload) {
      modalDownload.setAttribute("href", url);
    }
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closePdf() {
    if (!modal || !modalFrame) return;
    modal.classList.remove("open");
    modalFrame.setAttribute("src", "about:blank");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".pdf-preview").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const url = link.getAttribute("data-pdf") || link.getAttribute("href");
      const title = link.getAttribute("data-title") || link.textContent.trim();
      openPdf(url, title);
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener("click", closePdf);
  if (modalClose) modalClose.addEventListener("click", closePdf);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePdf();
  });

  document.querySelectorAll(".doc-download").forEach(function (link) {
    link.addEventListener("click", function () {
      showToast(t("toastDoc"));
    });
  });

  function setupReveal() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealTargets = Array.from(
      document.querySelectorAll(
        "main section, .hero__card, .activity-card, .date-card, .bank-item, .media-tile, .home-intro, .home-impact, .home-cta"
      )
    ).filter(function (el) {
      return !el.closest("[data-pdf-modal]");
    });

    if (!revealTargets.length || !("IntersectionObserver" in window)) return;

    revealTargets.forEach(function (el, idx) {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
      }

      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(function (node) {
        return node.hasAttribute && node.hasAttribute("data-reveal");
      }) : [];
      const siblingIndex = siblings.indexOf(el);
      const delay = siblingIndex > -1 ? Math.min(siblingIndex, 5) * 60 : (idx % 4) * 45;
      el.style.setProperty("--reveal-delay", delay + "ms");
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function setupHeaderScroll() {
    const body = document.body;
    if (!body) return;

    let ticking = false;
    const enterThreshold = 72;
    const exitThreshold = 28;
    let isCompact = false;

    function updateHeaderState() {
      const y = window.scrollY || 0;
      if (!isCompact && y > enterThreshold) {
        isCompact = true;
      } else if (isCompact && y < exitThreshold) {
        isCompact = false;
      }
      body.classList.toggle("is-scrolled", isCompact);
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeaderState);
    }

    updateHeaderState();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
  }

  const clickSelector = "button, .btn, .icon-btn, .icon-link, .theme-toggle, .main-nav a, .submenu a";
  document.addEventListener("pointerdown", function (event) {
    const target = event.target.closest(clickSelector);
    if (!target) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paw = document.createElement("span");
    paw.className = "paw-click";
    paw.style.left = event.clientX + "px";
    paw.style.top = event.clientY + "px";
    document.body.appendChild(paw);
    setTimeout(function () {
      paw.remove();
    }, 600);
  });

  applyText();
  setupToplineFacts();
  setupHeaderScroll();
  applyBannerImage();
  applyThemeIcons(root.getAttribute("data-theme") || "light");
  setupReveal();
})();

