---
sidebar_position: 5
---

# 数据库与存储

这是一页模块索引，不承担详细规格。真正可直接开发的内容拆到下列子功能页。

## 子功能目录

1. [主业务数据存储](./storage/business-data-storage)
2. [Tracker 运行态存储](./storage/tracker-runtime-storage)
3. [内容互动与审计存储](./storage/content-and-audit-storage)
4. [附件、文件与备份](./storage/file-and-backup-storage)

## 模块边界

- 负责持久化策略和数据分层
- 不替代业务模块定义规则，但承载这些规则的事实结果
- 数据库设计文档是该模块的结构依据

## 首批交付

- 用户/种子/Peer/Snatch 主存储
- 日志与审计基础能力
- 附件与种子文件存储
- 备份与恢复基础方案
