---
slug: /database-design/tables/searchbox
title: searchbox
---

# `searchbox`

## 表定位

- 模块：种子模块
- 中文名称：搜索配置表
- 表名：`searchbox`

## 来源对照

- `2021_06_08_113437_create_searchbox_table.php`
- `2022_03_08_041951_add_custom_fields_to_searchbox_table.php`
- `2022_09_02_031539_add_extra_to_searchbox_table.php`
- `2022_09_06_004318_add_section_name_to_searchbox_table.php`
- `2022_09_06_030324_change_searchbox_field_extra_to_json.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `smallIncrements` | 否 | 无 | 2021_06_08_113437_create_searchbox_table.php |   |
| `name` | `string(30)` | 是 | 无 | 2021_06_08_113437_create_searchbox_table.php |   |
| `showsubcat` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `showsource` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `showmedium` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `showcodec` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `showstandard` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `showprocessing` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `showteam` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `showaudiocodec` | `boolean` | 否 | `0` | 2021_06_08_113437_create_searchbox_table.php |   |
| `catsperrow` | `unsignedSmallInteger` | 否 | `7` | 2021_06_08_113437_create_searchbox_table.php |   |
| `catpadding` | `unsignedSmallInteger` | 否 | `25` | 2021_06_08_113437_create_searchbox_table.php |   |
| `custom_fields` | `text` | 是 | 无 | 2021_06_08_113437_create_searchbox_table.php<br />2022_03_08_041951_add_custom_fields_to_searchbox_table.php |   |
| `custom_fields_display_name` | `string` | 是 | `` | 2021_06_08_113437_create_searchbox_table.php<br />2022_03_08_041951_add_custom_fields_to_searchbox_table.php<br />2022_09_06_030324_change_searchbox_field_extra_to_json.php |   |
| `custom_fields_display` | `text` | 是 | 无 | 2021_06_08_113437_create_searchbox_table.php<br />2022_03_08_041951_add_custom_fields_to_searchbox_table.php |   |
| `extra` | `json` | 是 | 无 | 2022_09_02_031539_add_extra_to_searchbox_table.php<br />2022_09_06_030324_change_searchbox_field_extra_to_json.php |   |
| `section_name` | `json` | 是 | 无 | 2022_09_06_004318_add_section_name_to_searchbox_table.php |   |

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
