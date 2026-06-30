/* =========================================================
   Portfolio · Project Detail Renderer
   - 读 ?id=xxx → 找项目 → 渲染
   - 数据来源：localStorage('portfolio:data') -> PORTFOLIO_DEFAULTS
   ========================================================= */
(function () {
  "use strict";

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

  function getProject() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (!id) return null;
    const data = loadData();
    const list = (data.projects || window.PORTFOLIO_DEFAULTS.projects) || [];
    return list.find((p) => p.id === id) || null;
  }

  function renderHero(project) {
    if (project.image && /^https?:\/\//.test(project.image)) {
      return `<figure class="detail__hero">
        <img src="${escapeAttr(project.image)}" alt="${escapeAttr(project.title)}" />
      </figure>`;
    }
    // 没图就用纸张底色的封面
    const c1 = project.cover1 || "#e8e2d4";
    const c2 = project.cover2 || "#d8cdb8";
    const initials =
      (project.title || "·").replace(/[^A-Za-z\u4e00-\u9fa5]/g, "").slice(0, 2) ||
      "·";
    return `<figure class="detail__hero detail__hero--empty" style="--c1:${escapeAttr(c1)};--c2:${escapeAttr(c2)}">
      <span class="detail__hero-initials">${escapeHtml(initials)}</span>
    </figure>`;
  }

  function renderBody(project) {
    const body =
      Array.isArray(project.detail) && project.detail.length
        ? project.detail
        : project.description
        ? [project.description]
        : [];
    if (!body.length) {
      return `<p class="detail__body-empty">这个项目还没有写详情，等待你回来填。<em>在 admin · 项目 · 编辑项目 · 「详情页正文」里写。</em></p>`;
    }
    return body
      .map(
        (p) =>
          `<p>${escapeHtml(p)
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>")}</p>`
      )
      .join("");
  }

  function renderChips(project) {
    if (!Array.isArray(project.chips) || !project.chips.length) return "";
    return `<div class="detail__chips">${project.chips
      .map((c) => `<span>${escapeHtml(c)}</span>`)
      .join("")}</div>`;
  }

  function render() {
    const root = document.getElementById("detail-root");
    const loading = document.getElementById("detail-loading");
    if (loading) loading.remove();

    const project = getProject();

    // 把 owner 名同步到 nav / footer
    const data = loadData();
    const ownerName =
      (data.owner && data.owner.name) ||
      (window.PORTFOLIO_DEFAULTS.owner && window.PORTFOLIO_DEFAULTS.owner.name) ||
      "[ 你的名字 ]";
    document.querySelectorAll("#owner-name, #owner-name-foot").forEach((el) => {
      el.textContent = ownerName;
    });

    if (!project) {
      root.innerHTML = `
        <a class="detail__back" href="../index.html#projects">← 所有项目</a>
        <div class="detail__not-found">
          <h1 class="detail__title">没找到这个项目</h1>
          <p>链接可能过期了，或者项目在 admin 里被删除了。<br />回去看看其他项目吧。</p>
          <a class="detail__link" href="../index.html#projects">回到项目列表 →</a>
        </div>`;
      return;
    }

    // 同分类的「上一个 / 下一个」链接
    const list = (data.projects || window.PORTFOLIO_DEFAULTS.projects) || [];
    const sorted = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sorted.findIndex((p) => p.id === project.id);
    const prev = idx > 0 ? sorted[idx - 1] : null;
    const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

    document.title = `${project.title} · 项目详情`;

    root.innerHTML = `
      <a class="detail__back" href="../index.html#projects">← 所有项目</a>

      <header class="detail__head">
        <p class="detail__eyebrow">
          <span class="detail__year">${escapeHtml(project.year || "")}</span>
          ${project.year && project.tag ? '<span class="detail__dot">·</span>' : ""}
          <span class="detail__tag">${escapeHtml(project.tag || "")}</span>
        </p>
        <h1 class="detail__title">${escapeHtml(project.title)}</h1>
        ${project.description ? `<p class="detail__lede">${escapeHtml(project.description)}</p>` : ""}
      </header>

      ${renderHero(project)}

      <article class="detail__body">
        ${renderBody(project)}
      </article>

      ${renderChips(project)}

      ${
        project.link
          ? `<a class="detail__link" href="${escapeAttr(project.link)}" target="_blank" rel="noopener">查看现场 ↗</a>`
          : ""
      }

      <nav class="detail__nav" aria-label="项目导航">
        ${
          prev
            ? `<a class="detail__nav-item detail__nav-item--prev" href="detail.html?id=${encodeURIComponent(prev.id)}">
                <span class="detail__nav-label">← 上一件</span>
                <span class="detail__nav-title">${escapeHtml(prev.title)}</span>
              </a>`
            : '<span></span>'
        }
        ${
          next
            ? `<a class="detail__nav-item detail__nav-item--next" href="detail.html?id=${encodeURIComponent(next.id)}">
                <span class="detail__nav-label">下一件 →</span>
                <span class="detail__nav-title">${escapeHtml(next.title)}</span>
              </a>`
            : '<span></span>'
        }
      </nav>`;

    // 渐入
    requestAnimationFrame(() => {
      root.querySelectorAll(
        ".detail__head, .detail__hero, .detail__body, .detail__chips, .detail__link, .detail__nav"
      ).forEach((el) => el.classList.add("reveal", "is-visible"));
    });
  }

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const THEME_KEY = "portfolio-theme";

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
  }
  applyTheme(
    localStorage.getItem(THEME_KEY) ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

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

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  render();
})();
