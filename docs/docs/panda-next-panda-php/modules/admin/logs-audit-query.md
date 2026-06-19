# 日志与审计查询

## 1. 概述

为管理员和运维人员提供系统运行日志和操作审计记录的查询能力，涵盖站内通知、种子操作、用户登录、禁用记录、魔力值流水、用户名变更等。适用于安全审查、问题追溯和运营分析。

## 2. 功能说明

### 2.1 站内通知日志（Sitelog）

**数据模型（表 `sitelog`）：**
- 字段：`id`、`added`（时间）、`txt`（内容）、`security_level`（安全级别）
- 安全级别：`normal`（普通）、`mod`（管理）
- 普通用户仅可见 `normal` 级别的通知

### 2.2 种子操作日志（TorrentOperationLog）

通过 Filament TorrentOperationLogResource 以只读方式展示：
- 记录种子管理操作：`approval_allow`（审批通过）、`approval_deny`（审批拒绝）、`edit`（编辑）、`delete`（删除）
- 可筛选条件：操作人（uid）、种子 ID、操作类型、操作时间范围
- 包含操作备注（comment），审批拒绝时备注会通过 PM 发送给上传者

### 2.3 登录日志（LoginLog）

通过 Filament LoginLogResource 展示用户登录记录：
- 字段：`uid`、`ip`、`country`（国家）、`city`（城市）、`client`（客户端信息）
- 基于 GeoIP 数据库解析 IP 地理位置
- 支持按用户、时间范围检索

### 2.4 用户禁用日志（UserBanLog）

记录用户账号被禁用的完整历史：
- 字段：`uid`、`username`、`operator`（操作人）、`reason`（原因）
- 无论是管理员手动禁用、考核到期自动禁用还是其他系统触发禁用，均写入此表
- 可通过用户详情页查看

### 2.5 用户名变更日志（UsernameChangeLog）

通过 Filament 可查的用户名变更历史：
- 字段：`uid`、`old_name`（旧名）、`new_name`（新名）、`operator`、`change_type`
- 变更类型：`1` — 用户自助改名，`2` — 管理员修改

### 2.6 魔力值流水（BonusLogs）

通过 Filament BonusLogResource 展示完整魔力值变动记录：
- 每次变动记录变动前余额、变动金额、变动后余额
- 支持 20+ 种业务类型：

| 业务类型 | 说明 |
|----------|------|
| cancel_hr | H&R 消除 |
| buy_medal | 购买勋章 |
| buy_attendance_card | 购买签到卡 |
| post_reward | 发帖奖励 |
| gift | 用户间赠送 |

### 2.7 其他日志

- **签到日志**（AttendanceLogResource）— 用户每日签到记录
- **种子购买记录**（TorrentBuyLogResource）— 付费种子购买详情

## 3. 操作入口

**Fiament 路径：**

| 日志类型 | Filament 资源 |
|----------|--------------|
| 种子操作日志 | TorrentOperationLogResource |
| 登录日志 | LoginLogResource |
| 魔力值流水 | BonusLogResource |
| 用户名变更日志 | UsernameChangeLogResource |
| 签到日志 | AttendanceLogResource |
| 种子购买记录 | TorrentBuyLogResource |
| 用户禁用记录 | 用户详情页 / UserBanLog |
| 站内通知 | Sitelog 页面（security_level 过滤） |

## 4. 使用说明

1. **审计追溯**：需要对某个用户或种子做全链路审计时，依次查看登录日志（确认登录行为）、种子操作日志（确认管理操作）、魔力值流水（确认财务变动）、禁用日志（确认状态变更）。
2. **权限控制**：Sitelog 的 `security_level=mod` 条目仅管理员可见。所有 Filament 日志资源受 Filament 角色权限控制。
3. **导出**：部分 Filament 资源支持 CSV 导出，注意导出行为本身也应在审计范围。
4. **数据保留**：所有审计日志为只读记录，不可修改。历史日志的保留策略由系统数据归档机制控制，建议定期归档旧日志。
