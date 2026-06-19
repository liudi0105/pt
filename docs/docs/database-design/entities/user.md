---
sidebar_position: 1
---

# 用户模块实体

这一组实体负责账号身份、权限状态、用户偏好和用户审计。

## 实体清单

| 实体 | 职责 | 关键关系 | 备注 |
| --- | --- | --- | --- |
| users | 用户主数据 | 关联种子、消息、考核、H&R、勋章、邀请 | 站点所有行为的起点 |
| user_metas | 用户扩展配置 | 1:1 或 1:N 关联 users | 存放偏好和扩展字段 |
| login_logs | 登录审计 | 关联 users | 记录登录轨迹和安全信息 |
| username_change_logs | 改名审计 | 关联 users | 记录用户名变更历史 |
| user_ban_logs | 封禁审计 | 关联 users | 记录封禁、解封和原因 |
| invites | 邀请关系 | 关联 users 作为邀请人/被邀请人 | 控制邀请额度和有效期 |
| user_medals | 用户勋章关系 | 关联 users 和 medals | 保存用户持有的勋章 |
| bonus_logs | 积分/Bonus 变更 | 关联 users | 保存积分变化轨迹 |
| torrent_buy_logs | 购买记录 | 关联 users 和 torrents | 记录用户购买种子或权限的行为 |
| personal_access_tokens | API 授权令牌 | 关联 users | 站点认证基础设施 |

## 核心实体说明

### users

用户主表建议承载以下信息：

- 身份标识
- 用户名和密码摘要
- 登录密钥和编辑密钥
- 邮箱和状态
- 等级和权限标识
- 最近访问和活跃时间
- 上传、下载、做种和积分统计
- 邀请、勋章、补签卡和展示偏好

设计要求：

- 用户状态必须显式
- 等级变更必须可审计
- 所有权限判断从用户主体派生

#### 典型字段

- `id`
- `username`
- `passhash`
- `secret`
- `email`
- `status`
- `added`
- `last_login`
- `last_access`
- `class`
- `uploaded`
- `downloaded`
- `seedtime`
- `leechtime`
- `enabled`
- `donor`
- `warned`
- `leechwarn`
- `invites`
- `seedbonus`
- `title`
- `passkey`
- `downloadpos`
- `uploadpos`
- `showclienterror`
- `attendance_card`
- `seed_points_per_hour`

#### 索引关注

- `username` 唯一索引
- `passkey` 唯一索引
- `class`
- `enabled`
- `warned`
- `ip`
- `last_access`
- `uploaded`
- `downloaded`
- `country`
- `status + added` 组合索引

### user_metas

扩展属性不要塞回主表。

适合承载：

- 页面展示偏好
- 封面图展示开关
- 语言和时区偏好
- 站点功能开关

### invites

邀请体系建议同时承载：

- 邀请人
- 被邀请人
- 邀请状态
- 过期时间
- 邀请来源

设计要求：

- 邀请关系可追踪
- 邀请额度可计算
- 邀请失效可回收

### 关联实体

用户模块还会与下列实体产生强关联：

- `login_logs`
- `username_change_logs`
- `user_ban_logs`
- `bonus_logs`
- `torrent_buy_logs`
- `attendance_logs`
- `exam_users`
- `hit_and_runs`
- `user_medals`

## 使用场景

- 登录后校验账号状态
- 用户中心展示
- 后台用户管理
- 邀请链路管理
- 账号封禁和解封

## 风险点

- users 是高频读写表，必须控制字段膨胀
- 用户状态和权限不要过度耦合
- 所有审计类记录要能按用户回查
- 二进制密钥和大文本备注不应影响列表查询
- 统计字段和展示字段要区分主次
