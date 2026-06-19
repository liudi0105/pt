# 评论、感谢与书签

## 1. 概述

提供用户对种子资源的三种互动能力：评论、感谢和书签。用于形成内容反馈、用户活跃度数据和个性化偏好记录。

## 2. 功能说明

### 2.1 评论

参见《评论治理与内容审核》完整说明。简要要点：

- 支持对种子、求种、邀约三种对象发表评论。
- 评论时发送通知给目标资源所有者（若其设置了 `commentpm='yes'`）。
- 评论作者可获得积分奖励。

### 2.2 感谢

用户对种子资源表达感谢，系统记录并发放双向奖励。

- 数据模型 `Thank`：字段 `torrentid`、`userid`，表 `thanks`。
- 前置校验：不能感谢自己发布的种子、不能重复感谢、种子和种子发布者状态必须正常。
- 奖励发放（在事务中执行，使用乐观锁控制并发）：
  - 感谢者获得 `saythanks` 积分奖励。
  - 种子发布者获得 `receivethanks` 积分奖励。
- API：`GET /api/thanks?torrent_id=X`（查询某种子收到的感谢）、`POST /api/thanks`（执行感谢）。

### 2.3 书签

用户收藏感兴趣的种子资源，方便后续查找和追踪。

- 数据模型 `Bookmark`：字段 `userid`、`torrentid`，表 `bookmarks`。
- 前置校验：种子状态必须正常、不能重复收藏。
- API：`POST /api/bookmarks`（添加书签）、`DELETE /api/bookmarks/{torrentId}`（移除书签）。

## 3. 操作入口

- 种子详情页：查看评论列表、点击感谢按钮、添加/移除书签
- 用户中心互动记录区：查看自己的感谢记录和书签列表
- API：
  - `POST /api/comments` — 发布评论
  - `GET /api/thanks?torrent_id=X`、`POST /api/thanks` — 感谢
  - `POST /api/bookmarks`、`DELETE /api/bookmarks/{torrentId}` — 书签管理

## 4. 使用说明

1. 感谢和书签均不可重复操作，系统会校验唯一约束。
2. 感谢发放积分奖励使用乐观锁，高并发下不会重复发放。
3. 删除书签不会影响种子做种数据。
4. 评论支持编辑，编辑后保留原始文本用于审计。

## 5. 配置参考

| 配置项 | 说明 |
|--------|------|
| `saythanks` | 感谢者获得积分值，由 BonusRepository 管理 |
| `receivethanks` | 种子发布者收到感谢时的积分值，由 BonusRepository 管理 |
