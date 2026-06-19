---
slug: /database-design/tables/plugins
title: plugins
---

# `plugins`

## 表定位

- 模块：系统模块
- 中文名称：插件表
- 表名：`plugins`

## 来源对照

- `2022_09_16_164224_create_plugins_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2022_09_16_164224_create_plugins_table.php |   |
| `display_name` | `string` | 是 | 无 | 2022_09_16_164224_create_plugins_table.php |   |
| `package_name` | `string` | 否 | 无 | 2022_09_16_164224_create_plugins_table.php |   |
| `remote_url` | `string` | 是 | 无 | 2022_09_16_164224_create_plugins_table.php |   |
| `installed_version` | `string` | 是 | 无 | 2022_09_16_164224_create_plugins_table.php |   |
| `description` | `text` | 是 | 无 | 2022_09_16_164224_create_plugins_table.php |   |
| `status` | `integer` | 否 | `-1` | 2022_09_16_164224_create_plugins_table.php |   |
| `status_result` | `text` | 是 | 无 | 2022_09_16_164224_create_plugins_table.php |   |
| `created_at` | `timestamp` | 是 | `null` | 2022_09_16_164224_create_plugins_table.php |   |
| `updated_at` | `timestamp` | 是 | `null` | 2022_09_16_164224_create_plugins_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`package_name`，来源：`2022_09_16_164224_create_plugins_table.php`

## 索引清单

- 未发现

## 关系清单

- 当前迁移中未声明外键，表间关系主要通过字段命名表达。

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
