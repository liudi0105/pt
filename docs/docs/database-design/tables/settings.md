---
sidebar_position: 5
---

# `settings`

## 表定位

`settings` 保存站点配置项，是全局配置读取的主要来源。

## 来源对照

- 表名：`settings`
- 模型：`App\Models\Setting`
- 初始建表：`2021_06_08_113437_create_settings_table.php`
- 后续追加迁移：
  - `2022_05_06_191830_add_autoload_to_settings_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `int` | 否 | 自增 | 主键 |
| `name` | `varchar(255)` | 否 | `''` | 配置名 |
| `value` | `mediumtext` | 是 | `null` | 配置值 |
| `created_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `timestamp` | 否 | `CURRENT_TIMESTAMP` | 更新时间 |
| `autoload` | `enum('yes','no')` | 否 | `'yes'` | 是否自动加载 |

## 约束清单

- 主键：`id`
- 唯一约束：
  - `uniqe_name(name)`

## 索引清单

- 当前无额外普通索引

## 关系清单

- 该表不通过外键关联业务表
- 通过 `name` 命名空间为各模块提供配置

## 使用场景

- 站点启动读取配置
- 后台设置保存
- 模块配置缓存

## 备注

- `value` 当前允许保存标量和 JSON 结构。
- 模型层存在按 `autoload = yes` 批量加载并缓存的读取逻辑。
