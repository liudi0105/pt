---
slug: /database-design/tables/categories
title: categories
---

# `categories`

## 表定位

- 模块：种子模块
- 中文名称：分类表
- 表名：`categories`

## 来源对照

- `2021_06_08_113437_create_categories_table.php`
- `2022_03_08_040415_add_icon_id_to_categories_table.php`
- `2022_09_06_030324_change_searchbox_field_extra_to_json.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `smallIncrements` | 否 | 无 | 2021_06_08_113437_create_categories_table.php |   |
| `mode` | `unsignedTinyInteger` | 否 | `1` | 2021_06_08_113437_create_categories_table.php |   |
| `class_name` | `string` | 是 | `` | 2021_06_08_113437_create_categories_table.php<br />2022_09_06_030324_change_searchbox_field_extra_to_json.php |   |
| `name` | `string(30)` | 否 | `` | 2021_06_08_113437_create_categories_table.php |   |
| `image` | `string` | 是 | `` | 2021_06_08_113437_create_categories_table.php<br />2022_09_06_030324_change_searchbox_field_extra_to_json.php |   |
| `sort_index` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_categories_table.php |   |
| `icon_id` | `integer` | 否 | `0` | 2021_06_08_113437_create_categories_table.php<br />2022_03_08_040415_add_icon_id_to_categories_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`mode`, `sort_index`，名称：`mode_sort`，来源：`2021_06_08_113437_create_categories_table.php`

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
