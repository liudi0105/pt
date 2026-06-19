---
slug: /database-design/tables/login_logs
title: login_logs
---

# `login_logs`

## 表定位

- 模块：用户模块
- 中文名称：登录日志表
- 表名：`login_logs`

## 来源对照

- `2023_01_30_154106_create_login_logs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2023_01_30_154106_create_login_logs_table.php |   |
| `uid` | `integer` | 否 | 无 | 2023_01_30_154106_create_login_logs_table.php |   |
| `ip` | `string(128)` | 否 | 无 | 2023_01_30_154106_create_login_logs_table.php |   |
| `country` | `string` | 是 | 无 | 2023_01_30_154106_create_login_logs_table.php |   |
| `city` | `string` | 是 | 无 | 2023_01_30_154106_create_login_logs_table.php |   |
| `client` | `string` | 是 | 无 | 2023_01_30_154106_create_login_logs_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2023_01_30_154106_create_login_logs_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2023_01_30_154106_create_login_logs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`uid`，来源：`2023_01_30_154106_create_login_logs_table.php`
- 索引字段：`ip`，来源：`2023_01_30_154106_create_login_logs_table.php`
- 索引字段：`country`，来源：`2023_01_30_154106_create_login_logs_table.php`
- 索引字段：`city`，来源：`2023_01_30_154106_create_login_logs_table.php`
- 索引字段：`client`，来源：`2023_01_30_154106_create_login_logs_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`
- 字段命名关联：`country` -> `countries.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
