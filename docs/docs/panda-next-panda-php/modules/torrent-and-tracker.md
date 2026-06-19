---
sidebar_position: 2
---

# 种子与 Tracker

## 1. 概述

管理 PT 站点的核心资源生命周期——从种子发布、审核、搜索浏览、文件下载到 Tracker 协议交互的全流程。覆盖资源进入站点、被用户发现、被客户端下载/做种跟踪以及行为数据持久化的完整闭环。

## 2. 功能说明

### 2.1 种子列表与详情
以 `torrents` 表为核心，按分类/标签/状态组织种子列表（`GET /api/torrents`），详情页聚合文件列表、评论、感谢、书签等信息。支持管理员置顶、全局促销状态覆盖（`TorrentState`）等运营控制。

[详细文档 →](./torrent/torrent-list-detail)

### 2.2 种子发布与编辑
用户上传 `.torrent` 文件后提取元数据并填写分类、标签、简介等信息，生成唯一 `info_hash` 并创建 `TorrentSecret` 下载密钥。编辑功能允许资源维护者更新描述和元数据。

[详细文档 →](./torrent/torrent-publish-edit)

### 2.3 种子审核
种子发布后进入 `pending` 状态，审核员在后台（`GET /web/torrent-approval-page`）进行通过/拒绝/待修改操作，操作记录写入 `torrent_operation_logs`。审核结果决定种子对外可见性。

[详细文档 →](./torrent/torrent-approval)

### 2.4 搜索与筛选
支持关键词搜索和分类、源码、媒体、编码、分辨率等维度的元数据筛选，通过 `SearchBox` 配置确定可用过滤维度。搜索结果受种子状态和用户权限约束。

[详细文档 →](./torrent/torrent-search-filter)

### 2.5 文件与下载契约
用户下载 `.torrent` 文件时校验下载权限（`downloadpos`），通过 `TorrentSecret` 密钥验证合法性后返回有效文件内容。支持 Passkey 免签下载、管理员免限下载等模式。

[详细文档 →](./torrent/file-download-contract)

### 2.6 Peer 与 Snatch 查询
以用户/种子维度查询 `peers` 表的实时连接状态和 `snatched` 表的完成记录，为用户中心、种子详情页、考核系统和奖励系统提供数据源。

[详细文档 →](./torrent/peer-snatch-query)

### 2.7 Tracker Announce
`GET /api/announce` 接收客户端周期性上报，处理 17 步流程：协议校验、用户校验、客户端黑白名单、种子状态识别、流量计算、Peer 表 Upsert、Snatch 创建/更新、H&R 判定、作弊检测、ShadowBan、种子盒标识优化等。

[详细文档 →](./torrent/tracker-announce)

### 2.8 Scrape
`GET /api/scrape` 返回种子维度汇总统计（做种数、下载数、完成数），支持单种子和多种子批量查询，数据源为 `peers` 和 `snatched` 的实时聚合。

[详细文档 →](./torrent/tracker-scrape-peer-snatch)

## 3. 操作入口

- `GET /api/torrents` — 种子列表
- `GET /api/torrents/{id}` — 种子详情
- `POST /api/torrents` — 发布种子
- `PUT /api/torrents/{id}` — 编辑种子
- `DELETE /api/torrents/{id}` — 删除种子
- `GET /api/search-box` — 搜索筛选
- `GET /api/files` — 文件列表
- `GET /api/peers` — Peer 列表
- `GET /api/snatches` — Snatch 列表
- `GET /api/announce` — Tracker Announce
- `GET /api/scrape` — Tracker Scrape
- `GET /api/thanks` — 感谢记录
- `GET /api/bookmarks` — 书签列表
- `GET /api/rewards` — 魔力值记录
- `GET /web/torrent-approval-page` — 种子审核页
- `GET /web/torrent-approval-logs` — 审核日志

## 4. 使用说明

1. 资源进入站点：用户发布种子 → 审核员审核 → 通过后对外可见。
2. 用户下载资源：浏览列表 → 查看详情 → 点击下载 `.torrent` 文件 → 客户端加载后开始下载/做种。
3. Tracker 实时跟踪：客户端周期性 `/announce` 上报状态，服务端更新 Peer/Snatch 并触发 H&R 和奖励判定。
4. 搜索筛选通过 GET 参数组合实现，搜索维度由后台 `SearchBox` 配置决定。
5. 种子删除为物理删除，关联数据一并清除，需管理员权限。
6. 所有种子操作（发布、编辑、审核、删除）均记录 `torrent_operation_logs`。

## 5. 配置参考（可选）

- `TorrentState` 状态定义：normal/free/twoup/freeandtwoup/halfdown
- `TorrentDenyReason` 审核拒绝原因在后台字典管理中维护
- 下载权限（`downloadpos`）在用户表中独立控制
- SearchBox 配置决定前台的搜索维度组合
