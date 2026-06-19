---
sidebar_position: 8
---

# Hit and Run 实体

Hit and Run 负责记录用户未正常做种或违规做种行为。

## 核心字段

根据现有 migration，hit_and_runs 的关键字段包括：

- `id`
- `uid`
- `torrent_id`
- `snatched_id`
- `status`
- `comment`
- `created_at`
- `updated_at`

## 关系说明

- `uid` 关联用户
- `torrent_id` 关联种子
- `snatched_id` 关联完成记录

## 设计用途

- 违规记录
- 豁免和处罚
- 处罚状态跟踪
- 与考核和做种统计联动

## 索引与约束

- `uid + torrent_id` 唯一约束
- `snatched_id` 唯一约束

## 风险点

- 处罚状态必须可解释
- 记录与豁免要能回溯
- 需要和 snatch 保持强关联

