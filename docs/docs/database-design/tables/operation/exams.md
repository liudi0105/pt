---
slug: /database-design/tables/exams
title: exams
---

# `exams`

## 表定位

- 模块：运营模块
- 中文名称：考核表
- 表名：`exams`

## 来源对照

- `2021_06_08_113437_create_exams_table.php`
- `2022_04_18_153140_add_priority_to_exams_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_exams_table.php |   |
| `name` | `string` | 否 | 无 | 2021_06_08_113437_create_exams_table.php |   |
| `description` | `text` | 是 | 无 | 2021_06_08_113437_create_exams_table.php |   |
| `begin` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_exams_table.php |   |
| `end` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_exams_table.php |   |
| `duration` | `integer` | 否 | `0` | 2021_06_08_113437_create_exams_table.php |   |
| `filters` | `text` | 是 | 无 | 2021_06_08_113437_create_exams_table.php |   |
| `indexes` | `text` | 否 | 无 | 2021_06_08_113437_create_exams_table.php |   |
| `status` | `tinyInteger` | 否 | `0` | 2021_06_08_113437_create_exams_table.php |   |
| `is_discovered` | `tinyInteger` | 否 | `0` | 2021_06_08_113437_create_exams_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2021_06_08_113437_create_exams_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2021_06_08_113437_create_exams_table.php |   |
| `priority` | `integer` | 否 | `0` | 2022_04_18_153140_add_priority_to_exams_table.php |   |

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
