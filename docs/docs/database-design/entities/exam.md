---
sidebar_position: 7
---

# Exam 实体

Exam 负责站点考核规则定义、用户参与关系和进度控制。

## 核心字段

根据现有 migration，exams 的关键字段包括：

- `id`
- `name`
- `description`
- `begin`
- `end`
- `duration`
- `filters`
- `indexes`
- `status`
- `is_discovered`
- `created_at`
- `updated_at`

## 关系说明

- `exam_users` 关联用户和考核
- `exam_progress` 记录进度

## 设计用途

- 发布考核任务
- 判断用户是否满足条件
- 跟踪进度和结论
- 支撑考核自动化

## 风险点

- 规则配置和结果状态必须分离
- 考核进度通常要可计算和可快照
- 定时检查依赖清晰的时间字段

