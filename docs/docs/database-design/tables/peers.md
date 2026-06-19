---
sidebar_position: 3
---

# `peers`

## 表定位

`peers` 记录 tracker 上报的实时连接状态，用于表达用户在某个种子上的当前连接和上传下载状态。

## 来源对照

- 表名：`peers`
- 模型：`App\Models\Peer`
- 初始建表：`2021_06_08_113437_create_peers_table.php`
- 后续追加迁移：
  - `2022_04_20_195415_add_ipv6_to_peers_table.php`
  - `2022_09_12_181952_add_is_seed_box_to_peers_table.php`
  - `2023_03_04_031319_add_index_to_last_action_field_of_peers_table.php`
  - `2023_04_01_005409_add_unique_torrent_peer_user_to_peers_table.php`
  - `2022_04_18_030257_handle_peers_peer_id_unique.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | 否 | 自增 | 主键 |
| `torrent` | `unsigned mediumint` | 否 | `0` | 种子 ID |
| `peer_id` | `char(20) binary` | 否 | 无 | peer 标识 |
| `ip` | `varchar(64)` | 否 | `''` | IP |
| `port` | `unsigned smallint` | 否 | `0` | 端口 |
| `uploaded` | `unsigned bigint` | 否 | `0` | 已上传量 |
| `downloaded` | `unsigned bigint` | 否 | `0` | 已下载量 |
| `to_go` | `unsigned bigint` | 否 | `0` | 剩余量 |
| `seeder` | `enum('yes','no')` | 否 | `'no'` | 是否做种 |
| `started` | `datetime` | 是 | `null` | 开始时间 |
| `last_action` | `datetime` | 是 | `null` | 最近活动时间 |
| `prev_action` | `datetime` | 是 | `null` | 上次活动时间 |
| `connectable` | `enum('yes','no')` | 否 | `'yes'` | 是否可连接 |
| `userid` | `unsigned mediumint` | 否 | `0` | 用户 ID |
| `agent` | `varchar(60)` | 否 | `''` | 客户端标识 |
| `finishedat` | `unsigned int` | 否 | `0` | 完成时间戳 |
| `downloadoffset` | `unsigned bigint` | 否 | `0` | 下载偏移 |
| `uploadoffset` | `unsigned bigint` | 否 | `0` | 上传偏移 |
| `passkey` | `char(32)` | 否 | `''` | passkey |
| `ipv4` | `varchar(64)` | 否 | `''` | IPv4 |
| `ipv6` | `varchar(64)` | 否 | `''` | IPv6 |
| `is_seed_box` | `tinyint` | 否 | `0` | 是否 SeedBox |

## 约束清单

- 主键：`id`
- 唯一约束：
  - 初始：`torrent + peer_id`
  - 后续新增：`unique_torrent_peer_user(torrent, peer_id, userid)`

## 索引清单

- 单列索引：
  - `peer_id`
  - `userid`
  - `last_action`

## 关系清单

- `torrent` 指向 `torrents.id`
- `userid` 指向 `users.id`
- `passkey` 关联用户下载身份

## 使用场景

- tracker announce
- tracker scrape
- 做种/下载列表
- 当前在线状态统计

## 备注

- 该表是高频更新表。
- 唯一约束经历过迁移调整，当前文档按最终现状记录。
