
# Qiuge’s Blog

一个基于 Next.js 15 构建的个人技术博客项目，支持 MDX 文章、归档、搜索、评论、登录、访问统计、主题切换和 SEO 配置。

## 项目概览

这个项目不是模板仓库，而是一个已经落地到具体业务功能的博客应用。当前实现包含：

- 首页 Hero 轮播与精选文章展示
- MDX 文章系统
- 文章详情页与目录导航
- 时间归档与标签归档
- 全站搜索弹窗
- NextAuth 登录
- Prisma + SQLite 评论系统
- 页面访问统计与图表
- 亮色 / 暗色 / 跟随系统主题
- sitemap、robots、Open Graph 图片、manifest
- 自定义 404 页面与全局 loading 骨架屏

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- MDX + next-mdx-remote
- NextAuth v5
- Prisma
- SQLite
- Recharts
- next-themes

## 目录结构

```text
myBlog/
├─ content/
│  └─ posts/                  # MDX 文章内容
├─ prisma/
│  ├─ schema.prisma           # 数据模型
│  └─ dev.db                  # 本地 SQLite 数据库
├─ public/
│  └─ images/                 # 本地静态图片资源
├─ src/
│  ├─ app/
│  │  ├─ api/                 # API 路由
│  │  │  ├─ analytics/
│  │  │  ├─ auth/[...nextauth]/
│  │  │  ├─ comments/
│  │  │  ├─ posts/
│  │  │  └─ search/
│  │  ├─ about/               # 关于页
│  │  ├─ archive/             # 归档页
│  │  ├─ posts/[slug]/        # 文章详情页
│  │  ├─ globals.css          # 全局样式
│  │  ├─ layout.tsx           # 根布局与全局 metadata
│  │  ├─ loading.tsx          # 全局骨架屏
│  │  ├─ manifest.ts          # Web App Manifest
│  │  ├─ not-found.tsx        # 404 页面
│  │  ├─ opengraph-image.tsx  # OG 分享图生成
│  │  ├─ page.tsx             # 首页
│  │  ├─ robots.ts            # robots.txt
│  │  └─ sitemap.ts           # sitemap.xml
│  ├─ components/             # 业务组件
│  └─ lib/                    # 认证、数据库、MDX、工具函数
├─ .env.local                 # 本地环境变量
├─ next.config.mjs
├─ package.json
└─ vercel.json                # Vercel 部署配置
```

## 页面与功能结构分析

### 1. 页面层

- `src/app/page.tsx`

  - 首页
  - 组合 HeroCarousel 与 PostCard，展示精选文章和最新文章
- `src/app/posts/page.tsx`

  - 文章列表页
  - 首屏服务端渲染，后续通过 PostListClient 无限加载
- `src/app/posts/[slug]/page.tsx`

  - 文章详情页
  - 渲染 MDX、封面图、标签、目录、评论区、上下篇导航
- `src/app/archive/page.tsx`

  - 归档页
  - 支持按时间与按标签两种视图
- `src/app/about/page.tsx`

  - 关于页
  - 展示个人信息、博客数据、技能栈、访问统计图表

### 2. API 层

- `src/app/api/posts/route.ts`

  - 文章分页接口
- `src/app/api/search/route.ts`

  - 搜索接口
  - 根据标题、摘要、标签匹配文章
- `src/app/api/comments/route.ts`

  - 评论增删查接口
- `src/app/api/analytics/route.ts`

  - 页面访问埋点与统计接口
- `src/app/api/auth/[...nextauth]/route.ts`

  - NextAuth 路由入口

### 3. 内容层

- `content/posts/*.mdx`
  - 博客正文内容
  - 使用 frontmatter 管理标题、摘要、日期、标签、封面、精选状态

### 4. 数据层

Prisma 当前包含以下核心模型：

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Comment`
- `PageView`

前四个为 NextAuth 所需，后两个为博客业务模型。

## 当前已实现功能

### 内容系统

- 支持 MDX 文章
- 支持 frontmatter 元数据
- 支持代码高亮
- 支持文章阅读时长统计
- 支持精选文章

### 博客浏览体验

- 首页轮播大图
- 文章卡片悬浮效果
- 无限滚动加载
- 时间归档
- 标签归档
- 搜索弹窗与键盘导航

### 用户能力

- GitHub / Google 登录
- 登录后发表评论
- 作者可删除自己的评论

### 数据统计

- 页面访问记录
- 近 30 天趋势图
- 热门页面排行

### 界面与主题

- 亮色模式
- 暗色模式
- 跟随系统主题
- 无闪烁主题初始化

### SEO 与部署

- sitemap
- robots
- Open Graph 图片
- manifest
- 自定义 404
- Vercel 配置

## 本地开发

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

参考 `.env.local`：

```env
AUTH_SECRET=your-random-secret-here-change-me
NEXT_PUBLIC_SITE_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

DATABASE_URL="file:./dev.db"
```

### 3. 初始化 Prisma

```bash
pnpm db:generate
pnpm db:push
```

### 4. 启动开发服务器

```bash
pnpm dev
```

### 5. 生产构建

```bash
pnpm build
pnpm start
```

## 可用脚本

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm db:generate
pnpm db:push
```

## 如何新增文章

在 `content/posts/` 下新增一个 `.mdx` 文件，例如：

```mdx
---
title: "新文章标题"
date: "2026-04-06"
excerpt: "这里是一段文章摘要"
tags: ["Next.js", "Blog"]
coverImage: "/images/lls1.png"
featured: false
---

# 正文标题

这里开始写正文。
```

## 如何替换本地图片

把图片放入 `public/images/` 目录后，直接使用站点根路径引用：

```txt
/images/your-image.png
```

可以用于：

- 首页轮播图
- 文章封面图
- MDX 正文图片

## 部署说明

项目已包含 `vercel.json`，可直接部署到 Vercel。

部署前建议设置：

- `NEXT_PUBLIC_SITE_URL`
- `AUTH_SECRET`
- OAuth 相关环境变量
- 生产数据库 `DATABASE_URL`

如果生产环境不使用 SQLite，建议切换到 PostgreSQL。

## 后续可扩展方向

- 全文搜索索引
- 评论审核与管理后台
- 文章点赞 / 收藏
- RSS 输出
- 站内通知
- 多语言支持

## License

仅用于学习与个人项目实践。

>>>>>>> laojingbaoying-feature
>>>>>>>
>>>>>>
>>>>>
>>>>
>>>
>>
