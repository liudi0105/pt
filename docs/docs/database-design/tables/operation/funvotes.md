---
slug: /database-design/tables/funvotes
title: funvotes
---

# `funvotes`

## 表定位

- 模块：运营模块
- 中文名称：趣味投票表
- 表名：`funvotes`

## 来源对照

- `2021_06_08_113437_create_funvotes_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `funid` | `unsignedMediumInteger` | 否 | 无 | 2021_06_08_113437_create_funvotes_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | 无 | 2021_06_08_113437_create_funvotes_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_funvotes_table.php |   |
| `vote` | `enum(['fun', 'dull'])` | 否 | `fun` | 2021_06_08_113437_create_funvotes_table.php |   |

## 约束清单

### 主键与主键声明

- 主键/主键声明字段：`funid`, `userid`，来源：`2021_06_08_113437_create_funvotes_table.php`

### 唯一约束

- 未发现

## 索引清单

- 未发现

## 关系清单

- 字段命名关联：`userid` -> `users.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
