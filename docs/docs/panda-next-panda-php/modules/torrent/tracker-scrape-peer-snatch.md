# Scrape、Peer 与 Snatch

## 功能目标

对外提供资源统计，对内固化在线状态和完成记录两类关键事实。

## 参与角色

- BitTorrent 客户端
- Tracker 服务
- 管理员

## 入口

- `/scrape`
- Peer 查询接口
- Snatch 查询接口

## 前台功能

- 查看做种、下载、完成等汇总结果

## 后台功能

- 查询 Peer 当前状态
- 查询 Snatch 历史记录

## 状态定义

- Peer 在线
- Peer 离线
- Snatch 已完成
- Snatch 历史保留

## 状态流转

1. Scrape 返回资源统计
2. Announce 持续刷新 Peer
3. 满足完成条件时写入 Snatch
4. Peer 可过期或离线，Snatch 作为历史事实保留

## 规则与校验

- Scrape 统计口径必须与 Peer/Snatch 一致
- Peer 偏运行态，Snatch 偏历史态
- 完成记录不能依赖前端主观提交

## 异常与边界

- Peer 重复上报
- Snatch 重复生成
- Scrape 查询不存在种子

## 数据结果

- Scrape 汇总结果
- Peer 在线状态
- Snatch 完成历史

## 验收标准

- Scrape 数值与 Peer/Snatch 数据口径一致
- Peer 和 Snatch 在生命周期和用途上分层明确
- Snatch 可稳定作为奖励、考核和 H&R 输入
