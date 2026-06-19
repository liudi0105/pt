---
slug: /database-design/tables/pollanswers
title: pollanswers
---

# `pollanswers`

## 表定位

- 模块：社区模块
- 中文名称：投票选项表
- 表名：`pollanswers`

## 来源对照

- `2021_06_08_113437_create_pollanswers_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_pollanswers_table.php |   |
| `pollid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_pollanswers_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_pollanswers_table.php |   |
| `selection` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_pollanswers_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`pollid`，名称：`pollid`，来源：`2021_06_08_113437_create_pollanswers_table.php`
- 索引字段：`userid`，名称：`userid`，来源：`2021_06_08_113437_create_pollanswers_table.php`
- 索引字段：`selection`，名称：`selection`，来源：`2021_06_08_113437_create_pollanswers_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`
- 字段命名关联：`pollid` -> `polls.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
