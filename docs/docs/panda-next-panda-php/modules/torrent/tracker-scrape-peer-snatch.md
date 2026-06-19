# Scrape、Peer 与 Snatch

## 1. 概述
对外提供 Tracker Scrape 协议接口返回种子汇总统计；对内通过 announce 流程持续生成 Peer 运行态数据和 Snatch 完成态历史。适用于客户端批量查询种子状态、用户中心展示个人数据、H&R 和奖励系统消费数据等场景。

## 2. 功能说明

### 2.1 Scrape 接口
- **端点**: `GET /scrape` → `TrackerController@scrape`
- **认证**: 同 announce 流程，使用 passkey/authkey 认证用户身份并执行客户端检测
- **请求参数**: 支持多个 `info_hash` 参数，批量查询多个种子
- **响应格式**: BEncoded 字典，格式标准 Tracker Scrape 协议
- **返回字段**（每个 info_hash）:
  - `complete`: 当前做种者数量（对应 Torrent.seeders）
  - `incomplete`: 当前下载者数量（对应 Torrent.leechers）
  - `downloaded`: 累计完成次数（对应 Torrent.times_completed）

### 2.2 Peer 数据生命周期
- **创建**: announce `event=started` 时，在 peers 表插入新记录，唯一键 `(torrent, peer_id)`
- **更新**: 每次 announce 覆盖 ip/port/agent/uploaded/downloaded/to_go/seeder/last_action 等字段
- **删除**: announce `event=stopped` 时删除对应 Peer 记录
- **离线**: 客户端不再上报后，Peer 记录不再存在（不保留历史连接）

### 2.3 Snatch 数据生命周期
- **创建**: 用户首次 announce 到某个种子时，系统调用 `updateSnatch` 创建 snatch 记录
  - 设置初始 uploaded/downloaded 为用户报告的值
  - 记录 startdat 为首次 announce 时间
- **更新**: 每次 announce 使用 delta 差值增量累加上传/下载量
  - 上传增量 = 当前报告 uploaded - 上次记录 uploaded
  - 下载增量 = 当前报告 downloaded - 上次记录 downloaded
- **做种/下载时间累积**: 基于当前 announce 时间与 last_action 的时间差
  - 若 `seeder=yes`，差值计入 seedtime
  - 若 `seeder=no`，差值计入 leechtime
- **完成标记**: `event=completed` 时设置 `completedat` 为当前时间、`finished=yes`
- **唯一性**: 每个 `(userid, torrentid)` 一条总记录，不拆分每次会话

### 2.4 Scrape 数据源
- **complete**(seeders): 当前 peers 表中 `seeder=yes` 且关联的 torrent_id 匹配的去重计数
- **incomplete**(leechers): 当前 peers 表中 `seeder=no` 且关联的 torrent_id 匹配的去重计数
- **downloaded**: Torrent 表的 `times_completed` 字段值

### 2.5 查询差异
- **Scrape 接口**: 轻量级汇总，仅返回三个计数，用于客户端快速获取种子整体状态
- **Peer API** (`GET /api/peers`): 返回每个 Peer 的详细信息（用户、客户端、进度、上传/下载量）
- **Snatch API** (`GET /api/snatches`): 返回每个用户的完成历史（做种时间、完成时间、分享率）

## 3. 操作入口
- **Scrape 请求**: `GET /scrape?info_hash={hash1}&info_hash={hash2}...`（客户端调用）
- **Peer 查询 API**: `GET /api/peers?torrent_id={id}`
- **Snatch 查询 API**: `GET /api/snatches?torrent_id={id}`
- **用户中心**: 个人做种/下载/完成列表

## 4. 使用说明
- 客户端通过 `scrape` 接口批量查询种子状态，减少对 announce 的依赖
- 一个种子可同时被多个用户做种，每个用户可建立多个 Peer 连接
- 完成事件由客户端上报，但不完全可信；系统结合数据变化进行二次验证
- Scrape 汇总数据与详情页显示的 seeders/leechers/完成数保持一致
- Snatch 记录是 H&R 考核的输入源，做种时间不满足要求时会触发 H&R 警告
- 魔方奖励系统消费 Snatch 的做种时间数据计算魔力值
- Peer 数据为实时运行态，断开即消失；Snatch 为历史归档态，长期保存
- 因避免重复完成记录，同一个种子同用户只会有一条 Snatch 记录
