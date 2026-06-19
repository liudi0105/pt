---
slug: /database-design/tables/faq
title: faq
---

# `faq`

## 表定位

- 模块：系统模块
- 中文名称：FAQ表
- 表名：`faq`

## 来源对照

- `2021_06_08_113437_create_faq_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `smallIncrements` | 否 | 无 | 2021_06_08_113437_create_faq_table.php |   |
| `link_id` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_faq_table.php |   |
| `lang_id` | `unsignedSmallInteger` | 否 | `6` | 2021_06_08_113437_create_faq_table.php |   |
| `type` | `enum(['categ', 'item'])` | 否 | `item` | 2021_06_08_113437_create_faq_table.php |   |
| `question` | `text` | 否 | 无 | 2021_06_08_113437_create_faq_table.php |   |
| `answer` | `text` | 否 | 无 | 2021_06_08_113437_create_faq_table.php |   |
| `flag` | `unsignedTinyInteger` | 否 | `1` | 2021_06_08_113437_create_faq_table.php |   |
| `categ` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_faq_table.php |   |
| `order` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_faq_table.php |   |

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
