---
sidebar_position: 3
---

# Peer 实体

Peer 负责记录 tracker 上报的实时连接状态，是做种统计和下载状态的核心实体。

## 实体清单

| 字段/属性 | 职责 | 说明 |
| --- | --- | --- |
| peers | 实时连接记录 | 一条记录对应一个用户在一个种子上的一个 peer |

## 核心字段

根据现有 migration，peer 的关键字段包括：

- `id`
- `torrent`
- `peer_id`
- `ip`
- `port`
- `uploaded`
- `downloaded`
- `to_go`
- `seeder`
- `started`
- `last_action`
- `prev_action`
- `connectable`
- `userid`
- `agent`
- `finishedat`
- `downloadoffset`
- `uploadoffset`
- `passkey`

## 关系说明

- `userid` 关联用户
- `torrent` 关联种子
- `peer_id + torrent` 形成唯一 peer 记录

## 设计用途

- 追踪做种和下载中的实时状态
- 计算下载进度和分享率
- 判断是否完成、是否连接、是否活跃
- 服务 tracker announce / scrape

## 索引与约束

- `peer_id` 索引
- `userid` 索引
- `torrent + peer_id` 唯一约束

## 风险点

- 这是高写入高更新实体
- 需要防止重复上报膨胀
- 查询主要按用户和种子聚合

