---
slug: /database-design/tables/torrents_custom_fields
title: torrents_custom_fields
---

# `torrents_custom_fields`

## 表定位

- 模块：种子模块
- 中文名称：种子自定义字段表
- 表名：`torrents_custom_fields`

## 来源对照

- `2021_06_08_113437_create_torrents_custom_fields_table.php`
- `2022_09_19_043749_add_display_to_torrents_custom_fields_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `integer(true)` | 否 | 无 | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `name` | `string` | 否 | `` | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `label` | `string` | 否 | `` | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `type` | `enum(['text', 'textarea', 'select', 'radio', 'checkbox', 'image'])` | 否 | 无 | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `required` | `tinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `is_single_row` | `integer` | 否 | `0` | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `options` | `text` | 是 | 无 | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `help` | `text` | 是 | 无 | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `created_at` | `dateTime` | 否 | 无 | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `updated_at` | `dateTime` | 否 | 无 | 2021_06_08_113437_create_torrents_custom_fields_table.php |   |
| `display` | `text` | 是 | 无 | 2022_09_19_043749_add_display_to_torrents_custom_fields_table.php |   |
| `priority` | `integer` | 否 | `0` | 2022_09_19_043749_add_display_to_torrents_custom_fields_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 未发现

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
