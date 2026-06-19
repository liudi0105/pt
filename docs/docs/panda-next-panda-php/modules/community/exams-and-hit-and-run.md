# 考核与 H&R

## 1. 概述

通过考核（Exam）和 Hit & Run（H&R）机制对用户行为施加持续约束。考核用于引导用户达成上传、做种等目标；H&R 用于治理下载后不做种的违规行为。

## 2. 功能说明

### 2.1 考核管理

#### 2.1.1 考核定义

管理员创建考核规则，模型 `Exam` 包含：

- 基本信息：`name`、`description`、`begin`（开始时间）、`end`（结束时间）、`duration`（持续天数）、`status`、`is_discovered`（是否为发现式考核）、`priority`（优先级）。
- 考核指标（`indexes`，JSON 字段）：支持 4 种指标类型——上传量（GB）、做种时间（小时）、下载量（GB）、魔力值（Bonus）。每种指标可配置目标值。
- 过滤器（`filters`，JSON 字段）：定义哪些用户会被自动分配此考核，如用户等级、注册时长等条件。

#### 2.1.2 考核分配

- **定时任务** `exam:assign`（每小时执行）：自动将开启了 `is_discovered=1` 的考核分配给符合条件的用户。
- 分配时创建 `ExamUser` 记录，状态初始为 `Normal(0)`，记录 `begin` 和 `end` 时间。
- 同时初始化 `ExamProgress` 记录：每个考核指标一条，记录 `init_value`（分配时的基准值）和 `value`（当前值）。

#### 2.1.3 考核进度与结算

- 考核进度按指标增量计算：`progress = value - init_value`，在检查点由定时任务更新。
- **定时任务** `exam:checkout`：处理已过期的考核。
  - **通过**：发送站内信通知用户考核通过。
  - **失败**：按规则执行处罚——禁用用户账号、记录 `UserBanLog`、发送失败通知 PM。

#### 2.1.4 考核治理

- 管理员可对单条或批量 `ExamUser` 执行：豁免（避免，status=-1）、恢复、删除。
- API：`CRUD /api/exams`、`CRUD /api/exam-users`、`GET /api/exams-all`、`GET /api/exam-indexes`。

### 2.2 Hit & Run（H&R）管理

#### 2.2.1 H&R 产生

- 用户下载种子后，系统创建 `HitAndRun` 记录，初始状态 `INSPECTING(1)`。
- 数据模型：表 `hit_and_runs`，字段 `uid`、`snatch_id`、`torrent_id`、`status`、`comment`。

#### 2.2.2 H&R 判定

**定时任务**：定期检查处于 `INSPECTING` 状态的记录，若当前时间超过 `inspect_time` 则执行判定：

1. **VIP/捐赠者豁免检查**：若用户为 VIP 或捐赠者等级，直接标记为 `PARDONED(4)`。
2. **种子完成度检查**：统计用户对该种子的做种时间（`seed_time`）和分享率（`share_ratio`）。
3. **判定结果**：
   - 达标 → `REACHED(2)`
   - 未达标 → `UNREACHED(3)`

#### 2.2.3 H&R 处罚

- **自动封禁**：若用户的 `UNREACHED` 记录数量达到或超过配置项 `ban_user_when_counts_reach`，系统自动禁用该用户账号并记录封禁日志。
- **豁免（Pardon）**：用户可通过消耗魔力值购买豁免，调用 `BonusRepository::consumeToCancelHitAndRun()`，支付后状态变为 `PARDONED(4)`。

#### 2.2.4 H&R 治理

- 管理员可单条或批量对 H&R 记录执行：赦免（修改为 PARDONED）、删除。
- API：`CRUD /api/hr`、`GET /api/hr-status`、`PUT /api/hr-pardon/{id}`。
- 支持三种模式：`DISABLED`（关闭）、`MANUAL`（手动）、`GLOBAL`（全局规则）。

## 3. 操作入口

- 用户考核状态页：查看当前进行中的考核及其进度
- 用户 H&R 记录页：查看 H&R 状态、执行豁免操作
- 后台考核管理页：创建/编辑考核规则、管理考核分配
- 后台 H&R 管理页：查看/赦免/删除 H&R 记录
- API：`/api/exams`、`/api/exams-all`、`/api/exam-indexes`、`/api/exam-users`、`/api/hr`、`/api/hr-status`、`/api/hr-pardon/{id}`

## 4. 使用说明

1. 发现式考核（`is_discovered=1`）每小时自动分配给符合条件的用户，用户无需主动报名。
2. 考核进度在定时任务检查点更新，非实时刷新。
3. 考核失败处罚为自动封禁账号，管理员可在后台手动恢复。
4. H&R 判定有延迟，需等待 `inspect_time` 到达后才执行判定。
5. 用户可通过消耗魔力值豁免 H&R 记录，豁免后状态不可逆。

## 5. 配置参考

| 配置项 | 说明 |
|--------|------|
| `ban_user_when_counts_reach` | 达到此数量的 UNREACHED 记录后自动封禁用户 |
| `BonusRepository::consumeToCancelHitAndRun()` 定价 | 豁免单条 H&R 所需魔力值，由 Bonus 系统配置 |
