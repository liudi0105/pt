---
slug: /database-design/tables/magic
title: magic
---

# `magic`

## 表定位

- 模块：运营模块
- 中文名称：魔法道具表
- 表名：`magic`

## 来源对照

- `2021_06_08_113437_create_magic_table.php`
- `2022_05_03_145712_add_times_field_to_magic_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_magic_table.php |   |
| `torrentid` | `integer` | 否 | `0` | 2021_06_08_113437_create_magic_table.php |   |
| `userid` | `integer` | 否 | `0` | 2021_06_08_113437_create_magic_table.php |   |
| `value` | `integer` | 否 | `0` | 2021_06_08_113437_create_magic_table.php |   |
| `created_at` | `dateTime` | 否 | `CURRENT_TIMESTAMP` | 2021_06_08_113437_create_magic_table.php<br />2022_05_03_145712_add_times_field_to_magic_table.php |   |
| `updated_at` | `dateTime` | 否 | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 2021_06_08_113437_create_magic_table.php<br />2022_05_03_145712_add_times_field_to_magic_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`torrentid`，名称：`idx_torrentid`，来源：`2021_06_08_113437_create_magic_table.php`
- 索引字段：`userid`，名称：`idx_userid`，来源：`2021_06_08_113437_create_magic_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`
- 字段命名关联：`torrentid` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
