# 🎮 Game Aggregator - 出海小游戏聚合站

## 项目概述

面向英语市场的 H5 小游戏聚合站，通过监控头部游戏平台的 Sitemap，自动发现新游戏并同步到自己的平台。

## 核心思路

头部平台上新 → 他们已验证流量 → 跟着搬运 → 省掉选题成本

## 技术选型

| 层 | 选择 |
|---|---|
| 爬虫/监控 | Python（腾讯云服务器定时跑） |
| 数据库 | SQLite（MVP阶段） → 后期 Cloudflare D1 |
| 前端框架 | Next.js（静态生成，SEO友好） |
| 部署 | 腾讯云（测试）→ Cloudflare Pages（生产） |
| 通知 | 飞书消息 |
| 代码管理 | GitHub |

## 监控目标站点

- [ ] poki.com
- [ ] crazygames.com
- [ ] silvergames.com
- [ ] （待扩展）

## 项目阶段

### 阶段一：数据管道（当前）
- [ ] Sitemap 爬取脚本
- [ ] 每日差异对比
- [ ] 飞书通知
- [ ] 数据存储到 SQLite

### 阶段二：MVP 网站
- [ ] Next.js 项目初始化
- [ ] 游戏列表页
- [ ] 游戏详情页（iframe 嵌入）
- [ ] 基础 SEO

### 阶段三：上线
- [ ] 购买域名
- [ ] 迁移到 Cloudflare Pages
- [ ] Google Search Console 提交

## 目录结构

```
game-aggregator/
├── README.md          # 本文件
├── PROJECT.md         # 项目日志 & 决策记录
├── scraper/           # 爬虫脚本
├── web/               # Next.js 网站
└── data/              # 本地数据存储
```

## 负责人

- 产品：烽火连城
- 执行：🤖 AI 助手
