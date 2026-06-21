# Server 约束 — AI Agent 指令

## 数据库 i18n

- **表**：`sys_i18n`，复合主键 `(key, locale)`
- **key 格式**：`medal.{code}.label`、`medal.{code}.description`
- **Medal 模型**：`I18n` 字段使用 `gorm:"-"`（不持久化），i18n 存于 `sys_i18n` 表
- **API 返回**：handler 中从 `sys_i18n` 表加载并注入到 `medal.I18n`，格式为 `{ zh: { label, description }, en: { label, description } }`

## 成就系统

- **条件格式**：`{"type":"<type>","gte":<number>}`，以 JSON 字符串存于 `condition` 列
- **condition 类型**：
  - `upload_count` / `seed_hours` / `thanks_received` / `days_since_join`
  - `upload_size` / `download_size` / `post_count` / `torrent_count`
  - `registered`（特殊类型，始终返回 `value=1`，用于注册成就）
- **检查流程**：`checker.CheckUser(userID)` → 查询用户统计 → 遍历活跃成就 → 比对条件 → 授予缺失成就
- **注册自动颁发**：`Register` 和 `RegisterWithInvite` handler 创建用户后调用 `checker.CheckUser(user.ID)`

## 佩戴系统

- **字段**：`user_medals.is_wearing bool`（不是 `users.activated_medal_id`）
- **仓库方法**：`SetWearing(userID, medalID, wearing bool)`
- **Handler**：`WearMedal`（设 `is_wearing=true`）、`UnwearMedal`（设 `is_wearing=false`）
- **路由**：
  - `POST /medals/:id/wear`
  - `POST /medals/:id/unwear`

## Seed 数据

- **成就 seed**：`seed/system/achievements.jsonl` (21 个成就，code 0-20，locales 中 zh/en common.json 覆盖 code 0-20)
- **勋章 seed**：`seed/demo/medals.jsonl` (16 个勋章，code 4-22)
- **用户勋章 seed**：`seed/demo/user_medal.jsonl` (通过 email 引用用户, medal_id 为自增 ID)
- **用户成就 seed**：`seed/demo/user_achievement.jsonl` (通过 email + achievement_code 引用)
- **顺序即 ID**：JSONL 行顺序决定自增 ID，不可调换
- **防重复**：`insertAchievement` 按 `code` 检查是否已存在，存在则跳过
- **用户勋章去重**：`insertUserMedal` 按 `(user_id, medal_id)` 检查，存在则跳过
- **用户成就去重**：`insertUserAchievement` 按 `(user_id, achievement_id)` 检查，存在则跳过
- **批量授予**：`grantRegistrationAchievement()` 在成就 seed 插入后执行，查找 `condition` 含 `registered` 的成就，批量 INSERT 给所有未拥有用户
- **排序**：`achievement` → `user_achievement` → `medal` → `user_medal`，确保 FK 先插入

## 模型约定

- `UserMedal.IsWearing bool`：佩戴状态（每个 user_medal 行独立控制）
- `Achievement.Condition string`：成就解锁条件 JSON
- `Achievement.Code int`：唯一索引，API 和 i18n 均以此为标识
- `User.AchievementCount`：前端展示用，仓库中通过 `UserAchievementRepo.CountByUser` 获取
- `Medal.Color / Achievement.Color string`：十六进制颜色字符串（如 "#FFD700"），前端 Lucide 图标渲染颜色
- `Medal.Image string`：存储 Lucide 图标名称（如 "Gem"），前端通过 `iconRegistry` 动态解析
- `Achievement.Icon string`：同上，存储 Lucide 图标名称
