# 登录与认证

## 1. 概述

提供用户进入站点、维持登录态、退出登录以及接受 API 授权的统一认证闭环，覆盖密码登录、Passkey 登录、Nexus Cookie 认证和 Passport OAuth 四种方式。

## 2. 功能说明

### 2.1 密码登录
用户通过用户名/邮箱 + 密码提交 `POST /api/login`，服务端构造 `md5(secret + password + secret)` 比对 `passhash`。校验通过后返回用户数据并生成 Passport Token（`$user->createToken()`）。所有后续 API 请求通过 `auth:api` 中间件验证。

### 2.2 Passkey 登录
用户访问 `/{loginSecret}/{passkey}` 链接，系统根据 `passkey` 字段直接定位用户并设置 Nexus Cookie。无需输入密码，适用于自动化工具或快捷登录。

### 2.3 Nexus Cookie 认证
用于 Filament 后台和传统 Web 页面，由三个 Cookie 构成：
- `c_secure_uid`：用户 ID
- `c_secure_pass`：`md5(passhash)`，校验身份
- `c_secure_login`：最后登录时间

### 2.4 API Token（Laravel Passport）
登录成功后通过 `$user->createToken()` 签发 OAuth Token，API 路由统一使用 `auth:api` 中间件保护。登出时调用 `POST /api/logout` 撤销所有令牌。

### 2.5 用户状态拦截
任意认证方式通过后均调用 `User::checkIsNormal()` 校验：`status` 必须为 `confirmed` 且 `enabled` 为 `yes`，否则拒绝建立登录态。

### 2.6 多认证守卫
| 守卫 | 用途 | 认证方式 |
|------|------|----------|
| `web` | 传统 Session | 密码 |
| `api` | Passport API | Token |
| `nexus` | Cookie 校验 | Cookie |
| `nexus-web` | Filament/Web | Cookie |
| `passkey` | Tracker | Passkey |

## 3. 操作入口

- `GET /login` — 登录页面
- `POST /api/login` — 密码登录 API
- `POST /api/logout` — 登出 API
- `GET /api/user-me` — 获取当前用户
- `/{loginSecret}/{passkey}` — Passkey 登录链接

## 4. 使用说明

1. 密码登录：提交用户名和密码到 `POST /api/login`，成功后保存返回的 Token。
2. Passkey 登录：生成带 Passkey 的唯一链接，用户访问后自动登录。
3. 登出：调用 `POST /api/logout`，所有当前用户的 Passport Token 立即失效。
4. 账号被禁用或未确认时，任何认证方式均无法建立登录态。
5. Cookie 认证用于 Web 页面和后台，API 认证优先使用 Passport Token。

## 5. 配置参考（可选）

- `login_secret` — Passkey 登录路径中的 `{loginSecret}` 字段
- Passport Token 有效期可通过 `config/passport.php` 配置
