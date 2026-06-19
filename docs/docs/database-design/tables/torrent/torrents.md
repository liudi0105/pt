---
slug: /database-design/tables/torrents
title: torrents
---

# `torrents`

## 表定位

- 模块：种子模块
- 中文名称：种子主表
- 表名：`torrents`

## 来源对照

- `2021_06_08_113437_create_torrents_table.php`
- `2021_06_19_141415_add_hr_to_torrents_table.php`
- `2022_03_08_042734_add_pt_gen_tags_technical_info_to_torrents_table.php`
- `2022_05_03_155158_add_cover_to_torrents_table.php`
- `2022_06_14_021936_add_approval_status_to_torrents_table.php`
- `2022_09_17_150606_add_pos_state_until_to_torrents_table.php`
- `2023_02_11_024403_add_price_to_torrents_table.php`
- `2023_04_30_054546_alter_table_torrents_descr_ori_descr_columns_type_from_text_to_mediumtext.php`
- `2023_07_25_010623_add_pieces_hash_to_torrents_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `id` | `mediumIncrements` | 否 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `name` | `string` | 否 | `` | 2021_06_08_113437_create_torrents_table.php |   |
| `filename` | `string` | 否 | `` | 2021_06_08_113437_create_torrents_table.php |   |
| `save_as` | `string` | 否 | `` | 2021_06_08_113437_create_torrents_table.php |   |
| `descr` | `mediumText` | 否 | 无 | 2021_06_08_113437_create_torrents_table.php<br />2023_04_30_054546_alter_table_torrents_descr_ori_descr_columns_type_from_text_to_mediumtext.php |   |
| `small_descr` | `string` | 否 | `` | 2021_06_08_113437_create_torrents_table.php |   |
| `ori_descr` | `mediumText` | 否 | 无 | 2021_06_08_113437_create_torrents_table.php<br />2023_04_30_054546_alter_table_torrents_descr_ori_descr_columns_type_from_text_to_mediumtext.php |   |
| `category` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `source` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `medium` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `codec` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `standard` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `processing` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `team` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `audiocodec` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `size` | `unsignedBigInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `added` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `type` | `enum(['single', 'multi'])` | 否 | `single` | 2021_06_08_113437_create_torrents_table.php |   |
| `numfiles` | `unsignedSmallInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `comments` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `views` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `hits` | `unsignedInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `times_completed` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `leechers` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `seeders` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `last_action` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `visible` | `enum(['yes', 'no'])` | 否 | `yes` | 2021_06_08_113437_create_torrents_table.php |   |
| `banned` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_torrents_table.php |   |
| `owner` | `unsignedMediumInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `nfo` | `binary` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `sp_state` | `unsignedTinyInteger` | 否 | `1` | 2021_06_08_113437_create_torrents_table.php |   |
| `promotion_time_type` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `promotion_until` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `anonymous` | `enum(['yes', 'no'])` | 否 | `no` | 2021_06_08_113437_create_torrents_table.php |   |
| `url` | `unsignedInteger` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `pos_state` | `string(32)` | 否 | `normal` | 2021_06_08_113437_create_torrents_table.php |   |
| `cache_stamp` | `unsignedTinyInteger` | 否 | `0` | 2021_06_08_113437_create_torrents_table.php |   |
| `picktype` | `enum(['hot', 'classic', 'recommended', 'normal'])` | 否 | `normal` | 2021_06_08_113437_create_torrents_table.php |   |
| `picktime` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `last_reseed` | `dateTime` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php |   |
| `pt_gen` | `mediumText` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php<br />2022_03_08_042734_add_pt_gen_tags_technical_info_to_torrents_table.php |   |
| `technical_info` | `text` | 是 | 无 | 2021_06_08_113437_create_torrents_table.php<br />2022_03_08_042734_add_pt_gen_tags_technical_info_to_torrents_table.php |   |
| `hr` | `tinyInteger` | 否 | `0` | 2021_06_19_141415_add_hr_to_torrents_table.php |   |
| `cover` | `string` | 否 | `` | 2022_05_03_155158_add_cover_to_torrents_table.php |   |
| `approval_status` | `integer` | 否 | `0` | 2022_06_14_021936_add_approval_status_to_torrents_table.php |   |
| `pos_state_until` | `dateTime` | 是 | 无 | 2022_09_17_150606_add_pos_state_until_to_torrents_table.php |   |
| `price` | `integer` | 否 | `0` | 2023_02_11_024403_add_price_to_torrents_table.php |   |
| `pieces_hash` | `char(40)` | 否 | `` | 2023_07_25_010623_add_pieces_hash_to_torrents_table.php |   |

## 约束清单

### 主键与主键声明

- 未发现

### 唯一约束

- 未发现

## 索引清单

- 索引字段：`name`，名称：`name`，来源：`2021_06_08_113437_create_torrents_table.php`
- 索引字段：`owner`，名称：`owner`，来源：`2021_06_08_113437_create_torrents_table.php`
- 索引字段：`url`，名称：`url`，来源：`2021_06_08_113437_create_torrents_table.php`
- 索引字段：`visible`, `pos_state`, `id`，名称：`visible_pos_id`，来源：`2021_06_08_113437_create_torrents_table.php`
- 索引字段：`category`, `visible`, `banned`，名称：`category_visible_banned`，来源：`2021_06_08_113437_create_torrents_table.php`
- 索引字段：`visible`, `banned`, `pos_state`, `id`，名称：`visible_banned_pos_id`，来源：`2021_06_08_113437_create_torrents_table.php`
- 索引字段：`pieces_hash`，来源：`2023_07_25_010623_add_pieces_hash_to_torrents_table.php`

## 关系清单

- 字段命名关联：`owner` -> `users.id`
- 字段命名关联：`category` -> `categories.id`

## 迁移备注

- 当前文档按迁移代码推导现状，不额外补充业务推测。
- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。
