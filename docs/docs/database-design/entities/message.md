---
sidebar_position: 6
---

# Message 实体

Message 负责站内信和系统消息，是用户沟通的重要实体。

## 核心字段

根据现有 migration，messages 的关键字段包括：

- `id`
- `sender`
- `receiver`
- `added`
- `subject`
- `msg`
- `unread`
- `location`
- `saved`

## 关系说明

- `sender` 关联发送者
- `receiver` 关联接收者

## 设计用途

- 私信发送
- 管理通知
- 未读状态管理
- 保存和归档

## 索引关注

- `sender`
- `receiver`

## 风险点

- 消息状态和盒子状态容易混淆
- 未读状态必须准确
- 大文本消息要注意查询范围

