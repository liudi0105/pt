---
slug: /database-design/tables/peers
title: peers
---

# `peers`

## 表定位

- 模块：Tracker模块
- 中文名称：连接状态表
- 表名：`peers`

## 来源对照

- `2021_06_08_113437_create_peers_table.php`
- `2022_04_20_195415_add_ipv6_to_peers_table.php`
- `2022_09_12_181952_add_is_seed_box_to_peers_table.php`
- `2023_03_04_031319_add_index_to_last_action_field_of_peers_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_peers_table.php |   |
| `torrent` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `peer_id` | `char(20)` | 否 | 无 | 2021_06_08_113437_create_peers_table.php |   |
| `ip` | `string(64)` | 否 | `` | 2021_06_08_113437_create_peers_table.php |   |
| `port` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `uploaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `downloaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `to_go` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `seeder` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_peers_table.php |   |
| `started` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_peers_table.php |   |
| `last_action` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_peers_table.php |   |
| `prev_action` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_peers_table.php |   |
| `connectable` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_peers_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `agent` | `string(60)` | 否 | `` | 2021_06_08_113437_create_peers_table.php |   |
| `finishedat` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `downloadoffset` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `uploadoffset` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_peers_table.php |   |
| `passkey` | `char(32)` | 否 | `` | 2021_06_08_113437_create_peers_table.php |   |
| `ipv4` | `string(64)` | 否 | `` | 2022_04_20_195415_add_ipv6_to_peers_table.php |   |
| `ipv6` | `string(64)` | 否 | `` | 2022_04_20_195415_add_ipv6_to_peers_table.php |   |
| `is_seed_box` | `tinyInteger` | 否 | `0` | 2022_09_12_181952_add_is_seed_box_to_peers_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`torrent`, `peer_id`，来源：`2021_06_08_113437_create_peers_table.php`

## 索引清单

- 索引字段：`peer_id`，来源：`2021_06_08_113437_create_peers_table.php`
- 索引字段：`userid`，来源：`2021_06_08_113437_create_peers_table.php`
- 索引字段：`last_action`，来源：`2023_03_04_031319_add_index_to_last_action_field_of_peers_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
