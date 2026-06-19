---
slug: /database-design/tables/claims
title: claims
---

# `claims`

## 表定位

- 模块：运营模块
- 中文名称：认领表
- 表名：`claims`

## 来源对照

- `2022_05_04_234639_create_claims_table.php`
- `2023_07_05_005825_add_index_to_field_created_at_of_claims_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_05_04_234639_create_claims_table.php |   |
| `uid` | `integer` | 否 | 无 | 2022_05_04_234639_create_claims_table.php |   |
| `torrent_id` | `integer` | 否 | 无 | 2022_05_04_234639_create_claims_table.php |   |
| `snatched_id` | `integer` | 否 | 无 | 2022_05_04_234639_create_claims_table.php |   |
| `seed_time_begin` | `bigInteger` | 否 | `0` | 2022_05_04_234639_create_claims_table.php |   |
| `uploaded_begin` | `bigInteger` | 否 | `0` | 2022_05_04_234639_create_claims_table.php |   |
| `last_settle_at` | `dateTime` | 是 | 无 | 2022_05_04_234639_create_claims_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_05_04_234639_create_claims_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_05_04_234639_create_claims_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`uid`, `torrent_id`，来源：`2022_05_04_234639_create_claims_table.php`

## 索引清单

- 索引字段：`torrent_id`，来源：`2022_05_04_234639_create_claims_table.php`
- 索引字段：`snatched_id`，来源：`2022_05_04_234639_create_claims_table.php`
- 索引字段：`last_settle_at`，来源：`2022_05_04_234639_create_claims_table.php`
- 索引字段：`created_at`，名称：`idx_created_at`，来源：`2023_07_05_005825_add_index_to_field_created_at_of_claims_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`
- 字段命名关联：`torrent_id` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
