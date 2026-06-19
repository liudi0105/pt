# 用户主档案

## 1. 概述

统一管理用户的基础身份、统计数据、展示偏好和后台管理信息，支持前台展示和后台完整查看，是用户模块的核心数据聚合点。

## 2. 功能说明

### 2.1 用户模型核心字段
users 表包含以下主要字段：
- **身份**：`id`, `username`, `email`, `passhash`, `secret`, `added`, `last_access`
- **状态**：`status`(confirmed/pending), `enabled`(yes/no), `class`(等级), `title`, `avatar`
- **统计**：`uploaded`, `downloaded`, `seedbonus`, `seed_points`, `seedtime`, `leechtime`
- **权限**：`invites`, `downloadpos`, `leechwarn`, `leechwarnuntil`, `vip_added`, `vip_until`
- **安全**：`two_step_secret`, `passkey`, `editsecret`, `stylesheet`
- **管理**：`modcomment`, `notifs`, `two_step_secret`

### 2.2 当前用户 API（GET /api/user-me）
返回当前登录用户的完整上下文，包含：
- 基础信息：id, username, status, enabled, added, last_access, avatar
- 等级：class, class_text
- 统计：share_ratio, uploaded, downloaded, bonus, seed_points, seedtime, leechtime
- 互动：comments_count, posts_count, torrents_count
- 做种/下载：seeding_count, leeching_count, completed_count, incomplete_count
- 其他：invites, attendance_card, email

### 2.3 管理员查看用户（GET /api/users/\{id\}）
在 `/api/user-me` 基础上额外返回：
- `two_step_secret` — 二步验证密钥
- `inviter` — 邀请人信息
- `medals` — 勋章列表
- `exam` — 考核信息

### 2.4 用户关联数据 API
通过用户视角查询关联业务数据，各接口均以用户 ID 为维度：
- `user-publish-torrent` — 用户发布的种子
- `user-seeding-torrent` — 用户正在做种的种子
- `user-leeching-torrent` — 用户正在下载的种子
- `user-finished-torrent` — 用户已完成种子
- `user-not-finished-torrent` — 用户未完成种子

### 2.5 档案编辑
当前版本中用户无法通过 API 直接编辑自身档案。管理员可通过 `PUT /api/user-increment-decrement` 增减指定字段（uploaded/downloaded/seedbonus/invites/attendance_card）。传统 PHP 用户详情页仍提供前台编辑能力。

## 3. 操作入口

- `GET /api/user-me` — 当前用户查看自身档案
- `GET /api/users/{id}` — 管理员查看指定用户档案
- `GET /api/user-publish-torrent` — 用户发布的种子列表
- `GET /api/user-seeding-torrent` — 用户做种列表
- `GET /api/user-leeching-torrent` — 用户下载列表
- `GET /api/user-finished-torrent` — 用户已完成列表
- `GET /api/user-not-finished-torrent` — 用户未完成列表
- `PUT /api/user-increment-decrement` — 管理员增减字段

## 4. 使用说明

1. 用户登录后调用 `/api/user-me` 获取自身完整档案。
2. 管理员通过 `/api/users/{id}` 查看任意用户全量信息。
3. 用户发布/做种/下载等关联数据通过独立 API 查询。
4. 档案字段不可由用户自行修改，需管理员操作或通过传统 PHP 页面编辑。
5. 管理员增减字段时需指定字段名和增量值。

## 5. 配置参考（可选）

- 用户头像尺寸、样式等可通过 `stylesheet` 字段配置
- 种子列表分页参数通过 API 请求参数控制
