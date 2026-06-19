---
sidebar_position: 1
---

# 账户与权限

## 1. 概述

管理用户从进入站点到持续使用的全生命周期，包括身份认证、登录态维持、用户信息聚合、等级与权限控制、账号状态治理以及邀请体系，是站点所有业务模块的基础依赖。

## 2. 功能说明

### 2.1 登录与认证
提供四种认证方式：密码登录（`POST /api/login`，`passhash` 校验）、Passkey 登录（`/{loginSecret}/{passkey}`，免密直登）、Nexus Cookie 认证（`c_secure_uid/pass/login` 三个 Cookie）和 Passport OAuth Token 认证。多守卫架构（`web/api/nexus/nexus-web/passkey`）分别对应 Web 页面、API 请求、后台管理、传统页面和 Tracker 场景。所有认证入口均需通过 `User::checkIsNormal()` 校验用户状态。

[详细文档 →](./user/login-and-auth)

### 2.2 用户主档案
以 `users` 表为核心聚合用户身份（username, email）、状态（confirmed/enabled）、等级（class 0-16）、统计（uploaded/downloaded/bonus/seedtime）和安全信息（passkey, two_step_secret）。`GET /api/user-me` 返回当前用户完整上下文；`GET /api/users/{id}` 管理员视角额外包含邀请人、勋章、考核信息。关联数据通过 `user-publish-torrent`、`user-seeding-torrent` 等独立接口查询。

[详细文档 →](./user/user-profile)

### 2.3 权限与等级
17 级等级体系（Peasant 0 → StaffLeader 16），等级 0-9 由 seed_points 条件自动晋升，10-16 为人工指定。权限来源分三层合并：等级权限（`authority.*` 配置）、角色权限（`user_role_permissions` 插件）、直接权限（`user_permissions` 表）。核心函数 `user_can($permissionName)` 和 `User::canAccessAdmin()` 分别校验操作权限和后台访问权限。

[详细文档 →](./user/permission-and-level)

### 2.4 用户状态治理
提供禁用（`POST /api/user-disable`）、启用（`POST /api/user-enable`）、重置密码（`POST /api/user-reset-password`）、增减字段（`PUT /api/user-increment-decrement`）、移除二步验证（`PUT /api/user-remove-two-step`）、删除用户（`UserRepository::destroy()`）等治理操作，全部记录 `user_ban_logs` 等审计日志。状态变化影响登录拦截和权限可用性。

[详细文档 →](./user/user-status-governance)

### 2.5 邀请体系
管理永久额度（`user.invites` 字段）和临时额度（控制台 `invite:tmp` 命令生成，带过期时间）。邀请发送消耗额度生成 32 位唯一 hash，注册时凭 hash 校验 `valid=1` 且未过期，注册后填充邀请关系。管理员可通过 Filament InviteResource 查看全站邀请记录。

[详细文档 →](./user/invitation-system)

## 3. 操作入口

- `POST /api/login` — 密码登录
- `POST /api/logout` — 登出
- `GET /api/user-me` — 当前用户信息
- `/{loginSecret}/{passkey}` — Passkey 登录
- `GET /oauth/authorize` — OAuth 授权
- `POST /api/user-disable` — 禁用用户
- `POST /api/user-enable` — 启用用户
- `POST /api/user-reset-password` — 重置密码
- `PUT /api/user-increment-decrement` — 增减字段
- `PUT /api/user-remove-two-step` — 移除二步验证
- `php artisan invite:tmp {uid} {days} {count}` — 发放临时邀请

## 4. 使用说明

1. 用户进入站点首先通过登录认证，任意认证方式均需用户状态正常。
2. 登录后通过 `/api/user-me` 获取用户上下文，包含等级、统计和权限信息。
3. 业务代码中通过 `user_can($permissionName)` 统一校验操作权限。
4. 管理员的治理操作必须记录原因，所有变更可追溯。
5. 邀请体系控制站点用户准入，临时邀请过期后自动失效。
6. 等级 0-9 用户自动晋升，无需人工干预。

## 5. 配置参考（可选）

- `login_secret` — Passkey 登录路径中的密钥段
- `authority.*` — 各权限名称与最低 class 的映射
- `system.access_admin_class_min` — 后台访问最低等级，默认 14
- `user.invites` — 用户永久邀请额度字段
- `temporary_invites` 过期时间由 `invite:tmp` 命令的 `{days}` 参数控制
