# Portfolio · 个人作品集网站

一个现代极简的纯静态个人作品集模板，纯 HTML / CSS / JS，无任何构建工具依赖，直接双击 `index.html` 就能在浏览器里跑。

## 目录

```text
portfolio/
├── index.html                # 主页（单页应用，包含所有板块）
├── assets/
│   ├── css/style.css         # 主样式 + 明暗主题
│   ├── js/main.js            # 交互（主题切换、滚动、移动菜单）
│   └── images/               # 你的图片资源放这里
├── projects/                 # 可选：项目详情页放这里
└── README.md
```

## 本地预览

直接双击 `index.html`，或者：

```bash
# Python
cd portfolio && python3 -m http.server 5173
# 然后访问 http://localhost:5173
```

## 定制指南

打开 `index.html`，把里面 `[ 占位 ]` / `[ 你的名字 ]` / `hello@example.com` 之类的占位文本替换成你的真实信息：

| 想改的地方              | 在 `index.html` 里搜                          |
|------------------------|----------------------------------------------|
| 你的名字               | `[ 你的名字 ]`                               |
| Hero 文案 / 副标题      | `<h1 class="hero__title">`                   |
| 邮箱 / 社交账号         | `.contact-card` 的 `href` 和 `value`         |
| 项目卡片               | `.project-card` 块（标题、描述、chip、tag）    |
| 技能条                 | `.skill-group > .bars` 里的 `data-pct`       |
| 经历时间线             | `.timeline > li`                              |
| 关于我正文             | `.about__text p`                              |

主题颜色（主色）改 `assets/css/style.css` 顶部：

```css
:root {
  --c-accent: #6366f1;   /* 主色 */
  --c-accent-soft: #eef2ff;
  --c-accent-strong: #4f46e5;
}
```

## 主题

- 默认跟随系统（macOS / Windows 的浅色 / 深色模式自动适配）
- 右上角太阳 / 月亮按钮可手动切换
- 用户偏好保存在 `localStorage`，下次来还是上次的主题

## 部署

任意静态托管都行：

- **GitHub Pages**：推到仓库，Settings → Pages → 选 `main` 分支根目录
- **Vercel / Netlify**：直接拖这个文件夹进去
- **Cloudflare Pages**：同上

## 想要的功能没在这？

下面这些是「下一步可能想加」的，按需挑：

- [ ] 项目详情子页（`projects/<slug>.html` + 一个简单模板）
- [ ] 博客（写过的笔记）
- [ ] 多语言切换（中 / 英 / 日）
- [ ] RSS / Sitemap
- [ ] View Transitions API 做页面过渡动画
- [ ] 把项目卡片接到 JSON / Markdown 自动渲染

需要哪个就告诉我，加起来都不重。