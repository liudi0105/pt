---
sidebar_position: 3
---

# 社区模块实体

这一组实体负责站内内容、沟通、互动和信息流。

## 实体清单

| 实体 | 职责 | 关键关系 | 备注 |
| --- | --- | --- | --- |
| comments | 评论 | 关联 users 和 torrents/news/posts | 站点互动基础对象 |
| messages | 站内信 | 关联 users | 用户间消息 |
| staff_messages | 管理消息 | 关联 users | 管理员或系统消息 |
| news | 新闻/公告 | 关联 users | 站点信息流 |
| polls | 投票主题 | 关联 users | 运营投票 |
| poll_answers | 投票选项 | 关联 polls | 选项和统计结果 |
| bookmarks | 书签 | 关联 users 和 torrents | 用户收藏/关注 |
| thanks | 感谢记录 | 关联 users 和 torrents | 积极反馈 |
| rewards | 奖励记录 | 关联 users 和 torrents/comments | 激励和打赏 |
| posts | 帖子 | 关联 topics 和 users | 论坛内容 |
| topics | 主题 | 关联 forums 和 users | 论坛主话题 |
| forums | 版块 | 关联 topics/posts | 论坛容器 |
| forummods | 版主关系 | 关联 forums 和 users | 版块管理者 |
| pmboxes | 私信盒子 | 关联 users/messages | 消息容器 |
| shoutbox | 喊话/短消息 | 关联 users | 快速互动流 |
| readposts | 已读帖子记录 | 关联 users 和 posts/topics | 阅读状态跟踪 |
| overforums | 超级版块配置 | 关联 forums | 论坛层级配置 |

## 核心实体说明

### comments

评论是资源详情页和信息流讨论的基础。

设计要求：

- 必须关联发言人和对象
- 支持回复层级或父子关系
- 支持审核和删除留痕

#### 典型字段

- `id`
- `user`
- `torrent`
- `added`
- `text`
- `ori_text`
- `editedby`
- `editdate`
- `offer`
- `request`
- `anonymous`

#### 索引关注

- `user`
- `torrent + id`
- `offer + id`

### messages / staff_messages

站内信和管理消息都需要明确：

- 发送者
- 接收者
- 读取状态
- 删除状态
- 业务上下文

#### 典型字段（messages）

- `id`
- `sender`
- `receiver`
- `added`
- `subject`
- `msg`
- `unread`
- `location`
- `saved`

### polls / poll_answers

投票应拆成主题和选项，避免结果字段污染主体。

设计要求：

- 主题与投票选项分离
- 投票结果可统计
- 同一用户的重复投票可控

### forums / topics / posts

论坛建议保留三层：

- forum 作为版块
- topic 作为主题
- post 作为回帖

设计要求：

- 版块权限可配置
- 主题和回帖分离
- 已读状态可追踪

#### 支持性实体

- `forums`：版块容器
- `topics`：主题主记录
- `posts`：回帖和楼层
- `forummods`：版主关系
- `pmboxes`：私信盒子
- `shoutbox`：短消息流
- `readposts`：已读状态
- `overforums`：论坛层级配置

## 使用场景

- 种子详情评论
- 站点公告和新闻
- 论坛发帖和回帖
- 投票和舆情收集
- 私信和系统通知

## 风险点

- 评论和帖子属于高写入数据，需控制索引数量
- 消息状态和已读状态要分离
- 站内互动对象多，必须统一归属策略
- 内容实体和互动实体要区分主从，避免统计口径混乱
