/* =========================================================
   Portfolio · main.js
   - 主题切换 / 滚动 / 移动菜单
   - 项目卡片：从 localStorage('portfolio:data') 渲染，缺省回退 PORTFOLIO_DEFAULTS
   - 分类筛选
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "切换到浅色主题" : "切换到深色主题"
      );
    }
  }

  function getPreferredTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {
      /* ignore */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(getPreferredTheme());

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (_) {}
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      let stored = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch (_) {}
      if (!stored) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });

  /* ---------- Nav: scroll shadow + mobile toggle ---------- */
  const nav = document.querySelector(".nav");
  const navLinks = document.getElementById("nav-links");
  const navToggle = document.getElementById("nav-toggle");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("is-open");
      navLinks.classList.toggle("is-open");
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navToggle.classList.remove("is-open");
        navLinks.classList.remove("is-open");
      });
    });
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Data layer ---------- */
  const STORAGE_KEY = "portfolio:data";

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* ignore */
    }
    return window.PORTFOLIO_DEFAULTS || {};
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(s) {
    return escapeHtml(s);
  }

  /* ---------- Projects: render ---------- */
  const grid = document.getElementById("projects-grid");
  const empty = document.getElementById("projects-empty");
  const tabs = document.querySelectorAll(".filter-tab");

  function coverHTML(p) {
    if (p.image && /^https?:\/\//.test(p.image)) {
      return `<a class="project-card__cover" href="projects/detail.html?id=${encodeURIComponent(p.id)}" aria-hidden="true" tabindex="-1">
        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" loading="lazy" />
      </a>`;
    }
    const c1 = p.cover1 || "#e8e2d4";
    const c2 = p.cover2 || "#d8cdb8";
    return `<a class="project-card__cover project-card__cover--empty" style="--c1:${escapeAttr(c1)};--c2:${escapeAttr(c2)}" href="projects/detail.html?id=${encodeURIComponent(p.id)}" aria-hidden="true" tabindex="-1">
      <span class="project-card__initials">${escapeHtml(
        (p.title || "·").slice(0, 2)
      )}</span>
    </a>`;
  }

  function cardHTML(p) {
    return `
      <article class="project-card" role="listitem" data-project="${escapeAttr(
        p.id
      )}" data-category="${escapeAttr(p.category || "")}">
        ${coverHTML(p)}
        ${p.year ? `<span class="project-card__year">${escapeHtml(p.year)}</span>` : ""}
        <div class="project-card__body">
          <h3 class="project-card__title">
            <a href="projects/detail.html?id=${encodeURIComponent(p.id)}">${escapeHtml(
      p.title
    )}</a>
          </h3>
          <p class="project-card__desc">${escapeHtml(p.description || "")}</p>
          ${
            Array.isArray(p.chips) && p.chips.length
              ? `<div class="project-card__chips">${p.chips
                  .map((c) => `<span>${escapeHtml(c)}</span>`)
                  .join("")}</div>`
              : ""
          }
        </div>
      </article>`;
  }

  function renderProjects() {
    if (!grid) return;
    const data = loadData();
    const list = (data.projects || window.PORTFOLIO_DEFAULTS.projects || [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    grid.innerHTML = list.map(cardHTML).join("");

    // 渐入
    requestAnimationFrame(() => {
      grid
        .querySelectorAll(".project-card")
        .forEach((el) => el.classList.add("reveal", "is-visible"));
    });

    updateCounts(list);
  }

  function updateCounts(list) {
    const counts = { all: list.length };
    list.forEach((p) => {
      const c = p.category || "";
      counts[c] = (counts[c] || 0) + 1;
    });
    document.querySelectorAll("[data-count-for]").forEach((el) => {
      const key = el.dataset.countFor;
      if (counts[key] !== undefined) el.textContent = counts[key];
    });
  }

  function applyFilter(filter) {
    if (!grid) return;
    let visible = 0;
    grid.querySelectorAll(".project-card").forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !match);
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      applyFilter(tab.dataset.filter);
    });
  });

  /* ---------- Reveal on scroll (其他段) ---------- */
  const reveals = document.querySelectorAll(
    ".about__prose, .about__now, .skills__prose, .skills__grid, " +
      ".timeline li, .contact__intro, .contact__list li, .section-title, " +
      ".hero__title, .hero__lede, .hero__cta, .hero__signoff"
  );
  reveals.forEach((el) => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Init ---------- */
  renderProjects();
})();
