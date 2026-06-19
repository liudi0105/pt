---
slug: /database-design/tables/hit_and_runs
title: hit_and_runs
---

# `hit_and_runs`

## 表定位

- 模块：运营模块
- 中文名称：H&R表
- 表名：`hit_and_runs`

## 来源对照

- `2021_06_18_125347_create_hit_and_runs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_18_125347_create_hit_and_runs_table.php |   |
| `uid` | `integer` | 否 | 无 | 2021_06_18_125347_create_hit_and_runs_table.php |   |
| `torrent_id` | `integer` | 否 | 无 | 2021_06_18_125347_create_hit_and_runs_table.php |   |
| `snatched_id` | `integer` | 否 | 无 | 2021_06_18_125347_create_hit_and_runs_table.php |   |
| `status` | `integer` | 否 | `1` | 2021_06_18_125347_create_hit_and_runs_table.php |   |
| `comment` | `string` | 否 | `` | 2021_06_18_125347_create_hit_and_runs_table.php |   |
| `created_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP` | 2021_06_18_125347_create_hit_and_runs_table.php |   |
| `updated_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 2021_06_18_125347_create_hit_and_runs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`snatched_id`，来源：`2021_06_18_125347_create_hit_and_runs_table.php`
- 唯一约束字段：`uid`, `torrent_id`，来源：`2021_06_18_125347_create_hit_and_runs_table.php`

## 索引清单

- 未发现

## 关系清单

- 字段命名关联：`uid` -> `users.id`
- 字段命名关联：`torrent_id` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
