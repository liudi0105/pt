---
slug: /database-design/tables/subs
title: subs
---

# `subs`

## 表定位

- 模块：种子模块
- 中文名称：字幕表
- 表名：`subs`

## 来源对照

- `2021_06_08_113437_create_subs_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_subs_table.php |   |
| `torrent_id` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_subs_table.php |   |
| `lang_id` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_subs_table.php |   |
| `title` | `string` | 否 | `` | 2021_06_08_113437_create_subs_table.php |   |
| `filename` | `string` | 否 | `` | 2021_06_08_113437_create_subs_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_subs_table.php |   |
| `size` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_subs_table.php |   |
| `uppedby` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_subs_table.php |   |
| `anonymous` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_subs_table.php |   |
| `hits` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_subs_table.php |   |
| `ext` | `string(10)` | 否 | `` | 2021_06_08_113437_create_subs_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`torrent_id`, `lang_id`，名称：`torrentid_langid`，来源：`2021_06_08_113437_create_subs_table.php`

## 关系清单

- 字段命名关联：`torrent_id` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
