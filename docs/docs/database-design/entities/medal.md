---
sidebar_position: 9
---

# Medal 实体

Medal 负责站点勋章定义和用户持有关系。

## 核心字段

根据现有 migration，medals 的关键字段包括：

- `id`
- `name`
- `get_type`
- `description`
- `image_large`
- `image_small`
- `price`
- `duration`
- `created_at`
- `updated_at`

## 关系说明

- `user_medals` 关联用户与勋章

## 设计用途

- 勋章商城或发放规则
- 展示用户身份和荣誉
- 形成长期激励体系

## 风险点

- 勋章定义要稳定
- 有效期和价格要可配置
- 用户持有状态不要和定义混写

