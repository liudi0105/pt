---
sidebar_position: 1
---

# 账户与权限

这是一页模块索引，不承担详细规格。真正可直接开发的内容拆到下列子功能页。

## 子功能目录

1. [登录与认证](./user/login-and-auth)
2. [用户主档案](./user/user-profile)
3. [权限与等级](./user/permission-and-level)
4. [用户状态治理](./user/user-status-governance)
5. [邀请体系](./user/invitation-system)

## 模块边界

- 负责用户身份、权限、状态和邀请
- 不负责种子生命周期本身
- 用户与种子的统计视图以用户中心结果为入口，但底层依赖种子与 Tracker 模块

## 首批交付

- 登录/登出
- 当前用户信息
- 权限校验
- 用户后台治理
- 邀请信息查询
