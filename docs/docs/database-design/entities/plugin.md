---
sidebar_position: 10
---

# Plugin 实体

Plugin 负责插件生命周期和状态管理，是站点能力扩展的承载体。

## 核心字段

根据现有 migration，plugins 的关键字段包括：

- `id`
- `display_name`
- `package_name`
- `remote_url`
- `installed_version`
- `description`
- `status`
- `status_result`
- `created_at`
- `updated_at`

## 设计用途

- 插件安装和卸载
- 版本更新
- 状态跟踪
- 扩展能力注册

## 风险点

- 插件状态需要可恢复
- 远程地址和版本要可追踪
- 插件失败结果要保留

