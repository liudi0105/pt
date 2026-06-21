# PT 站点

基于 Go + React 的私有 PT 站点系统。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite + Ant Design + TanStack Router |
| 后端 | Go + Gin + GORM + MySQL |
| 文档 | Docusaurus (`docs/`) |

## 项目结构

```
├── server/          # Go 后端
│   ├── cmd/         # 入口
│   ├── internal/    # handler / repository / model / service
│   └── seed/        # 种子数据
├── web/             # React 前端
│   └── src/
│       ├── pages/       # 页面组件
│       ├── routes/      # TanStack Router 路由定义
│       ├── api/         # API 客户端
│       ├── types/       # TypeScript 类型
│       └── hooks/       # 通用 hooks
├── docs/            # Docusaurus 文档站点
└── docker-compose.yml
```

## 快速开始

```bash
# 后端
cd server && go run ./cmd/server

# 前端
cd web && pnpm install && pnpm dev
```

详见各子目录 README。
