## 📚 项目文档

- **项目快速理解文档（推荐先看）**：`docs/quickstart.md` - 5 分钟快速了解项目架构和核心功能
- **完整项目文档**：`docs/PROJECT.md` - 详细的技术文档，包含 API 接口、数据库设计、权限系统等

## 运行（本地开发）

```bash
npm install
cd client && npm install
npm run dev
```

## 备注

`express-xss-sanitizer` 是一个专为 Express.js 设计的中间件，核心作用是清理用户输入中的 XSS 攻击代码（会处理 `req.body`、`req.query`、`req.params`）。