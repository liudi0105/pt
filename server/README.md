# Server 后端

Go + Gin + GORM + MySQL 的 PT 站点后端。

## 技术选型

| 用途 | 选型 |
|---|---|
| HTTP 框架 | Gin |
| ORM | GORM |
| 数据库 | MySQL 8 |
| 认证 | JWT (golang-jwt) |
| Seed 数据 | JSONL 文件 |
| 成就引擎 | 自研 Checker（条件式） |
| Markdown 渲染 | goldmark（计划中） |

## 目录结构

```
server/
├── cmd/server/       # 入口
├── internal/
│   ├── handler/      # HTTP handler
│   ├── repository/   # 数据访问
│   ├── model/        # 数据模型
│   ├── middleware/    # Gin 中间件
│   ├── i18n/         # 服务端 i18n
│   ├── achievement/  # 成就检查引擎
│   ├── seed/         # Seed 数据插入逻辑
│   └── utils/        # 工具函数
├── seed/             # JSONL 种子数据
│   ├── system/       # 系统数据（权限、成就等）
│   └── demo/         # 演示数据（勋章、用户等）
└── go.mod
```

## 开发

```bash
go run ./cmd/server
```

## 约定

详见 `AGENTS.md`。
