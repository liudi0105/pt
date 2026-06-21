# Web 前端

React 19 + TypeScript + Vite + Ant Design + TanStack Router。

## 技术选型

| 用途 | 选型 |
|---|---|
| 路由 | TanStack Router (文件路由) |
| UI | Ant Design 5 |
| i18n | react-i18next + 自定义 useI18n hook |
| 数据获取 | TanStack Query |
| 图标 | @ant-design/icons |
| Markdown 渲染 | react-markdown + remark-math + rehype-katex |
| 富文本编辑 | bytemd（计划中） |

## 目录结构

```
src/
├── pages/           # 页面组件
│   └── user-center/ # 用户中心子页面
├── routes/          # 路由定义（含 validateSearch）
│   └── $lang/       # 国际化路由
├── api/             # API 客户端
├── types/           # TypeScript 类型定义
├── hooks/           # 通用 hooks
├── constants/       # 常量
├── utils/           # 工具函数
└── public/locales/  # i18n JSON 文件（zh/en）
```

## 开发

```bash
npm run dev    # 开发服务器
npm run build  # 类型检查 + 构建
npm run lint   # ESLint
```

## 约定

详见 `AGENTS.md`。
