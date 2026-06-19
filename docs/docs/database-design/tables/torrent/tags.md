---
slug: /database-design/tables/tags
title: tags
---

# `tags`

## 表定位

- 模块：种子模块
- 中文名称：标签表
- 表名：`tags`

## 来源对照

- `2022_03_07_012545_create_tags_table.php`
- `2022_03_26_162038_add_margin_padding_to_tags_table.php`
- `2022_10_30_024325_add_mode_to_tags_table.php`
- `2023_01_11_044915_add_description_to_tags_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_03_07_012545_create_tags_table.php |   |
| `name` | `string` | 否 | 无 | 2022_03_07_012545_create_tags_table.php |   |
| `color` | `string` | 否 | 无 | 2022_03_07_012545_create_tags_table.php |   |
| `priority` | `integer` | 否 | `0` | 2022_03_07_012545_create_tags_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_03_07_012545_create_tags_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_03_07_012545_create_tags_table.php |   |
| `padding` | `string` | 否 | `1px 2px` | 2022_03_26_162038_add_margin_padding_to_tags_table.php |   |
| `margin` | `string` | 否 | `0 4px 0 0` | 2022_03_26_162038_add_margin_padding_to_tags_table.php |   |
| `border_radius` | `string` | 否 | `0` | 2022_03_26_162038_add_margin_padding_to_tags_table.php |   |
| `font_size` | `string` | 否 | `12px` | 2022_03_26_162038_add_margin_padding_to_tags_table.php |   |
| `font_color` | `string` | 否 | `#ffffff` | 2022_03_26_162038_add_margin_padding_to_tags_table.php |   |
| `mode` | `integer` | 否 | `0` | 2022_10_30_024325_add_mode_to_tags_table.php |   |
| `description` | `text` | 是 | 无 | 2023_01_11_044915_add_description_to_tags_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`name`，来源：`2022_03_07_012545_create_tags_table.php`

## 索引清单

- 未发现

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
