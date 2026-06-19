---
sidebar_position: 5
---

# Comment 实体

Comment 负责记录种子或内容下的评论，是社区互动的基础实体之一。

## 核心字段

根据现有 migration，comments 的关键字段包括：

- `id`
- `user`
- `torrent`
- `added`
- `text`
- `ori_text`
- `editedby`
- `editdate`
- `offer`
- `request`
- `anonymous`

## 关系说明

- `user` 关联发言用户
- `torrent` 关联种子
- `offer` 关联候选或求种场景
- `request` 关联需求场景

## 设计用途

- 资源评论
- 回复和互动
- 评论审计
- 匿名评论支持

## 索引关注

- `user`
- `torrent + id`
- `offer + id`

## 风险点

- 评论量高，写入频繁
- 必须保留原始文本和编辑后文本
- 需要支持匿名和审计并存

