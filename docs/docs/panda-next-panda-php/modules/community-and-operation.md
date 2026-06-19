---
sidebar_position: 3
---

# 社区与运营

## 1. 概述

驱动用户活跃和站点运营的核心功能集合，涵盖站内信息传播（新闻/消息/通知）、用户互动（评论/感谢/书签）、活跃激励（签到/奖励/勋章）、行为约束（考核/H&R）以及需求闭环（求种/认领/举报）。所有运营动作均关联用户积分、等级和通知体系。

## 2. 功能说明

### 2.1 新闻与投票
通过 `news` 表发布站点公告（`GET /api/news`），管理员在 Filament 后台管理新闻内容。投票（`polls` 表）支持用户参与和实时计票，`GET /api/polls-latest` 返回最新投票，`POST /api/polls-vote` 提交投票。

[详细文档 →](./community/news-and-polls)

### 2.2 消息与通知
基于 `messages` 表（用户间私信）和 `staffmessages` 表（联系 Staff）实现双向通信。`GET /api/messages` 以 REST 资源形式管理消息，`GET /api/notifications` 聚合通知列表。读取状态通过 `unread` 或 `read` 标记区分。

[详细文档 →](./community/messages-and-notifications)

### 2.3 评论、感谢与书签
评论（`comments` 表）关联 torrent/offer/request 资源，支持全文内容；感谢（`thanks` 表）仅记录用户与种子关系；书签（`bookmarks` 表）实现种子收藏。三者均以 REST API 暴露。

[详细文档 →](./community/comments-thanks-bookmarks)

### 2.4 签到
通过 `POST /api/attend` 每日签到，`attendance` 表和 `attendance_logs` 表分别记录签到状态和历史。连续签到递增魔力值奖励，补签卡（`attendance_card` 字段）可用于补签。

[详细文档 →](./community/attendance-signin)

### 2.5 奖励与勋章
用户间魔力值打赏（`magic` 表）实现正向激励；勋章（`medals` 表）定义授勋条件与图标，`user_medals` 表维护用户持有关系。管理员通过 Filament MedalResource/UserMedalResource 管理。

[详细文档 →](./community/rewards-and-medals)

### 2.6 奖励与通知契约
事件驱动架构：业务事件（如奖励发放、考核完成、等级变更）触发奖励逻辑后，通过通知契约自动生成站内通知或私信送达用户。`GET /api/notifications` 统一消费。

[详细文档 →](./community/reward-notification-contract)

### 2.7 评论治理与内容审核
管理员通过 Filament 后台的评论管理能力删除违规评论；用户可编辑/删除自己的评论。种子评论、求种评论和邀约评论统一管理。

[详细文档 →](./community/comment-governance-and-moderation)

### 2.8 考核与 H&R
考核（`exams` 表）定义多索引目标（上传量/做种时间/魔力值等），`exam_users` 关联用户，`exam_progress` 追踪进度。H&R（`hit_and_runs` 表）在 announce 中自动判定，管理员可通过 `PUT /api/hr-pardon` 赦免。

[详细文档 →](./community/exams-and-hit-and-run)

### 2.9 求种、认领与举报
求种（`requests` 表）让用户提出资源需求，认领（`claims` 表）让发布者接单交付。举报（`complains` 表）供用户投诉违规内容。管理员在 Filament 后台统一处理。

[详细文档 →](./community/requests-claims-and-reports)

## 3. 操作入口

- `GET /api/news` — 新闻列表
- `GET /api/polls` — 投票列表
- `POST /api/polls-vote` — 提交投票
- `GET /api/messages` — 私信管理
- `GET /api/notifications` — 通知列表
- `GET /api/comments` — 评论管理
- `POST /api/attend` — 签到
- `GET /api/thanks` — 感谢记录
- `GET /api/bookmarks` — 书签列表
- `GET /api/rewards` — 魔力值记录
- `GET /api/exams` — 考核管理
- `GET /api/hr` — H&R 管理
- `PUT /api/hr-pardon/{id}` — H&R 赦免
- `GET /api/requests` — 求种列表
- `GET /api/claims` — 认领列表

## 4. 使用说明

1. 新闻和投票用于站方主动触达用户，无需用户配置即可接收。
2. 私信用于用户间沟通，通知用于系统事件触达，两者在 API 层面分离。
3. 签到是用户日常获得魔力值的主要途径，连续签到奖励递增。
4. 评论、感谢、书签三种互动分别适用于不同场景：讨论、点赞、收藏。
5. 考核由管理员配置考核规则，用户达成条件后自动完成。
6. H&R 在 announce 时自动判定，管理员可赦免或批量处理。
7. 求种 → 认领 → 交付形成需求闭环，管理员监督全过程。

## 5. 配置参考（可选）

- 签到连续奖励规则由业务逻辑硬编码，补签卡消耗在签到接口中处理
- 考核索引类型支持：uploaded/downloaded/seedbonus/seedtime/leechtime 等
- H&R 判定参数（最低做种时长等）在 announce 流程中配置
- 勋章领取条件在 `medals` 表中配置，支持自动授予和管理员手动授予
