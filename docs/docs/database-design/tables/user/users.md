---
slug: /database-design/tables/users
title: users
---

# `users`

## 表定位

- 模块：用户模块
- 中文名称：用户主表
- 表名：`users`

## 来源对照

- `2021_06_08_113437_create_users_table.php`
- `2021_06_10_181005_add_two_step_secret_to_users_table.php`
- `2021_06_24_013107_add_seed_points_to_users_table.php`
- `2022_03_08_043201_add_page_to_users_table.php`
- `2022_04_03_041642_add_attendance_card_to_users_table.php`
- `2022_09_13_204800_add_offer_allowed_count_to_users_table.php`
- `2022_11_23_042152_add_seed_points_seed_times_update_time_to_users_table.php`
- `2023_06_01_013150_change_bonus_log_table_value_decimal.php`
- `2023_07_12_014056_add_seed_points_per_hour_to_users_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigIncrements` | 否 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `username` | `string(40)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `passhash` | `string(32)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `secret` | `binary` | 否 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `email` | `string(80)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `status` | `enum(['pending', 'confirmed'])` | 否 | `pending` | 2021_06_08_113437_create_users_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_login` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_access` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_home` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_offer` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `forum_access` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_staffmsg` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_pm` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_comment` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_post` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `last_browse` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `last_music` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `last_catchup` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `editsecret` | `binary` | 否 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `privacy` | `enum(['strong', 'normal', 'low'])` | 否 | `normal` | 2021_06_08_113437_create_users_table.php |   |
| `stylesheet` | `unsignedTinyInteger` | 否 | `1` | 2021_06_08_113437_create_users_table.php |   |
| `caticon` | `unsignedTinyInteger` | 否 | `1` | 2021_06_08_113437_create_users_table.php |   |
| `fontsize` | `enum(['small', 'medium', 'large'])` | 否 | `medium` | 2021_06_08_113437_create_users_table.php |   |
| `info` | `text` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `acceptpms` | `enum(['yes', 'friends', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `commentpm` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `ip` | `string(64)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `class` | `unsignedTinyInteger` | 否 | `1` | 2021_06_08_113437_create_users_table.php |   |
| `max_class_once` | `tinyInteger` | 否 | `1` | 2021_06_08_113437_create_users_table.php |   |
| `avatar` | `string` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `uploaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `downloaded` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `seedtime` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `leechtime` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `title` | `string(30)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `country` | `unsignedSmallInteger` | 否 | `107` | 2021_06_08_113437_create_users_table.php |   |
| `notifs` | `string(500)` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `modcomment` | `text` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `enabled` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `avatars` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `donor` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `donated` | `decimal` | 否 | `0.00` | 2021_06_08_113437_create_users_table.php |   |
| `donated_cny` | `decimal` | 否 | `0.00` | 2021_06_08_113437_create_users_table.php |   |
| `donoruntil` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `warned` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `warneduntil` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `noad` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `noaduntil` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `torrentsperpage` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `topicsperpage` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `postsperpage` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `clicktopic` | `enum(['firstpage', 'lastpage'])` | 否 | `firstpage` | 2021_06_08_113437_create_users_table.php |   |
| `deletepms` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `savepms` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `showhot` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `showclassic` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `support` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `picker` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `stafffor` | `string` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `supportfor` | `string` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `pickfor` | `string` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `supportlang` | `string(50)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `passkey` | `string(32)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `promotion_link` | `string(32)` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `uploadpos` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `forumpost` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `downloadpos` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `clientselect` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `signatures` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `signature` | `string(800)` | 否 | `` | 2021_06_08_113437_create_users_table.php |   |
| `lang` | `unsignedSmallInteger` | 否 | `6` | 2021_06_08_113437_create_users_table.php |   |
| `cheat` | `smallInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `download` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `upload` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `isp` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `invites` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `invited_by` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `gender` | `enum(['Male', 'Female', 'N/A'])` | 否 | `N/A` | 2021_06_08_113437_create_users_table.php |   |
| `vip_added` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `vip_until` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `seedbonus` | `decimal(20, 1)` | 否 | `0.0` | 2021_06_08_113437_create_users_table.php<br />2023_06_01_013150_change_bonus_log_table_value_decimal.php |   |
| `charity` | `decimal(10, 1)` | 否 | `0.0` | 2021_06_08_113437_create_users_table.php |   |
| `bonuscomment` | `text` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `parked` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `leechwarn` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `leechwarnuntil` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `lastwarned` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_users_table.php |   |
| `timeswarned` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `warnedby` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_users_table.php |   |
| `sbnum` | `unsignedSmallInteger` | 否 | `70` | 2021_06_08_113437_create_users_table.php |   |
| `sbrefresh` | `unsignedSmallInteger` | 否 | `120` | 2021_06_08_113437_create_users_table.php |   |
| `hidehb` | `enum(['yes', 'no'])` | 是 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `showimdb` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `showdescription` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `showcomment` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `showclienterror` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `showdlnotice` | `boolean` | 否 | `1` | 2021_06_08_113437_create_users_table.php |   |
| `tooltip` | `enum(['minorimdb', 'medianimdb', 'off'])` | 否 | `off` | 2021_06_08_113437_create_users_table.php |   |
| `shownfo` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `timetype` | `enum(['timeadded', 'timealive'])` | 是 | `timealive` | 2021_06_08_113437_create_users_table.php |   |
| `appendsticky` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `appendnew` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `appendpromotion` | `enum(['highlight', 'word', 'icon', 'off'])` | 是 | `icon` | 2021_06_08_113437_create_users_table.php |   |
| `appendpicked` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `dlicon` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `bmicon` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `showsmalldescr` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `showcomnum` | `enum(['yes', 'no'])` | 是 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `showlastcom` | `enum(['yes', 'no'])` | 是 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `showlastpost` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_users_table.php |   |
| `pmnum` | `unsignedTinyInteger` | 否 | `10` | 2021_06_08_113437_create_users_table.php |   |
| `school` | `unsignedSmallInteger` | 否 | `35` | 2021_06_08_113437_create_users_table.php |   |
| `showfb` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_users_table.php |   |
| `page` | `string` | 是 | `` | 2021_06_08_113437_create_users_table.php<br />2022_03_08_043201_add_page_to_users_table.php |   |
| `two_step_secret` | `string` | 否 | `` | 2021_06_10_181005_add_two_step_secret_to_users_table.php |   |
| `seed_points` | `decimal(20, 1)` | 否 | `0` | 2021_06_24_013107_add_seed_points_to_users_table.php |   |
| `attendance_card` | `integer` | 否 | `0` | 2022_04_03_041642_add_attendance_card_to_users_table.php |   |
| `offer_allowed_count` | `integer` | 否 | `0` | 2022_09_13_204800_add_offer_allowed_count_to_users_table.php |   |
| `seed_points_updated_at` | `dateTime` | 是 | 无 | 2022_11_23_042152_add_seed_points_seed_times_update_time_to_users_table.php |   |
| `seed_time_updated_at` | `dateTime` | 是 | 无 | 2022_11_23_042152_add_seed_points_seed_times_update_time_to_users_table.php |   |
| `seed_points_per_hour` | `decimal(20, 1)` | 否 | `0` | 2023_07_12_014056_add_seed_points_per_hour_to_users_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 唯一约束字段：`username`，名称：`username`，来源：`2021_06_08_113437_create_users_table.php`

## 索引清单

- 索引字段：`last_access`，名称：`last_access`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`ip`，名称：`ip`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`class`，名称：`class`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`uploaded`，名称：`uploaded`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`downloaded`，名称：`downloaded`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`country`，名称：`country`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`enabled`，名称：`enabled`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`warned`，名称：`warned`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`passkey`，名称：`passkey`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`cheat`，名称：`cheat`，来源：`2021_06_08_113437_create_users_table.php`
- 索引字段：`status`, `added`，名称：`status_added`，来源：`2021_06_08_113437_create_users_table.php`

## 关系清单

- 字段命名关联：`invited_by` -> `users.id`
- 字段命名关联：`lang` -> `language.id`
- 字段命名关联：`country` -> `countries.id`
- 字段命名关联：`school` -> `schools.id`
- 字段命名关联：`isp` -> `isp.id`
- 字段命名关联：`passkey` 被 Tracker、下载鉴权和日志链路引用

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
