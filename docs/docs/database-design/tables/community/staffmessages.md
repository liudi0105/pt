---
slug: /database-design/tables/staffmessages
title: staffmessages
---

# `staffmessages`

## 表定位

- 模块：社区模块
- 中文名称：管理消息表
- 表名：`staffmessages`

## 来源对照

- `2021_06_08_113437_create_staffmessages_table.php`
- `2022_08_22_030816_add_permission_to_staffmessages_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `mediumIncrements` | 否 | 无 | 2021_06_08_113437_create_staffmessages_table.php |   |
| `sender` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_staffmessages_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_staffmessages_table.php |   |
| `msg` | `text` | 是 | 无 | 2021_06_08_113437_create_staffmessages_table.php |   |
| `subject` | `string(128)` | 否 | `` | 2021_06_08_113437_create_staffmessages_table.php |   |
| `answeredby` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_staffmessages_table.php |   |
| `answered` | `boolean` | 否 | `0` | 2021_06_08_113437_create_staffmessages_table.php |   |
| `answer` | `text` | 是 | 无 | 2021_06_08_113437_create_staffmessages_table.php |   |
| `permission` | `string` | 否 | `` | 2022_08_22_030816_add_permission_to_staffmessages_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`permission`，来源：`2022_08_22_030816_add_permission_to_staffmessages_table.php`

## 关系清单

- 字段命名关联：`sender` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
