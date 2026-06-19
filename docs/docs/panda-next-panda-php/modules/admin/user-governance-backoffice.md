# 用户治理后台

## 1. 概述

提供管理员对用户账号进行全生命周期治理的能力，包括用户检索、详情查看、状态变更（禁用/启用）、密码重置、字段调整、权限升降级、用户删除等操作。适用于用户违规处理、账号恢复、信息修正等管理场景。

## 2. 功能说明

### 2.1 用户检索与列表

通过 `GET /api/users` 接口支持按用户 ID、用户名、邮箱、用户等级等多维度筛选用户。Filament 端提供 UserResource（ListUsers）实现分页、搜索和过滤。

### 2.2 用户详情查看

通过 `GET /api/users/{id}` 查看用户完整信息，包括基本信息（上传量、下载量、魔力值、邀请数量等）以及当前考核进度。同时提供以下专用查询接口：

- `GET /api/user-base` — 当前用户自身基础信息
- `GET /api/user-invite-info` — 用户邀请信息
- `GET /api/user-match-exams` — 匹配用户的考核列表
- `GET /api/user-mod-comment` — 用户管理备注历史

### 2.3 用户禁用与启用

- **禁用**：调用 `POST /api/user-disable`，将用户 `enabled` 置为 `no`，自动追加管理备注（modcomment）并写入 UserBanLog 审计记录。
- **启用**：调用 `POST /api/user-enable`，将用户 `enabled` 置为 `yes`。若用户为 Peasant 等级，同时设置 leechwarn 30 天限制。

### 2.4 密码重置

调用 `POST /api/user-reset-password`，系统重新生成 `secret` 和 `passhash`，用户下次登录需使用新密码。

### 2.5 字段调整

通过 `PUT /api/user-increment-decrement` 对用户上传量、下载量、魔力值、邀请数量、签到卡数量进行增减操作。增减量可正可负，系统校验操作后不产生负值等非法状态。

### 2.6 二步验证移除

通过 `PUT /api/user-remove-two-step` 清除用户绑定的 2FA secret，用于帮助用户恢复账号访问。

### 2.7 用户权限升降级

通过 UserRepository 的 `changeClass()` 方法实现用户等级变更（promote/demote）。变更后自动发送 PM 通知用户并写入 modcomment。

### 2.8 用户删除

通过 UserRepository 的 `destroy()` 方法物理删除用户及其关联数据（hit_and_runs、claims、exam_users 等所有关联记录）。此操作不可逆。

### 2.9 用户确认与元属性管理

- `confirmUser()` — 确认待审核用户（pending 状态）
- `addMeta()` — 为用户授予元属性（如改名卡）
- `addTemporaryInvite()` — 添加或移除临时邀请码
- `consumeBenefit()` — 消费用户的福利元属性（如执行改名）

### 2.10 Filament 关联资源

在 Filament 管理面板中，除 UserResource 外，还提供以下关联资源的查看与管理：

- UserMetaResource — 用户元属性
- InviteResource — 邀请记录
- HitAndRunResource — H&R 记录
- ClaimResource — 认领记录
- ExamUserResource — 考核参与记录
- LoginLogResource — 登录日志
- AttendanceLogResource — 签到记录
- BonusLogResource — 魔力值流水
- TorrentBuyLogResource — 种子购买记录
- UserMedalResource — 用户勋章

## 3. 操作入口

**Filament 路径：** System → Users（用户管理页面）

**API 端点：**

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/users` | 用户列表/筛选 |
| POST | `/api/users` | 创建用户 |
| GET | `/api/users/{id}` | 用户详情 |
| POST | `/api/user-disable` | 禁用用户 |
| POST | `/api/user-enable` | 启用用户 |
| POST | `/api/user-reset-password` | 重置密码 |
| PUT | `/api/user-increment-decrement` | 字段增减 |
| PUT | `/api/user-remove-two-step` | 移除二步验证 |
| GET | `/api/user-classes` | 用户等级列表 |

## 4. 使用说明

1. 管理员在 Filament 用户列表页通过搜索框输入 ID/用户名/邮箱定位用户。
2. 点击用户进入详情页，查看基本信息、考核进度、管理备注等。
3. 治理操作区提供禁用、启用、重置密码、字段调整、移除 2FA 等按钮，按需执行。
4. 敏感操作（禁用、删除、降级）需二次确认，系统自动写入操作审计日志。
5. 用户前台状态（能否登录、下载权限等）在操作完成后即时生效。
6. 如需删除用户，在详情页使用删除功能，系统级联清理所有关联数据。
