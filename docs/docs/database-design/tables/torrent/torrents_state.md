---
slug: /database-design/tables/torrents_state
title: torrents_state
---

# `torrents_state`

## 表定位

- 模块：种子模块
- 中文名称：种子状态表
- 表名：`torrents_state`

## 来源对照

- `2021_06_08_113437_create_torrents_state_table.php`
- `2022_07_08_215348_add_deadline_to_torrents_state_table.php`
- `2022_08_26_061516_add_begin_to_torrents_state_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `global_sp_state` | `unsignedTinyInteger` | 否 | `1` | 2021_06_08_113437_create_torrents_state_table.php |   |
| `id` | `bigIncrements` | 否 | 无 | 2022_07_08_215348_add_deadline_to_torrents_state_table.php |   |
| `deadline` | `dateTime` | 是 | 无 | 2022_07_08_215348_add_deadline_to_torrents_state_table.php |   |
| `begin` | `dateTime` | 是 | 无 | 2022_08_26_061516_add_begin_to_torrents_state_table.php |   |

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
