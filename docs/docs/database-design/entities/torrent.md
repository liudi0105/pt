---
sidebar_position: 2
---

# 种子模块实体

这一组实体负责资源发布、分类元数据、审核结果、附件和检索。

## 实体清单

| 实体 | 职责 | 关键关系 | 备注 |
| --- | --- | --- | --- |
| torrents | 种子主数据 | 关联 users、tags、comments、peers、snatches、files | 资源核心表 |
| torrent_operation_logs | 种子操作日志 | 关联 torrents 和 users | 记录审核、编辑、状态变化 |
| torrent_states | 种子状态字典 | 被 torrents 及后台配置引用 | 状态定义应稳定 |
| torrent_deny_reasons | 拒绝原因字典 | 被审核流程引用 | 审核标准化输出 |
| torrent_tags | 种子标签关系 | 关联 torrents 和 tags | 多对多关系 |
| torrent_custom_fields | 自定义字段定义 | 关联 torrents | 站点扩展元数据 |
| torrent_custom_field_values | 自定义字段值 | 关联 torrents 和字段定义 | 存放具体填充值 |
| torrent_secrets | 秘钥/校验数据 | 关联 torrents 和 users | 服务下载和 tracker 校验 |
| torrent_buy_logs | 购买记录 | 关联 users 和 torrents | 记录付费或消耗行为 |
| files | 附件记录 | 关联 torrents | 种子附件与资源文件 |
| attachments | 其他附件记录 | 关联帖子或站点内容 | 通用附件容器 |
| categories | 分类字典 | 关联 torrents | 资源一级分类 |
| codecs | 编码字典 | 关联 torrents | 编码标准 |
| audio_codecs | 音轨字典 | 关联 torrents | 音频编码 |
| media | 媒体类型字典 | 关联 torrents | 影视/音乐等媒体类型 |
| sources | 来源字典 | 关联 torrents | 来源标准 |
| standards | 规格字典 | 关联 torrents | 资源标准或质量要求 |
| processing | 处理方式字典 | 关联 torrents | 后处理状态 |
| tags | 标签字典 | 关联 torrents 和后台标签体系 | 标签主表 |
| teams | 团队字典 | 关联 torrents | 制作组或团队信息 |
| icons | 图标字典 | 关联 categories/torrents | 主图标 |
| secondicons | 次图标字典 | 关联 categories/torrents | 次级图标 |
| searchbox | 搜索盒子配置 | 关联 torrents | 搜索入口配置 |
| searchbox_fields | 搜索字段配置 | 关联 searchbox | 搜索扩展字段 |

## 核心实体说明

### torrents

重写时建议把 torrents 视为一个“资源聚合根”。

它至少需要表达：

- 标题和简介
- 分类和标签
- 审核状态
- 可见性和推荐状态
- 下载次数、完成数、做种数
- 上传者和审核者
- 是否允许候选/特别区/封面展示

#### 典型字段

- `id`
- `info_hash`
- `name`
- `filename`
- `save_as`
- `descr`
- `small_descr`
- `ori_descr`
- `category`
- `source`
- `medium`
- `codec`
- `standard`
- `processing`
- `team`
- `audiocodec`
- `size`
- `added`
- `type`
- `numfiles`
- `comments`
- `views`
- `hits`
- `times_completed`
- `leechers`
- `seeders`
- `last_action`
- `visible`
- `banned`
- `owner`
- `nfo`
- `sp_state`
- `promotion_time_type`
- `promotion_until`
- `anonymous`
- `url`
- `pos_state`
- `cache_stamp`
- `picktype`
- `picktime`
- `last_reseed`
- `pt_gen`
- `technical_info`
- `approval_status`
- `pos_state_until`
- `price`
- `offers`
- `cover`
- `hr`

#### 索引关注

- `name`
- `info_hash` 唯一索引
- `owner`
- `url`
- `visible + pos_state + id`
- `category + visible + banned`
- `visible + banned + pos_state + id`

设计要求：

- 状态字段要拆清楚
- 审核信息和公开信息要分开表达
- 列表排序字段要可维护

### torrent_custom_fields / torrent_custom_field_values

自定义字段不能直接硬编码进 torrents。

适合承载：

- 平台扩展信息
- 特定分类专用信息
- 站点额外展示字段

设计要求：

- 定义和取值分离
- 字段类型明确
- 查询索引按使用场景设计

### 关联实体

种子模块还会强关联以下实体：

- `categories`
- `codecs`
- `audio_codecs`
- `media`
- `sources`
- `standards`
- `processing`
- `teams`
- `icons`
- `secondicons`
- `searchbox`
- `searchbox_fields`

### torrent_operation_logs

这是种子审计的核心。

建议保存：

- 操作类型
- 操作人
- 操作前状态
- 操作后状态
- 原因和备注
- 发生时间

## 使用场景

- 发种和编辑
- 审核和拒绝
- 列表展示和搜索
- 下载和附件访问
- 管理员追踪操作

## 风险点

- torrents 是高频查询表，状态和统计字段必须有索引策略
- 标签和自定义字段容易演化，要预留扩展能力
- 审核和公开状态不能混在同一个枚举里
- 资源描述和原始描述要分开保留，避免覆盖原文
- 统计字段多，重写时要控制写放大
