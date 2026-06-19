---
slug: /database-design/tables/invites
title: invites
---

# `invites`

## 表定位

- 模块：用户模块
- 中文名称：邀请表
- 表名：`invites`

## 来源对照

- `2021_06_08_113437_create_invites_table.php`
- `2022_03_08_041115_add_invitee_fields_to_invites_table.php`
- `2022_12_10_034926_add_expired_at_to_invites_table.php`
- `2022_12_10_041706_change_invites_table_invitee_default_empty.php`
- `2023_08_23_020717_add_pre_register_email_and_username_to_invites_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_invites_table.php |   |
| `inviter` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_invites_table.php |   |
| `invitee` | `string` | 否 | `` | 2021_06_08_113437_create_invites_table.php<br />2022_12_10_041706_change_invites_table_invitee_default_empty.php |   |
| `hash` | `char(32)` | 否 | 无 | 2021_06_08_113437_create_invites_table.php |   |
| `time_invited` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_invites_table.php |   |
| `valid` | `tinyInteger` | 否 | `1` | 2021_06_08_113437_create_invites_table.php<br />2022_03_08_041115_add_invitee_fields_to_invites_table.php |   |
| `invitee_register_uid` | `integer` | 是 | 无 | 2021_06_08_113437_create_invites_table.php<br />2022_03_08_041115_add_invitee_fields_to_invites_table.php |   |
| `invitee_register_email` | `string` | 是 | 无 | 2021_06_08_113437_create_invites_table.php<br />2022_03_08_041115_add_invitee_fields_to_invites_table.php |   |
| `invitee_register_username` | `string` | 是 | 无 | 2021_06_08_113437_create_invites_table.php<br />2022_03_08_041115_add_invitee_fields_to_invites_table.php |   |
| `expired_at` | `dateTime` | 是 | 无 | 2022_12_10_034926_add_expired_at_to_invites_table.php |   |
| `created_at` | `dateTime` | 否 | `CURRENT_TIMESTAMP` | 2022_12_10_034926_add_expired_at_to_invites_table.php |   |
| `pre_register_email` | `string` | 是 | 无 | 2023_08_23_020717_add_pre_register_email_and_username_to_invites_table.php |   |
| `pre_register_username` | `string` | 是 | 无 | 2023_08_23_020717_add_pre_register_email_and_username_to_invites_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`hash`，名称：`hash`，来源：`2021_06_08_113437_create_invites_table.php`
- 索引字段：`expired_at`，来源：`2022_12_10_034926_add_expired_at_to_invites_table.php`
- 索引字段：`inviter`，名称：`idx_inviter`，来源：`2022_12_10_034926_add_expired_at_to_invites_table.php`

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
