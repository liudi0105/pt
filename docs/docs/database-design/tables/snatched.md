---
sidebar_position: 4
---

# `snatched`

## 表定位

`snatched` 保存用户和种子之间的完成记录与历史传输统计。

## 来源对照

- 表名：`snatched`
- 模型：`App\Models\Snatch`
- 初始建表：`2021_06_08_113437_create_snatched_table.php`
- 后续追加迁移：
  - `2021_06_11_161551_add_completedat_index_to_snatched_table.php`
  - `2023_03_29_021950_handle_snatched_user_torrent_unique.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | 否 | 自增 | 主键 |
| `torrentid` | `unsigned mediumint` | 否 | `0` | 种子 ID |
| `userid` | `unsigned mediumint` | 否 | `0` | 用户 ID |
| `ip` | `varchar(64)` | 否 | `''` | IP |
| `port` | `unsigned smallint` | 否 | `0` | 端口 |
| `uploaded` | `unsigned bigint` | 否 | `0` | 已上传量 |
| `downloaded` | `unsigned bigint` | 否 | `0` | 已下载量 |
| `to_go` | `unsigned bigint` | 否 | `0` | 剩余量 |
| `seedtime` | `unsigned int` | 否 | `0` | 做种时长 |
| `leechtime` | `unsigned int` | 否 | `0` | 下载时长 |
| `last_action` | `datetime` | 是 | `null` | 最近活动时间 |
| `startdat` | `datetime` | 是 | `null` | 开始时间 |
| `completedat` | `datetime` | 是 | `null` | 完成时间 |
| `finished` | `enum('yes','no')` | 否 | `'no'` | 是否完成 |

## 约束清单

- 主键：`id`
- 唯一约束：
  - 初始：`torrentid_userid(torrentid, userid)`
  - 后续调整：`unique_torrent_user(torrentid, userid)`

## 索引清单

- 单列索引：
  - `userid` / `idx_user`
  - `completedat`

## 关系清单

- `torrentid` 指向 `torrents.id`
- `userid` 指向 `users.id`

## 使用场景

- 完成记录列表
- 用户下载历史
- H&R 判断
- 考核统计

## 备注

- 模型名是 `Snatch`，真实表名是 `snatched`。
- 唯一索引在后续迁移中做过清理和重建。
