---
slug: /database-design/tables/bonus_logs
title: bonus_logs
---

# `bonus_logs`

## 表定位

- 模块：运营模块
- 中文名称：积分日志表
- 表名：`bonus_logs`

## 来源对照

- `2021_06_20_005557_create_bonus_logs_table.php`
- `2023_06_01_013150_change_bonus_log_table_value_decimal.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_20_005557_create_bonus_logs_table.php |   |
| `business_type` | `integer` | 否 | `0` | 2021_06_20_005557_create_bonus_logs_table.php |   |
| `uid` | `integer` | 否 | 无 | 2021_06_20_005557_create_bonus_logs_table.php |   |
| `old_total_value` | `decimal(20, 1)` | 否 | 无 | 2021_06_20_005557_create_bonus_logs_table.php<br />2023_06_01_013150_change_bonus_log_table_value_decimal.php |   |
| `value` | `decimal(20, 1)` | 否 | 无 | 2021_06_20_005557_create_bonus_logs_table.php<br />2023_06_01_013150_change_bonus_log_table_value_decimal.php |   |
| `new_total_value` | `decimal(20, 1)` | 否 | 无 | 2021_06_20_005557_create_bonus_logs_table.php<br />2023_06_01_013150_change_bonus_log_table_value_decimal.php |   |
| `comment` | `string` | 是 | 无 | 2021_06_20_005557_create_bonus_logs_table.php |   |
| `created_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP` | 2021_06_20_005557_create_bonus_logs_table.php |   |
| `updated_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 2021_06_20_005557_create_bonus_logs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`uid`，来源：`2021_06_20_005557_create_bonus_logs_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
