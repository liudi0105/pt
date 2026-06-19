---
slug: /database-design/tables/medals
title: medals
---

# `medals`

## 表定位

- 模块：运营模块
- 中文名称：勋章表
- 表名：`medals`

## 来源对照

- `2022_01_06_023153_create_medals_table.php`
- `2023_01_10_072601_add_display_on_medal_page_to_medals_table.php`
- `2023_01_24_132053_add_sale_begin_end_time_and_inventory_to_medals_table.php`
- `2023_01_26_210814_add_bonus_addition_factor_to_medals_table.php`
- `2023_01_27_143831_add_gift_fee_factor_to_medals_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_01_06_023153_create_medals_table.php |   |
| `name` | `string` | 否 | 无 | 2022_01_06_023153_create_medals_table.php |   |
| `get_type` | `integer` | 否 | 无 | 2022_01_06_023153_create_medals_table.php |   |
| `description` | `text` | 是 | 无 | 2022_01_06_023153_create_medals_table.php |   |
| `image_large` | `string` | 是 | 无 | 2022_01_06_023153_create_medals_table.php |   |
| `image_small` | `string` | 是 | 无 | 2022_01_06_023153_create_medals_table.php |   |
| `price` | `integer` | 否 | `0` | 2022_01_06_023153_create_medals_table.php |   |
| `duration` | `integer` | 是 | 无 | 2022_01_06_023153_create_medals_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_01_06_023153_create_medals_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_01_06_023153_create_medals_table.php |   |
| `display_on_medal_page` | `integer` | 否 | `1` | 2023_01_10_072601_add_display_on_medal_page_to_medals_table.php |   |
| `sale_begin_time` | `dateTime` | 是 | 无 | 2023_01_24_132053_add_sale_begin_end_time_and_inventory_to_medals_table.php |   |
| `sale_end_time` | `dateTime` | 是 | 无 | 2023_01_24_132053_add_sale_begin_end_time_and_inventory_to_medals_table.php |   |
| `inventory` | `integer` | 是 | 无 | 2023_01_24_132053_add_sale_begin_end_time_and_inventory_to_medals_table.php |   |
| `bonus_addition_factor` | `float(10, 6)` | 否 | `0` | 2023_01_26_210814_add_bonus_addition_factor_to_medals_table.php |   |
| `gift_fee_factor` | `float(10, 6)` | 否 | `0` | 2023_01_27_143831_add_gift_fee_factor_to_medals_table.php |   |

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
