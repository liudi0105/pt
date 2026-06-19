# 后台操作契约

## 1. 概述

定义后台所有管理操作在审计、通知、数据一致性方面的统一契约。适用于种子审批（允许/拒绝）、种子编辑删除、用户禁用、账号变更等需要追溯和通知的管理行为。

## 2. 功能说明

### 2.1 Torrent 操作日志（TorrentOperationLog）

**数据模型（表 `torrent_operation_logs`）：**
- 字段：`uid`（操作人）、`torrent_id`、`action_type`、`comment`（备注）
- 支持的操作类型：`approval_none`（无操作）、`approval_allow`（审批通过）、`approval_deny`（审批拒绝）、`edit`（编辑）、`delete`（删除）

**审计特性：**
- 所有操作通过 Filament TorrentOperationLogResource 可查（只读）
- 支持按操作人、种子 ID、操作类型、时间范围筛选
- `approval_allow` 和 `approval_deny` 操作自动向种子上传者发送 PM 通知，附带审批备注

### 2.2 用户操作审计

**UserBanLog：** 记录所有用户禁用事件。字段包含 uid、username、operator（操作人）、reason（原因）。无论通过 API 禁用还是考核失败自动禁用，均写入此表。

**UsernameChangeLog：** 记录用户名变更历史。字段包含 uid、old_name、new_name、operator、change_type（1=用户自助、2=管理员修改）。通过 Filament 可查。

**Modcomment：** 用户记录上的 `modcomment` 字段，以时间戳标记的方式追加管理备注，形成用户治理时间线。

### 2.3 财务操作审计

**BonusLogs（魔力值流水）：** 记录所有魔力值变动，包含业务类型（20+ 种）、变动前余额、变动后余额、变动金额。业务类型包括：

| 业务类型 | 说明 |
|----------|------|
| cancel_hr | H&R 消除 |
| buy_medal | 购买勋章 |
| buy_attendance_card | 购买签到卡 |
| post_reward | 发帖奖励 |
| gift | 用户赠送 |

**TorrentBuyLogs：** 记录用户购买种子的付费记录，包含种子信息、支付金额、购买时间。

### 2.4 登录审计

**LoginLogs：** 记录用户登录记录。字段包含 uid、IP、country、city、client（客户端信息）。通过 GeoIP 数据解析 IP 所在地理位置。通过 Filament LoginLogResource 可查。

## 3. 操作入口

**Filament 路径：**
- 运营 → 种子操作日志（TorrentOperationLogResource）
- 运营 → 勋章日志、签到日志、魔力值日志
- 运营 → 登录日志（LoginLogResource）
- 运营 → 种子购买记录（TorrentBuyLogResource）
- 用户管理 → 用户详情页（查看 modcomment、UserBanLog）

**数据模型：**

| 模型/表 | 说明 |
|---------|------|
| TorrentOperationLog | 种子管理操作审计 |
| UserBanLog | 用户禁用审计 |
| UsernameChangeLog | 用户名变更审计 |
| BonusLogs | 魔力值流水审计 |
| LoginLogs | 登录审计（含 GeoIP） |
| TorrentBuyLogs | 种子购买审计 |

## 4. 使用说明

1. **种子审批**：在种子详情页执行 approve/deny 操作。每次操作自动写入 TorrentOperationLog，同时向上传者发送包含审批意见的 PM。
2. **用户禁用**：通过用户治理后台或考核系统触发。无论哪种途径，均写入 UserBanLog 并在 modcomment 追加记录。
3. **魔力值审计**：所有魔力值变动（消费、奖励、赠送等）均有 BonusLogs 记录，可在 Filament 中按用户、业务类型、时间范围检索。
4. **审计追溯原则**：所有审计日志为只读，不允许修改或删除。导出行为本身也需要留痕。
5. **用户名变更**：自助改名和管理员改名均记录到 UsernameChangeLog，change_type 区分变更来源。

## 5. 配置参考

无独立配置项。审计数据的保留策略由系统数据清理机制控制。
