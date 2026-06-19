---
slug: /database-design/tables/agent_allowed_family
title: agent_allowed_family
---

# `agent_allowed_family`

## 表定位

- 模块：系统模块
- 中文名称：客户端白名单家族表
- 表名：`agent_allowed_family`

## 来源对照

- `2021_06_08_113437_create_agent_allowed_family_table.php`
- `2023_04_12_011330_change_agent_allow_deny_table_comment_field_nullable.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `family` | `string(50)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `start_name` | `string(100)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `peer_id_pattern` | `string(200)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `peer_id_match_num` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `peer_id_matchtype` | `enum(['dec', 'hex'])` | 否 | `dec` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `peer_id_start` | `string(20)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `agent_pattern` | `string(200)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `agent_match_num` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `agent_matchtype` | `enum(['dec', 'hex'])` | 否 | `dec` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `agent_start` | `string(100)` | 否 | `` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `exception` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `allowhttps` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |
| `comment` | `string` | 是 | `null` | 2021_06_08_113437_create_agent_allowed_family_table.php<br />2023_04_12_011330_change_agent_allow_deny_table_comment_field_nullable.php |   |
| `hits` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_agent_allowed_family_table.php |   |

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
