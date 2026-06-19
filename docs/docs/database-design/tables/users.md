---
sidebar_position: 1
---

# `users`

## 表定位

`users` 是用户主表，保存账号主体、访问状态、权限等级、上传下载统计、展示偏好以及部分安全和运营字段。

## 来源对照

- 表名：`users`
- 模型：`App\Models\User`
- 初始建表：`2021_06_08_113437_create_users_table.php`
- 后续追加迁移：
  - `2021_06_10_181005_add_two_step_secret_to_users_table.php`
  - `2021_06_24_013107_add_seed_points_to_users_table.php`
  - `2022_03_08_043201_add_page_to_users_table.php`
  - `2022_04_03_041642_add_attendance_card_to_users_table.php`
  - `2022_09_13_204800_add_offer_allowed_count_to_users_table.php`
  - `2022_11_23_042152_add_seed_points_seed_times_update_time_to_users_table.php`
  - `2023_07_12_014056_add_seed_points_per_hour_to_users_table.php`

## 字段清单

| 字段名 | 当前类型 | 可空 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | 否 | `UID_STARTS` 或 `10001` 起始 | 主键 |
| `username` | `varchar(40)` | 否 | `''` | 用户名 |
| `passhash` | `varchar(32)` | 否 | `''` | 密码摘要 |
| `secret` | `binary` | 否 | 无 | 用户密钥 |
| `email` | `varchar(80)` | 否 | `''` | 邮箱 |
| `status` | `enum('pending','confirmed')` | 否 | `'pending'` | 账号确认状态 |
| `added` | `datetime` | 是 | `null` | 注册时间 |
| `last_login` | `datetime` | 是 | `null` | 最近登录时间 |
| `last_access` | `datetime` | 是 | `null` | 最近访问时间 |
| `last_home` | `datetime` | 是 | `null` | 最近首页访问时间 |
| `last_offer` | `datetime` | 是 | `null` | 最近候选相关时间 |
| `forum_access` | `datetime` | 是 | `null` | 最近论坛访问时间 |
| `last_staffmsg` | `datetime` | 是 | `null` | 最近管理消息时间 |
| `last_pm` | `datetime` | 是 | `null` | 最近私信时间 |
| `last_comment` | `datetime` | 是 | `null` | 最近评论时间 |
| `last_post` | `datetime` | 是 | `null` | 最近发帖时间 |
| `last_browse` | `unsigned int` | 否 | `0` | 最近浏览标记 |
| `last_music` | `unsigned int` | 否 | `0` | 最近音乐页标记 |
| `last_catchup` | `unsigned int` | 否 | `0` | 最近追赶标记 |
| `editsecret` | `binary` | 否 | 无 | 编辑密钥 |
| `privacy` | `enum('strong','normal','low')` | 否 | `'normal'` | 隐私等级 |
| `stylesheet` | `unsigned tinyint` | 否 | `1` | 样式表编号 |
| `caticon` | `unsigned tinyint` | 否 | `1` | 分类图标风格 |
| `fontsize` | `enum('small','medium','large')` | 否 | `'medium'` | 字号 |
| `info` | `text` | 是 | `null` | 个人简介 |
| `acceptpms` | `enum('yes','friends','no')` | 否 | `'yes'` | 私信接收策略 |
| `commentpm` | `enum('yes','no')` | 否 | `'yes'` | 评论通知私信 |
| `ip` | `varchar(64)` | 否 | `''` | IP 地址 |
| `class` | `unsigned tinyint` | 否 | `1` | 用户等级 |
| `max_class_once` | `tinyint` | 否 | `1` | 单次最大等级 |
| `avatar` | `varchar(255)` | 否 | `''` | 头像 |
| `uploaded` | `unsigned bigint` | 否 | `0` | 上传量 |
| `downloaded` | `unsigned bigint` | 否 | `0` | 下载量 |
| `seedtime` | `unsigned bigint` | 否 | `0` | 做种时长 |
| `leechtime` | `unsigned bigint` | 否 | `0` | 下载时长 |
| `title` | `varchar(30)` | 否 | `''` | 头衔 |
| `country` | `unsigned smallint` | 否 | `107` | 国家 |
| `notifs` | `varchar(500)` | 是 | `null` | 通知设置 |
| `modcomment` | `text` | 是 | `null` | 管理员备注 |
| `enabled` | `enum('yes','no')` | 否 | `'yes'` | 启用状态 |
| `avatars` | `enum('yes','no')` | 否 | `'yes'` | 头像开关 |
| `donor` | `enum('yes','no')` | 否 | `'no'` | 捐赠状态 |
| `donated` | `decimal` | 否 | `0.00` | 捐赠额 |
| `donated_cny` | `decimal` | 否 | `0.00` | 人民币捐赠额 |
| `donoruntil` | `datetime` | 是 | `null` | 捐赠有效期 |
| `warned` | `enum('yes','no')` | 否 | `'no'` | 警告状态 |
| `warneduntil` | `datetime` | 是 | `null` | 警告截止时间 |
| `noad` | `enum('yes','no')` | 否 | `'no'` | 去广告状态 |
| `noaduntil` | `datetime` | 是 | `null` | 去广告截止时间 |
| `torrentsperpage` | `unsigned tinyint` | 否 | `0` | 每页种子数 |
| `topicsperpage` | `unsigned tinyint` | 否 | `0` | 每页主题数 |
| `postsperpage` | `unsigned tinyint` | 否 | `0` | 每页帖子数 |
| `clicktopic` | `enum('firstpage','lastpage')` | 否 | `'firstpage'` | 主题点击行为 |
| `deletepms` | `enum('yes','no')` | 否 | `'yes'` | 自动删私信 |
| `savepms` | `enum('yes','no')` | 否 | `'no'` | 保存私信 |
| `showhot` | `enum('yes','no')` | 否 | `'yes'` | 显示热门 |
| `showclassic` | `enum('yes','no')` | 否 | `'yes'` | 显示经典 |
| `support` | `enum('yes','no')` | 否 | `'no'` | 客服/支持身份 |
| `picker` | `enum('yes','no')` | 否 | `'no'` | 推荐员身份 |
| `stafffor` | `varchar(255)` | 否 | `''` | 管理负责范围 |
| `supportfor` | `varchar(255)` | 否 | `''` | 支持负责范围 |
| `pickfor` | `varchar(255)` | 否 | `''` | 推荐负责范围 |
| `supportlang` | `varchar(50)` | 否 | `''` | 支持语言 |
| `passkey` | `varchar(32)` | 否 | `''` | 下载 passkey |
| `promotion_link` | `varchar(32)` | 是 | `null` | 推广链接标识 |
| `uploadpos` | `enum('yes','no')` | 否 | `'yes'` | 上传权限开关 |
| `forumpost` | `enum('yes','no')` | 否 | `'yes'` | 发帖权限开关 |
| `downloadpos` | `enum('yes','no')` | 否 | `'yes'` | 下载权限开关 |
| `clientselect` | `unsigned tinyint` | 否 | `0` | 客户端选择设置 |
| `signatures` | `enum('yes','no')` | 否 | `'yes'` | 签名开关 |
| `signature` | `varchar(800)` | 否 | `''` | 签名内容 |
| `lang` | `unsigned smallint` | 否 | `6` | 语言编号 |
| `cheat` | `smallint` | 否 | `0` | 作弊标记 |
| `download` | `unsigned int` | 否 | `0` | 下载速度/次数字段 |
| `upload` | `unsigned int` | 否 | `0` | 上传速度/次数字段 |
| `isp` | `unsigned tinyint` | 否 | `0` | ISP 编号 |
| `invites` | `unsigned smallint` | 否 | `0` | 邀请数 |
| `invited_by` | `unsigned mediumint` | 否 | `0` | 邀请人 ID |
| `gender` | `enum('Male','Female','N/A')` | 否 | `'N/A'` | 性别 |
| `vip_added` | `enum('yes','no')` | 否 | `'no'` | VIP 是否追加 |
| `vip_until` | `datetime` | 是 | `null` | VIP 截止时间 |
| `seedbonus` | `decimal(10,1)` | 否 | `0.0` | 魔力值 |
| `charity` | `decimal(10,1)` | 否 | `0.0` | 慈善值 |
| `bonuscomment` | `text` | 是 | `null` | 奖励备注 |
| `parked` | `enum('yes','no')` | 否 | `'no'` | 停车状态 |
| `leechwarn` | `enum('yes','no')` | 否 | `'no'` | 吸血警告状态 |
| `leechwarnuntil` | `datetime` | 是 | `null` | 吸血警告截止时间 |
| `lastwarned` | `datetime` | 是 | `null` | 最近警告时间 |
| `timeswarned` | `unsigned tinyint` | 否 | `0` | 警告次数 |
| `warnedby` | `unsigned mediumint` | 否 | `0` | 警告执行人 |
| `sbnum` | `unsigned smallint` | 否 | `70` | shoutbox 数量设置 |
| `sbrefresh` | `unsigned smallint` | 否 | `120` | shoutbox 刷新设置 |
| `hidehb` | `enum('yes','no')` | 是 | `'no'` | 隐藏某展示位 |
| `showimdb` | `enum('yes','no')` | 是 | `'yes'` | 显示 IMDB |
| `showdescription` | `enum('yes','no')` | 是 | `'yes'` | 显示描述 |
| `showcomment` | `enum('yes','no')` | 是 | `'yes'` | 显示评论 |
| `showclienterror` | `enum('yes','no')` | 否 | `'no'` | 显示客户端错误 |
| `showdlnotice` | `boolean` | 否 | `1` | 显示下载提醒 |
| `tooltip` | `enum('minorimdb','medianimdb','off')` | 否 | `'off'` | tooltip 样式 |
| `shownfo` | `enum('yes','no')` | 是 | `'yes'` | 显示 NFO |
| `timetype` | `enum('timeadded','timealive')` | 是 | `'timealive'` | 时间显示方式 |
| `appendsticky` | `enum('yes','no')` | 是 | `'yes'` | 附加置顶标记 |
| `appendnew` | `enum('yes','no')` | 是 | `'yes'` | 附加新标记 |
| `appendpromotion` | `enum('highlight','word','icon','off')` | 是 | `'icon'` | 附加优惠标记 |
| `appendpicked` | `enum('yes','no')` | 是 | `'yes'` | 附加精选标记 |
| `dlicon` | `enum('yes','no')` | 是 | `'yes'` | 显示下载图标 |
| `bmicon` | `enum('yes','no')` | 是 | `'yes'` | 显示书签图标 |
| `showsmalldescr` | `enum('yes','no')` | 否 | `'yes'` | 显示短描述 |
| `showcomnum` | `enum('yes','no')` | 是 | `'yes'` | 显示评论数 |
| `showlastcom` | `enum('yes','no')` | 是 | `'no'` | 显示最后评论 |
| `showlastpost` | `enum('yes','no')` | 否 | `'no'` | 显示最后帖子 |
| `pmnum` | `unsigned tinyint` | 否 | `10` | 私信数显示设置 |
| `school` | `unsigned smallint` | 否 | `35` | 学校编号 |
| `showfb` | `enum('yes','no')` | 否 | `'yes'` | 显示某功能位 |
| `page` | `varchar(255)` | 是 | `''` | 页面偏好 |
| `two_step_secret` | `varchar(255)` | 否 | `''` | 两步验证密钥 |
| `seed_points` | `decimal(20,1)` | 否 | `0` | 做种积分 |
| `attendance_card` | `int` | 否 | `0` | 补签卡数量 |
| `offer_allowed_count` | `int` | 否 | `0` | 候选允许次数 |
| `seed_points_updated_at` | `datetime` | 是 | `null` | 做种积分更新时间 |
| `seed_time_updated_at` | `datetime` | 是 | `null` | 做种时间更新时间 |
| `seed_points_per_hour` | `decimal(20,1)` | 否 | `0` | 每小时做种积分 |

## 约束清单

- 主键：`id`
- 唯一约束：
  - `username`
- 业务唯一/索引字段：
  - `passkey`

## 索引清单

- 单列索引：
  - `last_access`
  - `ip`
  - `class`
  - `uploaded`
  - `downloaded`
  - `country`
  - `enabled`
  - `warned`
  - `passkey`
  - `cheat`
- 组合索引：
  - `status_added(status, added)`

## 关系清单

- `invited_by` 指向 `users.id`
- `country` 对应国家字典
- `lang` 对应语言字典
- `isp` 对应 ISP 字典
- `school` 对应学校字典

## 使用场景

- 登录与鉴权
- 用户中心展示
- 权限和等级判断
- 上传下载统计
- 邀请与运营控制

## 备注

- 该表混合了承载主体信息、展示偏好、统计字段、权限控制和部分运营字段。
- 当前结构没有显式外键约束，关系主要通过字段约定表达。
