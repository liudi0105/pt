---
slug: /database-design/tables/username_change_logs
title: username_change_logs
---

# `username_change_logs`

## 表定位

- 模块：用户模块
- 中文名称：用户名变更日志表
- 表名：`username_change_logs`

## 来源对照

- `2022_08_09_235716_create_username_change_logs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_08_09_235716_create_username_change_logs_table.php |   |
| `uid` | `integer` | 否 | 无 | 2022_08_09_235716_create_username_change_logs_table.php |   |
| `operator` | `string` | 否 | 无 | 2022_08_09_235716_create_username_change_logs_table.php |   |
| `change_type` | `integer` | 否 | `0` | 2022_08_09_235716_create_username_change_logs_table.php |   |
| `username_old` | `string` | 否 | 无 | 2022_08_09_235716_create_username_change_logs_table.php |   |
| `username_new` | `string` | 否 | 无 | 2022_08_09_235716_create_username_change_logs_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_08_09_235716_create_username_change_logs_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_08_09_235716_create_username_change_logs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 未发现

## 关系清单

- 字段命名关联：`uid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
