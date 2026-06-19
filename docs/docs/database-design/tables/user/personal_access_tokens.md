---
slug: /database-design/tables/personal_access_tokens
title: personal_access_tokens
---

# `personal_access_tokens`

## 表定位

- 模块：用户模块
- 中文名称：访问令牌表
- 表名：`personal_access_tokens`

## 来源对照

- `2019_12_14_000001_create_personal_access_tokens_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `tokenable_type` | `string` | 否 | `` | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `tokenable_id` | `unsignedBigInteger` | 否 | `` | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `name` | `string` | 否 | 无 | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `token` | `string(64)` | 否 | 无 | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `abilities` | `text` | 是 | 无 | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `last_used_at` | `timestamp` | 是 | 无 | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2019_12_14_000001_create_personal_access_tokens_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2019_12_14_000001_create_personal_access_tokens_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`token`，来源：`2019_12_14_000001_create_personal_access_tokens_table.php`

## 索引清单

- 索引字段：`tokenable_type`, `tokenable_id`，来源：`2019_12_14_000001_create_personal_access_tokens_table.php`

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
