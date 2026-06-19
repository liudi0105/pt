---
slug: /database-design/tables/snatched
title: snatched
---

# `snatched`

## 表定位

- 模块：Tracker模块
- 中文名称：完成记录表
- 表名：`snatched`

## 来源对照

- `2021_06_08_113437_create_snatched_table.php`
- `2021_06_11_161551_add_completedat_index_to_snatched_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements(true)` | 否 | 无 | 2021_06_08_113437_create_snatched_table.php |   |
| `torrentid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `ip` | `string(64)` | 否 | `` | 2021_06_08_113437_create_snatched_table.php |   |
| `port` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `uploaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `downloaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `to_go` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `seedtime` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `leechtime` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_snatched_table.php |   |
| `last_action` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_snatched_table.php |   |
| `startdat` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_snatched_table.php |   |
| `completedat` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_snatched_table.php |   |
| `finished` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_snatched_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`torrentid`, `userid`，名称：`torrentid_userid`，来源：`2021_06_08_113437_create_snatched_table.php`

## 索引清单

- 索引字段：`userid`，名称：`userid`，来源：`2021_06_08_113437_create_snatched_table.php`
- 索引字段：`completedat`，来源：`2021_06_11_161551_add_completedat_index_to_snatched_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`
- 字段命名关联：`torrentid` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
