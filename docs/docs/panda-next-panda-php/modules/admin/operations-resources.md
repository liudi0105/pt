# 运营资源管理

## 1. 概述

集中管理标签、勋章、考核等运营资源，供种子系统和用户系统消费。适用于运营人员配置种子标签分类、设计勋章体系、制定用户考核计划等场景。

## 2. 功能说明

### 2.1 标签管理（Tags）

标签用于种子标记和分类展示。

**数据模型（表 `tags`）：**
- 字段：`name`（名称）、`color`（背景色）、`font_color`、`font_size`、`padding`、`margin`、`border_radius`（样式配置）
- 标签与种子通过 `torrent_tags` 中间表多对多关联

**预置标签（7 个）：**

| 标签 | 颜色 |
|------|------|
| 禁转 | 红色 |
| 首发 | 紫色 |
| 官方 | 蓝色 |
| DIY | 青色 |
| 国语 | 棕色 |
| 中字 | 绿色 |
| HDR | 绿色 |

**特殊标签：**
- `official_tag` — 官方标签，影响种子展示优先级
- `zero_bonus_tag` — 零魔力标签，标记的种子不产生魔力值

**API：** 完整 CRUD，`resource /api/tags`
**Filament：** TagResource，展示标签名、颜色预览、关联种子数、总大小

### 2.2 勋章管理（Medals）

勋章用于用户成就展示和社区激励。

**数据模型（表 `medals`）：**
- 字段：`name`、`description`、`images`（图片列表）、`price`（魔力值价格）、`duration`（有效期天数）、`get_type`（Exchange 兑换 / Grant 授予）
- 兑换型勋章：用户使用魔力值购买
- 授予型勋章：管理员直接分配

**用户勋章关系（`user_medal` 中间表）：**
- 字段：`expire_at`（到期时间）、`status`（wearing 佩戴中 / not 未佩戴）
- 每个用户同时佩戴上限由 `system.maximum_number_of_medals_can_be_worn` 配置控制

**API：**
- `resource /api/medals` — 勋章定义 CRUD
- `resource /api/user-medals` — 用户勋章关系 CRUD

**核心逻辑：**
- MedalRepository：`toggleUserMedalStatus()` 切换佩戴状态，`saveUserMedal()` 保存关系
- BonusRepository：`consumeToBuyMedal()` 扣除魔力值并扣减勋章库存

### 2.3 考核管理（Exams）

考核用于对用户设定上传量、做种时间、下载量、魔力值等目标，到期未完成则触发处罚。

**数据模型（表 `exams`）：**
- 字段：`name`、`description`、`begin`（开始时间）、`end`（结束时间）、`duration`（持续天数）、`status`、`is_discovered`（是否公开发现）、`filters`（目标用户筛选条件 JSON）、`priority`（优先级）
- 考核指标支持 4 种类型：Uploaded（上传量）、SeedTime（做种时间）、DL（下载量）、Bonus（魔力值）

**考核用户关系（`exam_user`）：**
- 字段：`status`（Normal 进行中 / Finished 完成 / Avoided 规避）、`progress`（进度 JSON）
- ExamProgress：每个指标追踪 `init_value`（初始值）和 `current_value`（当前值）

**API：**
- `resource /api/exams` — 考核定义 CRUD
- `resource /api/exam-indexes` — 考核指标列表
- `resource /api/exam-users` — 考核用户关系管理（包含 avoid 规避、recover 恢复、批量规避、批量删除）

**定时任务：**
- `exam:assign`（每小时执行）— 根据 filters 筛选用户并自动分配考核
- `exam:checkout`（每小时执行）— 检查到期考核，未完成的用户设置 `enabled=no`，记录 UserBanLog，发送 PM 通知

## 3. 操作入口

**Filament 路径：**
- 运营 → 标签管理（TagResource）
- 运营 → 勋章管理（MedalResource）
- 运营 → 用户勋章管理（UserMedalResource）
- 运营 → 考核管理（ExamResource）
- 运营 → 考核用户管理（ExamUserResource）

**API 端点：**

| 方法 | 端点 | 说明 |
|------|------|------|
| GET/POST/PUT/DELETE | `/api/tags` | 标签 CRUD |
| GET/POST/PUT/DELETE | `/api/medals` | 勋章 CRUD |
| GET/POST/PUT/DELETE | `/api/user-medals` | 用户勋章 CRUD |
| GET/POST/PUT/DELETE | `/api/exams` | 考核 CRUD |
| GET | `/api/exams-all` | 全部考核列表 |
| GET | `/api/exam-indexes` | 考核指标列表 |
| GET/POST/PUT/DELETE | `/api/exam-users` | 考核用户 CRUD |

## 4. 使用说明

1. **标签**：创建标签时设置名称和视觉样式。特殊的 `official_tag` 和 `zero_bonus_tag` 在系统配置中指定，不可通过普通标签 CRUD 设置。
2. **勋章**：兑换型勋章需设定价格和有效期，用户可在前台购买。授予型勋章由管理员在后台直接分配给用户。注意 `max_worn_medals` 配置约束。
3. **考核**：创建考核时需设置时间范围、考核指标（至少一个）、目标用户 filters（可按用户等级、注册时间等筛选）。考核到期自动执行处罚。如需提前解除，可通过 exam-users API 执行 avoid 规避操作。
4. **历史数据保护**：删除标签或勋章前确认是否已关联种子或用户，删除后历史关联数据将失去可解释性。

## 5. 配置参考

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `system.maximum_number_of_medals_can_be_worn` | 用户最大佩戴勋章数 | 3 |
| `official_tag` | 官方标签 ID（系统配置中指定） | 无 |
| `zero_bonus_tag` | 零魔力标签 ID（系统配置中指定） | 无 |
