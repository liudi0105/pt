---
slug: /database-design/tables/attachments
title: attachments
---

# `attachments`

## 表定位

- 模块：种子模块
- 中文名称：附件表
- 表名：`attachments`

## 来源对照

- `2021_06_08_113437_create_attachments_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_attachments_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_attachments_table.php |   |
| `width` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_attachments_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_attachments_table.php |   |
| `filename` | `string` | 否 | `` | 2021_06_08_113437_create_attachments_table.php |   |
| `dlkey` | `char(32)` | 否 | 无 | 2021_06_08_113437_create_attachments_table.php |   |
| `filetype` | `string(50)` | 否 | `` | 2021_06_08_113437_create_attachments_table.php |   |
| `filesize` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_attachments_table.php |   |
| `location` | `string` | 否 | `` | 2021_06_08_113437_create_attachments_table.php |   |
| `downloads` | `mediumInteger` | 否 | `0` | 2021_06_08_113437_create_attachments_table.php |   |
| `isimage` | `boolean` | 否 | `0` | 2021_06_08_113437_create_attachments_table.php |   |
| `thumb` | `boolean` | 否 | `0` | 2021_06_08_113437_create_attachments_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`dlkey`，名称：`idx_delkey`，来源：`2021_06_08_113437_create_attachments_table.php`
- 索引字段：`userid`, `id`，名称：`pid`，来源：`2021_06_08_113437_create_attachments_table.php`
- 索引字段：`added`, `isimage`, `downloads`，名称：`dateline`，来源：`2021_06_08_113437_create_attachments_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
