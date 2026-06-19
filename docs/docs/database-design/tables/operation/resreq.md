---
slug: /database-design/tables/resreq
title: resreq
---

# `resreq`

## 表定位

- 模块：运营模块
- 中文名称：资源请求关系表
- 表名：`resreq`

## 来源对照

- `2021_06_08_113437_create_resreq_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `integer(true)` | 否 | 无 | 2021_06_08_113437_create_resreq_table.php |   |
| `reqid` | `integer` | 否 | `0` | 2021_06_08_113437_create_resreq_table.php |   |
| `torrentid` | `integer` | 否 | `0` | 2021_06_08_113437_create_resreq_table.php |   |
| `chosen` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_resreq_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`reqid`，名称：`reqid`，来源：`2021_06_08_113437_create_resreq_table.php`

## 关系清单

- 字段命名关联：`torrentid` -> `torrents.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
