# Tracker 运行态存储

## 1. 概述

承载 Tracker 服务的高频连接状态更新，管理 Peer 的在线/离线生命周期，为 Scrape 统计和 Snatch 历史记录提供运行态输入，与主业务查询分离以避免干扰。

## 2. 功能说明

### 2.1 Peer 表
`peers` 表是 Tracker 运行态的核心，每条记录对应一个用户与一个种子间的连接。

| 特性 | 说明 |
|------|------|
| 唯一约束 | `(torrent, peer_id)` 唯一，一个用户对一个种子只有一个连接 |
| 更新频率 | 普通连接约 30-60 秒一次 Announce |
| 创建 | 用户首次 Announce 时插入 |
| 更新 | 每次 Announce 更新上传量、下载量、剩余量、速度 |
| 删除 | 客户端发送 `stopped` 事件时删除 |

### 2.2 Peer 关键字段
- `connectable` — 是否可连接
- `is_seed_box` — 是否标记为盒子
- `agent` — 客户端标识
- `ipv4` / `ipv6` — 网络地址
- `uploaded`, `downloaded`, `to_go` — 流量计数
- `last_action` — 最后活跃时间

每次 Announce 计算下载/上传增量并累加到对应的 `users` 和 `torrents` 统计数据中。

### 2.3 Snatch（完成记录）
当用户完成下载或停止做种时，生成 Snatch 记录（`snatches` 表）：
- 记录用户对种子的完成/做种/下载数据
- 作为历史态留存，Peer 记录被清理后仍可查询
- H&R 判定依赖 Snatch 记录

### 2.4 Scrape 数据
Scrape 请求（批量查询种子状态）直接通过 Peer 表的聚合查询生成：
- 做种数（seeder count）
- 下载数（leecher count）
- 完成数（completed count）

### 2.5 生命周期
```
用户 Announce（首次）→ Peer 创建 → 持续 Announce 更新
  ↓                                   ↓
完成下载                              stopped 事件
  ↓                                   ↓
Snatch 记录                          Peer 删除
```

### 2.6 数据隔离
- 高频写入与主业务查询分开：Peer 写操作不阻塞其他业务读操作。
- Peer 是运行态数据，允许过期；Snatch 是历史态数据，不可丢失。
- 过期 Peer 通过 CRON 或空闲超时清理。

## 3. 操作入口

- Announce URL（Tracker 协议）：由客户端自动调用
- Scrape URL（Tracker 协议）：批量查询种子状态
- 数据库：`peers` 表（运行态）、`snatches` 表（历史态）

## 4. 使用说明

1. Peer 表中的 `uploaded` / `downloaded` 是差分值，每次 Announce 的增量累加到 `users` 和 `torrents` 的总额中。
2. 用户停止做种或下载后，Peer 记录被删除，但 Snatch 记录保留。
3. H&R 策略基于 Snatch 记录中的做种时间来判定。
4. Tracker 高并发场景下需关注表的索引和写入性能。
5. 运行态数据（Peer）与历史态数据（Snatch）职责边界清晰，不可混用。

## 5. 配置参考（可选）

- Announce 间隔由 Tracker 配置和客户端协商决定
- Peer 过期清理策略由调度任务控制
