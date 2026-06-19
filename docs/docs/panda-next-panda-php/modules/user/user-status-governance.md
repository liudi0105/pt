# 用户状态治理

## 1. 概述

管理用户从正常到受限再到恢复的治理全过程，包括禁用/启用、重置密码、增减字段、移除二步验证及删除用户等操作，所有治理动作均记录审计日志。

## 2. 功能说明

### 2.1 核心状态字段
| 字段 | 值 | 含义 |
|------|------|------|
| `status` | confirmed / pending | 用户确认状态 |
| `enabled` | yes / no | 是否启用 |
| `downloadpos` | yes / no | 下载权限 |
| `leechwarn` | yes / no | 吸血警告 |
| `leechwarnuntil` | datetime | 吸血警告截止时间 |

`User::checkIsNormal()` 要求 `status=confirmed` 且 `enabled=yes`。

### 2.2 治理操作 API

**禁用用户** — `POST /api/user-disable`
- 需提供 `reason` 参数，自动追加到 `modcomment` 字段
- 同时写入 `UserBanLog` 记录
- 用户立即无法登录和执行任何业务操作

**启用用户** — `POST /api/user-enable`
- 将 `enabled` 恢复为 `yes`
- 若目标用户为 Peasant（class=0），自动设置 `leechwarn=yes` 并持续 30 天

**重置密码** — `POST /api/user-reset-password`
- 生成新的 `secret` 和 `passhash`
- 原 Token 和 Cookie 立即失效，用户需重新登录

**增减字段** — `PUT /api/user-increment-decrement`
- 支持字段：`uploaded`, `downloaded`, `seedbonus`, `invites`, `attendance_card`
- 操作为增量调整（正数增加，负数减少）

**移除二步验证** — `PUT /api/user-remove-two-step`
- 清除 `two_step_secret` 字段

**删除用户** — `UserRepository::destroy()`
- 物理删除用户记录以及所有关联数据（种子、评论、消息等）
- 不可逆操作，执行前需确认

**变更等级** — `changeClass()`
- 提升或降低用户等级
- 变更后自动发送 PM 通知用户

**切换下载权限** — `updateDownloadPrivileges()`
- 切换 `downloadpos` 字段

**移除吸血警告** — `removeLeechWarn()`
- 清除 `leechwarn` 和 `leechwarnuntil`
- 恢复下载权限

### 2.3 审计日志
所有治理操作均写入对应的审计表：
- `user_ban_logs` — 禁用/启用记录，包含操作人、原因、时间
- `user_operation_*` 表 — 其他操作记录

### 2.4 状态变化影响
- 登录拦截：`enabled=no` 或 `status=pending` 时拒绝登录
- 权限拦截：禁用用户无法调用任何受权限保护的 API
- 恢复后，权限按当前等级和角色重新计算

## 3. 操作入口

- `POST /api/user-disable` — 禁用用户
- `POST /api/user-enable` — 启用用户
- `POST /api/user-reset-password` — 重置密码
- `PUT /api/user-increment-decrement` — 增减字段
- `PUT /api/user-remove-two-step` — 移除二步验证
- `UserRepository::destroy()` — 删除用户
- `changeClass()` — 变更等级
- `updateDownloadPrivileges()` — 切换下载权限
- `removeLeechWarn()` — 移除吸血警告

## 4. 使用说明

1. 禁用用户时必须填写原因，便于后续追溯。
2. 启用 Peasant 用户时系统自动附加 30 天吸血警告，需管理员关注。
3. 重置密码后用户所有活跃会话立即失效。
4. 增减字段支持正负值，但下载量不可为负。
5. 删除用户为物理删除，关联数据一并清除，请谨慎操作。
6. 所有治理动作均自动记录审计日志，人工操作时需确认操作者身份。

## 5. 配置参考（可选）

- `leechwarn` 默认持续时长由业务逻辑硬编码为 30 天
- `modcomment` 追加格式：`[操作时间] 操作人: 操作描述`
