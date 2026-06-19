---
slug: /database-design/tables/comments
title: comments
---

# `comments`

## 表定位

- 模块：社区模块
- 中文名称：评论表
- 表名：`comments`

## 来源对照

- `2021_06_08_113437_create_comments_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_comments_table.php |   |
| `user` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_comments_table.php |   |
| `torrent` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_comments_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_comments_table.php |   |
| `text` | `text` | 是 | 无 | 2021_06_08_113437_create_comments_table.php |   |
| `ori_text` | `text` | 是 | 无 | 2021_06_08_113437_create_comments_table.php |   |
| `editedby` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_comments_table.php |   |
| `editdate` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_comments_table.php |   |
| `offer` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_comments_table.php |   |
| `request` | `integer` | 否 | `0` | 2021_06_08_113437_create_comments_table.php |   |
| `anonymous` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_comments_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`user`，名称：`user`，来源：`2021_06_08_113437_create_comments_table.php`
- 索引字段：`torrent`, `id`，名称：`torrent_id`，来源：`2021_06_08_113437_create_comments_table.php`
- 索引字段：`offer`, `id`，名称：`offer_id`，来源：`2021_06_08_113437_create_comments_table.php`

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
