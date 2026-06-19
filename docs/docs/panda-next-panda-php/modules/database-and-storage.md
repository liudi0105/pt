---
sidebar_position: 5
---

# 数据库与存储

## 1. 概述

定义站点数据的持久化策略和存储分层，覆盖核心业务数据（MySQL）、Tracker 高频运行态（内存表/Redis + MySQL 持久化）、内容互动与审计记录（MySQL）以及文件附件与备份（FTP/SFTP/Google Drive）。数据模型决定了所有业务模块的查询效率和扩展能力。

## 2. 功能说明

### 2.1 主业务数据存储
承载用户（`users`）、种子（`torrents`）、评论（`comments`）、消息（`messages`）、新闻（`news`）、投票（`polls`）、奖励（`magic`）、考核（`exams`）、H&R（`hit_and_runs`）、求种（`requests`）、标签（`tags`）等 30+ 核心业务表的 MySQL 存储。关联关系清晰：用户 ↔ 种子 ↔ 评论/Peer/Snatch 形成主链路，考核/H&R 奖励/通知构成运营链路。

[详细文档 →](./storage/business-data-storage)

### 2.2 Tracker 运行态存储
Peer 表（`peers`）承载客户端实时连接状态，Snatch 表（`snatched`）记录下载完成历史。高频写入（每次 announce 更新 peer 的 uploaded/downloaded/remaining）通过 upsert 保证性能。内存表或 Redis 缓存作为可选加速层，与主业务查询物理分离。

[详细文档 →](./storage/tracker-runtime-storage)

### 2.3 内容互动与审计存储
评论（`comments`）、感谢（`thanks`）、书签（`bookmarks`）、签到（`attendance`/`attendance_logs`）、私信（`messages`/`staffmessages`）等互动数据，配合审计日志（`torrent_operation_logs`/`user_ban_logs`/`login_logs`/`bonus_logs`/`username_change_logs`），保证业务可追溯。

[详细文档 →](./storage/content-and-audit-storage)

### 2.4 附件、文件与备份
`.torrent` 种子文件通过 `attachments` 表追踪，文件本体可存储在本地或外部（FTP/SFTP/Google Drive）。数据库备份通过 `backup` 相关配置管理（支持 S3/Google Drive 等远端存储），定时任务自动轮转。

[详细文档 →](./storage/file-and-backup-storage)

## 3. 操作入口

- MySQL：`panda-php` 数据库，所有业务表均使用 InnoDB 引擎
- Redis：缓存（settings）、队列（jobs）、种子盒标记、限流计数器
- MeiliSearch/Elasticsearch：种子搜索索引
- 附件存储：本地 `attachments/` 目录或外部 FTP/SFTP/Google Drive
- 备份：`backup` 配置组定义策略和目的地

## 4. 使用说明

1. 主业务数据（用户/种子/评论等）统一用 MySQL InnoDB，事务保障数据一致性。
2. Tracker 高频数据（peer 表）需关注写入性能，推荐分表或使用内存引擎/Redis 中转。
3. 审计日志只追加不修改，长期数据建议归档或设置自动清理策略。
4. 备份按配置策略定时执行，远端存储需提前配置凭据。
5. 搜索索引与主存储分离，种子变更时自动同步到搜索服务。
6. 附件存储路径在 `settings` 中配置，迁移存储后端时需同步更新附件表。

## 5. 配置参考（可选）

- 数据库连接在 `.env` 中配置（`DB_HOST`/`DB_PORT`/`DB_DATABASE`/`DB_USERNAME`/`DB_PASSWORD`）
- Redis 连接在 `.env` 中配置（`REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD`）
- MeiliSearch 配置：`settings` 表中 `meilisearch.*` 配置组
- 备份配置：`settings` 表中 `backup.*` 配置组
- 附件存储配置：`settings` 表中 `attachment.*` 配置组
