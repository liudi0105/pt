# 种子发布与编辑

## 1. 概述
让用户将本地资源以规范方式发布到站点，支持种子文件上传、元数据填写、标签设定；编辑功能允许资源维护者更新描述、分类和元数据。适用于用户发种、发种组批量发布、管理员编辑维护等场景。

## 2. 功能说明

### 2.1 种子发布流程
- **入口**: `public/upload.php`（传统 PHP 页面），提交到 `public/takeupload.php`
- **必填字段**: descr（详细描述）、type（分类 ID）、name（标题）、file（.torrent 文件上传）
- **解析种子文件**: 使用 Bencode 解析器解析 `.torrent`，提取 `info` 字典计算 `info_hash`（SHA1）
- **版本校验**: 拒绝 Bittorrent v2 格式（hybrid 或 v2 only）
- **重复检测**: `Torrent::where('info_hash', $infohash)->exists()`，若已存在则返回重复提示

### 2.2 发布权限与状态
- **权限检查**: `user_can('upload')` 判断用户是否有发布权限
- **免审发布**: 若用户 `offer` 积分 >= 5，资源直接审核通过（visible=yes, banned=no, approval_status=allow）
- **待审核（Pending）**: offer 积分 < 5 时，资源进入待审核队列（offers=yes），等待管理员审批
- **可选字段（特权用户）**: 
  - `hr`: 设置 H&R 模式（需 torrent_hr 权限）
  - `sticky`: 置顶设置（需 torrentsticky 权限）
  - `pick`: 推荐类型（需 torrentmanage 权限）
  - `approval_status_allow`: 免审强制通过（需 torrent-approval-allow-automatic 权限）
  - `price`: 设置种子价格（需 torrent-set-price 权限）

### 2.3 发布后处理
- **文件存储**: 将 `.torrent` 文件写入磁盘 `{$torrent_dir}/{$id}.torrent`
- **文件列表**: 解析种子文件内的 files 列表，逐条写入 `files` 表
- **自定义字段**: 处理分类对应的自定义字段配置
- **标签处理**: 解析并关联 tags 表
- **积分奖励**: 为发布者增加魔力值（karma bonus）
- **搜索引擎同步**: 同步到 Elasticsearch（索引 `nexus_torrents`）或 MeiliSearch（索引 `torrents`）

### 2.4 种子编辑
- **入口**: `public/takeedit.php`（传统 PHP 页面）
- **可编辑字段**: name, descr, small_descr, category, source, medium, codec, standard, processing, team, audiocodec, nfo, cover, technical_info 等
- **限制**: 已审核资源的关键字段修改可能需要重新审核
- **权限**: 发布者本人可编辑，管理员可编辑任意资源
- **日志记录**: 每次编辑写入 `torrent_operation_logs`，action_type=edit

### 2.5 自动促销（Auto Promotion）
- **大体积促销**: 种子文件大小超过配置阈值时自动设为免费（free）
- **随机促销**: 按配置百分比随机为部分新种子设置促销状态
- **促销类型**: 包括免费(Free)、2x上传、2x免费(2XFree)、50%、30%、100% 六种

### 2.6 API 状态
- **Laravel API**: `store` 和 `update` 方法仅为存根（stub），未实现完整的发布编辑逻辑
- **当前发布编辑依赖传统 PHP 路由**

## 3. 操作入口
- **发布页**: `/upload`（浏览器前端页面，对应后端 `public/upload.php`）
- **提交发布**: `POST /takeupload.php`
- **编辑页**: `/torrent/{id}/edit`（对应后端 `public/takeedit.php`）
- **提交编辑**: `POST /takeedit.php`

## 4. 使用说明
1. 进入发布页，选择资源分类（category）
2. 上传 `.torrent` 文件（仅支持 Bittorrent v1 格式）
3. 填写种子标题（name）和详细描述（descr），支持 BBcode 和 HTML
4. 选择来源(Source)、媒介(Medium)、编码(Codec)、分辨率(Standard)等元数据
5. 添加标签（tags）以便分类检索
6. 提交后系统自动检测重复，若 info_hash 已存在则拒绝
7. 发布者 offer 积分 >= 5 时直接公开，否则进入审核队列
8. 编辑时不允许重新上传 `.torrent` 文件；修改关键字段建议描述变更原因

## 5. 配置参考
- **大体积促销阈值**: `config('torrent.promotion_large_size')`，单位字节
- **随机促销概率**: `config('torrent.promotion_random_percent')`，百分比 0-100
- **免审积分阈值**: offer 积分 >= 5 自动免审，可在后台调整
- **种子存储目录**: `config('torrent.torrent_dir')`，默认 `{storage_path}/torrents`
