---
slug: /database-design/tables/torrent_deny_reasons
title: torrent_deny_reasons
---

# `torrent_deny_reasons`

## 表定位

- 模块：种子模块
- 中文名称：种子拒绝原因表
- 表名：`torrent_deny_reasons`

## 来源对照

- `2022_08_16_042239_create_torrent_deny_reasons_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_08_16_042239_create_torrent_deny_reasons_table.php |   |
| `name` | `string` | 否 | 无 | 2022_08_16_042239_create_torrent_deny_reasons_table.php |   |
| `hits` | `integer` | 否 | `0` | 2022_08_16_042239_create_torrent_deny_reasons_table.php |   |
| `priority` | `integer` | 否 | `0` | 2022_08_16_042239_create_torrent_deny_reasons_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_08_16_042239_create_torrent_deny_reasons_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_08_16_042239_create_torrent_deny_reasons_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 未发现

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
