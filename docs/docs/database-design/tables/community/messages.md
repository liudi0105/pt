---
slug: /database-design/tables/messages
title: messages
---

# `messages`

## 表定位

- 模块：社区模块
- 中文名称：站内信表
- 表名：`messages`

## 来源对照

- `2021_06_08_113437_create_messages_table.php`
- `2023_04_30_054425_alter_table_messages_msg_column_type_from_text_to_mediumtext.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_messages_table.php |   |
| `sender` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_messages_table.php |   |
| `receiver` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_messages_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_messages_table.php |   |
| `subject` | `string(128)` | 否 | `` | 2021_06_08_113437_create_messages_table.php |   |
| `msg` | `mediumText` | 否 | 无 | 2021_06_08_113437_create_messages_table.php<br />2023_04_30_054425_alter_table_messages_msg_column_type_from_text_to_mediumtext.php |   |
| `unread` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_messages_table.php |   |
| `location` | `smallInteger` | 否 | `1` | 2021_06_08_113437_create_messages_table.php |   |
| `saved` | `enum(['no', 'yes'])` | 否 | `no` | 2021_06_08_113437_create_messages_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`sender`，名称：`sender`，来源：`2021_06_08_113437_create_messages_table.php`
- 索引字段：`receiver`，名称：`receiver`，来源：`2021_06_08_113437_create_messages_table.php`

## 关系清单

- 字段命名关联：`sender` -> `users.id`
- 字段命名关联：`receiver` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
