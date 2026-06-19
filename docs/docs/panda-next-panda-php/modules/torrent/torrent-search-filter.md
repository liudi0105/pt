# 搜索与筛选

## 1. 概述
为用户提供站内资源定位能力，支持关键词搜索和多维度元数据筛选，结果与资源状态、用户权限保持一致。适用于用户查找资源、管理后台检索、API 对接等场景。

## 2. 功能说明

### 2.1 SearchBox 配置模型
- **模型**: `SearchBox`，表 `searchbox`，按 section 存储搜索框配置
- **section**: browse（浏览页）、special（特殊页面）
- **配置字段**:
  - 开关控制：showsource、showmedium、showcodec、showstandard、showprocessing、showteam、showaudiocodec（控制哪些分类筛选器显示）
  - JSON 扩展：taxonomy_labels（分类标签）、cover display（封面显示配置）、seed box icon（做种盒子图标）
- **API**: `GET /api/search-box` 返回搜索框配置及分类字典项（source、medium、codec 等所有 taxonomy 列表）

### 2.2 搜索后端一：MySQL LIKE
- **模式**: 基础搜索，适用于未开启 Elasticsearch/MeiliSearch 的场景
- **搜索字段**: `name` 和 `small_descr` 的 LIKE 模糊匹配
- **筛选**: 所有分类筛选（category, source, medium, codec, standard, processing, team, audiocodec）做 WHERE 条件
- **排序**: 数据库层 ORDER BY pos_state DESC, added DESC
- **适用**: 小型站点或全文搜索不可用时的回退方案

### 2.3 搜索后端二：Elasticsearch
- **启用条件**: `ELASTICSEARCH_ENABLED=true` 配置
- **索引**: `nexus_torrents`
- **搜索模式**: 
  - AND：关键词全部匹配
  - OR：关键词任一匹配
  - EXACT：精确匹配
- **搜索范围 (areas)**:
  - title(0)：匹配种子标题 name
  - desc(1)：匹配详细描述 descr
  - owner(3)：按发布者搜索
  - imdb(4)：按 IMDB ID 搜索
- **筛选**: 支持所有分类筛选（category, source, medium, codec, standard, processing, team, audiocodec）
- **排序**: name（标题）、comments（评论数）、size（大小）、seeders（做种数）、leechers（下载数）、times_completed（完成数）、added（发布时间）
- **可见性**: 仅返回 `visible=yes` 且 `banned=no` 且 `approval_status=allow` 的资源

### 2.4 搜索后端三：MeiliSearch
- **配置**: 通过 MeiliSearch settings 配置
- **索引**: `torrents`
- **搜索**: 支持同义词、停用词、可排序属性配置
- **筛选**: 支持所有分类筛选
- **同步**: 发布/编辑后自动同步到 MeiliSearch 索引

### 2.5 可见性与权限过滤
- 未公开种子（visible=no, banned=yes, approval_status!=allow）不进入普通用户的搜索结果
- 发布者本人可搜到自己的待审核种子
- 拥有 `seebanned` 权限的管理员可搜索到被封禁种子
- 所有搜索后端遵循统一的可见性规则

## 3. 操作入口
- **搜索框**: 站点顶部搜索栏，支持关键词输入和搜索模式选择
- **筛选区**: 列表页左侧/顶部筛选面板
- **API 搜索框配置**: `GET /api/search-box`
- **API 搜索**: `GET /api/torrents`（标准列表接口，带 query 和 filter 参数即进入搜索模式）

## 4. 使用说明
1. 在搜索框输入关键词（标题或描述），按回车搜索
2. 支持 AND（空格分隔）/ OR（|分隔）/ EXACT（引号包裹）三种模式
3. 从筛选面板选择分类、来源、媒介、编码等条件缩小范围
4. 搜索结果支持按做种数、大小、发布时间等排序
5. 搜索框配置（显示哪些筛选器）由管理员在后台 SearchBox 管理
6. 开启 Elasticsearch 后搜索速度和质量显著提升，支持更丰富的排序维度
