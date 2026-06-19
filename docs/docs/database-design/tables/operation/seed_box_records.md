---
slug: /database-design/tables/seed_box_records
title: seed_box_records
---

# `seed_box_records`

## 表定位

- 模块：运营模块
- 中文名称：SeedBox记录表
- 表名：`seed_box_records`

## 来源对照

- `2022_07_20_194152_create_seedbox_records_table.php`
- `2023_01_31_172522_add_is_allowed_to_seed_box_records_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `type` | `integer` | 否 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `uid` | `integer` | 否 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `status` | `integer` | 否 | `0` | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `operator` | `string` | 是 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `bandwidth` | `integer` | 是 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `ip` | `string` | 是 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `ip_begin` | `string` | 是 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `ip_end` | `string` | 是 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `ip_begin_numeric` | `string(128)` | 否 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `ip_end_numeric` | `string(128)` | 否 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `version` | `integer` | 否 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `comment` | `string` | 是 | 无 | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_07_20_194152_create_seedbox_records_table.php |   |
| `is_allowed` | `integer` | 否 | `0` | 2023_01_31_172522_add_is_allowed_to_seed_box_records_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`ip_begin_numeric`，来源：`2022_07_20_194152_create_seedbox_records_table.php`
- 索引字段：`ip_end_numeric`，来源：`2022_07_20_194152_create_seedbox_records_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
