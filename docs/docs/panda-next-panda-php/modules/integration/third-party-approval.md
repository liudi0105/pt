# 第三方审批接入

## 1. 概述

为 NAS Tools 和 IYUU 等外部联动系统提供用户身份审批能力，外部系统通过约定的加密或签名机制验证站内用户身份，获取授权结果，确保授权过程受控且最小化信息暴露。

## 2. 功能说明

### 2.1 NAS Tools 审批 — POST /api/nastools/approve

**认证机制**：对称加密
- 请求体携带 `data` 字段，内容为加密后的 JSON 字符串
- 服务端使用站点密钥解密，解析出 `uid` + `passkey`
- 校验通过后返回完整用户资源

**处理流程**：
1. 接收请求，解密 `data` 获得用户信息
2. 根据 `uid` + `passkey` 定位用户
3. 校验用户状态（用户必须存在且 `enabled=yes`）
4. 校验通过返回用户资源，失败返回错误

### 2.2 IYUU 审批 — GET /api/iyuu/approve

**认证机制**：签名验证
- 请求携带参数：`token`, `id`(uid), `verity`(签名), `passkey`
- `verity` = `md5(token + uid + passkey + secret)`，其中 `secret` 为站点密钥
- 校验通过后返回简单成功标识

**处理流程**：
1. 接收请求，根据用户 `uid` 查找用户 `passkey`
2. 用站点 `secret` 重新计算签名，比对 `verity` 是否匹配
3. 校验用户状态
4. 返回成功/失败结果（不返回详细用户数据）

### 2.3 公共约束
| 约束项 | 说明 |
|--------|------|
| 限流 | 两个接口均配置速率限制，防止滥用 |
| 用户校验 | 必须验证用户存在且 `enabled=yes` |
| 信息最小化 | NAS Tools 返回用户资源，IYUU 仅返回成功/失败 |
| 错误明确 | 签名失败、用户不存在、用户禁用分别返回不同错误 |

### 2.4 对比
| | NAS Tools | IYUU |
|--|-----------|------|
| 方法 | POST | GET |
| 认证 | 加密 JSON 解密 | 签名 md5 比对 |
| 返回 | 用户资源 | 成功/失败 |
| 密钥 | 站点对称加密密钥 | 站点 secret |
| 场景 | 需要完整用户信息的联动 | 仅需确认身份的联动 |

## 3. 操作入口

- `POST /api/nastools/approve` — NAS Tools 审批
- `GET /api/iyuu/approve` — IYUU 审批

## 4. 使用说明

1. NAS Tools 请求时必须使用站点密钥加密 `{uid, passkey}` 为 `data` 字段。
2. IYUU 请求时必须计算正确签名 `md5(token + uid + passkey + secret)` 作为 `verity`。
3. 两个接口的认证机制互相独立，不可混用。
4. 用户被禁用后，审批接口将拒绝通过。
5. 频繁请求触发限流后，客户端需等待后重试。

## 5. 配置参考（可选）

- 站点加密密钥 / `secret`：在系统配置中设置
- 限流阈值：通过 Laravel `throttle` 中间件配置
- Passkey 字段值：来自 `users.passkey` 列
