---
slug: /database-design/tables/polls
title: polls
---

# `polls`

## 表定位

- 模块：社区模块
- 中文名称：投票表
- 表名：`polls`

## 来源对照

- `2021_06_08_113437_create_polls_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `mediumIncrements` | 否 | 无 | 2021_06_08_113437_create_polls_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_polls_table.php |   |
| `question` | `string` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option0` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option1` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option2` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option3` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option4` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option5` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option6` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option7` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option8` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option9` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option10` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option11` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option12` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option13` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option14` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option15` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option16` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option17` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option18` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |
| `option19` | `string(40)` | 否 | `` | 2021_06_08_113437_create_polls_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 未发现

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
