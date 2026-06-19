# 权限与等级

## 1. 概述

定义用户的访问能力和操作能力，通过等级（class）、角色权限和直接权限三层合并计算，控制前台页面、后台管理及 API 接口的可访问性。

## 2. 功能说明

### 2.1 用户等级体系（17 级）
| class | 名称 | 说明 |
|-------|------|------|
| 0 | Peasant | 初始等级 |
| 1 | User | 普通用户 |
| 2 | PowerUser | 需 seed_points 自动晋升 |
| 3 | EliteUser | 需 seed_points 自动晋升 |
| 4 | CrazyUser | 需 seed_points 自动晋升 |
| 5 | InsaneUser | 需 seed_points 自动晋升 |
| 6 | VeteranUser | 需 seed_points 自动晋升 |
| 7 | ExtremeUser | 需 seed_points 自动晋升 |
| 8 | UltimateUser | 需 seed_points 自动晋升 |
| 9 | NexusMaster | 需 seed_points 自动晋升 |
| 10 | VIP | 特殊身份，无自动晋升 |
| 11 | Retiree | 退休用户 |
| 12 | Uploader | 发布员 |
| 13 | Moderator | 版主 |
| 14 | Administrator | 管理员 |
| 15 | Sysop | 系统管理员 |
| 16 | StaffLeader | 站长 |

等级 0-9 由 `seed_points` 条件自动晋升（持续满足即自动升级）。等级 10-16 为人工指定，不参与自动晋升。

### 2.2 权限来源（三层合并）
1. **等级权限** — 通过 `authority.*` 配置定义，每个权限名称映射到最低所需等级（class）。
2. **角色权限** — 通过 `user_role_permissions` 插件过滤，为用户附加或收窄权限。
3. **直接权限** — 存储于 `user_permissions` 表，为用户单独指定的权限记录。

最终权限 = 等级权限 ∪ 角色权限 ∪ 直接权限。

### 2.3 权限校验
核心函数 `user_can($permissionName)`：
- StaffLeader（class=16）自动拥有所有权限，跳过检查。
- 普通用户：比较用户 class 与权限设置的最低 class 要求。
- 校验结果受用户状态影响（disabled 用户即使等级足够也无权限）。

### 2.4 后台访问
`User::canAccessAdmin()` — 校验用户 class 是否 >= `system.access_admin_class_min`（默认 14，即 Administrator）。

### 2.5 关键权限与等级要求
| 权限 | 最低等级 |
|------|----------|
| upload（发布种子） | User(1) |
| sendinvite（发送邀请） | User(1) |
| buyinvite（购买邀请） | CrazyUser(4) |
| torrent-approval（种子审核） | Administrator(14) |
| torrent-delete（删除种子） | Administrator(14) |
| user-delete（删除用户） | Administrator(14) |
| user-change-class（变更等级） | Administrator(14) |
| torrent-sticky（置顶种子） | Administrator(14) |
| torrentmanage（种子管理） | Moderator(13) |
| commentmanage（评论管理） | Moderator(13) |
| viewanonymous（查看匿名） | Uploader(12) |
| seebanned（查看封禁） | Uploader(12) |

## 3. 操作入口

- 权限校验：`user_can($permissionName)` — 任意代码中调用
- 后台访问：`User::canAccessAdmin()` — 管理入口守卫
- 等级配置：`authority.*` 配置项
- 角色插件：`user_role_permissions` 过滤器
- 直接权限：`user_permissions` 表

## 4. 使用说明

1. 开发新功能时，先在 `authority.*` 配置中定义权限与最低等级，然后通过 `user_can()` 校验。
2. 用户状态（disabled）优先级高于权限配置，应先通过 `User::checkIsNormal()`。
3. 后台功能需同时校验 `canAccessAdmin()` 和具体操作权限。
4. 等级 0-9 用户自动晋升无需人工干预，改变后权限立即生效。
5. 特殊角色（VIP、Retiree）依赖人工管理，不会自动变更。

## 5. 配置参考（可选）

- `system.access_admin_class_min` — 后台访问最低等级，默认 14
- `authority.*` — 各权限名称与最低 class 的映射关系
