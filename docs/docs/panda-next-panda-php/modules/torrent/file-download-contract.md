# 文件与下载契约

## 1. 概述
定义用户下载 `.torrent` 文件的入口和权限校验流程，确保只有合法用户才能获取有效种子文件。适用于用户在详情页点击下载、通过 RSS/API 自动下载等场景。

## 2. 功能说明

### 2.1 认证方式（按优先级）
- **downhash 参数**: 格式为 `{uid}|{encrypted_hash}`，hash 使用 Hashids 库加密，密钥 = `md5(passkey . date(Ymd) . uid)`。哈希值每日变化，当日有效。
- **passkey + id 参数**: 当 `torrent.download_support_passkey=yes` 时启用，通过 passkey 识别用户身份
- **Cookie 认证**: 基于 Web 会话，用户需已登录

### 2.2 权限检查
- **用户状态**: `downloadpos != no`（下载权限未被禁用）、`enabled=yes`（账号未被禁用）、`not parked`（账号未冻结）
- **种子状态**: torrent 未被 banned（除非用户有 `seebanned` 权限）
- **审核状态**: torrent 已通过审核（approval_status=allow），除非用户是发布者或拥有 `seebanned` 权限
- **付费种子**: 调用 `can_access_torrent()` 检查用户是否已满足付费条件

### 2.3 种子文件处理
- **读取**: 从磁盘 `{$torrent_dir}/{$id}.torrent` 读取种子文件内容
- **注入 Passkey**: 将用户 passkey 写入 announce URL（替换原有 announce 地址）
- **缓存**: 缓存 authkey→passkey 映射关系，避免重复计算
- **响应**: 返回 BEncoded 格式的 `.torrent` 二进制数据

### 2.4 下载入口
- **入口文件**: `public/download.php`（传统 PHP 入口）
- **参数**: `id`（种子 ID）或 `downhash`（加密下载令牌）
- **passkey 下载**: 通过 RSS 订阅或外部下载工具传递 passkey + id

## 3. 操作入口
- **Web 下载**: 种子详情页"下载"按钮 → `download.php?id={torrent_id}`
- **Passkey 下载**: `download.php?passkey={passkey}&id={torrent_id}`（需开启 passkey 下载支持）
- **加密下载**: `download.php?downhash={uid}|{hash}`（用于外部工具免登录下载）

## 4. 使用说明
- 普通用户在详情页点击下载按钮即可获取种子文件
- 下载时系统自动将用户的 passkey 注入种子文件的 announce URL
- 种子文件每日下载链接（downhash）加密密钥随日期变化，不可复用隔日链接
- 若种子被禁用或下架，下载时返回错误提示
- 付费种子需先购买或满足条件才能下载
- 管理员和发布者可以下载自己的种子，不受审核状态限制
- 下载记录计入站点统计和用户数据

## 5. 配置参考
- **passkey 下载开关**: `config('torrent.download_support_passkey')`，控制是否允许通过 passkey+id 下载
- **种子存储目录**: `config('torrent.torrent_dir')`，种子文件物理存储路径
