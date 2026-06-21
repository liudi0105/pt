# Web 约束 — AI Agent 指令

## TorrentList 种子列表页

- **排序**：使用单个 `Select` 组件，选中项即为标签（"最新"/"最多做种"）
- **"高级搜索" 按钮**：始终显示文字"高级搜索"，展开时 `type="primary"`
- **促销筛选**：多选 `Select`，标签为"促销"，选项含免费/2X
- **URL 同步**：所有筛选条件通过 TanStack Router 的 `navigate({ to, params, search })` 同步到 URL

## 导航

- **Forum** 导航项必须在顶部菜单首位（`menuSort: 5`）

## 样式与组件

- **优先使用 Ant Design 组件**，最小化内联 `style` 属性
- **Profile 页**：`Card` + `Descriptions` + `Space`，极少内联样式
- **勋章/成就图标**：使用 Lucide 图标，集中定义在 `web/src/constants/icons.tsx`
  - `getMedalIcon(code, dbIcon?)` / `getAchievementIcon(code, dbIcon?)` 返回 `LucideIcon` 组件
  - 渲染方式：`{(() => { const Icon = getMedalIcon(m.code, m.image); return <Icon size={48} color={c} /> })()}`
  - 优先使用 DB 字段（`image`/`icon`/`color`），回退到硬编码映射
- **解锁状态**：通过 `Tag` 颜色区分（绿色=已解锁），不通过图标切换
- **图标选择器**：使用 `components/IconPicker.tsx`（搜索式 Lucide 图标网格），替代普通 Input
- **颜色选择器**：使用 `components/ColorPickerField.tsx`（封装 Ant Design ColorPicker），替代普通 Input
- **动态图标解析**：`iconRegistry[name: string]` 按名称查找 LucideIcon 组件
- **颜色字段**：`color` 存储十六进制颜色字符串（如 "#1890FF"），在 `constants/icons.tsx` 中有备用映射

## i18n

- **勋章 i18n**：从 API 响应 `m.i18n?.[lang]?.label` 读取（handler 中从 `sys_i18n` 表加载）
- **成就名**：`tCommon('achievements.{code}')`，**描述**：`tCommon('achievementDescriptions.{code}')`
- **勋章相关 key**：`medal.wear` / `medal.wearing` / `medal.unwear` / `medal.unwearing` / `medal.confirmBuy`
- **所有展示文本**必须走 i18n，不得硬编码

## 状态管理

- **勋章购买**：共享一个 `useMutation`，加载状态按 ID 追踪：`buyMut.variables === m.id`
- **佩戴/取消佩戴**：各自 `useMutation`，同样按 ID 追踪：`wearMut.variables === m.id`

## TanStack Router 使用

- **读取 search params**：`useSearch({ from: routeId })` 或 `Route.useSearch()`，无需 `as` 转型
- **导航更新 search**：`navigate({ to: routePath, params: { lang }, search: { ... } as any })`
  - `as any` 用于多字段 search 的类型逃逸，保持 `to` + `params` 提供路由类型安全
- **路由定义**：`validateSearch` 返回的类型即为该路由的 search 类型

## 按钮文字规范

- **购买**："购买"（`Popconfirm` 确认，`type="primary"`）
- **佩戴**："穿戴"（默认样式）
- **取消佩戴**："取消佩戴"（默认样式）
- **原则**：动作为准，非状态（不用"已佩戴"）

## 表单布局

- **所有 Form 必须使用水平布局**（`layout="horizontal"`，即不传 `layout` 属性）
- **必须设置 `labelCol={{ style: { width: <px> } }}`**，宽度视场景：
  - 登录/注册：`80px`
  - 一般页面表单：`100px`
  - 用户设置：`120px`
  - Admin 弹窗：`110px`
- **禁止使用 `layout="vertical"`**，除非有明确理由并注释说明
- **Login/Register 的 Form.Item 必须加 `label` 属性**，不能仅依靠 placeholder
