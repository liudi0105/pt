---
slug: /database-design/tables/secondicons
title: secondicons
---

# `secondicons`

## 表定位

- 模块：种子模块
- 中文名称：次图标表
- 表名：`secondicons`

## 来源对照

- `2021_06_08_113437_create_secondicons_table.php`
- `2022_09_05_230532_add_mode_to_section_related.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `smallIncrements` | 否 | 无 | 2021_06_08_113437_create_secondicons_table.php |   |
| `source` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_secondicons_table.php |   |
| `medium` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_secondicons_table.php |   |
| `codec` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_secondicons_table.php |   |
| `standard` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_secondicons_table.php |   |
| `processing` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_secondicons_table.php |   |
| `team` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_secondicons_table.php |   |
| `audiocodec` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_secondicons_table.php |   |
| `name` | `string(30)` | 否 | `` | 2021_06_08_113437_create_secondicons_table.php |   |
| `class_name` | `string` | 是 | 无 | 2021_06_08_113437_create_secondicons_table.php |   |
| `image` | `string` | 否 | `` | 2021_06_08_113437_create_secondicons_table.php |   |
| `mode` | `integer` | 否 | `0` | 2022_09_05_230532_add_mode_to_section_related.php |   |

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
