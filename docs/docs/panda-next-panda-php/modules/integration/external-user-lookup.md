# 外部用户态读取

## 1. 概述

为 ADTU 和 autoseed 等外部自动化工具提供受控的用户身份读取接口，根据站点 Cookie 识别当前登录用户并返回最小必要信息，不暴露敏感字段。

## 2. 功能说明

### 2.1 接口概览

两个端点均通过 Nexus Cookie 认证（非 Passport Token），解析 `c_secure_uid` 和 `c_secure_pass` 定位用户。

| 接口 | 认证方式 | 返回字段 |
|------|----------|----------|
| `GET /api/ADTU/getUserByCookie` | Nexus Cookie | id, username, class, class_name |
| `GET /api/autoseed/getUserByCookie` | Nexus Cookie | id, username, class, class_name, enabled, roles |

### 2.2 ADTU 用户态读取
- 用途：仅需确认当前用户身份的联动场景
- 返回：用户 ID、用户名、等级数值、等级名称
- 适用：辅助工具识别当前操作人

### 2.3 autoseed 用户态读取
- 用途：需要判断用户是否可用及角色信息的联动场景
- 额外返回：`enabled`（是否启用）、`roles`（角色列表）
- 适用：联动前校验用户权限和可用性

### 2.4 认证流程
1. 外部工具携带用户浏览器 Cookie 请求接口。
2. 系统通过 `nexus` guard 解析 Cookie 得到用户 ID + passhash 校验。
3. 校验通过后，返回约定的用户信息。
4. 校验失败（Cookie 过期、不匹配、用户不存在等）返回明确错误。

### 2.5 安全约束
- 只返回联动必需字段，不返回 email、passkey 等敏感信息
- 外部工具无法绕过站点登录态校验
- 返回字段集稳定，不因内部数据结构变化而影响外部工具
- 失败时返回明确错误码，不伪造匿名或默认用户结果

## 3. 操作入口

- `GET /api/ADTU/getUserByCookie` — ADTU 工具
- `GET /api/autoseed/getUserByCookie` — autoseed 工具

## 4. 使用说明

1. 外部工具需携带有效的 Nexus Cookie（c_secure_uid + c_secure_pass + c_secure_login）。
2. Cookie 过期后需用户重新登录获取新的 Cookie。
3. 禁用（enabled=no）或未确认（status=pending）的用户将被拒绝。
4. 两个接口的返回字段不同，工具需使用对应接口。
5. 接口只用于身份识别，不提供业务数据操作能力。

## 5. 配置参考（可选）

- Cookie 名称和校验规则由 Nexus guard 配置
- 接口路由限制可通过 Laravel 中间件配置
