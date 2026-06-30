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
    let data;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) data = JSON.parse(raw);
    } catch (e) {
      /* ignore */
    }
    if (!data) return window.PORTFOLIO_DEFAULTS || {};
    return normalize(data);
  }

  /**
   * 把老 localStorage 数据里缺失的字段补上默认值。
   * 这样 admin / data.js 加新字段时，旧数据还能 graceful 退化。
   */
  function normalize(data) {
    const defaults = window.PORTFOLIO_DEFAULTS || {};
    const merged = mergeDefaults(data, defaults);
    // 项目按 id 合并，避免老数据缺少新增字段时详情页或卡片异常
    if (Array.isArray(defaults.projects) && Array.isArray(data.projects)) {
      const defById = Object.fromEntries(defaults.projects.map((p) => [p.id, p]));
      merged.projects = data.projects.map((p) => ({
        ...(defById[p.id] || {}),
        ...p,
      }));
    }
    return merged;
  }

  function mergeDefaults(data, defaults) {
    if (Array.isArray(defaults)) {
      return Array.isArray(data) ? data : clone(defaults);
    }
    if (defaults && typeof defaults === "object") {
      const out = {};
      Object.keys(defaults).forEach((key) => {
        out[key] =
          data && key in data ? mergeDefaults(data[key], defaults[key]) : clone(defaults[key]);
      });
      if (data && typeof data === "object") {
        Object.keys(data).forEach((key) => {
          if (!(key in out)) out[key] = data[key];
        });
      }
      return out;
    }
    return data !== undefined ? data : defaults;
  }

  function clone(value) {
    return value && typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
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

  function sanitizeInlineHtml(value) {
    const template = document.createElement("template");
    template.innerHTML = String(value == null ? "" : value);
    const allowed = new Set(["STRONG", "EM", "B", "I", "BR", "CODE"]);

    function walk(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) return;
        if (child.nodeType !== Node.ELEMENT_NODE) {
          child.remove();
          return;
        }
        if (!allowed.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent || ""));
          return;
        }
        Array.from(child.attributes).forEach((attr) => child.removeAttribute(attr.name));
        walk(child);
      });
    }

    walk(template.content);
    return template.innerHTML;
  }

  function stripLocationIcon(value) {
    return String(value || "").replace(/^📍\s*/, "").trim();
  }

  function externalHref(value, type) {
    const v = String(value || "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v) || /^mailto:/i.test(v)) return v;
    if (type === "email") return `mailto:${v}`;
    if (type === "github") {
      if (/^github\.com\//i.test(v)) return `https://${v}`;
      if (v.startsWith("@")) return `https://github.com/${encodeURIComponent(v.slice(1))}`;
    }
    if (type === "twitter") {
      if (/^(x|twitter)\.com\//i.test(v)) return `https://${v}`;
      if (v.startsWith("@")) return `https://x.com/${encodeURIComponent(v.slice(1))}`;
    }
    return "";
  }

  /* ---------- Page content: render from admin data ---------- */
  function renderOwner(data) {
    const owner = data.owner || {};
    const name = owner.name || "[ 你的名字 ]";
    const location = stripLocationIcon(owner.location);

    document.title = `${name} · 个人作品集`;
    document.querySelectorAll(".nav__logo span:last-child").forEach((el) => {
      el.textContent = name;
    });

    const heroEyebrow = document.querySelector(".hero__eyebrow");
    if (heroEyebrow) {
      heroEyebrow.textContent = `${new Date().getFullYear()}${location ? ` · ${location}` : ""}`;
    }

    const heroTitle = document.querySelector(".hero__title");
    if (heroTitle) {
      heroTitle.innerHTML = `你好，我是 <span class="hl" id="user-name">${escapeHtml(
        name
      )}</span>。<br />${escapeHtml(owner.tagline || "写代码，也写一点点东西。")}`;
    }

    const heroLede = document.querySelector(".hero__lede");
    if (heroLede && owner.intro) heroLede.textContent = owner.intro;

    const signoff = document.getElementById("hero-signoff");
    if (signoff) {
      const bits = [
        owner.yearsExp ? `${owner.yearsExp} 经验` : "",
        owner.projectsCount ? `${owner.projectsCount} 项目` : "",
      ].filter(Boolean);
      signoff.textContent = bits.length
        ? bits.join(" · ")
        : `V. ${new Date().getFullYear()} · 持续更新中`;
    }

    const footer = document.querySelector(".footer p");
    if (footer) {
      footer.innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${escapeHtml(
        name
      )}${location ? ` · 写于${escapeHtml(location)}` : ""}`;
    }
  }

  function renderAbout(data) {
    const about = data.about || {};
    const prose = document.querySelector(".about__prose");
    const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : [];
    if (prose) {
      prose.innerHTML = paragraphs
        .map((p) => `<p>${sanitizeInlineHtml(p)}</p>`)
        .join("");
    }

    const nowList = document.querySelector(".about__now ul");
    const now = Array.isArray(about.now) ? about.now : [];
    if (nowList) {
      nowList.innerHTML = now.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }
  }

  function renderSkills(data) {
    const gridEl = document.querySelector(".skills__grid");
    if (!gridEl) return;
    const groups = Array.isArray(data.skills) ? data.skills : [];
    gridEl.innerHTML = groups
      .map(
        (group) => `<div class="skills__group">
          <h3>${escapeHtml(group.group || "技能")}</h3>
          <ul>${(group.items || [])
            .map((item) => {
              const level =
                item.level != null && item.level !== ""
                  ? item.level
                  : item.pct != null
                  ? `${item.pct}%`
                  : "";
              return `<li><span>${escapeHtml(item.name || "")}</span><span>${escapeHtml(
                level
              )}</span></li>`;
            })
            .join("")}</ul>
        </div>`
      )
      .join("");
  }

  function renderTimeline(data) {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;
    const items = Array.isArray(data.timeline) ? data.timeline : [];
    timeline.innerHTML = items
      .map(
        (item) => `<li>
          <div class="t-time">${escapeHtml(item.time || "")}</div>
          <div class="t-body">
            <h3>${escapeHtml(item.title || "")}</h3>
            <p>${escapeHtml(item.body || "")}</p>
          </div>
        </li>`
      )
      .join("");
  }

  function contactItemHTML(label, value, type) {
    if (!value) return "";
    const href = externalHref(value, type);
    const valueHTML = href
      ? `<a class="contact__value" href="${escapeAttr(href)}" ${
          type === "email" ? "" : 'target="_blank" rel="noopener"'
        }>${escapeHtml(value)}</a>`
      : `<span class="contact__value">${escapeHtml(value)}</span>`;
    return `<li>
      <span class="contact__label">${escapeHtml(label)}</span>
      ${valueHTML}
      <span class="contact__arrow">↗</span>
    </li>`;
  }

  function renderContact(data) {
    const list = document.querySelector(".contact__list");
    if (!list) return;
    const contact = data.contact || {};
    list.innerHTML = [
      contactItemHTML("邮箱", contact.email, "email"),
      contactItemHTML("GitHub", contact.github, "github"),
      contactItemHTML("Twitter / X", contact.twitter, "twitter"),
      contactItemHTML("小红书", contact.xhs, "xhs"),
    ].join("");
  }

  function renderPageContent() {
    const data = loadData();
    renderOwner(data);
    renderAbout(data);
    renderSkills(data);
    renderTimeline(data);
    renderContact(data);
    renderProjects(data);
    prepareReveals();
  }

  /* ---------- Projects: render ---------- */
  const grid = document.getElementById("projects-grid");
  const empty = document.getElementById("projects-empty");
  const tabsWrap = document.querySelector(".filter-tabs");
  let activeFilter = "all";

  function coverHTML(p) {
    // 这里不再限定 http(s) —— 任何非空路径都直接用，支持 assets/images/xxx.jpg 相对路径
    if (p.image && p.image.trim()) {
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

  function renderProjects(data) {
    if (!grid) return;
    const list = (data.projects || window.PORTFOLIO_DEFAULTS.projects || [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    renderFilterTabs(data, list);
    grid.innerHTML = list.map(cardHTML).join("");

    // 渐入
    requestAnimationFrame(() => {
      grid
        .querySelectorAll(".project-card")
        .forEach((el) => el.classList.add("reveal", "is-visible"));
    });

    updateCounts(list);
    applyFilter(activeFilter);
  }

  function renderFilterTabs(data, list) {
    if (!tabsWrap) return;
    const categories = (data.categories || [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const hasActive =
      activeFilter === "all" || categories.some((category) => category.id === activeFilter);
    if (!hasActive) activeFilter = "all";

    const counts = { all: list.length };
    list.forEach((p) => {
      const c = p.category || "";
      counts[c] = (counts[c] || 0) + 1;
    });

    const buttons = [
      { id: "all", label: "全部", count: counts.all || 0 },
      ...categories.map((category) => ({
        id: category.id,
        label: category.label,
        count: counts[category.id] || 0,
      })),
    ];

    tabsWrap.innerHTML = buttons
      .map(
        (button) => `<button class="filter-tab ${
          button.id === activeFilter ? "is-active" : ""
        }" data-filter="${escapeAttr(button.id)}" role="tab" aria-selected="${
          button.id === activeFilter ? "true" : "false"
        }">
          ${escapeHtml(button.label)}<span class="filter-tab__count" data-count-for="${escapeAttr(
          button.id
        )}">${escapeHtml(button.count)}</span>
        </button>`
      )
      .join("");

    tabsWrap.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        activeFilter = tab.dataset.filter || "all";
        tabsWrap.querySelectorAll(".filter-tab").forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        applyFilter(activeFilter);
      });
    });
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

  /* ---------- Reveal on scroll (其他段) ---------- */
  const revealSelector =
    ".about__prose, .about__now, .skills__prose, .skills__grid, " +
    ".timeline li, .contact__intro, .contact__list li, .section-title, " +
    ".hero__title, .hero__lede, .hero__cta, .hero__signoff";
  let revealObserver = null;

  function prepareReveals() {
    const reveals = document.querySelectorAll(revealSelector);
    reveals.forEach((el) => {
      if (el.dataset.revealReady === "1") return;
      el.dataset.revealReady = "1";
      el.classList.add("reveal");
      if (revealObserver) {
        revealObserver.observe(el);
      } else {
        el.classList.add("is-visible");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }

  /* ---------- Init ---------- */
  renderPageContent();

  /* ---------- 监听页面重新可见：用户从 admin 切回来时前台自动刷新 ---------- */
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      renderPageContent();
    }
  });

  /* ---------- 也监听 storage 事件：同一浏览器多 tab 场景 ---------- */
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      renderPageContent();
    }
  });
})();
