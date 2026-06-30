/* =========================================================
   Portfolio · Admin
   - 纯静态 + localStorage
   - hash 路由
   - 项目 / 分类 / 关于我 / 技能 / 经历 / 联系 / 设置
   ========================================================= */
(function () {
  "use strict";

  /* =========================================================
     1. 数据层
     ========================================================= */
  const STORAGE_KEY = "portfolio:data";
  const SESSION_KEY = "portfolio:admin-session";

  const DEFAULT_DATA = {
    version: 1,
    owner: {
      name: "[ 你的名字 ]",
      tagline: "做有温度的产品与代码。",
      intro: "一个面向 AI / Web / 产品工程方向的独立开发者。",
      location: "📍 JP",
      yearsExp: "5+",
      projectsCount: "30+",
    },
    about: {
      paragraphs: [
        "我是一名独立产品工程师，过去几年主要在 <strong>Web 应用、AI 工程化、独立产品</strong> 这几条线上工作。",
        "喜欢从 0 到 1 自己搞：写代码、做设计、想产品策略、跑客户访谈。比起大厂里把一颗螺丝钉做亮，我更想把一整件事从想法变成有人用的东西。",
        "工作之外，我在持续写关于 AI 工具、独立开发的笔记。最近搬到了日本，正在适应这边的节奏。",
      ],
      now: [
        "搭建面向小白的 AI 知识小红书账号",
        "维护几个独立 SaaS / 工具类项目",
        "探索 Agent / 多 Agent 协作的工作流",
        "学日语（がんばっています）",
      ],
    },
    categories: [
      { id: "ml", label: "机器学习算法", icon: "🤖", order: 0 },
      { id: "web", label: "网站系统", icon: "🌐", order: 1 },
      { id: "product", label: "产品工具", icon: "🛠", order: 2 },
      { id: "agent", label: "Agent / AI 工程", icon: "🧠", order: 3 },
    ],
    projects: [
      {
        id: "alpha",
        title: "Project Alpha",
        year: "2025",
        category: "product",
        tag: "AI · SaaS",
        description:
          "一个面向内容创作者的 AI 选题与文案助手，结合历史内容库做风格匹配与灵感推荐。",
        image: "",
        detail: [
          "我做了一个面向内容创作者的 AI 工具。",
          "它的核心想法很简单：把你过去写过的东西喂给它，让它理解你的风格和偏好，然后基于这个做选题推荐、文案生成、风格延续。",
          "整个流程跑在 Next.js + Postgres + OpenAI 上，前端尽量做得克制，把重点留给作者的语言本身。",
        ],
        chips: ["Next.js", "OpenAI", "Postgres"],
        cover1: "#e8e2d4",
        cover2: "#d8cdb8",
        link: "",
        order: 0,
      },
      {
        id: "beta",
        title: "Project Beta",
        year: "2019",
        category: "web",
        tag: "Web · WordPress",
        description:
          "为线下店铺交付的官网与后台管理系统，含自定义主题、插件、CMS 工作流与移动端预约导流。",
        image: "",
        detail: [
          "一个餐饮连锁品牌的官网+后台项目。",
          "前端自定义 WordPress 主题，后端做了一个轻量的库存/预约管理，附带一个移动端的预约引导页。",
          "整套系统在 Docker 上跑，CI 走 GitHub Actions。",
        ],
        chips: ["WordPress", "PHP", "Docker"],
        cover1: "#e8d4c4",
        cover2: "#d4c0b0",
        link: "",
        order: 1,
      },
      {
        id: "gamma",
        title: "Project Gamma",
        year: "2021",
        category: "ml",
        tag: "Computer Vision",
        description:
          "基于姿态估计的实时人体动作检测，覆盖异常姿态、跌倒、碰撞等场景的工业级告警。",
        image: "",
        detail: [
          "工业场景的人体动作检测系统。",
          "PyTorch 做的姿态估计模型，部署在边缘设备（Jetson）上做实时推断，配合一个简单的告警工作流。",
          "通过 MQTT 把告警推到车间的中控屏，做人工兜底。",
        ],
        chips: ["Python", "PyTorch", "Edge"],
        cover1: "#d8d8d2",
        cover2: "#c0c0ba",
        link: "",
        order: 2,
      },
      {
        id: "delta",
        title: "Project Delta",
        year: "2025",
        category: "product",
        tag: "Productivity",
        description:
          "一款用 AI 把口语 / 想法自动整理成结构化小说的写作工具，作者只需保留灵感流。",
        image: "",
        detail: [
          "一个面向小说作者的写作工具。",
          "作者用语音或片段文字记录灵感，后台用 LLM 自动整理成结构化的剧情卡、人物卡、世界观条目，写正文时可以从这些卡里直接拖过来。",
          "整个产品强调「作者保留灵感流」，AI 只做整理，不替作者决定故事。",
        ],
        chips: ["LLM", "Prompt Eng.", "Web App"],
        cover1: "#dcc8d8",
        cover2: "#c8b4cc",
        link: "",
        order: 3,
      },
      {
        id: "epsilon",
        title: "Project Epsilon",
        year: "2026",
        category: "agent",
        tag: "Agent · Infra",
        description:
          "多 Agent 协作框架，把复杂任务拆给具备不同专长的 Agent 跑，输出可审计的工作报告。",
        image: "",
        detail: [
          "一个多 Agent 协作框架。",
          "主控 Agent 拿到任务后拆解给具备不同专长的子 Agent（代码、研究、写作、审稿），子 Agent 各自跑完了把结果聚合回来，主控 Agent 出最终审计报告。",
          "TypeScript 写的核心调度器，TypeScript + Python 混用的子 Agent 生态。",
        ],
        chips: ["Agents", "TypeScript", "Tooling"],
        cover1: "#c8d8d8",
        cover2: "#b0c0c8",
        link: "",
        order: 4,
      },
    ],
    skills: [
      {
        group: "前端 / 设计",
        items: [
          { name: "HTML / CSS / 现代 JS", pct: 92 },
          { name: "React / Next.js", pct: 85 },
          { name: "Tailwind / 设计系统", pct: 80 },
          { name: "Figma / 动效", pct: 75 },
        ],
      },
      {
        group: "后端 / 工程",
        items: [
          { name: "Node.js / Python", pct: 88 },
          { name: "Postgres / Redis", pct: 80 },
          { name: "Docker / CI/CD", pct: 78 },
          { name: "WordPress / PHP", pct: 70 },
        ],
      },
      {
        group: "AI / 数据",
        items: [
          { name: "LLM 应用与 Prompt", pct: 88 },
          { name: "RAG / Agent 编排", pct: 82 },
          { name: "PyTorch / 视觉", pct: 70 },
          { name: "数据可视化", pct: 78 },
        ],
      },
      {
        group: "产品 / 协作",
        items: [
          { name: "需求拆解 / PRD", pct: 88 },
          { name: "客户访谈 / 销售", pct: 80 },
          { name: "独立项目全栈", pct: 90 },
          { name: "中 / 英 / 日 沟通", pct: 75 },
        ],
      },
    ],
    timeline: [
      {
        time: "2026 — Now",
        title: "独立产品 / 内容创作",
        body:
          "在日本做独立开发者，运营小红书「小白 AI 扫盲」账号，维护多个 AI / Web 工具。",
      },
      {
        time: "2024 — 2025",
        title: "AI 工程化方向",
        body:
          "把 LLM、RAG、Agent 能力嵌入真实业务场景，做了几套面向内容运营和电商的工具。",
      },
      {
        time: "2022 — 2024",
        title: "Web 全栈 / 客户交付",
        body:
          "负责多个客户项目从需求到上线的全流程，含官网、SaaS、内部系统，WordPress / Next.js / Python 都做。",
      },
      {
        time: "2020 — 2022",
        title: "计算机视觉 / 早期工程",
        body: "做工业场景的姿态估计、动作检测和告警系统，落地过几个产线项目。",
      },
    ],
    contact: {
      email: "hello@example.com",
      twitter: "@your_handle",
      github: "github.com/your_handle",
      xhs: "@your_xhs",
    },
    meta: {
      password: "admin",
    },
  };

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        saveData(DEFAULT_DATA);
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
      const parsed = JSON.parse(raw);
      // 浅合并默认值，避免老数据缺字段报错
      return mergeDefaults(parsed, DEFAULT_DATA);
    } catch (e) {
      console.error("loadData failed", e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  function mergeDefaults(data, defaults) {
    if (Array.isArray(defaults)) {
      return Array.isArray(data) ? data : JSON.parse(JSON.stringify(defaults));
    }
    if (defaults && typeof defaults === "object") {
      const out = {};
      for (const k of Object.keys(defaults)) {
        out[k] =
          data && k in data
            ? mergeDefaults(data[k], defaults[k])
            : JSON.parse(JSON.stringify(defaults[k]));
      }
      // 保留 data 里独有的字段
      if (data) {
        for (const k of Object.keys(data)) {
          if (!(k in out)) out[k] = data[k];
        }
      }
      return out;
    }
    return data !== undefined ? data : defaults;
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      toast("保存失败：localStorage 不可用", "error");
      return false;
    }
  }

  let data = loadData();

  /* =========================================================
     2. 工具
     ========================================================= */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k of Object.keys(attrs)) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else if (k.startsWith("on") && typeof attrs[k] === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (k === "style" && typeof attrs[k] === "object") {
          Object.assign(node.style, attrs[k]);
        } else if (attrs[k] !== undefined && attrs[k] !== null) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    if (children) {
      const arr = Array.isArray(children) ? children : [children];
      for (const c of arr) {
        if (c == null) continue;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      }
    }
    return node;
  }
  function uid(prefix) {
    return (
      (prefix || "id") +
      "-" +
      Date.now().toString(36).slice(-4) +
      Math.random().toString(36).slice(-4)
    );
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function categoryById(id) {
    return data.categories.find((c) => c.id === id) || { label: id, icon: "•" };
  }
  function projectsByCategory(catId) {
    return data.projects.filter((p) => p.category === catId).length;
  }

  /* =========================================================
     3. Toast & Modal
     ========================================================= */
  let toastTimer = null;
  function toast(msg, type) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.toggle("toast--error", type === "error");
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("is-show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("is-show");
      setTimeout(() => (t.hidden = true), 250);
    }, 1800);
  }

  function openModal({ title, body, footer }) {
    const root = $("#modal-root");
    $("#modal-title").textContent = title;
    const bodyEl = $("#modal-body");
    bodyEl.innerHTML = "";
    if (body instanceof Node) bodyEl.appendChild(body);
    else bodyEl.innerHTML = body || "";
    const footEl = $("#modal-foot");
    footEl.innerHTML = "";
    if (footer) {
      if (Array.isArray(footer)) footer.forEach((b) => footEl.appendChild(b));
      else footEl.appendChild(footer);
    }
    root.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    $("#modal-root").hidden = true;
    document.body.style.overflow = "";
  }
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-modal-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#modal-root").hidden) closeModal();
  });

  /* =========================================================
     4. 主题 / 登录
     ========================================================= */
  const THEME_KEY = "portfolio-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
  }
  applyTheme(
    localStorage.getItem(THEME_KEY) ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  $("#theme-toggle").addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "ok";
  }
  function setLoggedIn(v) {
    if (v) sessionStorage.setItem(SESSION_KEY, "ok");
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function showLogin() {
    $("#login-view").hidden = false;
    $("#admin-shell").hidden = true;
    setTimeout(() => $("#login-password")?.focus(), 50);
  }
  function showApp() {
    $("#login-view").hidden = true;
    $("#admin-shell").hidden = false;
  }

  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pw = $("#login-password").value;
    const expected = data.meta?.password || "admin";
    if (pw === expected) {
      setLoggedIn(true);
      $("#login-error").hidden = true;
      $("#login-password").value = "";
      showApp();
      route();
    } else {
      const err = $("#login-error");
      err.textContent = "密码错误，演示密码是 admin";
      err.hidden = false;
    }
  });

  $("#logout-btn").addEventListener("click", () => {
    setLoggedIn(false);
    showLogin();
    location.hash = "";
  });

  /* =========================================================
     5. 路由
     ========================================================= */
  const ROUTES = {
    dashboard: { title: "概览", crumb: "概览", render: renderDashboard },
    projects: { title: "项目管理", crumb: "项目", render: renderProjects },
    "project-edit": {
      title: "编辑项目",
      crumb: "项目 / 编辑",
      render: (params) => renderProjectEdit(params.id),
    },
    "project-new": {
      title: "新建项目",
      crumb: "项目 / 新建",
      render: renderProjectNew,
    },
    categories: { title: "分类管理", crumb: "分类", render: renderCategories },
    about: { title: "关于我", crumb: "关于我", render: renderAbout },
    skills: { title: "技能图谱", crumb: "技能", render: renderSkills },
    timeline: { title: "经历时间线", crumb: "经历", render: renderTimeline },
    contact: { title: "联系方式", crumb: "联系", render: renderContact },
    settings: { title: "设置", crumb: "设置", render: renderSettings },
  };

  function parseHash() {
    const h = (location.hash || "").replace(/^#\/?/, "");
    if (!h) return { name: "dashboard", params: {} };
    const parts = h.split("/");
    return { name: parts[0], params: { id: parts[1] } };
  }

  function route() {
    if (!isLoggedIn()) {
      showLogin();
      return;
    }
    showApp();
    const { name, params } = parseHash();
    const r = ROUTES[name] || ROUTES.dashboard;
    $("#crumb").textContent = r.crumb;
    $("#page-title").textContent = r.title;
    $$(".admin-side__nav a").forEach((a) =>
      a.classList.toggle("is-active", a.dataset.nav === name)
    );
    const view = $("#view");
    view.innerHTML = "";
    r.render(params);
  }

  window.addEventListener("hashchange", route);

  /* =========================================================
     6. 视图：Dashboard
     ========================================================= */
  function renderDashboard() {
    const view = $("#view");
    const totalProjects = data.projects.length;
    const totalCategories = data.categories.length;
    const totalChips = data.projects.reduce(
      (a, p) => a + (p.chips || []).length,
      0
    );
    const updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });

    view.appendChild(
      el("div", { class: "stats-grid" }, [
        statCard("项目数量", totalProjects, `共 ${totalCategories} 个分类`),
        statCard("分类数量", totalCategories, "可在分类页管理"),
        statCard("标签 / 技能", totalChips, "所有项目的标签累计"),
        statCard("最近更新", updatedAt, "本地时间"),
      ])
    );

    const quickHeader = el("div", { class: "section-card__head" }, [
      el("h3", { text: "快捷操作" }),
    ]);
    const quickGrid = el(
      "div",
      { class: "quick-actions" },
      [
        quickAction("新建项目", "把最近做的项目加进来", () => {
          location.hash = "#/project-new";
        }),
        quickAction("管理分类", "调整分类标签和顺序", () => {
          location.hash = "#/categories";
        }),
        quickAction("编辑关于我", "更新介绍 / 现在在做的事", () => {
          location.hash = "#/about";
        }),
        quickAction("打开前台", "查看效果（新窗口）", () => {
          window.open("../", "_blank");
        }),
      ]
    );
    const card = el("div", { class: "section-card" }, [quickHeader, quickGrid]);
    view.appendChild(card);
  }

  function statCard(label, value, hint) {
    return el("div", { class: "stat-card" }, [
      el("div", { class: "stat-card__label", text: label }),
      el("div", { class: "stat-card__value", text: String(value) }),
      hint ? el("div", { class: "stat-card__hint", text: hint }) : null,
    ]);
  }

  function quickAction(title, desc, onClick) {
    const a = el("button", { class: "quick-action", type: "button" }, [
      el("div", { class: "quick-action__title", text: title }),
      el("div", { class: "quick-action__desc", text: desc }),
    ]);
    a.addEventListener("click", onClick);
    return a;
  }

  /* =========================================================
     7. 视图：项目
     ========================================================= */
  function renderProjects() {
    const view = $("#view");
    const head = el("div", { class: "section-card__head" }, [
      el("h3", { text: `共 ${data.projects.length} 个项目` }),
      el(
        "button",
        {
          class: "btn btn--primary btn--sm",
          type: "button",
          onClick: () => (location.hash = "#/project-new"),
        },
        "+ 新建项目"
      ),
    ]);
    const card = el("div", { class: "section-card" }, [head]);

    if (data.projects.length === 0) {
      card.appendChild(
        el("div", { class: "empty" }, [
          el("div", { class: "empty__icon", text: "📦" }),
          el("div", { text: "还没有项目，先新建一个吧" }),
        ])
      );
    } else {
      const sorted = [...data.projects].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      sorted.forEach((p) => card.appendChild(projectRow(p)));
    }
    view.appendChild(card);
  }

  function projectRow(p) {
    const cat = categoryById(p.category);
    const row = el(
      "div",
      { class: "project-row" },
      [
        el("div", {
          class: "project-row__cover",
          style: {
            background: `linear-gradient(135deg, ${p.cover1 || "#6366f1"}, ${p.cover2 || "#06b6d4"})`,
          },
        }),
        el("div", { class: "project-row__meta" }, [
          el("div", { class: "project-row__title" }, [
            el("span", { text: p.title }),
            el("span", { class: "badge", text: cat.icon + " " + cat.label }),
            p.tag ? el("span", { class: "badge", text: p.tag }) : null,
          ]),
          el("div", { class: "project-row__desc", text: p.description || "" }),
        ]),
        el("div", { class: "project-row__actions" }, [
          el(
            "button",
            {
              class: "btn btn--ghost btn--sm",
              type: "button",
              onClick: () => (location.hash = "#/project-edit/" + p.id),
            },
            "编辑"
          ),
          el(
            "button",
            {
              class: "btn btn--danger btn--sm",
              type: "button",
              onClick: () => confirmDeleteProject(p),
            },
            "删除"
          ),
        ]),
      ]
    );
    return row;
  }

  function confirmDeleteProject(p) {
    const okBtn = el(
      "button",
      {
        class: "btn btn--danger",
        type: "button",
        onClick: () => {
          data.projects = data.projects.filter((x) => x.id !== p.id);
          saveData(data);
          closeModal();
          toast("项目已删除");
          route();
        },
      },
      "确认删除"
    );
    const cancelBtn = el(
      "button",
      {
        class: "btn btn--ghost",
        type: "button",
        onClick: closeModal,
      },
      "取消"
    );
    openModal({
      title: `删除「${p.title}」？`,
      body: `<p style="margin:0;color:var(--c-text-soft);">这个操作会立刻从本地数据中移除，没法撤销（除非从备份恢复）。</p>`,
      footer: [cancelBtn, okBtn],
    });
  }

  function renderProjectNew() {
    renderProjectForm(null);
  }
  function renderProjectEdit(id) {
    const p = data.projects.find((x) => x.id === id);
    if (!p) {
      toast("找不到这个项目", "error");
      location.hash = "#/projects";
      return;
    }
    renderProjectForm(p);
  }

  function renderProjectForm(existing) {
    const view = $("#view");
    const isEdit = !!existing;
    const p = existing || {
      id: "",
      title: "",
      year: new Date().getFullYear().toString(),
      category: data.categories[0]?.id || "",
      tag: "",
      description: "",
      image: "",
      detail: [],
      chips: [],
      cover1: "#e8e2d4",
      cover2: "#d8cdb8",
      link: "",
      order: data.projects.length,
    };

    const card = el("div", { class: "section-card" });

    // title
    card.appendChild(
      el("div", { class: "form-row" }, [
        el("label", null, [el("span", { text: "项目名称 *" })]),
        (() => {
          const i = el("input", { type: "text", value: p.title, placeholder: "例如：智能客服系统" });
          i.dataset.k = "title";
          return i;
        })(),
      ])
    );

    // category / tag
    const sel = el(
      "select",
      { "data-k": "category" },
      data.categories.map((c) =>
        el("option", { value: c.id, selected: c.id === p.category ? "" : null }, c.icon + " " + c.label)
      )
    );
    const tagInput = el("input", { type: "text", value: p.tag, placeholder: "例如：AI · SaaS" });
    tagInput.dataset.k = "tag";

    // year
    const yearInput = el("input", { type: "text", value: p.year || "", placeholder: "例如：2025", maxlength: "8" });
    yearInput.dataset.k = "year";

    card.appendChild(
      el("div", { class: "form-grid form-grid--3" }, [
        el("div", { class: "form-row" }, [el("label", null, [el("span", { text: "分类 *" })]), sel]),
        el("div", { class: "form-row" }, [el("label", null, [el("span", { text: "卡片标签" })]), tagInput]),
        el("div", { class: "form-row" }, [el("label", null, [el("span", { text: "年份" })]), yearInput]),
      ])
    );

    // description
    const desc = el("textarea", { "data-k": "description", placeholder: "一段话讲清楚这个项目是什么、解决了什么问题" });
    desc.value = p.description;
    card.appendChild(
      el("div", { class: "form-row" }, [
        el("label", null, [el("span", { text: "项目描述" })]),
        desc,
      ])
    );

    // image (URL)
    const imgInput = el("input", {
      type: "url",
      value: p.image || "",
      placeholder: "https://example.com/cover.jpg  （留空则用下面的纯色封面）",
    });
    imgInput.dataset.k = "image";
    card.appendChild(
      el("div", { class: "form-row" }, [
        el("label", null, [
          el("span", { text: "封面图 URL" }),
          el("span", { class: "hint", text: "可选" }),
        ]),
        imgInput,
      ])
    );

    // detail (multi-paragraph, will show in detail.html)
    const detailVal = Array.isArray(p.detail) ? p.detail.join("\n\n") : p.detail || "";
    const detailInput = el("textarea", {
      "data-k": "detail",
      placeholder:
        "详细讲讲这个项目 — 背景、过程、踩过的坑、你的思考。\n每空一行 = 一个段落。\n用 **加粗** / *斜体* 也行。",
      rows: "8",
    });
    detailInput.value = detailVal;
    card.appendChild(
      el("div", { class: "form-row" }, [
        el("label", null, [
          el("span", { text: "详情页正文" }),
          el("span", { class: "hint", text: "空行分段 · 可选" }),
        ]),
        detailInput,
      ])
    );

    // chips
    const chipsInput = chipsEditor(p.chips || []);
    chipsInput.dataset.k = "chips";
    card.appendChild(
      el("div", { class: "form-row" }, [
        el("label", null, [el("span", { text: "技术标签" }), el("span", { class: "hint", text: "回车添加" })]),
        chipsInput,
      ])
    );

    // colors
    const c1 = el("input", { type: "color", value: p.cover1 });
    c1.dataset.k = "cover1";
    const c2 = el("input", { type: "color", value: p.cover2 });
    c2.dataset.k = "cover2";
    card.appendChild(
      el("div", { class: "form-grid form-grid--2" }, [
        el("div", { class: "form-row" }, [
          el("label", null, [el("span", { text: "封面渐变 - 左" })]),
          el("div", { class: "color-row" }, [c1]),
        ]),
        el("div", { class: "form-row" }, [
          el("label", null, [el("span", { text: "封面渐变 - 右" })]),
          el("div", { class: "color-row" }, [c2]),
        ]),
      ])
    );

    // link
    const link = el("input", { type: "url", value: p.link, placeholder: "https://..." });
    link.dataset.k = "link";
    card.appendChild(
      el("div", { class: "form-row" }, [
        el("label", null, [el("span", { text: "项目链接" }), el("span", { class: "hint", text: "可选" })]),
        link,
      ])
    );

    // footer
    const cardFoot = el(
      "div",
      { style: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "24px" } },
      [
        el(
          "button",
          {
            class: "btn btn--ghost",
            type: "button",
            onClick: () => (location.hash = "#/projects"),
          },
          "取消"
        ),
        el(
          "button",
          {
            class: "btn btn--primary",
            type: "button",
            onClick: () => saveProject(isEdit, p),
          },
          isEdit ? "保存修改" : "创建项目"
        ),
      ]
    );
    card.appendChild(cardFoot);
    view.appendChild(card);
  }

  function chipsEditor(initial) {
    const box = el("div", { class: "chips-input" });
    const state = [...initial];
    function rerender() {
      box.innerHTML = "";
      state.forEach((c, idx) => {
        const chip = el("span", { class: "chip" }, [
          document.createTextNode(c),
          el(
            "button",
            {
              type: "button",
              onClick: () => {
                state.splice(idx, 1);
                rerender();
              },
            },
            "×"
          ),
        ]);
        box.appendChild(chip);
      });
      const input = el("input", { type: "text", placeholder: "加一个标签…" });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          const v = input.value.trim();
          if (v && !state.includes(v)) {
            state.push(v);
            rerender();
          } else if (v) {
            input.value = "";
          }
        } else if (e.key === "Backspace" && !input.value && state.length) {
          state.pop();
          rerender();
        }
      });
      box.appendChild(input);
    }
    rerender();
    box._getValue = () => [...state];
    return box;
  }

  function saveProject(isEdit, original) {
    const view = $("#view");
    const title = view.querySelector('[data-k="title"]').value.trim();
    const year = view.querySelector('[data-k="year"]').value.trim();
    const category = view.querySelector('[data-k="category"]').value;
    const tag = view.querySelector('[data-k="tag"]').value.trim();
    const description = view.querySelector('[data-k="description"]').value.trim();
    const image = view.querySelector('[data-k="image"]').value.trim();
    const detailRaw = view.querySelector('[data-k="detail"]').value;
    const detail = detailRaw
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    const chips = view.querySelector('[data-k="chips"]')._getValue();
    const cover1 = view.querySelector('[data-k="cover1"]').value;
    const cover2 = view.querySelector('[data-k="cover2"]').value;
    const link = view.querySelector('[data-k="link"]').value.trim();

    if (!title) {
      toast("项目名称不能为空", "error");
      return;
    }
    if (!category) {
      toast("请选择一个分类", "error");
      return;
    }

    const record = {
      id: original.id || uid("p"),
      title,
      year,
      category,
      tag,
      description,
      image,
      detail,
      chips,
      cover1,
      cover2,
      link,
      order: original.order ?? data.projects.length,
    };

    if (isEdit) {
      const idx = data.projects.findIndex((p) => p.id === original.id);
      data.projects[idx] = record;
    } else {
      data.projects.push(record);
    }
    saveData(data);
    toast(isEdit ? "已保存" : "项目已创建");
    location.hash = "#/projects";
  }

  /* =========================================================
     8. 视图：分类
     ========================================================= */
  function renderCategories() {
    const view = $("#view");
    const head = el("div", { class: "section-card__head" }, [
      el("h3", { text: `共 ${data.categories.length} 个分类` }),
      el(
        "button",
        {
          class: "btn btn--primary btn--sm",
          type: "button",
          onClick: () => openCategoryForm(),
        },
        "+ 新建分类"
      ),
    ]);
    const card = el("div", { class: "section-card" }, [head]);

    if (data.categories.length === 0) {
      card.appendChild(
        el("div", { class: "empty" }, [
          el("div", { class: "empty__icon", text: "🗂" }),
          el("div", { text: "还没有分类，先建一个吧" }),
        ])
      );
    } else {
      data.categories
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .forEach((c) => card.appendChild(categoryRow(c)));
    }
    view.appendChild(card);
  }

  function categoryRow(c) {
    const count = projectsByCategory(c.id);
    return el(
      "div",
      { class: "category-row" },
      [
        el("div", { class: "category-row__icon", text: c.icon || "•" }),
        el("div", { class: "category-row__label", text: c.label }),
        el("div", { class: "category-row__count", text: count + " 个项目" }),
        el(
          "div",
          { style: { display: "flex", gap: "6px" } },
          [
            el(
              "button",
              {
                class: "btn btn--ghost btn--sm",
                type: "button",
                onClick: () => openCategoryForm(c),
              },
              "编辑"
            ),
            el(
              "button",
              {
                class: "btn btn--danger btn--sm",
                type: "button",
                onClick: () => confirmDeleteCategory(c),
                disabled: count > 0 ? "" : null,
                title: count > 0 ? "该分类下还有项目，无法删除" : "删除分类",
              },
              "删除"
            ),
          ]
        ),
      ]
    );
  }

  function openCategoryForm(existing) {
    const isEdit = !!existing;
    const c = existing || { id: "", label: "", icon: "✨", order: data.categories.length };

    const body = el("div", { class: "form-grid" }, [
      el("div", { class: "form-row" }, [
        el("label", null, [el("span", { text: "显示名 *" })]),
        (() => {
          const i = el("input", { type: "text", value: c.label, placeholder: "例如：内容创作" });
          i.id = "cat-label";
          return i;
        })(),
      ]),
      el("div", { class: "form-row" }, [
        el("label", null, [el("span", { text: "图标（emoji）" })]),
        (() => {
          const i = el("input", { type: "text", value: c.icon, placeholder: "🤖" });
          i.id = "cat-icon";
          return i;
        })(),
      ]),
    ]);

    const cancelBtn = el(
      "button",
      { class: "btn btn--ghost", type: "button", onClick: closeModal },
      "取消"
    );
    const saveBtn = el(
      "button",
      {
        class: "btn btn--primary",
        type: "button",
        onClick: () => {
          const label = $("#cat-label").value.trim();
          const icon = $("#cat-icon").value.trim() || "•";
          if (!label) {
            toast("分类名不能为空", "error");
            return;
          }
          if (isEdit) {
            const idx = data.categories.findIndex((x) => x.id === c.id);
            data.categories[idx] = { ...data.categories[idx], label, icon };
          } else {
            data.categories.push({
              id: uid("c"),
              label,
              icon,
              order: data.categories.length,
            });
          }
          saveData(data);
          closeModal();
          toast(isEdit ? "分类已更新" : "分类已创建");
          route();
        },
      },
      isEdit ? "保存" : "创建"
    );

    openModal({ title: isEdit ? "编辑分类" : "新建分类", body, footer: [cancelBtn, saveBtn] });
  }

  function confirmDeleteCategory(c) {
    if (projectsByCategory(c.id) > 0) {
      toast("该分类下还有项目，无法删除", "error");
      return;
    }
    const okBtn = el(
      "button",
      {
        class: "btn btn--danger",
        type: "button",
        onClick: () => {
          data.categories = data.categories.filter((x) => x.id !== c.id);
          saveData(data);
          closeModal();
          toast("分类已删除");
          route();
        },
      },
      "确认删除"
    );
    openModal({
      title: `删除分类「${c.label}」？`,
      body: `<p style="margin:0;color:var(--c-text-soft);">分类本身会被删除，里面的项目会被保留但变成「未分类」。</p>`,
      footer: [
        el("button", { class: "btn btn--ghost", type: "button", onClick: closeModal }, "取消"),
        okBtn,
      ],
    });
  }

  /* =========================================================
     9. 视图：关于我
     ========================================================= */
  function renderAbout() {
    const view = $("#view");
    const card = el("div", { class: "section-card" });

    // owner
    card.appendChild(el("h3", { text: "基础信息" }));
    card.appendChild(
      el("div", { class: "form-grid form-grid--2", style: { marginTop: "16px" } }, [
        field("姓名", "owner-name", data.owner.name),
        field("所在地", "owner-loc", data.owner.location),
        field("经验年数", "owner-years", data.owner.yearsExp),
        field("项目总数（展示用）", "owner-count", data.owner.projectsCount),
      ])
    );
    card.appendChild(
      el("div", { class: "form-row", style: { marginTop: "16px" } }, [
        el("label", null, [el("span", { text: "Hero 副标题（一句）" })]),
        (() => {
          const i = el("input", { type: "text", value: data.owner.tagline });
          i.id = "owner-tagline";
          return i;
        })(),
      ])
    );

    // about paragraphs
    card.appendChild(el("h3", { text: "自我介绍段落", style: { marginTop: "32px" } }));
    card.appendChild(
      el("p", {
        class: "hint",
        style: { color: "var(--c-text-mute)", fontSize: "13px", margin: "8px 0 12px" },
        text: "每段一行展示在「关于我」左侧，支持 HTML 标签（如 <strong>）。",
      })
    );
    const list = el("div", { id: "about-list" });
    (data.about.paragraphs || []).forEach((p, i) => list.appendChild(aboutRow(p, i)));
    card.appendChild(list);
    card.appendChild(
      el(
        "button",
        {
          class: "btn btn--ghost btn--sm",
          type: "button",
          style: { marginTop: "8px" },
          onClick: () => list.appendChild(aboutRow("", list.children.length)),
        },
        "+ 添加段落"
      )
    );

    // now
    card.appendChild(el("h3", { text: "「现在在做的事」清单", style: { marginTop: "32px" } }));
    const nowList = el("div", { id: "now-list" });
    (data.about.now || []).forEach((p, i) => nowList.appendChild(nowRow(p, i)));
    card.appendChild(nowList);
    card.appendChild(
      el(
        "button",
        {
          class: "btn btn--ghost btn--sm",
          type: "button",
          style: { marginTop: "8px" },
          onClick: () => nowList.appendChild(nowRow("", nowList.children.length)),
        },
        "+ 添加条目"
      )
    );

    // save
    card.appendChild(
      el(
        "div",
        { style: { display: "flex", justifyContent: "flex-end", marginTop: "32px" } },
        [
          el(
            "button",
            {
              class: "btn btn--primary",
              type: "button",
              onClick: saveAbout,
            },
            "保存"
          ),
        ]
      )
    );
    view.appendChild(card);
  }

  function field(label, id, value) {
    return el("div", { class: "form-row" }, [
      el("label", null, [el("span", { text: label })]),
      (() => {
        const i = el("input", { type: "text", value: value });
        i.id = id;
        return i;
      })(),
    ]);
  }

  function aboutRow(value, idx) {
    return el(
      "div",
      { class: "form-row", style: { marginBottom: "10px", display: "grid", "grid-template-columns": "1fr auto", gap: "8px", alignItems: "start" } },
      [
        (() => {
          const t = el("textarea");
          t.value = value;
          t.dataset.k = "about-p";
          return t;
        })(),
        el(
          "button",
          {
            class: "btn btn--danger btn--sm",
            type: "button",
            style: { marginTop: "4px" },
            onClick: (e) => e.target.closest(".form-row").remove(),
          },
          "删除"
        ),
      ]
    );
  }

  function nowRow(value, idx) {
    return el(
      "div",
      { class: "form-row", style: { marginBottom: "10px", display: "grid", "grid-template-columns": "1fr auto", gap: "8px", alignItems: "start" } },
      [
        (() => {
          const t = el("input", { type: "text", value: value });
          t.dataset.k = "now-p";
          return t;
        })(),
        el(
          "button",
          {
            class: "btn btn--danger btn--sm",
            type: "button",
            onClick: (e) => e.target.closest(".form-row").remove(),
          },
          "删除"
        ),
      ]
    );
  }

  function saveAbout() {
    data.owner.name = $("#owner-name").value.trim() || data.owner.name;
    data.owner.location = $("#owner-loc").value.trim();
    data.owner.yearsExp = $("#owner-years").value.trim();
    data.owner.projectsCount = $("#owner-count").value.trim();
    data.owner.tagline = $("#owner-tagline").value.trim();

    data.about.paragraphs = $$("#about-list [data-k='about-p']")
      .map((t) => t.value.trim())
      .filter(Boolean);
    data.about.now = $$("#now-list [data-k='now-p']")
      .map((t) => t.value.trim())
      .filter(Boolean);
    saveData(data);
    toast("关于我已保存");
  }

  /* =========================================================
     10. 视图：技能
     ========================================================= */
  function renderSkills() {
    const view = $("#view");
    const card = el("div", { class: "section-card" });
    card.appendChild(
      el("div", { class: "section-card__head" }, [
        el("h3", { text: `共 ${data.skills.length} 组技能` }),
        el(
          "button",
          {
            class: "btn btn--primary btn--sm",
            type: "button",
            onClick: () => addSkillGroup(),
          },
          "+ 新增分组"
        ),
      ])
    );

    data.skills.forEach((g, gi) => card.appendChild(skillGroup(g, gi)));
    card.appendChild(
      el(
        "div",
        { style: { display: "flex", justifyContent: "flex-end", marginTop: "24px" } },
        [
          el(
            "button",
            {
              class: "btn btn--primary",
              type: "button",
              onClick: () => {
                $$(".skill-group-row").forEach((row, gi) => {
                  data.skills[gi].group = row.querySelector("[data-k='group']").value.trim() || data.skills[gi].group;
                  data.skills[gi].items = $$("[data-item]", row)
                    .map((it) => ({
                      name: it.querySelector("[data-k='name']").value.trim(),
                      pct: Math.max(0, Math.min(100, Number(it.querySelector("[data-k='pct']").value) || 0)),
                    }))
                    .filter((it) => it.name);
                });
                saveData(data);
                toast("技能已保存");
              },
            },
            "保存全部"
          ),
        ]
      )
    );
    view.appendChild(card);
  }

  function skillGroup(g, gi) {
    const items = el("div");
    function rerender() {
      items.innerHTML = "";
      g.items.forEach((it, idx) => items.appendChild(skillItem(it, idx, items, g)));
    }
    rerender();

    const head = el(
      "div",
      { style: { display: "grid", "grid-template-columns": "1fr auto", gap: "8px", marginBottom: "12px" } },
      [
        (() => {
          const i = el("input", { type: "text", value: g.group, placeholder: "分组名" });
          i.dataset.k = "group";
          i.style.fontWeight = "600";
          return i;
        })(),
        el(
          "button",
          {
            class: "btn btn--danger btn--sm",
            type: "button",
            onClick: () => {
              if (!confirm(`删除分组「${g.group}」？`)) return;
              data.skills.splice(gi, 1);
              saveData(data);
              route();
            },
          },
          "删除分组"
        ),
      ]
    );

    return el(
      "div",
      { class: "skill-group-row section-card", style: { marginBottom: "12px", padding: "20px" } },
      [head, items, addItemBtn(g, items, rerender)]
    );
  }

  function skillItem(it, idx, itemsHost, group) {
    return el(
      "div",
      {
        "data-item": "",
        style: { display: "grid", "grid-template-columns": "1fr 90px auto", gap: "8px", alignItems: "center", marginBottom: "8px" },
      },
      [
        (() => {
          const i = el("input", { type: "text", value: it.name, placeholder: "技能名" });
          i.dataset.k = "name";
          return i;
        })(),
        (() => {
          const i = el("input", { type: "number", min: "0", max: "100", value: it.pct });
          i.dataset.k = "pct";
          return i;
        })(),
        el(
          "button",
          {
            class: "btn btn--text",
            type: "button",
            onClick: () => {
              group.items.splice(idx, 1);
              saveData(data);
              renderSkills();
              route();
            },
          },
          "移除"
        ),
      ]
    );
  }

  function addItemBtn(group, itemsHost, rerender) {
    return el(
      "button",
      {
        class: "btn btn--ghost btn--sm",
        type: "button",
        style: { marginTop: "4px" },
        onClick: () => {
          group.items.push({ name: "", pct: 80 });
          saveData(data);
          renderSkills();
        },
      },
      "+ 添加技能"
    );
  }

  function addSkillGroup() {
    data.skills.push({ group: "新分组", items: [] });
    saveData(data);
    route();
  }

  /* =========================================================
     11. 视图：经历
     ========================================================= */
  function renderTimeline() {
    const view = $("#view");
    const card = el("div", { class: "section-card" });
    card.appendChild(
      el("div", { class: "section-card__head" }, [
        el("h3", { text: `共 ${data.timeline.length} 条经历` }),
        el(
          "button",
          {
            class: "btn btn--primary btn--sm",
            type: "button",
            onClick: () => {
              data.timeline.push({ time: "2026", title: "新经历", body: "" });
              saveData(data);
              route();
            },
          },
          "+ 新增"
        ),
      ])
    );
    const list = el("div");
    data.timeline.forEach((t, i) => list.appendChild(timelineRow(t, i)));
    card.appendChild(list);
    card.appendChild(
      el(
        "div",
        { style: { display: "flex", justifyContent: "flex-end", marginTop: "16px" } },
        [
          el(
            "button",
            {
              class: "btn btn--primary",
              type: "button",
              onClick: () => {
                $$("[data-tl]", card).forEach((row, i) => {
                  data.timeline[i].time = row.querySelector("[data-k='time']").value;
                  data.timeline[i].title = row.querySelector("[data-k='title']").value;
                  data.timeline[i].body = row.querySelector("[data-k='body']").value;
                });
                saveData(data);
                toast("经历已保存");
              },
            },
            "保存全部"
          ),
        ]
      )
    );
    view.appendChild(card);
  }

  function timelineRow(t, i) {
    return el(
      "div",
      {
        "data-tl": "",
        style: { padding: "14px", border: "1px solid var(--c-border)", borderRadius: "var(--radius-md)", marginBottom: "10px" },
      },
      [
        el(
          "div",
          { style: { display: "grid", "grid-template-columns": "160px 1fr auto", gap: "8px", marginBottom: "8px" } },
          [
            (() => {
              const x = el("input", { type: "text", value: t.time, placeholder: "2026 — Now" });
              x.dataset.k = "time";
              return x;
            })(),
            (() => {
              const x = el("input", { type: "text", value: t.title, placeholder: "标题" });
              x.dataset.k = "title";
              return x;
            })(),
            el(
              "button",
              {
                class: "btn btn--danger btn--sm",
                type: "button",
                onClick: () => {
                  data.timeline.splice(i, 1);
                  saveData(data);
                  route();
                },
              },
              "删除"
            ),
          ]
        ),
        (() => {
          const x = el("textarea", { placeholder: "描述" });
          x.value = t.body;
          x.dataset.k = "body";
          return x;
        })(),
      ]
    );
  }

  /* =========================================================
     12. 视图：联系
     ========================================================= */
  function renderContact() {
    const view = $("#view");
    const c = data.contact || {};
    const card = el("div", { class: "section-card" }, [
      el("h3", { text: "联系方式" }),
      el(
        "div",
        { class: "form-grid form-grid--2", style: { marginTop: "16px" } },
        [
          contactField("邮箱", "ct-email", c.email, "email"),
          contactField("Twitter / X", "ct-twitter", c.twitter, "text"),
          contactField("GitHub", "ct-github", c.github, "text"),
          contactField("小红书", "ct-xhs", c.xhs, "text"),
        ]
      ),
      el(
        "div",
        { style: { display: "flex", justifyContent: "flex-end", marginTop: "24px" } },
        [
          el(
            "button",
            {
              class: "btn btn--primary",
              type: "button",
              onClick: () => {
                data.contact = {
                  email: $("#ct-email").value.trim(),
                  twitter: $("#ct-twitter").value.trim(),
                  github: $("#ct-github").value.trim(),
                  xhs: $("#ct-xhs").value.trim(),
                };
                saveData(data);
                toast("联系方式已保存");
              },
            },
            "保存"
          ),
        ]
      ),
    ]);
    view.appendChild(card);
  }
  function contactField(label, id, value, type) {
    return el("div", { class: "form-row" }, [
      el("label", null, [el("span", { text: label })]),
      (() => {
        const i = el("input", { type, value: value || "" });
        i.id = id;
        return i;
      })(),
    ]);
  }

  /* =========================================================
     13. 视图：设置
     ========================================================= */
  function renderSettings() {
    const view = $("#view");

    const exportCard = el("div", { class: "section-card" }, [
      el("h3", { text: "导出 / 备份" }),
      el("p", {
        style: { color: "var(--c-text-soft)", margin: "8px 0 16px", fontSize: "14px" },
        text: "把当前数据导出为 JSON 文件，存到本地备份，或粘贴到 index.html / style.css 等地方同步前台。",
      }),
      el(
        "div",
        { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
        [
          el(
            "button",
            {
              class: "btn btn--primary btn--sm",
              type: "button",
              onClick: () => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast("已下载 JSON");
              },
            },
            "下载 portfolio-data.json"
          ),
          el(
            "button",
            {
              class: "btn btn--ghost btn--sm",
              type: "button",
              onClick: () => {
                navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                toast("已复制到剪贴板");
              },
            },
            "复制到剪贴板"
          ),
        ]
      ),
    ]);

    const importCard = el("div", { class: "section-card" }, [
      el("h3", { text: "导入 / 恢复" }),
      el("p", {
        style: { color: "var(--c-text-soft)", margin: "8px 0 16px", fontSize: "14px" },
        text: "⚠️ 导入会覆盖当前所有数据，建议先导出备份。",
      }),
      el(
        "div",
        { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
        [
          (() => {
            const i = el("input", { type: "file", accept: ".json,application/json" });
            i.style.display = "none";
            i.id = "import-file";
            i.addEventListener("change", () => {
              const f = i.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const parsed = JSON.parse(ev.target.result);
                  if (!parsed.projects || !Array.isArray(parsed.projects)) {
                    throw new Error("数据格式不对，需要包含 projects 数组");
                  }
                  if (!confirm("确认覆盖当前数据？此操作不可撤销。")) return;
                  data = mergeDefaults(parsed, DEFAULT_DATA);
                  saveData(data);
                  toast("导入成功");
                  route();
                } catch (err) {
                  toast("导入失败：" + err.message, "error");
                }
              };
              reader.readAsText(f);
            });
            return i;
          })(),
          el(
            "button",
            {
              class: "btn btn--ghost btn--sm",
              type: "button",
              onClick: () => $("#import-file").click(),
            },
            "选择 JSON 文件导入"
          ),
        ]
      ),
    ]);

    const pwdCard = el("div", { class: "section-card" }, [
      el("h3", { text: "修改登录密码" }),
      el("p", {
        style: { color: "var(--c-text-mute)", margin: "8px 0 16px", fontSize: "13px" },
        text: "演示用本地密码，仅挡住好奇的人；真要保护数据请配合服务端校验。",
      }),
      el(
        "div",
        { class: "form-grid form-grid--2" },
        [
          el("div", { class: "form-row" }, [
            el("label", null, [el("span", { text: "新密码" })]),
            (() => {
              const i = el("input", { type: "password", id: "new-pwd", placeholder: "新密码" });
              return i;
            })(),
          ]),
          el("div", { class: "form-row" }, [
            el("label", null, [el("span", { text: "确认密码" })]),
            (() => {
              const i = el("input", { type: "password", id: "new-pwd2", placeholder: "再输一次" });
              return i;
            })(),
          ]),
        ]
      ),
      el(
        "div",
        { style: { display: "flex", justifyContent: "flex-end", marginTop: "16px" } },
        [
          el(
            "button",
            {
              class: "btn btn--primary btn--sm",
              type: "button",
              onClick: () => {
                const a = $("#new-pwd").value;
                const b = $("#new-pwd2").value;
                if (!a || a.length < 3) {
                  toast("密码至少 3 位", "error");
                  return;
                }
                if (a !== b) {
                  toast("两次密码不一致", "error");
                  return;
                }
                data.meta = data.meta || {};
                data.meta.password = a;
                saveData(data);
                toast("密码已更新");
                $("#new-pwd").value = "";
                $("#new-pwd2").value = "";
              },
            },
            "更新密码"
          ),
        ]
      ),
    ]);

    const resetCard = el("div", { class: "section-card" }, [
      el("h3", { text: "重置数据" }),
      el("p", {
        style: { color: "var(--c-text-mute)", margin: "8px 0 16px", fontSize: "13px" },
        text: "恢复为初始示例数据，所有你编辑过的内容都会丢失。",
      }),
      el(
        "button",
        {
          class: "btn btn--danger btn--sm",
          type: "button",
          onClick: () => {
            if (!confirm("真的要重置吗？所有改动会丢失。")) return;
            if (!confirm("最后一次确认：重置为初始示例数据？")) return;
            data = JSON.parse(JSON.stringify(DEFAULT_DATA));
            saveData(data);
            toast("已重置");
            route();
          },
        },
        "重置为初始示例"
      ),
    ]);

    view.append(exportCard, importCard, pwdCard, resetCard);
  }

  /* =========================================================
     Boot
     ========================================================= */
  route();
})();