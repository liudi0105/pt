# 全局约束 — AI Agent 指令

## 架构规则

- **勋章 vs 成就**：勋章是购买品（price > 0），可在 Profile 佩戴展示；成就是条件引擎自动解锁
- **勋章 i18n** 存储在 `sys_i18n` 表（DB 驱动），成就 i18n 使用 `common.json` 硬编码 JSON
- **佩戴系统**：`is_wearing` 布尔字段在 `user_medals` 行上（不是 `users.activated_medal_id`）
- **API 命名统一**：`wear`/`unwear`（不用 `equip`/`unequip`）

## UI 规则

- **购买**：全部使用 `Popconfirm` 确认
- **按钮样式**：购买按钮 `type="primary"`，佩戴/取消佩戴按钮默认样式
- **按钮文字**：动作为准（"穿戴"/"取消佩戴"），非状态（"已佩戴"）
- **所有展示文本**必须走 i18n，不得硬编码
- **图标选择器**：使用 `components/IconPicker.tsx`（搜索式 Lucide 图标网格）替代普通 Input
- **颜色选择器**：使用 `components/ColorPickerField.tsx`（封装 Ant Design ColorPicker）替代普通 Input
- **图标路径**：后台 `icon`/`image` 字段存储 Lucide 图标名称（如 "Upload"），前端通过 `iconRegistry` 动态解析
- **颜色存储**：`color` 字段存储十六进制颜色字符串（如 "#1890FF"），前后端通用

## Seed 规则

- **JSONL 行顺序决定自增 ID**，不可调换
- **成就 seed** 在 `seed/system/`，**勋章 seed** 在 `seed/demo/`
- **注册成就**：在 `Register` 和 `RegisterWithInvite` handler 中通过 `checker.CheckUser(user.ID)` 自动授予
