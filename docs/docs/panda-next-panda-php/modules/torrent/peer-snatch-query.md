# Peer 与 Snatch 查询

## 1. 概述
定义站点如何查询 Peer 运行态和 Snatch 完成态数据，为用户中心、种子详情、统计报表、H&R 考核和奖励系统提供统一数据源。

## 2. 功能说明

### 2.1 Peer 数据
- **表**: `peers`
- **字段**: torrent, peer_id, ip, port, uploaded, downloaded, to_go, seeder, started, last_action, prev_action, connectable, userid, agent, finishedat, downloadoffset, uploadoffset, passkey, ipv4, ipv6, is_seed_box
- **API**: `GET /api/peers?torrent_id={id}`
- **分组**: 按 `seeder=yes/no` 分为做种者(Seeders)和下载者(Leechers)
- **返回字段**: connectable_text（是否可连接）、upload_text（上传量文本）、download_text（下载量文本）、share_ratio（分享率）、download_progress（下载进度）、connect_time_total（总连接时长）、last_action_human（最后活动时间）、agent_human（客户端描述）、user（用户信息）
- **唯一性**: 每个 `(torrent, peer_id)` 唯一一条记录；stopped 事件时删除

### 2.2 Snatch 数据
- **表**: `snatched`
- **字段**: torrentid, userid, ip, port, uploaded, downloaded, to_go, seedtime, leechtime, last_action, startdat, completedat, finished
- **API**: `GET /api/snatches?torrent_id={id}`
- **返回字段**: upload_text（上传量）、download_text（下载量）、share_ratio（分享率）、seed_time（做种时间）、leech_time（下载时间）、completed_at_human（完成时间）、last_action_human（最后活动）、user（用户信息）
- **唯一性**: 每个 `(userid, torrentid)` 一条总记录，每次 announce 更新增量

### 2.3 数据生成机制
- **Peer**: 由 announce 流程创建和更新——started 事件创建新 Peer，completed/空事件更新状态，stopped 事件删除
- **Snatch**: announce 流程的 updateSnatch 步骤中创建/更新——首次 announce 创建，后续累计上传/下载/做种时间
- **完成事件**: client 发送 `event=completed` 时设置 `completedat` 和 `finished=yes`

### 2.4 查询权限
- **普通用户**: 仅可查询自己的 Peer 和 Snatch 数据
- **管理员**: 可按 torrent_id、userid、时间范围等条件过滤查询任意数据
- **种子详情页**: 公开显示该种子的做种者/下载者列表（匿名用户可隐藏身份）

## 3. 操作入口
- **用户中心做种列表**: `/my/seeding`——当前用户正在做种的种子
- **用户中心下载列表**: `//my/downloading`——当前用户正在下载的种子
- **用户中心完成记录**: `/my/snatched`——当前用户的历史完成记录
- **种子详情 Peer**: `/torrent/{id}` → Peers 标签页——该种子的实时连接状态
- **API Peer 查询**: `GET /api/peers?torrent_id={id}`
- **API Snatch 查询**: `GET /api/snatches?torrent_id={id}`

## 4. 使用说明
- Peer 数据反映实时在线状态，Peer 断开后数据不再保留
- Snatch 数据是累计历史记录，每次 announce 增量更新
- 做种时间(seedtime)和下载时间(leechtime)由 announce 的间隔时间累积计算
- H&R 考核基于 Snatch 的做种时间是否满足要求
- 魔力值奖励系统消费 Snatch 的做种时间和种子整体数据
- 用户分享率计算基于 Snatch 的累计上传/下载量
- 匿名做种时用户身份不在详情页公开显示，但管理员后台可见
