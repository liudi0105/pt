---
slug: /database-design/tables/suggest
title: suggest
---

# `suggest`

## 表定位

- 模块：运营模块
- 中文名称：建议表
- 表名：`suggest`

## 来源对照

- `2021_06_08_113437_create_suggest_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_suggest_table.php |   |
| `keywords` | `string` | 否 | `` | 2021_06_08_113437_create_suggest_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_suggest_table.php |   |
| `adddate` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_suggest_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`keywords`，名称：`keywords`，来源：`2021_06_08_113437_create_suggest_table.php`
- 索引字段：`adddate`，名称：`adddate`，来源：`2021_06_08_113437_create_suggest_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
