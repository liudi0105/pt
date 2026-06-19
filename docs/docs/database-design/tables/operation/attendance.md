---
slug: /database-design/tables/attendance
title: attendance
---

# `attendance`

## 表定位

- 模块：运营模块
- 中文名称：签到表
- 表名：`attendance`

## 来源对照

- `2021_06_08_113437_create_attendance_table.php`
- `2021_06_13_215440_add_total_days_to_attendance_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_attendance_table.php |   |
| `uid` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_attendance_table.php |   |
| `added` | `dateTime` | 否 | 无 | 2021_06_08_113437_create_attendance_table.php |   |
| `points` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_attendance_table.php |   |
| `days` | `unsignedInteger` | 否 | `1` | 2021_06_08_113437_create_attendance_table.php |   |
| `total_days` | `integer` | 否 | `0` | 2021_06_13_215440_add_total_days_to_attendance_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`uid`，名称：`idx_uid`，来源：`2021_06_08_113437_create_attendance_table.php`
- 索引字段：`added`，来源：`2021_06_08_113437_create_attendance_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
