---
slug: /database-design/tables/user_ban_logs
title: user_ban_logs
---

# `user_ban_logs`

## 表定位

- 模块：用户模块
- 中文名称：用户封禁日志表
- 表名：`user_ban_logs`

## 来源对照

- `2021_06_08_113437_create_user_ban_logs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigInteger(true)` | 否 | 无 | 2021_06_08_113437_create_user_ban_logs_table.php |   |
| `uid` | `integer` | 否 | `0` | 2021_06_08_113437_create_user_ban_logs_table.php |   |
| `username` | `string` | 否 | `` | 2021_06_08_113437_create_user_ban_logs_table.php |   |
| `operator` | `integer` | 否 | `0` | 2021_06_08_113437_create_user_ban_logs_table.php |   |
| `reason` | `string` | 是 | 无 | 2021_06_08_113437_create_user_ban_logs_table.php |   |
| `created_at` | `timestamp` | 是 | `CURRENT_TIMESTAMP` | 2021_06_08_113437_create_user_ban_logs_table.php |   |
| `updated_at` | `timestamp` | 是 | `CURRENT_TIMESTAMP` | 2021_06_08_113437_create_user_ban_logs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`uid`，名称：`idx_uid`，来源：`2021_06_08_113437_create_user_ban_logs_table.php`
- 索引字段：`username`，名称：`idx_username`，来源：`2021_06_08_113437_create_user_ban_logs_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
