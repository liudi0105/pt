---
sidebar_position: 2
---

# `torrents`

## 表定位

`torrents` 是种子主表，保存资源元数据、展示状态、审核状态、统计字段和部分运营字段。

## 来源对照

- 表名：`torrents`
- 模型：`App\Models\Torrent`
- 初始建表：`2021_06_08_113437_create_torrents_table.php`
- 后续追加迁移：
  - `2021_06_19_141415_add_hr_to_torrents_table.php`
  - `2022_03_08_042734_add_pt_gen_tags_technical_info_to_torrents_table.php`
  - `2022_05_03_155158_add_cover_to_torrents_table.php`
  - `2022_06_14_021936_add_approval_status_to_torrents_table.php`
  - `2022_09_17_150606_add_pos_state_until_to_torrents_table.php`
  - `2023_02_11_024403_add_price_to_torrents_table.php`
  - `2023_07_25_010623_add_pieces_hash_to_torrents_table.php`
  - `2023_04_30_054546_alter_table_torrents_descr_ori_descr_columns_type_from_text_to_mediumtext.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `mediumint unsigned` | 否 | 自增 | 主键 |
| `info_hash` | `binary(20)` | 否 | 无 | 种子 info hash |
| `name` | `varchar(255)` | 否 | `''` | 资源标题 |
| `filename` | `varchar(255)` | 否 | `''` | 原始文件名 |
| `save_as` | `varchar(255)` | 否 | `''` | 保存名称 |
| `cover` | `varchar(255)` | 否 | `''` | 封面图 |
| `descr` | `mediumtext` | 是 | `null` | 描述 |
| `small_descr` | `varchar(255)` | 否 | `''` | 短描述 |
| `ori_descr` | `mediumtext` | 是 | `null` | 原始描述 |
| `category` | `unsigned smallint` | 否 | `0` | 分类 |
| `source` | `unsigned tinyint` | 否 | `0` | 来源 |
| `medium` | `unsigned tinyint` | 否 | `0` | 媒体类型 |
| `codec` | `unsigned tinyint` | 否 | `0` | 编码 |
| `standard` | `unsigned tinyint` | 否 | `0` | 规格 |
| `processing` | `unsigned tinyint` | 否 | `0` | 处理方式 |
| `team` | `unsigned tinyint` | 否 | `0` | 团队/制作组 |
| `audiocodec` | `unsigned tinyint` | 否 | `0` | 音频编码 |
| `size` | `unsigned bigint` | 否 | `0` | 总大小 |
| `added` | `datetime` | 是 | `null` | 添加时间 |
| `type` | `enum('single','multi')` | 否 | `'single'` | 单文件/多文件 |
| `numfiles` | `unsigned smallint` | 否 | `0` | 文件数 |
| `comments` | `unsigned mediumint` | 否 | `0` | 评论数 |
| `views` | `unsigned int` | 否 | `0` | 浏览数 |
| `hits` | `unsigned int` | 否 | `0` | 点击数 |
| `times_completed` | `unsigned mediumint` | 否 | `0` | 完成数 |
| `leechers` | `unsigned mediumint` | 否 | `0` | 下载人数 |
| `seeders` | `unsigned mediumint` | 否 | `0` | 做种人数 |
| `last_action` | `datetime` | 是 | `null` | 最近活动时间 |
| `visible` | `enum('yes','no')` | 否 | `'yes'` | 可见性 |
| `banned` | `enum('yes','no')` | 否 | `'no'` | 禁用状态 |
| `owner` | `unsigned mediumint` | 否 | `0` | 上传者 |
| `nfo` | `binary` | 是 | `null` | NFO 内容 |
| `sp_state` | `unsigned tinyint` | 否 | `1` | 促销状态 |
| `promotion_time_type` | `unsigned tinyint` | 否 | `0` | 促销时间类型 |
| `promotion_until` | `datetime` | 是 | `null` | 促销截止时间 |
| `anonymous` | `enum('yes','no')` | 否 | `'no'` | 是否匿名 |
| `url` | `unsigned int` | 是 | `null` | 外部链接/URL ID |
| `pos_state` | `varchar(32)` | 否 | `'normal'` | 置顶状态 |
| `pos_state_until` | `datetime` | 是 | `null` | 置顶截止时间 |
| `cache_stamp` | `unsigned tinyint` | 否 | `0` | 缓存标记 |
| `picktype` | `enum('hot','classic','recommended','normal')` | 否 | `'normal'` | 推荐类型 |
| `picktime` | `datetime` | 是 | `null` | 推荐时间 |
| `last_reseed` | `datetime` | 是 | `null` | 最近补种时间 |
| `pt_gen` | `mediumtext` | 是 | `null` | PTGen 信息 |
| `technical_info` | `text` | 是 | `null` | 技术信息 |
| `hr` | `tinyint` | 否 | `0` | H&R 标记 |
| `approval_status` | `int` | 否 | `0` | 审核状态 |
| `price` | `int` | 否 | `0` | 价格 |
| `pieces_hash` | `char(40)` | 否 | `''` | pieces hash |

## 约束清单

- 主键：`id`
- 唯一约束：
  - `info_hash`

## 索引清单

- 单列索引：
  - `name`
  - `owner`
  - `url`
  - `pieces_hash`
- 组合索引：
  - `visible_pos_id(visible, pos_state, id)`
  - `category_visible_banned(category, visible, banned)`
  - `visible_banned_pos_id(visible, banned, pos_state, id)`

## 关系清单

- `owner` 指向 `users.id`
- `category` 指向分类字典
- `source` / `medium` / `codec` / `standard` / `processing` / `team` / `audiocodec` 指向相应字典表

## 使用场景

- 发种和编辑
- 列表和详情展示
- 审核和拒绝
- 搜索过滤
- tracker 统计同步

## 备注

- 该表同时承载主体信息、展示状态、审核状态和统计字段。
- `descr`、`ori_descr` 当前已调整为 `mediumtext`。
