# 种子审核

## 1. 概述
控制资源进入公开流通的质量门槛，由审核员决定种子是否通过、拒绝或退回待修改。适用于发布后进入审核队列的种子，以及审核员的后台审核操作。

## 2. 功能说明

### 2.1 审核状态模型
- **NONE(0)**: 未审核——种子初始状态，banned=no, visible=yes，不公开显示但发布者可见
- **ALLOW(1)**: 审核通过——种子公开，进入列表和搜索
- **DENY(2)**: 审核拒绝——种子被封禁，退回发布者修改

### 2.2 审核通过
- **权限**: `user_can('torrent-approval', true)`
- **操作**: 设置 `banned=no, visible=yes, offers=no`
- **时间更新**: 更新 `added` 字段为当前时间（重新排列发布时间顺序）
- **促销延期**: 延长 `promotion_until` 时间（基于配置的审核通过促销时长）
- **积分奖励**: 发布者 offer 积分 +1，上限 15 分（达到后可免审发布）

### 2.3 审核拒绝
- **操作**: 设置 `banned=yes, visible=yes, offers=yes`（重新进入待审核队列）
- **积分扣减**: 发布者 offer 积分 -1
- **权限封禁**: 若 offer 积分 < -5，自动禁用用户上传权限
- **拒绝原因**: 关联 `TorrentDenyReason` 模型（name 原因名称、hits 命中次数、priority 排序权重）
- **通知**: 通过站内 PM 通知发布者审核拒绝原因

### 2.4 回退到未审核
- **操作**: 设置 `banned=no, visible=yes`，清除审核状态
- **使用场景**: 需要重新审核的资源

### 2.5 审核日志
- **模型**: `TorrentOperationLog`，记录所有审核动作
- **字段**: action_type（approval_none/allow/deny/edit/delete）、uid（操作人）、torrent_id、comment（备注）
- **审计**: 所有审核操作可追溯，供管理后台查询

### 2.6 拒绝原因管理
- **TorrentDenyReason 表**: name（原因描述）、hits（使用次数统计）、priority（显示排序）
- **驳回时**: 审核员从预配置原因列表中选择，也可填写自定义备注

## 3. 操作入口
- **审核列表页**: `GET /web/torrent-approval-page`——展示待审核种子列表
- **审核日志页**: `GET /web/torrent-approval-logs`——查看历史审核记录
- **审核操作**: `POST /web/torrent-approval`——提交通过/拒绝/回退操作
- **API 权限**: 所有审核接口需 `user_can('torrent-approval', true)` 授权

## 4. 使用说明
1. 审核员进入审核列表页（`/web/torrent-approval-page`）
2. 查看待审核种子的描述、文件列表、发布者信息
3. 点击"通过"——种子立即公开，发布者 offer 积分 +1
4. 点击"拒绝"——选择拒绝原因，种子退回待修改，发布者 offer 积分 -1
5. 审核通过后可再次审核（revert to none）回退状态
6. 发布者可在审核日志页查看审核结果和历史记录
7. 若用户 offer 积分低于 -5，自动失去发布权限，需管理员手动恢复
