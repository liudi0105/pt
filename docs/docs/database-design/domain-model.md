---
sidebar_position: 2
---

# 领域模型

这一页从业务视角描述数据库对象之间的关系。

## 用户域

### User

用户是所有业务的起点。

核心职责：

- 身份标识
- 等级与权限
- 状态控制
- 积分和统计
- 偏好和展示设置

### UserMeta

用户的扩展属性承载层。

适合存放：

- 个性化设置
- 展示开关
- 站点偏好
- 非核心扩展字段

### 关联对象

- LoginLog
- UserBanLog
- UsernameChangeLog
- Invite
- UserMedal

## 种子域

### Torrent

资源主对象。

核心职责：

- 资源元数据
- 审核和状态
- 可见性
- 搜索展示
- 下载和做种入口

### 关联对象

- TorrentOperationLog
- TorrentState
- TorrentDenyReason
- TorrentTag
- File
- TorrentSecret

## tracker 域

### Peer

描述用户和种子之间的实时连接状态。

核心职责：

- 做种状态
- 下载状态
- 上传下载速度
- 客户端信息

### Snatch

描述完成行为和下载结果。

核心职责：

- 完成记录
- 完成时间
- 与 H&R 和考核联动

## 社区域

### Comment

资源和内容下的讨论记录。

### Message / StaffMessage / News / Poll

内容传播和站内沟通对象。

### Bookmark / Thank / Reward

用户互动和激励对象。

## 运营域

### Attendance / AttendanceLog

签到与签到历史。

### Exam / ExamUser / ExamProgress

考核规则、参与关系和进度记录。

### HitAndRun / Cheater

违规行为与风控记录。

### Claim / Request / Offer

认领、求种和需求匹配对象。

### Medal / UserMedal

勋章定义和持有关系。

### SeedBoxRecord

SeedBox 识别和规则记录。

## 系统域

### Setting

站点配置中心。

### Plugin

插件生命周期记录。

### AgentAllow / AgentDeny

客户端允许和禁止规则。

### DownloadSpeed / UploadSpeed / Isp

速度和网络归属规则。

## 关系摘要

- 一个用户可以创建多个种子
- 一个种子可以产生多个 peer 和 snatch 记录
- 一个用户可以拥有多个勋章、考核、签到和 H&R 记录
- 一个种子可以关联多个标签、评论和附件
- 一个配置项可以影响多个模块

## 建模要求

- 主体表、关系表、日志表要分开
- 高写入对象和高查询对象要区别对待
- 状态变化要靠显式字段表达
- 枚举类字段要保持稳定

