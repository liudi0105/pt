---
sidebar_position: 3
---

# 表清单

下面按业务域列出重写时需要优先关注的表类型。更细的实体说明请直接看 [模块实体](./entities/user)。

## 用户相关

| 表 | 用途 | 说明 |
| --- | --- | --- |
| users | 用户主表 | 保存账号主体、等级、状态和核心统计 |
| user_meta | 用户扩展表 | 保存偏好和扩展字段 |
| login_logs | 登录日志 | 保存登录轨迹和安全审计 |
| username_change_logs | 改名日志 | 保存用户名变更历史 |
| user_ban_logs | 封禁日志 | 保存封禁和解封记录 |
| invites | 邀请表 | 保存邀请关系和邀请额度 |

## 种子相关

| 表 | 用途 | 说明 |
| --- | --- | --- |
| torrents | 种子主表 | 保存种子元数据和状态 |
| torrent_operation_logs | 操作日志 | 保存审核、编辑和状态变更 |
| torrent_states | 状态字典 | 保存种子状态定义 |
| torrent_deny_reasons | 拒绝原因 | 保存审核拒绝原因 |
| torrent_tags | 标签关系 | 保存种子与标签关系 |
| files | 附件表 | 保存附件和资源文件信息 |
| torrent_secrets | 秘钥表 | 保存下载和校验相关密钥 |

## tracker 相关

| 表 | 用途 | 说明 |
| --- | --- | --- |
| peers | 上报状态 | 保存做种和下载中的客户端状态 |
| snatches | 完成记录 | 保存完成下载历史 |

## 社区相关

| 表 | 用途 | 说明 |
| --- | --- | --- |
| comments | 评论表 | 保存评论和回复 |
| messages | 站内信 | 保存用户消息 |
| staff_messages | 管理消息 | 保存管理员沟通记录 |
| news | 新闻表 | 保存新闻和公告 |
| polls | 投票表 | 保存投票主题 |
| poll_answers | 投票项 | 保存投票选项和结果 |
| bookmarks | 书签表 | 保存收藏和关注 |
| thanks | 感谢表 | 保存感谢行为 |
| rewards | 奖励表 | 保存奖励和积分激励 |

## 运营相关

| 表 | 用途 | 说明 |
| --- | --- | --- |
| attendances | 签到表 | 保存签到结果 |
| attendance_logs | 签到日志 | 保存签到历史 |
| exams | 考核表 | 保存考核规则 |
| exam_users | 考核用户表 | 保存用户参与考核状态 |
| exam_progress | 考核进度表 | 保存完成进度 |
| hit_and_runs | H&R 表 | 保存违规记录 |
| cheaters | 作弊记录 | 保存异常行为 |
| medals | 勋章定义 | 保存勋章基础定义 |
| user_medals | 用户勋章 | 保存持有关系 |
| claims | 认领表 | 保存认领记录 |
| requests | 求种表 | 保存需求记录 |
| offers | 需求/候选表 | 保存候选和规则结果 |
| seed_box_records | SeedBox 记录 | 保存盒子识别和规则记录 |

## 系统相关

| 表 | 用途 | 说明 |
| --- | --- | --- |
| settings | 配置表 | 保存站点参数 |
| plugins | 插件表 | 保存插件生命周期信息 |
| agent_allows | 客户端白名单 | 保存允许的客户端标识 |
| agent_denies | 客户端黑名单 | 保存禁止的客户端标识 |
| download_speeds | 下载速度规则 | 保存下载规则 |
| upload_speeds | 上传速度规则 | 保存上传规则 |
| isps | ISP 规则 | 保存网络归属信息 |

## 设计要求

- 代码重写时先确认表职责，再确认字段
- 不同业务域不要把字段混写进一张表
- 日志表和主表不要混为一体
- 规则表优先保证可配置而不是可计算
