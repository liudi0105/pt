---
sidebar_position: 2
---

# 种子与 Tracker

这是一页模块索引，不承担详细规格。真正可直接开发的内容拆到下列子功能页。

## 子功能目录

1. [种子列表与详情](./torrent/torrent-list-detail)
2. [种子发布与编辑](./torrent/torrent-publish-edit)
3. [种子审核](./torrent/torrent-approval)
4. [搜索与筛选](./torrent/torrent-search-filter)
5. [Tracker Announce](./torrent/tracker-announce)
6. [Scrape、Peer 与 Snatch](./torrent/tracker-scrape-peer-snatch)

## 模块边界

- 负责资源进入站点、被审核、被下载和被追踪
- 负责 Peer、Snatch 等下载行为事实
- 不负责奖励、考核和 H&R 的最终治理决策，但要提供事实输入

## 首批交付

- 种子列表/详情/下载
- 种子发布/编辑
- 审核主流程
- Announce / Scrape
- Peer / Snatch 持久化
