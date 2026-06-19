---
sidebar_position: 4
---

# 核心数据模型

这页不是数据库清单，而是业务对象清单。

重写时，先把对象之间的关系想清楚，再决定表怎么拆、接口怎么出。

## 用户对象

### User

站点的基础主体对象。

它承载：

- 身份
- 等级
- 状态
- 积分
- 偏好
- 权限

### 关联对象

- UserMeta：扩展偏好和个性化设置
- LoginLog：登录轨迹
- UserBanLog：封禁轨迹
- UsernameChangeLog：改名轨迹
- Invite：邀请关系

## 种子对象

### Torrent

站点最核心的资源对象。

它承载：

- 标题和简介
- 分类和标签
- 元数据
- 状态
- 可见性
- 审核信息

### 关联对象

- TorrentOperationLog：操作日志
- TorrentState：状态定义
- TorrentDenyReason：拒绝原因
- TorrentTag：标签关系
- File：附件
- TorrentSecret：下载和验证密钥

## Tracker 对象

### Peer

描述客户端与站点之间的做种连接状态。

它承载：

- 当前上传/下载状态
- 做种状态
- 速度和连接信息
- 端口和客户端信息

### Snatch

描述用户对种子的完成记录。

它承载：

- 下载完成时间
- 完成行为
- 与考核和 H&R 的后续关系

## 社区对象

### Comment

资源详情页和内容页的讨论记录。

### Message / StaffMessage / News / Poll / PollAnswer

站内沟通与投票对象。

### Bookmark / Thank / Reward

用户行为和互动激励对象。

## 运营对象

### Attendance / AttendanceLog

签到行为和签到历史。

### Medal / UserMedal

勋章定义和用户持有关系。

### Exam / ExamUser / ExamProgress

考核任务、参与关系和进度状态。

### HitAndRun / Cheater

违规和风控记录。

### Claim / Request / Offer

认领、求种和需求对象。

### SeedBoxRecord

盒子记录和规则对象。

## 系统对象

### Setting

站点配置对象。

### Plugin

插件生命周期对象。

### AgentAllow / AgentDeny

客户端 allow / deny 规则对象。

### DownloadSpeed / UploadSpeed / Isp

速度和网络环境规则对象。

### TorrentState / TorrentDenyReason

用于审核和状态流转的系统字典对象。

## 关系视图

- 一个用户可以创建多个种子
- 一个种子可以拥有多个评论、peer 和完成记录
- 一个用户可以拥有多个签到、考核、H&R、勋章和消息记录
- 一个种子状态变化会触发日志和索引更新
- 一个运营动作通常会落到日志对象上

## 状态设计原则

- 主对象和日志对象分离
- 业务状态和展示状态分离
- 审核状态、发布状态、违规状态不能混用
- 只要能影响站点行为，就必须可持久化

## 重写要求

后续重构时，数据模型要优先满足以下原则：

- 查询路径清晰
- 状态流转明确
- 日志能回溯
- 统计能聚合
- 对外接口不暴露内部实现细节

