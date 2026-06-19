---
slug: /database-design/tables/agent_allowed_exception
title: agent_allowed_exception
---

# `agent_allowed_exception`

## 表定位

- 模块：系统模块
- 中文名称：客户端白名单例外表
- 表名：`agent_allowed_exception`

## 来源对照

- `2021_06_08_113437_create_agent_allowed_exception_table.php`
- `2022_02_25_021356_add_id_to_agent_allowed_exception_table.php`
- `2023_04_12_011330_change_agent_allow_deny_table_comment_field_nullable.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `family_id` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_agent_allowed_exception_table.php |   |
| `name` | `string(100)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_exception_table.php |   |
| `peer_id` | `string(20)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_exception_table.php |   |
| `agent` | `string(100)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_exception_table.php |   |
| `comment` | `string` | 是 | `null` | 2021_06_08_113437_create_agent_allowed_exception_table.php<br />2023_04_12_011330_change_agent_allow_deny_table_comment_field_nullable.php |   |
| `id` | `increments` | 否 | 无 | 2022_02_25_021356_add_id_to_agent_allowed_exception_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`family_id`，名称：`family_id`，来源：`2021_06_08_113437_create_agent_allowed_exception_table.php`

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
