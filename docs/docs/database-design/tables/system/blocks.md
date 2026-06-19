---
slug: /database-design/tables/blocks
title: blocks
---

# `blocks`

## 表定位

- 模块：系统模块
- 中文名称：屏蔽关系表
- 表名：`blocks`

## 来源对照

- `2021_06_08_113437_create_blocks_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_blocks_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_blocks_table.php |   |
| `blockid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_blocks_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`userid`, `blockid`，名称：`userfriend`，来源：`2021_06_08_113437_create_blocks_table.php`

## 索引清单

- 未发现

## 关系清单

- 字段命名关联：`userid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
