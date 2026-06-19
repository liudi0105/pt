# 客户端风控

## 1. 概述

定义 BitTorrent 客户端接入站点的准入规则，通过白名单（AgentAllow）和黑名单（AgentDeny）机制控制允许使用的客户端版本。适用于 Tracker 做种/下载时的客户端校验、防止非法或恶意客户端接入。

## 2. 功能说明

### 2.1 客户端白名单管理（AgentAllow）

白名单定义允许的客户端家族（如 "qBittorrent"、"Transmission"）。每条规则包含以下匹配字段：

- **peer_id 匹配**：`peer_id_pattern`（正则）、`peer_id_start`（固定前缀）、`peer_id_matchtype`（dec/hex 匹配模式）
- **Agent 字符串匹配**：`agent_pattern`（正则）、`agent_start`（固定前缀）、`agent_matchtype`
- **例外开关**：`exception`（yes/no）— 标记该家族是否有额外拒绝版本
- **HTTPS 开关**：`allowhttps`（yes/no）— 是否允许该客户端使用 HTTPS 连接

提供完整 CRUD 操作，API 端点 `resource /api/agent-allows`。

### 2.2 客户端黑名单管理（AgentDeny）

黑名单定义特定客户端家族中需要被禁止的具体版本。与白名单中的 `exception=yes` 家族配合使用。提供完整 CRUD 操作，API 端点 `resource /api/agent-denies`。

### 2.3 客户端校验流程

Tracker 在 announce 请求时调用风控引擎进行校验：

1. 加载全部白名单规则（缓存 1 小时，`GET /api/all-agent-allows`）。
2. 遍历白名单，对每条规则匹配 peer_id + agent 字符串。
3. 若匹配成功，进行版本号比较：通过正则提取版本数字，做数值比较。
4. 通过匹配且版本校验通过 → 客户端被允许。
5. 若规则标记 `exception=yes`，额外查询黑名单检查版本是否被明确拒绝。
6. 若客户端使用 HTTPS 但规则未开启 `allowhttps=yes` → 拒绝。

### 2.4 快速校验接口

`POST /api/agent-check` — 传入 peer_id + agent 字符串，返回校验结果。供管理排查使用。

### 2.5 简化校验模式

Tracker 常规 announce 使用简化校验：仅检查 agent 字符串是否匹配白名单正则，不执行完整的 peer_id + 版本比对流程，以提升性能。

### 2.6 数据模型

- **AgentAllow**（表：`agent_allowed_family`）— 客户端家族白名单
- **AgentDeny**（表：`agent_allowed_exception`）— 客户端版本黑名单
- AgentAllowRepository（336 行）封装所有查询和缓存逻辑
- AgentAllowController / AgentDenyController 处理 HTTP 请求

## 3. 操作入口

**Filament 路径：** 客户端管理 → Agent Allow / Agent Deny

**API 端点：**

| 方法 | 端点 | 说明 |
|------|------|------|
| GET/POST | `/api/agent-allows` | 白名单列表/新建 |
| PUT/DELETE | `/api/agent-allows/{id}` | 白名单编辑/删除 |
| GET | `/api/all-agent-allows` | 全部白名单（缓存） |
| POST | `/api/agent-check` | 客户端快速校验 |
| GET/POST | `/api/agent-denies` | 黑名单列表/新建 |
| PUT/DELETE | `/api/agent-denies/{id}` | 黑名单编辑/删除 |

## 4. 使用说明

1. **添加客户端家族**：在白名单中创建规则，填写 peer_id 匹配模式或 agent 匹配模式。建议优先使用 agent 正则匹配。
2. **封禁特定版本**：在白名单中对该家族设置 `exception=yes`，然后在黑名单中添加需拒绝的版本号。
3. **规则冲突处理**：优先级规则遵循"先匹配先服务"。若某客户端同时匹配多条白名单规则，以第一条匹配结果为准。
4. **禁用 HTTPS**：对不希望支持 HTTPS 连接的客户端家族，将 `allowhttps` 设为 `no`。
5. **校验测试**：新增规则后，通过 `POST /api/agent-check` 接口输入模拟的 peer_id 和 agent 进行验证。
6. **缓存刷新**：白名单规则缓存 1 小时，修改后需等待缓存过期或重启服务以立即生效。

## 5. 配置参考

无独立配置项。规则数据直接存储在 `agent_allowed_family` 和 `agent_allowed_exception` 表中，通过 Filament 管理界面维护。
