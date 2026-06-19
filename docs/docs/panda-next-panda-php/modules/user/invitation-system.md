# 邀请体系

## 1. 概述

承载用户准入和增长控制功能，管理邀请额度的发放、消耗、过期以及邀请关系的记录，支持永久邀请额度和临时邀请两种模式。

## 2. 功能说明

### 2.1 数据模型
`invites` 表结构：
| 字段 | 类型 | 说明 |
|------|------|------|
| inviter | int | 邀请人用户 ID |
| invitee | int | 被邀请人用户 ID（注册后填充） |
| hash | varchar(32) | 唯一邀请码 |
| time_invited | datetime | 发送时间 |
| valid | tinyint(1) | 是否有效（0/1） |
| invitee_register_uid | int | 注册用户 ID |
| invitee_register_email | varchar | 注册邮箱 |
| invitee_register_username | varchar | 注册用户名 |
| pre_register_email | varchar | 预注册邮箱 |
| pre_register_username | varchar | 预注册用户名 |
| expired_at | datetime | 过期时间 |

### 2.2 邀请发送流程
1. **权限校验**：用户需要拥有 `sendinvite` 权限（User 及以上等级），且邀请系统已启用。
2. **额度校验**：
   - 永久额度：`user.invites` 字段
   - 临时额度：`user.temporary_invites()` 关联查询（带过期时间）
3. **发送**：消耗一个额度，创建 `invites` 记录，生成唯一 32 位 `hash`。
4. **更新**：扣减 `user.invites` 值或临时邀请额度。

### 2.3 邀请注册流程
1. 新用户使用邀请码注册时提交 `hash`。
2. 系统根据 `hash` 查找邀请记录，校验 `valid=1`、未过期（`expired_at > now()`）、未使用。
3. 创建用户账号，更新邀请记录：填充 `invitee`、`invitee_register_uid/email/username`，设置 `valid=0`。
4. 建立 `inviter` → `invitee` 的邀请关系。

### 2.4 临时邀请
通过控制台命令 `invite:tmp {uid} {days} {count}` 生成：
- 给指定用户发放 `count` 个临时邀请额度
- `expired_at` 设为当前时间 + `days` 天
- 存储在 `invites` 表中，`invitee` 为空，`valid=1`
- 过期后自动失效，不允许继续使用

### 2.5 管理员管理
- **Filament InviteResource**：只读列表，可按状态、邀请人、时间过滤
- **Console 命令**：`invite:tmp` 手动发放临时邀请

### 2.6 用户关联
- `inviter()` — 获取邀请当前用户的人
- `invitee_code()` — 当前用户发出的邀请列表
- `temporary_invites()` — 当前用户的临时邀请额度（含过期状态）

## 3. 操作入口

- 发送邀请：用户中心邀请页面（传统 PHP）
- 邀请注册：注册页面提交 `hash`
- 管理员查看：Filament InviteResource
- 发放临时邀请：`php artisan invite:tmp {uid} {days} {count}`

## 4. 使用说明

1. 用户需满足等级要求（User+）且有可用额度才能发送邀请。
2. 临时邀请过期后自动作废，不影响永久额度。
3. 注册时填写的邮箱/用户名会与预注册信息比对，不一致可能触发审核。
4. 管理员可通过 InviteResource 查看全站邀请记录和状态。
5. 同一邀请码只能使用一次，使用后 `valid` 设为 0。

## 5. 配置参考（可选）

- 邀请系统全局开关：检查对应配置项
- 用户购买邀请权限：`buyinvite`（最低 CrazyUser，class=4）
- 临时邀请过期时长由 `invite:tmp` 命令的 `{days}` 参数控制
