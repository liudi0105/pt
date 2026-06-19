---
slug: /database-design/tables/locations
title: locations
---

# `locations`

## 表定位

- 模块：系统模块
- 中文名称：地区表
- 表名：`locations`

## 来源对照

- `2021_06_08_113437_create_locations_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_locations_table.php |   |
| `name` | `string(50)` | 是 | 无 | 2021_06_08_113437_create_locations_table.php |   |
| `location_main` | `string(200)` | 否 | `` | 2021_06_08_113437_create_locations_table.php |   |
| `location_sub` | `string(200)` | 否 | `` | 2021_06_08_113437_create_locations_table.php |   |
| `flagpic` | `string(50)` | 是 | 无 | 2021_06_08_113437_create_locations_table.php |   |
| `start_ip` | `string(20)` | 否 | `` | 2021_06_08_113437_create_locations_table.php |   |
| `end_ip` | `string(20)` | 否 | `` | 2021_06_08_113437_create_locations_table.php |   |
| `theory_upspeed` | `unsignedInteger` | 否 | `10` | 2021_06_08_113437_create_locations_table.php |   |
| `practical_upspeed` | `unsignedInteger` | 否 | `10` | 2021_06_08_113437_create_locations_table.php |   |
| `theory_downspeed` | `unsignedInteger` | 否 | `10` | 2021_06_08_113437_create_locations_table.php |   |
| `practical_downspeed` | `unsignedInteger` | 否 | `10` | 2021_06_08_113437_create_locations_table.php |   |
| `hit` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_locations_table.php |   |

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
