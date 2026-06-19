---
sidebar_position: 1
---

# Panda PT Site Doc

这套文档基于 `D:\workspace\panda-next\panda-php` 的代码结构整理，目标不是复述 README，而是把这个 PT 站点的功能分层、业务对象、接口边界和运维方式拆开说明，方便交接、二开和排障。

## 阅读顺序

1. [项目总览](./panda-next-panda-php/overview)
2. [系统架构](./panda-next-panda-php/architecture)
3. [功能模块与业务流程](./panda-next-panda-php/modules)
4. [核心数据模型](./panda-next-panda-php/data-model)
5. [数据库设计](./database-design/tables/users)
6. [接口与运维说明](./panda-next-panda-php/api-and-ops)

## 文档覆盖范围

- 站点前台和用户侧能力
- 种子、Peer、Snatch、做种统计等 PT 核心链路
- 考核、H&R、签到、勋章、积分、奖励等运营机制
- 后台管理、插件扩展、全文搜索和定时任务
- 路由、认证、中间件和外部系统接入

## 文档定位

- 偏设计说明，不是使用手册
- 偏结构化拆解，不是代码逐文件注释
- 内容基于代码命名、路由、资源和配置整理，属于实现层总结
