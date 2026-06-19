# 评论治理与内容审核

## 1. 概述

为用户提供围绕资源（种子、求种、邀约）的评论能力，同时支持管理员对评论进行治理。解决用户互动反馈与站点秩序之间的平衡问题。

## 2. 功能说明

### 2.1 评论发布

用户可对种子（`torrent`）、求种（`request`）和邀约（`offer`）三种业务对象发表评论。

- 数据模型 `Comment`：字段 `user`、`torrent`（关联对象 ID，按 type 区分）、`added`、`text`、`ori_text`、`editedby`、`editdate`、`offer`、`request`、`anonymous`。
- 评论创建后，系统递增目标对象的评论计数。
- 系统调用 `BonusRepository` 给评论作者发放积分奖励。
- 若目标资源的所有者开启了评论通知（`commentpm='yes'`），系统自动发送站内信通知该用户。

### 2.2 评论编辑

- 评论作者和系统管理员可编辑已发布的评论。
- 编辑时记录操作人 `editedby` 和编辑时间 `editdate`。
- 原始文本保留在 `ori_text` 字段，支持审计追溯。

### 2.3 用户治理通信

系统不设独立的审核工作流，审核治理能力通过以下途径实现：

- **StaffMessage 模型**（表 `staffmessages`）：用户向管理组发送消息，管理员可回复，形成用户-管理组之间的双向通信通道。
- **用户 Modcomment**：管理员在治理用户（封禁/解封/警告）时填写治理备注，备注内容写入用户的 `modcomment` 字段。
- **用户封禁日志**（`UserBanLog`）：记录封禁/解封操作的时间、操作人和原因。

### 2.4 评论数据接口

- `GET /api/comments?torrent_id=X` — 获取指定资源的评论列表
- `POST /api/comments` — 发布新评论
- 支持通过 `torrent_id`、`request_id`、`offer_id` 参数筛选不同类型的评论

## 3. 操作入口

- 资源详情页评论区：用户查看和发表评论
- 后台用户管理：管理员查看 StaffMessage 和处理用户投诉
- API：`GET /api/comments?torrent_id=X`、`POST /api/comments`

## 4. 使用说明

1. 评论必须绑定明确的业务对象（torrent/request/offer），系统通过类型字段区分。
2. 评论发布即刻生效，当前版本无独立"待审核"状态。
3. 评论支持匿名发布（`anonymous=1`），匿名评论在前台不显示作者身份。
4. 管理员编辑评论会覆盖 `editedby` 和 `editdate`，`ori_text` 保留原始内容。
5. 用户向管理组发送消息通过 StaffMessage 渠道，不占用评论系统。

## 5. 配置参考

无独立配置项。评论通知偏好由用户个人设置 `commentpm` 字段控制（yes/no）。
