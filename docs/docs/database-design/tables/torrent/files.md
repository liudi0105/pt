---
slug: /database-design/tables/files
title: files
---

# `files`

## 表定位

- 模块：种子模块
- 中文名称：文件表
- 表名：`files`

## 来源对照

- `2021_06_08_113437_create_files_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `increments` | 否 | 无 | 2021_06_08_113437_create_files_table.php |   |
| `torrent` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_files_table.php |   |
| `filename` | `string` | 否 | `` | 2021_06_08_113437_create_files_table.php |   |
| `size` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_files_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`torrent`，名称：`torrent`，来源：`2021_06_08_113437_create_files_table.php`

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
