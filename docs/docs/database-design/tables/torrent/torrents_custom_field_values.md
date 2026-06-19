---
slug: /database-design/tables/torrents_custom_field_values
title: torrents_custom_field_values
---

# `torrents_custom_field_values`

## 表定位

- 模块：种子模块
- 中文名称：种子自定义字段值表
- 表名：`torrents_custom_field_values`

## 来源对照

- `2021_06_08_113437_create_torrents_custom_field_values_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `integer(true)` | 否 | 无 | 2021_06_08_113437_create_torrents_custom_field_values_table.php |   |
| `torrent_id` | `integer` | 否 | `0` | 2021_06_08_113437_create_torrents_custom_field_values_table.php |   |
| `custom_field_id` | `integer` | 否 | `0` | 2021_06_08_113437_create_torrents_custom_field_values_table.php |   |
| `custom_field_value` | `mediumText` | 是 | 无 | 2021_06_08_113437_create_torrents_custom_field_values_table.php |   |
| `created_at` | `dateTime` | 否 | 无 | 2021_06_08_113437_create_torrents_custom_field_values_table.php |   |
| `updated_at` | `dateTime` | 否 | 无 | 2021_06_08_113437_create_torrents_custom_field_values_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`torrent_id`，名称：`idx_torrent_id`，来源：`2021_06_08_113437_create_torrents_custom_field_values_table.php`
- 索引字段：`custom_field_id`，名称：`idx_field_id`，来源：`2021_06_08_113437_create_torrents_custom_field_values_table.php`

## 关系清单

- 字段命名关联：`torrent_id` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
