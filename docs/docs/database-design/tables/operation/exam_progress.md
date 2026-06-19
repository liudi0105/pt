---
slug: /database-design/tables/exam_progress
title: exam_progress
---

# `exam_progress`

## 表定位

- 模块：运营模块
- 中文名称：考核进度表
- 表名：`exam_progress`

## 来源对照

- `2021_06_08_113437_create_exam_progress_table.php`
- `2021_06_11_141214_add_init_value_to_exam_progress_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_exam_progress_table.php |   |
| `exam_user_id` | `integer` | 否 | 无 | 2021_06_08_113437_create_exam_progress_table.php |   |
| `exam_id` | `integer` | 否 | 无 | 2021_06_08_113437_create_exam_progress_table.php |   |
| `uid` | `integer` | 否 | 无 | 2021_06_08_113437_create_exam_progress_table.php |   |
| `torrent_id` | `integer` | 否 | 无 | 2021_06_08_113437_create_exam_progress_table.php |   |
| `index` | `integer` | 否 | 无 | 2021_06_08_113437_create_exam_progress_table.php |   |
| `value` | `bigInteger` | 否 | 无 | 2021_06_08_113437_create_exam_progress_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2021_06_08_113437_create_exam_progress_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2021_06_08_113437_create_exam_progress_table.php |   |
| `init_value` | `bigInteger` | 否 | `0` | 2021_06_11_141214_add_init_value_to_exam_progress_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`exam_user_id`，来源：`2021_06_08_113437_create_exam_progress_table.php`
- 索引字段：`exam_id`，来源：`2021_06_08_113437_create_exam_progress_table.php`
- 索引字段：`uid`，来源：`2021_06_08_113437_create_exam_progress_table.php`

## 关系清单

- 字段命名关联：`uid` -> `users.id`
- 字段命名关联：`torrent_id` -> `torrents.id`
- 字段命名关联：`exam_id` -> `exams.id`
- 字段命名关联：`exam_user_id` -> `exam_users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
