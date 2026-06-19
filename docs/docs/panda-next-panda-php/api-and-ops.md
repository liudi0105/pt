---
sidebar_position: 6
---

# 接入与运维

## 1. 概述

管理站点对外提供的接入能力（站点入口、OAuth 授权、第三方用户态读取、外部工具审批）和运行保障（配置管理、定时任务、备份恢复、日志监控），确保外部系统可安全、受控地与站内用户态交互，同时保证站点持续稳定运行。

## 2. 功能说明

### 2.1 站点入口与首页跳转
根路径 `GET /` 指向 `index.php`，登录入口 `GET /login` 指向 `login.php`，未登录用户访问受限页面时自动重定向至登录页并保留 `returnto` 参数，登录完成后恢复跳转。

[详细文档 →](./modules/integration/site-entry-and-home)

### 2.2 外部用户态读取
ADTU 接口 `GET/POST /api/ADTU/getUserByCookie` 和 autoseed 接口 `GET/POST /api/autoseed/getUserByCookie` 通过 Nexus Cookie（`c_secure_uid`/`c_secure_pass`/`c_secure_login`）识别登录用户，返回用户 ID、用户名、等级、做种数据、Passkey 等最小必要信息。不暴露邮箱、密码、二步验证等敏感字段。

[详细文档 →](./modules/integration/external-user-lookup)

### 2.3 第三方审批接入
NAS Tools（`POST /api/nastools/approve`）和 IYUU（`GET /api/iyuu/approve`）通过约定的加密/签名机制验证站内用户身份，返回授权结果。使用 `throttle:third-party` 限流（10 次/分钟）。不支持任意第三方扩展，仅对接已验证的工具。

[详细文档 →](./modules/integration/third-party-approval)

### 2.4 认证与授权
OAuth 授权通过 `GET /oauth/authorize` 进入 Laravel Passport 授权流程，`passport_auth` 中间件使用 Nexus Cookie 校验用户身份。所有 API 路由通过 Passport Token 或 Nexus Cookie 认证。

### 2.5 运行保障
- **配置管理**：`settings` 表 key-value 配置，Redis 缓存自动生效（TTL 600s）
- **定时任务**：`routes/console.php` 定义调度任务（备份、清理过期数据、考核结算等）
- **备份恢复**：通过 `backup.*` 配置组定义备份策略，支持本地和远端存储
- **日志监控**：`torrent_operation_logs`/`user_ban_logs`/`login_logs` 等审计表提供可追溯记录
- **频率限制**：API 路由 60 次/分钟，第三方接口 10 次/分钟，Redis 限流

### 2.6 中间件体系
| 守卫/中间件 | 用途 |
|-------------|------|
| `auth:api` | Passport Token API 认证 |
| `auth.nexus` | Nexus Cookie Web 认证 |
| `admin` | 后台管理权限校验 |
| `user` | 用户级请求（更新 `last_access`） |
| `locale` | 多语言 + 请求注入（Request-Id, Running-In-Octane） |
| `passport_auth` | OAuth 授权页面的 Cookie 验证 |
| `throttle` | Redis 限流 |

## 3. 操作入口

- `GET /` — 站点首页
- `GET /login` — 登录页
- `GET /oauth/authorize` — OAuth 授权
- `GET/POST /api/ADTU/getUserByCookie` — ADTU 用户态读取
- `GET/POST /api/autoseed/getUserByCookie` — autoseed 用户态读取
- `POST /api/nastools/approve` — NAS Tools 审批
- `GET /api/iyuu/approve` — IYUU 审批
- `api` 路由组 — 所有 API 接口（限流 60/min）
- `third-party` 路由组 — 第三方接口（限流 10/min）
- 控制台命令 — 定时任务和运维命令

## 4. 使用说明

1. 站点入口 `/` 和 `/login` 由 Web 服务器配置指向，仅做入口跳转，不承担业务逻辑。
2. 外部工具通过 Cookie 或 Passkey 认证读取用户态，不同工具返回字段集合不同。
3. NAS Tools 和 IYUU 审批使用全路径参数签名校验，字段拼装规则由各自工具约定。
4. 所有写入型操作必须可追溯，通过审计日志反推发起来源。
5. 配置变更后通过 Redis 缓存 TTL 自动生效，无需重启服务。
6. 限流策略作用于路由组级别，第三方接口限流阈值低于通用 API。

## 5. 配置参考（可选）

- `backup.*` — 备份策略（目的地、频率、保留周期）
- `system.*` — 站点基础配置
- `security.*` — 安全策略配置
- 限流阈值：`throttle:api`（60/min），`throttle:third-party`（10/min）
- Cookie 加密排除：`c_secure_pass`/`c_secure_uid`/`c_secure_login` 等 Nexus Cookie 不加密
- OAuth 配置：Laravel Passport 配置，Token 有效期可在 `config/passport.php` 调整
