---
title: "网站说明"
description: "这个网站的目录简介以及搭建方法"
pubDate: 2026-10-01
---
- 首页：这里是我拍摄的一些照片，点击切换下一张
- 关于：介绍我是谁，我在干什么，用什么工具干
- 项目：我所专注课题的成果汇报
- 文章：一些方法论
- 闪念：一些想法，课题都是从这些想法中诞生
- 标签：用标签分类。分为身体健康，心智健康，环境健康，社交，财富几个方面。

## 目录结构

站点几乎全在 `src/` 下。先看骨架：

```
src/
├── content/          所有文章，按集合分文件夹
│   ├── blog/         长文
│   ├── journal/      闪念
│   ├── about/        关于页，一个文件一页
│   ├── projects/     项目，按文件夹分组
│   └── store/        商店（占位，暂时空着）
├── pages/            路由。文件路径就是 URL
├── layouts/          页面骨架
├── components/       组件
├── styles/global.css 全站唯一的样式文件
├── config.ts         站点标题、作者、简介
├── content.config.ts 内容集合的 schema
├── lib/createSlug.ts 中文标题转 slug
└── utils/            tags、stats、journal 三个工具
```

