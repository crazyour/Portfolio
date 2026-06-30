/* =========================================================
   Portfolio · 默认数据源（前台用）
   admin 也使用同名 STORAGE_KEY 写同一份；这里是给前台兜底用的。
   ========================================================= */
(function (root) {
  "use strict";

  root.PORTFOLIO_DEFAULTS = {
    version: 1,

    owner: {
      name: "[ 你的名字 ]",
      tagline: "做有温度的产品与代码。",
      intro: "一个面向 AI / Web / 产品工程方向的独立开发者。",
      location: "JP",
      yearsExp: "5+",
      projectsCount: "30+",
    },

    about: {
      paragraphs: [
        "我是一名独立产品工程师，过去几年主要在 Web 应用、AI 工程化、独立产品 这几条线上工作。",
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
      { id: "ml", label: "机器学习", icon: "", order: 0 },
      { id: "web", label: "网站系统", icon: "", order: 1 },
      { id: "product", label: "产品工具", icon: "", order: 2 },
      { id: "agent", label: "Agent", icon: "", order: 3 },
    ],

    projects: [
      {
        id: "alpha",
        title: "Project Alpha",
        year: "2025",
        category: "product",
        tag: "AI · SaaS",
        description: "一个面向内容创作者的 AI 选题与文案助手，结合历史内容库做风格匹配与灵感推荐。",
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
        description: "为线下店铺交付的官网与后台管理系统，含自定义主题、插件、CMS 工作流与移动端预约导流。",
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
        tag: "异常行为检测 · Pose",
        description: "面向监所场景的实时异常行为检测，基于 RTMDet + ByteTrack + ViTPose 的姿态估计与多特征时序判定。",
        image: "assets/images/gamma-cover.jpg",
        detail: [
          "在少样本数据、有限算力、又拿不到成熟预训练模型的条件下，从 0 搭的一套监所异常行为检测算法。",
          "底层流程：RTMDet 做人体检测，ByteTrack 做跨帧跟踪，ViTPose 抽 17 个关键点。三段管线全部本地推理，跑在边缘设备（Jetson）上，不依赖云端。",
          "判定层不用粗暴的二分类，而是把头部运动轨迹、手部静止约束、肘部姿态约束、滑动窗口时序统计这些可解释特征做成一个多特征融合判定。这层可配置、可加权，方便按监所场景调。",
          "工程上做了配置化 + 模块化，每个特征都是独立模块，组合和权重在 YAML 里改就行，不用动代码。",
          "结果：视频级检测 Precision ~100%，Recall 100%，F1 ~100%。误检漏检每出现一例都回去查原因、迭代特征与权重，最后这套规则稳定下来了。",
        ],
        chips: ["RTMDet", "ByteTrack", "ViTPose", "Python", "PyTorch", "Edge"],
        cover1: "#e0e6dc",
        cover2: "#c8d4c0",
        link: "",
        order: 2,
      },
      {
        id: "delta",
        title: "Project Delta",
        year: "2025",
        category: "product",
        tag: "Productivity",
        description: "用 AI 把口语 / 想法自动整理成结构化小说的写作工具，作者只需保留灵感流。",
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
        description: "多 Agent 协作框架，把复杂任务拆给具备不同专长的 Agent 跑，输出可审计的工作报告。",
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
        group: "工程",
        items: [
          { name: "前端 / 现代 Web", level: "主力" },
          { name: "Node · Python · TypeScript", level: "主力" },
          { name: "Postgres · Redis", level: "常用" },
          { name: "Docker · CI/CD", level: "常用" },
          { name: "WordPress · PHP", level: "可捡" },
        ],
      },
      {
        group: "AI / 数据",
        items: [
          { name: "LLM 应用与 Prompt", level: "主力" },
          { name: "RAG · Agent 编排", level: "主力" },
          { name: "PyTorch · 视觉", level: "早期" },
          { name: "数据可视化", level: "常用" },
        ],
      },
      {
        group: "产品 / 设计",
        items: [
          { name: "需求拆解 · PRD", level: "主力" },
          { name: "Figma · 动效", level: "常用" },
          { name: "客户访谈 · 销售", level: "主力" },
          { name: "独立项目全栈", level: "主力" },
        ],
      },
      {
        group: "语言 / 沟通",
        items: [
          { name: "中文 · 母语", level: "" },
          { name: "English · 工作语言", level: "" },
          { name: "日本語 · N3 学习中", level: "がんばる" },
        ],
      },
    ],

    timeline: [
      {
        time: "2026 — Now",
        title: "独立产品 / 内容创作",
        body: "在日本做独立开发者，运营小红书「小白 AI 扫盲」账号，维护多个 AI / Web 工具。",
      },
      {
        time: "2024 — 2025",
        title: "AI 工程化方向",
        body: "把 LLM、RAG、Agent 能力嵌入真实业务场景，做了几套面向内容运营和电商的工具。",
      },
      {
        time: "2022 — 2024",
        title: "Web 全栈 / 客户交付",
        body: "负责多个客户项目从需求到上线的全流程，含官网、SaaS、内部系统，WordPress / Next.js / Python 都做。",
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
})(window);
