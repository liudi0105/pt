---
slug: /database-design/tables/complains
title: complains
---

# `complains`

## 表定位

- 模块：运营模块
- 中文名称：申诉表
- 表名：`complains`

## 来源对照

- `2022_05_06_160029_create_complains_table.php`
- `2022_10_13_002653_add_ip_to_complains_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_05_06_160029_create_complains_table.php |   |
| `uuid` | `char(36)` | 否 | 无 | 2022_05_06_160029_create_complains_table.php |   |
| `email` | `string` | 否 | 无 | 2022_05_06_160029_create_complains_table.php |   |
| `body` | `text` | 否 | 无 | 2022_05_06_160029_create_complains_table.php |   |
| `added` | `dateTime` | 否 | 无 | 2022_05_06_160029_create_complains_table.php |   |
| `answered` | `smallInteger` | 否 | `0` | 2022_05_06_160029_create_complains_table.php |   |
| `ip` | `string` | 是 | 无 | 2022_10_13_002653_add_ip_to_complains_table.php |   |

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
