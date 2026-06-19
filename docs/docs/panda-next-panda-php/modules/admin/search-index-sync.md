# 搜索索引重建与同步

## 1. 概述

管理种子数据的搜索引擎索引，支持 MeiliSearch 和 Elasticsearch 两种引擎。解决种子搜索的全文检索性能问题，提供全量重建、增量同步和零停机切换能力。

## 2. 功能说明

### 2.1 MeiliSearch 支持

**仓库：** MeiliSearchRepository（567 行）

**Artisan 命令：**
- `meilisearch:import` — 全量导入种子数据到 MeiliSearch
- `meilisearch:stats` — 查看 MeiliSearch 索引状态

**索引配置：**
- 索引名：`torrents`，主键：`id`
- 动态 Swap 策略：先写入临时索引，再原子切换，实现零停机重索引
- 可搜索字段：`name`、`small_descr`、`url`（可选包含 `descr`）
- 过滤字段：`category`、`source`、`medium`、`codec`、`standard`、`processing`、`team` 等
- 排序字段：`id`、`name`、`comments`、`added`、`size`、`leechers`、`seeders` 等

**配置项：**
- `meilisearch.enabled` — 是否启用 MeiliSearch
- `meilisearch.search_description` — 是否将 descr 加入搜索范围
- `meilisearch.default_search_mode` — 默认搜索模式

### 2.2 Elasticsearch 支持

**仓库：** SearchRepository（912 行）

**Artisan 命令：**
- `EsCreateIndex` — 创建索引
- `EsImport` — 导入数据
- `EsDeleteIndex` — 删除索引
- `EsInfo` — 查看 ES 连接与索引信息

**索引配置：**
- 索引名：`nexus_torrents`
- Join 数据类型：parent — `torrent`；children — `bookmark`（收藏）、`tag`（标签）
- 中文分词器：IK Analyzer
- 搜索模式：AND、OR、EXACT 三种模式

**降级策略：**
- ES 不可用时自动降级为数据库查询，保证搜索功能可用

### 2.3 搜索功能公共能力

无论使用哪种搜索引擎，搜索功能均支持：

- 多字段全文检索（名称、副标题、描述）
- 分类/媒介/编码/标准/来源等维度过滤
- 结果排序（按时间、大小、做种数、下载数等）
- 分页返回结果

## 3. 操作入口

**Filament 路径：**
- 系统 → 搜索配置（MeiliSearch/ES 开关与参数配置）

**Artisan 命令：**

| 命令 | 引擎 | 说明 |
|------|------|------|
| `meilisearch:import` | MeiliSearch | 全量导入 |
| `meilisearch:stats` | MeiliSearch | 索引统计 |
| `EsCreateIndex` | Elasticsearch | 创建索引 |
| `EsImport` | Elasticsearch | 全量导入 |
| `EsDeleteIndex` | Elasticsearch | 删除索引 |
| `EsInfo` | Elasticsearch | 连接信息 |

## 4. 使用说明

### 4.1 首次部署

1. 在配置中启用所需搜索引擎（`meilisearch.enabled` 或 ES 连接配置）。
2. 执行索引创建命令（`EsCreateIndex` 或自动创建）。
3. 执行全量导入命令（`meilisearch:import` / `EsImport`）。

### 4.2 日常维护

- **全量重建**：MeiliSearch 使用 import 命令自动执行 Swap 策略，对外查询无中断。Elasticsearch 需先删除旧索引再重建导入。
- **增量同步**：当前版本种子数据变更后通过业务代码实时同步至搜索引擎，无需手动增量操作。
- **状态检查**：通过 `meilisearch:stats` 或 `EsInfo` 查看索引文档数和健康状况。

### 4.3 搜索引擎切换

- 从 MeiliSearch 切换到 ES：关闭 `meilisearch.enabled`，配置 ES 连接参数，执行 ES 索引创建与导入。
- 从 ES 切换到 MeiliSearch：启用 `meilisearch.enabled`，关闭 ES 配置，执行 MeiliSearch import。
- 两者不可同时启用。未启用搜索引擎时自动降级为 DB 搜索。

## 5. 配置参考

| 配置项 | 说明 | 可选值 |
|--------|------|--------|
| `meilisearch.enabled` | 启用 MeiliSearch | true/false |
| `meilisearch.search_description` | 搜索包含 descr 字段 | true/false |
| `meilisearch.default_search_mode` | 默认搜索模式 | and/or/exact |
| ES 连接配置 | Elasticsearch 主机、端口、认证 | 按实际环境配置 |
