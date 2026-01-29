# 项目快速理解（5 分钟）

## 1. 这是个什么项目

这是一个**前后端同仓（monorepo）**的示例项目：

- **前端**：`client/`（Vite + React + TypeScript）
- **后端**：`server/`（Express 5 + PostgreSQL + Drizzle ORM）
- **认证**：JWT（`passport-jwt`）从 `Authorization: Bearer <token>` 读取
- **权限**：RBAC（`accesscontrol`）+（可选）数据库 `permissions: string[]` 兜底

## 2. 目录结构速览

```text
node/
  client/                 # 前端（Vite React）
  server/                 # 后端（Express）
    server.ts             # 后端入口（路由挂载、全局中间件、错误处理）
    index.ts              # DB 初始化（drizzle）
    db/schema.ts          # DB schema 导出（users/roles）
    models/
      user/
        schema.ts         # users 表 + zod schema
        route.ts          # /api/user 路由（register/login/profile）
      role.ts             # roles 表（roleName, permissions jsonb）
    utils/
      passport.ts         # JWT 策略：解析 token -> 查询用户+角色 -> 挂载 req.user
      permissions.ts      # accesscontrol RBAC 配置（user/admin 的能力）
      checkPermissions.ts # RBAC 权限校验中间件
      bcrypt.ts           # 密码 hash/verify
  drizzle.config.ts       # drizzle-kit 配置（读取 DATABASE_URL）
  package.json            # 根脚本：并发启动前后端
```

## 3. 如何启动（本地开发）

### 3.1 安装依赖

```bash
npm install
cd client && npm install
```

### 3.2 环境变量（后端）

本仓库目前未提交 `.env`，后端需要至少这些环境变量（可以用系统环境变量或自行创建 `.env`）：

- **DATABASE_URL**：Postgres 连接串（drizzle 使用）
- **SECRET_KEY**：JWT 签名密钥（passport-jwt 与 login 签发都依赖）
- **EXPIRES_IN**：JWT 过期时间（如 `1d` / `2h`）
- **PORT**（可选）：后端端口，默认 `3000`

### 3.3 启动

根目录一键启动（前后端并发）：

```bash
npm run dev
```

单独启动后端：

```bash
npm run server
```

单独启动前端：

```bash
npm run client
```

## 4. 后端请求流（认证 + 权限）

### 4.1 登录签发 token

路由：`POST /api/user/login`

代码位置：`server/models/user/route.ts`

- 校验请求体：`usersSchema.parse(req.body)`（Zod）
- 查询用户：`usersTable`
- 校验密码：`utils/bcrypt`
- 签发 JWT：`jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn })`

### 4.2 携带 token 访问受保护接口

受保护接口示例：`GET /api/user/profile`

中间件链路（在 `route.ts` 里写死）：

- **authenticateJWT**：`passport.authenticate('jwt')`
  - 从 `Authorization: Bearer <token>` 取 token
  - 用 `SECRET_KEY` 验签
  - 用 token payload 的 `id` 去 DB 查询用户及角色信息（含 `roleName`、`permissions`）
  - 将用户信息挂到 `req.user`
- **checkPermissions(resource, action)**：
  - 先用 `accesscontrol` 基于 `roleName` 判断是否 `granted`
  - 再做兜底：如果 DB 的 `permissions` 是字符串数组，支持以下匹配方式：
    - `${action}:${resource}` 或 `${resource}:${action}`
    - `action` 或 `*`

## 5. 权限模型（RBAC）

配置位置：`server/utils/permissions.ts`

当前内置两个角色：

- **user**
  - `profile`: `readOwn`, `updateOwn`
  - `article`: `createOwn`, `readOwn`, `updateOwn`, `deleteOwn`
- **admin**
  - 继承 `user`
  - `profile`: `readAny`, `updateAny`, `deleteAny`
  - `article`: `createAny`, `deleteAny`

> 注意：`checkPermissions(resource, action)` 的 `action` 必须是 `accesscontrol` 支持的方法名（如 `readOwn/updateAny/...`）。

## 6. 已有 API（当前实现）

以 `server/models/user/route.ts` 为准：

- `POST /api/user/register`：注册（email/password）
- `POST /api/user/login`：登录，返回 `{ token, user }`
- `GET /api/user/profile`：需要 JWT + 权限
- `PUT /api/user/profile`：需要 JWT + 权限
- `DELETE /api/user/profile`：需要 JWT + 权限

## 7. 常见扩展点（你会从哪里开始改）

- **加新资源的权限**：
  - 在 `server/utils/permissions.ts` 给角色添加如 `readAny('xxx')`
  - 在路由上挂 `checkPermissions('xxx', 'readAny')`
- **把“权限”落到 DB**：
  - `roles.permissions` 已经是 `jsonb`（schema 在 `server/models/role.ts`）
  - `passport.ts` 会把 `roles.permissions` 读出来挂到 `req.user.permissions`
  - `checkPermissions.ts` 已经支持字符串权限兜底匹配
- **新增业务模块（如 article）**：
  - 按 `server/models/user/*` 的组织方式新增 `server/models/article/route.ts/schema.ts/...`
  - 在 `server/server.ts` 里 `app.use('/api/article', articleRouter)`


