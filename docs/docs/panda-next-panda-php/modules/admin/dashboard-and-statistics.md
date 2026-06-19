# 仪表盘与统计

## 1. 概述

为管理员提供站点运行状况的全局视图，包括系统信息、用户统计、种子统计、等级分布和最新活动。适用于日常巡检、运营分析和问题快速感知。

## 2. 功能说明

### 2.1 系统信息

通过 `GET /api/dashboard/system-info` 接口获取：
- Nexus 版本号
- Laravel 版本号
- Filament 版本号
- PHP 版本号
- MySQL 版本号
- 服务器负载（Server Load）

Filament 端以 SystemInfo Widget 展示上述信息的只读表格。

### 2.2 用户统计

通过 `GET /api/dashboard/stat-data` 接口获取 stat_data[user] 分类下的指标：

| 指标 | 说明 |
|------|------|
| total | 用户总数 |
| max | 历史最大用户数 |
| unconfirmed | 未确认用户数 |
| 1d/7d/30d visited | 最近 1/7/30 天访问用户数 |
| VIP | VIP 用户数 |
| donor | 捐赠者数 |
| warned | 警告中用户数 |
| disabled | 已禁用用户数 |
| Gender breakdown | 性别分布 |

Filament 端以 UserStat Widget 展示关键卡片，UserTrend Widget 展示注册趋势图。

### 2.3 种子统计

通过 `GET /api/dashboard/stat-data` 接口获取 stat_data[torrent] 分类下的指标：

| 指标 | 说明 |
|------|------|
| total | 种子总数 |
| dead | 死种数（无做种者） |
| seeders | 做种者总数 |
| leechers | 下载者总数 |
| peers | 连接总数 |
| S/L ratio | 做种/下载比例 |
| active web users | 当前活跃网页用户 |
| active tracker users | 当前活跃 Tracker 用户 |
| total size | 总容量 |
| total uploaded | 总上传量 |
| total downloaded | 总下载量 |

Filament 端以 TorrentStat Widget 展示关键卡片，TorrentTrend Widget 展示种子添加趋势图。

### 2.4 用户等级分布

通过 `GET /api/dashboard/stat-data` 获取 stat_data[user_class] 分类，展示每个用户等级（User Class）下的用户数量。

Filament 端以 UserClassStat Widget 展示等级分布图。

### 2.5 最新活动

- **最新用户**：`GET /api/dashboard/latest-user` — 最近注册的 10 个用户
- **最新种子**：`GET /api/dashboard/latest-torrent` — 最近发布的 5 个种子（包含上传者信息）

Filament 端以 LatestUsers Widget 和 LatestTorrents Widget 展示。

### 2.6 管理员信息

AccountInfo Widget 在仪表盘侧边展示当前登录管理员的基本信息。

## 3. 操作入口

**页面路径：** 后台首页（仪表盘）

**API 端点：**

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/dashboard/system-info` | 系统版本与负载 |
| GET | `/api/dashboard/stat-data` | 聚合统计（用户/种子/等级） |
| GET | `/api/dashboard/latest-user` | 最近 10 名用户 |
| GET | `/api/dashboard/latest-torrent` | 最近 5 个种子 |

**Filament Widgets：**
- SystemInfo Widget — 服务器信息表
- UserTrend Widget — 注册趋势图
- UserStat Widget — 用户统计卡片组
- UserClassStat Widget — 用户等级分布图
- TorrentTrend Widget — 种子添加趋势图
- TorrentStat Widget — 种子统计卡片组
- LatestUsers Widget — 最新用户列表
- LatestTorrents Widget — 最新种子列表
- AccountInfo Widget — 当前管理员信息

## 4. 使用说明

1. 管理员登录后台后默认进入仪表盘首页，所有 Widget 自动加载数据。
2. 统计数据的时效性：stat-data 为实时查询，数据准确度与业务数据库一致。
3. 仪表盘仅作展示用途，不提供数据修改能力。如需执行管理操作，通过对应功能模块进入。
4. 各 Widget 数据相互独立，单个 Widget 加载失败不影响其他模块展示。
5. 最新用户和最新种子列表点击可跳转至对应详情页。

## 5. 配置参考

无独立配置项。统计口径与业务数据库定义一致，无需额外配置。
