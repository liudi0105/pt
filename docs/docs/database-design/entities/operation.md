---
sidebar_position: 4
---

# 运营模块实体

这一组实体负责签到、考核、H&R、认领、求种、勋章和风控记录。

## 实体清单

| 实体 | 职责 | 关键关系 | 备注 |
| --- | --- | --- | --- |
| attendances | 签到主记录 | 关联 users | 每日签到结果 |
| attendance_logs | 签到日志 | 关联 users | 签到历史 |
| exams | 考核规则 | 关联 users 或后台配置 | 考核定义 |
| exam_users | 用户考核关系 | 关联 exams 和 users | 用户参与状态 |
| exam_progress | 考核进度 | 关联 exam_users | 进度快照 |
| hit_and_runs | H&R 记录 | 关联 users 和 torrents | 违规行为记录 |
| cheaters | 作弊记录 | 关联 users | 异常行为风控 |
| claims | 认领记录 | 关联 users 和 torrents/requests | 需求交付 |
| requests | 求种记录 | 关联 users | 需求单 |
| offers | 候选/建议记录 | 关联 requests/users | 规则驱动结果 |
| offervotes | 候选投票 | 关联 offers 和 users | 统计和审核输入 |
| medals | 勋章定义 | 关联 users_medals | 勋章规则 |
| user_medals | 用户勋章关系 | 关联 users 和 medals | 用户持有状态 |
| reward_logs | 奖励日志 | 关联 users | 奖励轨迹 |
| bonus_logs | 积分变化日志 | 关联 users | 积分账本 |
| magic | 道具记录 | 关联 users | 站内道具/特殊能力 |
| funds | 资金/捐助记录 | 关联 users | 财务或支持记录 |
| complaints | 申诉/投诉主表 | 关联 users | 申诉入口 |
| complain_replies | 申诉回复 | 关联 complaints 和 users | 处理回复 |
| seed_box_records | SeedBox 记录 | 关联 users | 盒子识别和规则 |

## 核心实体说明

### attendances / attendance_logs

签到建议拆成主记录和日志。

主记录保存当天结果，日志保存历史过程。

#### 关注字段

- 用户
- 签到日期
- 连签天数
- 总签到天数
- 奖励结果
- 补签状态

### exams / exam_users / exam_progress

考核至少需要三层：

- 规则定义
- 用户参与关系
- 进度和状态快照

设计要求：

- 规则可配置
- 进度可计算
- 结果可追踪

#### 典型字段（exams）

- `id`
- `name`
- `description`
- `begin`
- `end`
- `duration`
- `filters`
- `indexes`
- `status`
- `is_discovered`

### hit_and_runs

H&R 是典型的状态流转实体。

建议保存：

- 关联用户
- 关联种子
- 触发时间
- 截止时间
- 当前状态
- 豁免结果

#### 典型字段

- `id`
- `uid`
- `torrent_id`
- `snatched_id`
- `status`
- `comment`
- `created_at`
- `updated_at`

#### 索引关注

- `uid + torrent_id` 唯一约束
- `snatched_id` 唯一约束

### claims / requests / offers

这三类实体形成“需求 - 候选 - 认领”链路。

设计要求：

- 请求是需求
- offer 是候选或推荐
- claim 是最终承接动作

#### 关键字段提醒

- `claims` 需要保存承接人、状态、结算结果
- `requests` 需要保存需求发起人、标题、描述和状态
- `offers` 需要保存候选内容、来源和审批状态

### medals / user_medals

勋章体系至少要区分：

- 勋章定义
- 获取规则
- 有效期
- 用户持有状态

#### 典型字段（medals）

- `id`
- `name`
- `get_type`
- `description`
- `image_large`
- `image_small`
- `price`
- `duration`

## 使用场景

- 每日签到
- 考核任务和通过判定
- H&R 处罚和豁免
- 求种、认领和结算
- 勋章和奖励体系

## 风险点

- 运营类表通常有时间窗口查询，索引必须围绕时间和状态
- 规则类实体要尽量配置化
- 记录类表要避免主记录和历史记录混写
- 高状态表要保留清晰的状态定义和时间字段
