---
slug: /database-design/tables/torrent_operation_logs
title: torrent_operation_logs
---

# `torrent_operation_logs`

## 表定位

- 模块：种子模块
- 中文名称：种子操作日志表
- 表名：`torrent_operation_logs`

## 来源对照

- `2022_06_13_172104_create_torrent_operation_logs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_06_13_172104_create_torrent_operation_logs_table.php |   |
| `torrent_id` | `integer` | 否 | 无 | 2022_06_13_172104_create_torrent_operation_logs_table.php |   |
| `uid` | `integer` | 否 | 无 | 2022_06_13_172104_create_torrent_operation_logs_table.php |   |
| `action_type` | `string` | 否 | 无 | 2022_06_13_172104_create_torrent_operation_logs_table.php |   |
| `comment` | `string` | 否 | `` | 2022_06_13_172104_create_torrent_operation_logs_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_06_13_172104_create_torrent_operation_logs_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_06_13_172104_create_torrent_operation_logs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`torrent_id`，来源：`2022_06_13_172104_create_torrent_operation_logs_table.php`
- 索引字段：`uid`，来源：`2022_06_13_172104_create_torrent_operation_logs_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`
- 字段命名关联：`torrent_id` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
