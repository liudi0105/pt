---
slug: /database-design/tables/user_metas
title: user_metas
---

# `user_metas`

## 表定位

- 模块：用户模块
- 中文名称：用户扩展表
- 表名：`user_metas`

## 来源对照

- `2022_08_09_163552_create_user_metas_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_08_09_163552_create_user_metas_table.php |   |
| `uid` | `integer` | 否 | 无 | 2022_08_09_163552_create_user_metas_table.php |   |
| `meta_key` | `string` | 否 | 无 | 2022_08_09_163552_create_user_metas_table.php |   |
| `status` | `integer` | 否 | `0` | 2022_08_09_163552_create_user_metas_table.php |   |
| `deadline` | `dateTime` | 是 | 无 | 2022_08_09_163552_create_user_metas_table.php |   |
| `meta_value` | `text` | 是 | 无 | 2022_08_09_163552_create_user_metas_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_08_09_163552_create_user_metas_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_08_09_163552_create_user_metas_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`uid`，来源：`2022_08_09_163552_create_user_metas_table.php`
- 索引字段：`meta_key`，来源：`2022_08_09_163552_create_user_metas_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
