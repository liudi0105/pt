---
slug: /database-design/tables/complain_replies
title: complain_replies
---

# `complain_replies`

## 表定位

- 模块：运营模块
- 中文名称：申诉回复表
- 表名：`complain_replies`

## 来源对照

- `2022_05_06_165409_create_complain_replies_table.php`
- `2022_10_13_002653_add_ip_to_complains_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_05_06_165409_create_complain_replies_table.php |   |
| `complain` | `integer` | 否 | 无 | 2022_05_06_165409_create_complain_replies_table.php |   |
| `userid` | `integer` | 否 | `0` | 2022_05_06_165409_create_complain_replies_table.php |   |
| `added` | `dateTime` | 否 | 无 | 2022_05_06_165409_create_complain_replies_table.php |   |
| `body` | `text` | 否 | 无 | 2022_05_06_165409_create_complain_replies_table.php |   |
| `ip` | `string` | 是 | 无 | 2022_10_13_002653_add_ip_to_complains_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 未发现

## 关系清单

- 字段命名关联：`userid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
