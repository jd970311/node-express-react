## 快速开始 / 快速理解项目

- **项目快速理解文档（推荐先看）**：`docs/quickstart.md`

## 运行（本地开发）

```bash
npm install
cd client && npm install
npm run dev
```

## 备注

`express-xss-sanitizer` 是一个专为 Express.js 设计的中间件，核心作用是清理用户输入中的 XSS 攻击代码（会处理 `req.body`、`req.query`、`req.params`）。