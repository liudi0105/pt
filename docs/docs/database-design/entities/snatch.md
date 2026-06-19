---
sidebar_position: 4
---

# Snatch 实体

Snatch 负责记录用户完成下载的历史，是完成统计、考核和 H&R 的基础数据。

## 核心字段

根据现有 migration，snatched 的关键字段包括：

- `id`
- `torrentid`
- `userid`
- `ip`
- `port`
- `uploaded`
- `downloaded`
- `to_go`
- `seedtime`
- `leechtime`
- `last_action`
- `startdat`
- `completedat`
- `finished`

## 关系说明

- `torrentid` 关联种子
- `userid` 关联用户
- `torrentid + userid` 唯一表示一次完成记录

## 设计用途

- 记录完成下载
- 统计用户做种和下载历史
- 为 H&R、考核和积分系统提供基础数据
- 为用户历史列表提供数据源

## 索引与约束

- `userid` 索引
- `torrentid + userid` 唯一约束

## 风险点

- 这是历史记录表，增长会很快
- 需要围绕用户和种子做查询优化
- 完成状态和历史时间要可回溯

