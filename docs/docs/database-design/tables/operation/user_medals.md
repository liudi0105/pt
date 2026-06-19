---
slug: /database-design/tables/user_medals
title: user_medals
---

# `user_medals`

## 表定位

- 模块：运营模块
- 中文名称：用户勋章表
- 表名：`user_medals`

## 来源对照

- `2022_01_06_153905_create_user_medals_table.php`
- `2022_03_19_020327_add_status_to_user_medals_table.php`
- `2023_01_28_170836_add_priority_to_user_medals_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_01_06_153905_create_user_medals_table.php |   |
| `uid` | `integer` | 否 | 无 | 2022_01_06_153905_create_user_medals_table.php |   |
| `medal_id` | `integer` | 否 | 无 | 2022_01_06_153905_create_user_medals_table.php |   |
| `expire_at` | `dateTime` | 是 | 无 | 2022_01_06_153905_create_user_medals_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_01_06_153905_create_user_medals_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_01_06_153905_create_user_medals_table.php |   |
| `status` | `integer` | 否 | `1` | 2022_03_19_020327_add_status_to_user_medals_table.php |   |
| `priority` | `integer` | 否 | `0` | 2023_01_28_170836_add_priority_to_user_medals_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`uid`，来源：`2022_01_06_153905_create_user_medals_table.php`
- 索引字段：`medal_id`，来源：`2022_01_06_153905_create_user_medals_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`
- 字段命名关联：`medal_id` -> `medals.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
