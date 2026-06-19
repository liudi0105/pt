---
slug: /database-design/tables/cheaters
title: cheaters
---

# `cheaters`

## 表定位

- 模块：运营模块
- 中文名称：作弊记录表
- 表名：`cheaters`

## 来源对照

- `2021_06_08_113437_create_cheaters_table.php`
- `2022_03_17_202628_add_index_to_cheaters_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `mediumIncrements` | 否 | 无 | 2021_06_08_113437_create_cheaters_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_cheaters_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `torrentid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `uploaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `downloaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `anctime` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `seeders` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `leechers` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `hit` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `dealtby` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `dealtwith` | `boolean` | 否 | `0` | 2021_06_08_113437_create_cheaters_table.php |   |
| `comment` | `string` | 否 | `` | 2021_06_08_113437_create_cheaters_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`torrentid`，来源：`2022_03_17_202628_add_index_to_cheaters_table.php`
- 索引字段：`userid`，来源：`2022_03_17_202628_add_index_to_cheaters_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`
- 字段命名关联：`torrentid` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
