# 种子列表与详情

## 1. 概述
提供站点资源浏览主入口，让用户发现种子、查看完整描述、文件列表、互动信息（评论、感谢、书签）并进入下载流程。适用于首页种子列表、分类浏览、个人种子列表等场景。

## 2. 功能说明

### 2.1 种子列表
- **接口**: `GET /api/torrents`
- **返回字段**: id, name, filename, small_descr, comments, size_human, added, added_human, ttl, leechers, seeders, times_completed, numfiles, sp_state, sp_state_real, promotion_info, hr, pick_type, pick_time, pick_info, download_url, user, anonymous, basic_category, tags, thanks, reward_logs, cover
- **默认排序**: `pos_state DESC, added DESC`（置顶资源优先，按发布时间倒序）
- **分页**: 标准 Laravel paginate，每页数量由配置决定

### 2.2 列表筛选
- **分类筛选**: category（主分类 ID）、category_mode（分类模式）
- **元数据筛选**: source（来源）、medium（媒介）、codec（编码）、audio_codec（音频编码）、standard（分辨率/标准）、processing（制作组处理）、team（制作组/字幕组）
- **搜索**: query 参数模糊匹配 `name` 和 `small_descr` LIKE 查询
- **发布者筛选**: owner 参数按用户 ID 过滤

### 2.3 种子详情
- **接口**: `GET /api/torrents/{id}`
- **额外返回字段**（对比列表）:
  - `description`: 详细描述（HTML 格式，含 BBcode 渲染内容）
  - `images`: 种子截图/图片列表
  - `thank_users_count`: 感谢人数
  - `peers_count`: 当前 Peer 连接数
  - `reward_logs_count`: 奖励记录数
  - `is_bookmarked`: 当前用户是否已收藏
  - `bonus_reward_values`: 种子的魔力值奖励配置

### 2.4 关联数据
- **Torrent Model** (`app/Models/Torrent.php`, 表 `torrents`): id, name, filename, save_as, descr, small_descr, ori_descr, category, source, medium, codec, standard, processing, team, audiocodec, size, added, type, numfiles, owner, nfo, sp_state, promotion_time_type, promotion_until, anonymous, url, pos_state, cache_stamp, picktype, picktime, last_reseed, pt_gen, technical_info, cover, leechers, seeders, last_action, times_completed, approval_status, banned, visible, pos_state_until, price, offers
- **Eloquent 关联**: user（发布者）、bookmarks（收藏）、thanks（感谢记录）、thank_users（感谢用户列表）、peers（做种/下载 Peer）、snatches（完成记录）、files（文件列表）、basic_category/source/media/codec/standard/processing/team/audio_codec（分类字典）、tags（标签）、reward_logs（奖励日志）、operationLogs（操作日志）

### 2.5 资源状态控制
- **visible**: `Torrent::VISIBLE_YES(1)` / `VISIBLE_NO(0)`，控制是否在公开列表显示
- **banned**: `Torrent::BANNED_YES(1)` / `BANNED_NO(0)`，控制是否被禁用
- **approval_status**: 三种状态——NONE(0) 未审核 / ALLOW(1) 审核通过 / DENY(2) 审核拒绝
- **pos_state**: 三种置顶状态——Normal(0) / Sticky1(1) / Sticky2(2)
- **pick_type**: 推荐类型——normal(0) / hot(1) / classic(2) / recommended(3)
- **sp_state**: 促销状态，7 种类型（普通/免费/2x/2x免费/50%/30%/100%）
- **hr**: `HR_YES(1)` / `HR_NO(0)`，是否启用 H&R 考核

### 2.6 可见性规则
- 列表仅返回 `visible=yes` 且 `banned=no` 且 `approval_status=allow` 的种子
- 发布者本人可在列表看到自己的待审核种子
- 拥有 `seebanned` 权限的用户可看到被禁用种子
- 详情页可见性规则与列表一致

## 3. 操作入口
- **列表页**: `/torrents`（浏览器前端路由）
- **详情页**: `/torrent/{id}`（浏览器前端路由）
- **API 列表**: `GET /api/torrents`
- **API 详情**: `GET /api/torrents/{id}`
- **用户中心关联**: 用户发布的种子列表、收藏列表、做种/下载列表

## 4. 使用说明
- 列表页默认展示所有公开种子，按置顶和发布时间排序
- 可通过分类导航栏切换不同分类视图
- 使用筛选面板按来源、媒介、编码等元数据收窄结果
- 点击种子标题进入详情页查看描述、文件、评论和 Peer 信息
- 非公开种子（待审核/被拒绝/被封禁）不会出现在普通用户搜索结果和列表中
