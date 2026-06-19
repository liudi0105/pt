# 消息与通知

## 1. 概述

实现用户间通信、系统向用户发送通知以及通知聚合展示能力。解决站内沟通、事件触达和未读提醒等场景。

## 2. 功能说明

### 2.1 站内信（Message）

用户之间以及系统与用户之间的私信通信。

- 数据模型 `Message`：表 `messages`，字段 `sender`、`receiver`、`added`、`subject`、`msg`、`unread`、`location`、`saved`。
- 关联关系：`send_user()` BelongsTo `User`（`sender`，默认 0 为系统用户）、`receive_user()` BelongsTo `User`（`receiver`）。
- **发送消息**：调用 `Message::add()` 静态方法创建消息记录，同时清除接收者的收件箱缓存。
- **读取消息**：查看消息详情时自动将 `unread` 标记为 0。
- **列表查询**：支持按 `location` 筛选（收件箱/已发送）、按 `unread` 筛选未读消息。

#### 消息 API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/messages` | GET | 消息列表，支持 `?unread` 筛选 |
| `/api/messages` | POST | 发送消息 |
| `/api/messages/{id}` | GET | 查看消息详情（自动标记已读） |
| `/api/messages-unread` | GET | 未读消息列表 |
| `/api/messages-unread/count` | GET | 未读消息数量 |

### 2.2 通知聚合（Notifications）

系统通过 `ToolRepository` 提供统一的通知查询接口，聚合多个业务模块的未读/待处理状态。

`GET /api/notifications` 返回复合数据：

1. **签到通知**：当日是否已签到（未签到返回 1，表示有签到待处理）。
2. **新闻通知**：自用户 `last_home` 时间以来发布的新闻数量。
3. **消息通知**：用户未读站内信数量。
4. **投票通知**：用户尚未投票的投票数量。

### 2.3 通知偏好

用户可通过个人设置控制是否接收特定类型的通知：

- `User::acceptNotification($name)` 方法检查用户 `notifs` 字段中的配置项。
- 支持的通知类型：`topic_reply`（主题回复通知）、`hr_reached`（H&R 达标通知）等。

## 3. 操作入口

- 站内信列表页：`/api/messages`
- 站内信详情页：`/api/messages/{id}`
- 未读消息区域：`/api/messages-unread`
- 通知中心：`/api/notifications`

## 4. 使用说明

1. 系统消息的 `sender` 默认为 0（系统用户），前台展示为"系统消息"。
2. 阅读消息后自动标记已读，不可恢复为未读。
3. 消息支持存档（`saved` 字段）和删除（`location` 字段标记）。
4. 通知聚合数据为实时查询，非缓存数据。
5. 用户可在个人设置中关闭特定类型的通知。

## 5. 配置参考

无独立配置项。通知偏好由用户 `notifs` 字段的 JSON 配置控制。
