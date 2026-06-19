---
sidebar_position: 4
---

# 后台与治理

## 1. 概述

集中管理站点的全局配置、用户治理、风控策略、运营字典、搜索索引、操作审计和统计面板，是站点秩序维护和运营决策的控制中心。所有后台操作均通过 Filament 后台面板和 Admin API 暴露，敏感操作全量审计。

## 2. 功能说明

### 2.1 配置中心
全站配置以 key-value 形式存储于 `settings` 表，通过 SettingResource（Filament Tab 分组：`hr`, `backup`, `seed_box`, `meilisearch`, `system`）和传统 `settings.php` 管理 16 个配置组（basic/main/smtp/security/authority/tweak/bonus/account/torrent/attachment/advertisement/code 等）。配置修改后通过 Redis 缓存（TTL 600s）自动生效。

[详细文档 →](./admin/settings-center) · [配置参考 →](./admin/settings-reference)

### 2.2 用户治理后台
管理员通过 UserResource（Filament）执行用户禁用/启用、等级变更、重置密码、增减字段、移除二步验证等操作，所有操作记录 `user_ban_logs` 和变更日志。

[详细文档 →](./admin/user-governance-backoffice)

### 2.3 客户端风控
通过 AgentAllow/AgentDeny 定义客户端黑白名单。AgentAllowResource 管理允许列表（`agent_allowed_family` 表），内嵌 DeniesRelationManager 管理例外规则（`agent_allowed_exception` 表）。`POST /api/agent-check` 校验客户端合法性。

[详细文档 →](./admin/client-risk-control)

### 2.4 运营资源管理
管理站点的字典数据，包括分类（Category）、来源（Source）、媒体（Media）、编码（Codec）、分辨率（Standard）、处理类型（Processing）、制作组（Team）、音频编码（AudioCodec）、标签（Tag）和图标（Icon/SecondIcon）等，通过 Filament SectionResource/CategoryResource 等管理。

[详细文档 →](./admin/operations-resources)

### 2.5 后台操作契约
定义管理操作的请求格式、权限校验和返回规范，确保所有 Admin API 调用遵循统一契约。所有写入型操作均需通过 `admin` 中间件权限校验。

[详细文档 →](./admin/admin-operation-contract)

### 2.6 搜索索引同步
通过 MeiliSearch/Elasticsearch 实现站内资源检索。种子发布、编辑、审核状态变化时自动同步索引；管理员可通过后台触发全量重建。

[详细文档 →](./admin/search-index-sync)

### 2.7 日志与审计查询
统一管理种子操作日志（`torrent_operation_logs`）、用户封禁日志（`user_ban_logs`）、管理员操作日志等。Filament 资源以只读方式暴露审计数据，支持按操作人、时间、类型筛选。

[详细文档 →](./admin/logs-audit-query)

### 2.8 仪表盘与统计
DashboardController 提供系统信息（`GET /api/dashboard/system-info`）、统计图表（`GET /api/dashboard/stat-data`）、最新用户（`GET /api/dashboard/latest-user`）和最新种子（`GET /api/dashboard/latest-torrent`）四个核心接口。

[详细文档 →](./admin/dashboard-and-statistics)

## 3. 操作入口

- Filament 后台：`/{FILAMENT_PATH}`（默认 `/nexusphp`）
- `GET /api/settings` — 配置列表
- `POST /api/agent-check` — 客户端校验
- `GET /api/dashboard/system-info` — 系统信息
- `GET /api/dashboard/stat-data` — 统计数据
- `GET /api/dashboard/latest-user` — 最新用户
- `GET /api/dashboard/latest-torrent` — 最新种子
- `GET /api/users` — 用户治理
- `GET /api/all-agent-allows` — 全部允许客户端
- `POST /api/user-disable` — 禁用用户
- `POST /api/user-enable` — 启用用户

## 4. 使用说明

1. 配置修改通过 Filament SettingResource 的 Tab 分组管理，修改后自动缓存生效。
2. 用户治理操作需填写原因，所有变更写入审计日志。
3. 客户端风控通过配置 AgentAllow 白名单和 AgentDeny 黑名单例外实现。
4. 运营字典在 Filament 后台的 Section/Category 等资源中维护，影响种子发布和搜索。
5. 搜索索引在种子状态变更时自动同步，全量重建管理员可手动触发。
6. 仪表盘接口面向运维监控，统计数据可扩展自定义图表。

## 5. 配置参考（可选）

- `FILAMENT_PATH` 环境变量控制后台入口路径
- `system.access_admin_class_min` 控制后台访问门槛（默认 Administrator，class=14）
- 16 个配置组详见 [配置参考](./admin/settings-reference)
- 审计日志保留策略在 `settings` 表中配置
