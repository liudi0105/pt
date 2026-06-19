---
slug: /database-design/tables/exam_users
title: exam_users
---

# `exam_users`

## 表定位

- 模块：运营模块
- 中文名称：考核用户表
- 表名：`exam_users`

## 来源对照

- `2021_06_08_113437_create_exam_users_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_exam_users_table.php |   |
| `uid` | `integer` | 否 | 无 | 2021_06_08_113437_create_exam_users_table.php |   |
| `exam_id` | `integer` | 否 | 无 | 2021_06_08_113437_create_exam_users_table.php |   |
| `status` | `integer` | 否 | `0` | 2021_06_08_113437_create_exam_users_table.php |   |
| `begin` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_exam_users_table.php |   |
| `end` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_exam_users_table.php |   |
| `progress` | `text` | 是 | 无 | 2021_06_08_113437_create_exam_users_table.php |   |
| `is_done` | `tinyInteger` | 否 | `0` | 2021_06_08_113437_create_exam_users_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2021_06_08_113437_create_exam_users_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2021_06_08_113437_create_exam_users_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`uid`，来源：`2021_06_08_113437_create_exam_users_table.php`
- 索引字段：`exam_id`，来源：`2021_06_08_113437_create_exam_users_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`
- 字段命名关联：`exam_id` -> `exams.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
