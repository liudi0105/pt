---
slug: /database-design/tables/searchbox_fields
title: searchbox_fields
---

# `searchbox_fields`

## 表定位

- 模块：种子模块
- 中文名称：搜索字段表
- 表名：`searchbox_fields`

## 来源对照

- `2021_06_08_113437_create_searchbox_fields_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `integer(true)` | 否 | 无 | 2021_06_08_113437_create_searchbox_fields_table.php |   |
| `searchbox_id` | `integer` | 否 | 无 | 2021_06_08_113437_create_searchbox_fields_table.php |   |
| `field_type` | `string` | 否 | 无 | 2021_06_08_113437_create_searchbox_fields_table.php |   |
| `field_id` | `integer` | 否 | `0` | 2021_06_08_113437_create_searchbox_fields_table.php |   |
| `created_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP` | 2021_06_08_113437_create_searchbox_fields_table.php |   |
| `update_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP` | 2021_06_08_113437_create_searchbox_fields_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`searchbox_id`, `field_type`, `field_id`，名称：`uniq_searchbox_type_id`，来源：`2021_06_08_113437_create_searchbox_fields_table.php`

## 索引清单

- 未发现

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
