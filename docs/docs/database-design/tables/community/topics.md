---
slug: /database-design/tables/topics
title: topics
---

# `topics`

## 表定位

- 模块：社区模块
- 中文名称：主题表
- 表名：`topics`

## 来源对照

- `2021_06_08_113437_create_topics_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `mediumIncrements` | 否 | 无 | 2021_06_08_113437_create_topics_table.php |   |
| `userid` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_topics_table.php |   |
| `subject` | `string(128)` | 否 | `` | 2021_06_08_113437_create_topics_table.php |   |
| `locked` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_topics_table.php |   |
| `forumid` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_topics_table.php |   |
| `firstpost` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_topics_table.php |   |
| `lastpost` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_topics_table.php |   |
| `sticky` | `enum(['no', 'yes'])` | 否 | `no` | 2021_06_08_113437_create_topics_table.php |   |
| `hlcolor` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_topics_table.php |   |
| `views` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_topics_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`userid`，名称：`userid`，来源：`2021_06_08_113437_create_topics_table.php`
- 索引字段：`subject`，名称：`subject`，来源：`2021_06_08_113437_create_topics_table.php`
- 索引字段：`forumid`, `lastpost`，名称：`forumid_lastpost`，来源：`2021_06_08_113437_create_topics_table.php`
- 索引字段：`forumid`, `sticky`, `lastpost`，名称：`forumid_sticky_lastpost`，来源：`2021_06_08_113437_create_topics_table.php`

## 关系清单

- 字段命名关联：`userid` -> `users.id`
- 字段命名关联：`forumid` -> `forums.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
