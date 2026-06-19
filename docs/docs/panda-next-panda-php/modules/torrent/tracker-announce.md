# Tracker Announce

## 1. 概述
持续接收 BitTorrent 客户端的上报请求，维护用户在种子上的实时连接、进度和流量状态，支撑 Peer 管理、Snatch 累积、H&R 考核和风控系统。适用于所有客户端的周期性 announce 和事件上报。

## 2. 功能说明

### 2.1 请求入口与路由
- **端点**: `GET /announce`
- **处理**: `TrackerController` → `TrackerRepository`
- **废弃提示**: TrackerController 默认抛出 "Deprecated! Please announce to: " + `DEFAULT_TRACKER_URI`，但代码逻辑完整可用
- **协议**: 标准 BitTorrent Tracker HTTP 协议

### 2.2 字段校验
- **info_hash + peer_id**: 各 20 字节，必须为二进制数据
- **port**: 1-65535，黑名单端口 22/53/80/81/443 等被拒绝
- **uploaded/downloaded/left**: 整型数值，表示累计上传/下载/剩余字节
- **event**: 支持 started/completed/stopped/paused/空值五类
- **numwant**: 请求 Peer 数量上限，最大 50

### 2.3 用户认证
- **authkey**: 格式 `{torrent_id}|{uid}|{hash}`，基于用户 passkey 和种子 ID 生成
- **passkey**: 32 字符 MD5 字符串，用户的唯一标识
- **校验**: 检查用户 enabled=yes、not parked、downloadpos != no

### 2.4 客户端检测
- **阻止浏览器爬虫**: 通过 User-Agent 正则匹配，拦截非 BT 客户端
- **阻止缺少 UA**: 无 User-Agent 头的请求被拒绝
- **阻止 HTTP 头特征**: 检测 Accept-Language、Referer、Accept-Charset、Want-Digest 等浏览器特有头
- **客户端白名单**: 检查客户端是否在允许列表中

### 2.5 种子校验
- **查找**: 通过 info_hash（可缓存 60 秒）定位 Torrent 记录
- **状态检查**: banned 种子拒绝、unapproved 种子拒绝（除非用户有 seebanned 权限）

### 2.6 重复上报检测
- **Redis 锁**: 以请求的 query string 为 key，防止短时间内重复上报

### 2.7 Peer 限制
- **做种上限**: 每个用户每个种子最多 3 个做种连接
- **下载上限**: 每个用户每个种子最多 1 个下载连接

### 2.8 分享率与连接控制
- **VIP 豁免**: VIP 用户和捐赠者不受限制
- **等待系统**: 分享率 < 0.4 时等待 24 小时；按分享率阶梯设定等待时间
- **并发槽限制**: 基于分享率等级设定最大并发连接数

### 2.9 最小间隔
- **min_interval**: 300 秒，客户端两次 announce 之间至少间隔 5 分钟

### 2.10 作弊检测
- **配置等级**: 风控级别可配置
- **必定作弊**: 上传速度 > 1024MB/s 且单次上传 > 1GB → 自动禁用用户
- **疑似作弊**: 上传速度 > 100MB/s → 标记为疑似

### 2.11 SeedBox 检测
- **启用条件**: 配置开启且用户非 VIP/非捐赠者
- **检测**: 上传速度超过阈值 → 禁用该用户下载权限

### 2.12 流量计算
- **促销倍率**: 应用种子的 promotion 倍率（免费/2x/50% 等）
- **捐赠加成**: 捐赠者额外上传加成
- **SeedBox 状态**: SeedBox 用户可能有不同的倍率策略

### 2.13 Peer 更新
- **stopped 事件**: 删除 Peer 记录
- **其他事件**: 更新 ip/port/agent/to_go/seeder/uploaded/downloaded 字段

### 2.14 Snatch 更新
- **不存在则创建**: 首次 announce 插入新 snatch 记录
- **增量更新**: 上传/下载量使用 delta 差值累加
- **做种/下载时间**: 基于当前时间与 last_action 的时间差累加

### 2.15 Torrent 统计更新
- **重新计算**: 根据 peers 表统计当前 seeders 和 leechers 数量

### 2.16 H&R 考核
- **模式检查**: 种子 HR 模式启用时，在 stopped/completed 事件触发 H&R 记录创建

### 2.17 响应生成
- **interval**: 客户端下次 announce 间隔
- **seeders/leechers**: 当前做种/下载人数
- **peers**: 可选的 Peer 列表，支持 compact 和 no_peer_id 模式

### 2.18 用户流量更新
- **原子操作**: 更新用户表的 uploaded/downloaded 总量

## 3. 操作入口
- **客户端请求**: `GET /announce`（标准 Tracker 协议）
- **控制器**: `TrackerController@announce`
- **处理仓储**: `TrackerRepository`

## 4. 使用说明
- 客户端使用 Tracker URL 格式：`http://{site_url}/announce?passkey={user_passkey}`
- announce 间隔由服务器返回的 `interval` 字段决定，不可小于 300 秒
- 客户端应正确上报 event 类型（started/stopped/completed）
- 黑名单端口（22/53/80/81/443）的连接将被拒绝
- 作弊行为会被自动检测并禁用账号
- 分享率过低的用户会受到等待时间和并发槽限制
- H&R 种子在 stopped 或 completed 时触发考核记录

## 5. 配置参考
- **默认 Tracker URI**: `config('tracker.default_uri')`
- **最小间隔**: `config('tracker.min_interval')`，默认 300 秒
- **端口黑名单**: `config('tracker.blacklist_ports')`
- **客户端白名单**: `config('tracker.allowed_clients')`
- **作弊检测等级**: `config('tracker.cheat_level')`
- **SeedBox 检测开关**: `config('tracker.seedbox_check_enabled')`
- **SeedBox 速度阈值**: `config('tracker.seedbox_speed_threshold')`
