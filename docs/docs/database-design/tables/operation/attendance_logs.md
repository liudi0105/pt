---
slug: /database-design/tables/attendance_logs
title: attendance_logs
---

# `attendance_logs`

## 表定位

- 模块：运营模块
- 中文名称：签到日志表
- 表名：`attendance_logs`

## 来源对照

- `2022_04_02_163930_create_attendance_logs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_04_02_163930_create_attendance_logs_table.php |   |
| `uid` | `integer` | 否 | 无 | 2022_04_02_163930_create_attendance_logs_table.php |   |
| `points` | `integer` | 否 | 无 | 2022_04_02_163930_create_attendance_logs_table.php |   |
| `date` | `date` | 否 | 无 | 2022_04_02_163930_create_attendance_logs_table.php |   |
| `is_retroactive` | `smallInteger` | 否 | `0` | 2022_04_02_163930_create_attendance_logs_table.php |   |
| `created_at` | `dateTime` | 否 | `CURRENT_TIMESTAMP` | 2022_04_02_163930_create_attendance_logs_table.php |   |
| `updated_at` | `dateTime` | 否 | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 2022_04_02_163930_create_attendance_logs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`uid`, `date`，来源：`2022_04_02_163930_create_attendance_logs_table.php`

## 索引清单

- 索引字段：`date`，来源：`2022_04_02_163930_create_attendance_logs_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
