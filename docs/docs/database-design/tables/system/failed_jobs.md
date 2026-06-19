---
slug: /database-design/tables/failed_jobs
title: failed_jobs
---

# `failed_jobs`

## 表定位

- 模块：系统模块
- 中文名称：失败任务表
- 表名：`failed_jobs`

## 来源对照

- `2021_06_08_113437_create_failed_jobs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_failed_jobs_table.php |   |
| `uuid` | `string` | 否 | 无 | 2021_06_08_113437_create_failed_jobs_table.php |   |
| `connection` | `text` | 否 | 无 | 2021_06_08_113437_create_failed_jobs_table.php |   |
| `queue` | `text` | 否 | 无 | 2021_06_08_113437_create_failed_jobs_table.php |   |
| `payload` | `longText` | 否 | 无 | 2021_06_08_113437_create_failed_jobs_table.php |   |
| `exception` | `longText` | 否 | 无 | 2021_06_08_113437_create_failed_jobs_table.php |   |
| `failed_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP` | 2021_06_08_113437_create_failed_jobs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`uuid`，来源：`2021_06_08_113437_create_failed_jobs_table.php`

## 索引清单

- 未发现

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
