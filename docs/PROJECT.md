# 项目文档

## 📋 项目概述

这是一个**前后端分离的全栈 Web 应用**，采用 Monorepo 架构。项目实现了完整的用户认证、权限管理和文章管理功能。

### 核心特性

- ✅ **用户认证系统**：基于 JWT 的认证机制
- ✅ **权限管理系统**：RBAC（基于角色的访问控制）+ 数据库权限兜底
- ✅ **用户注册激活**：邮箱验证激活账号
- ✅ **文章管理**：支持文章的创建和管理
- ✅ **安全防护**：XSS 防护、密码加密、输入验证
- ✅ **类型安全**：TypeScript 全栈类型支持

---

## 🛠 技术栈

### 后端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | - | 运行时环境 |
| **Express** | 5.2.1 | Web 框架 |
| **TypeScript** | - | 类型系统 |
| **PostgreSQL** | - | 关系型数据库 |
| **Drizzle ORM** | 0.45.1 | 数据库 ORM |
| **Passport.js** | 0.7.0 | 认证中间件 |
| **JWT** | 9.0.3 | 身份令牌 |
| **AccessControl** | 2.2.1 | RBAC 权限控制 |
| **Zod** | 4.3.5 | 数据验证 |
| **bcryptjs** | 3.0.3 | 密码加密 |
| **Nodemailer** | 7.0.13 | 邮件发送 |
| **express-xss-sanitizer** | 2.0.1 | XSS 防护 |

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 19.2.0 | UI 框架 |
| **TypeScript** | 5.9.3 | 类型系统 |
| **Vite** | 7.2.4 | 构建工具 |

---

## 📁 项目结构

```
node/
├── client/                      # 前端应用
│   ├── src/                    # 源代码
│   │   ├── App.tsx             # 主应用组件
│   │   ├── main.tsx            # 入口文件
│   │   └── assets/             # 静态资源
│   ├── public/                 # 公共资源
│   ├── package.json            # 前端依赖
│   └── vite.config.ts          # Vite 配置
│
├── server/                      # 后端应用
│   ├── models/                 # 业务模型
│   │   ├── user/               # 用户模块
│   │   │   ├── schema.ts      # 用户表定义 + Zod 验证
│   │   │   ├── route.ts       # 用户路由（注册/登录/个人资料）
│   │   │   └── query.ts       # 查询函数（可选）
│   │   ├── article/            # 文章模块
│   │   │   ├── schema.ts      # 文章表定义 + Zod 验证
│   │   │   └── route.ts       # 文章路由
│   │   └── role.ts            # 角色表定义
│   │
│   ├── utils/                  # 工具函数
│   │   ├── passport.ts        # JWT 认证策略
│   │   ├── permissions.ts     # RBAC 权限配置
│   │   ├── checkPermissions.ts # 权限校验中间件
│   │   ├── bcrypt.ts          # 密码加密/验证
│   │   ├── emailServe.ts      # 邮件服务
│   │   └── authmiddle.ts      # 认证中间件（可选）
│   │
│   ├── db/                     # 数据库相关
│   │   └── schema.ts          # 数据库表导出
│   │
│   ├── config/                 # 配置文件（可选）
│   │
│   ├── server.ts               # Express 服务器入口
│   └── index.ts               # 数据库连接初始化
│
├── docs/                        # 文档目录
│   ├── quickstart.md          # 快速开始指南
│   └── PROJECT.md             # 项目文档（本文件）
│
├── drizzle.config.ts           # Drizzle ORM 配置
├── package.json                # 根目录依赖和脚本
└── README.md                   # 项目说明
```

---

## 🗄️ 数据库设计

### 表结构

#### 1. `users` 表（用户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键，自增 |
| `email` | VARCHAR(255) | 邮箱，唯一，非空 |
| `password` | VARCHAR(255) | 密码（bcrypt 加密），非空 |
| `roleId` | INTEGER | 角色 ID，外键关联 `roles.id`，默认 1 |
| `status` | VARCHAR(255) | 状态：`pending`（待激活）、`active`（已激活）、`inactive`（已禁用），默认 `pending` |

#### 2. `roles` 表（角色表）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键，自增 |
| `roleName` | VARCHAR(255) | 角色名称，唯一，非空（如：`user`、`admin`） |
| `permissions` | JSONB | 权限数组，默认 `[]`，用于权限兜底 |

#### 3. `articles` 表（文章表）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键，自增 |
| `title` | VARCHAR(255) | 标题，非空 |
| `content` | TEXT | 内容，非空 |
| `userId` | INTEGER | 用户 ID，外键关联 `users.id`，非空 |

### 关系说明

- `users.roleId` → `roles.id`（多对一）
- `articles.userId` → `users.id`（多对一）

---

## 🔐 认证与权限系统

### 认证流程

1. **用户注册**
   - 用户提交邮箱和密码
   - 密码使用 bcrypt 加密存储
   - 生成激活 token 并发送邮件
   - 用户状态为 `pending`

2. **账号激活**
   - 用户点击邮件中的激活链接
   - 验证 token 并更新用户状态为 `active`

3. **用户登录**
   - 验证邮箱和密码
   - 生成 JWT token（包含用户 ID）
   - 返回 token 和用户信息

4. **访问受保护接口**
   - 请求头携带：`Authorization: Bearer <token>`
   - `passport-jwt` 中间件验证 token
   - 从数据库查询用户及角色信息
   - 将用户信息挂载到 `req.user`

### 权限系统（RBAC）

#### 权限配置（`server/utils/permissions.ts`）

使用 `accesscontrol` 库定义角色权限：

**user 角色**：
- `profile`: `readOwn`, `updateOwn`
- `article`: `createOwn`, `readOwn`, `updateOwn`, `deleteOwn`

**admin 角色**（继承 user）：
- `profile`: `readAny`, `updateAny`, `deleteAny`
- `article`: `createAny`, `deleteAny`

#### 权限校验中间件

`checkPermissions(resource, action)` 中间件工作流程：

1. **优先使用 accesscontrol**：基于 `req.user.roleName` 判断权限
2. **数据库权限兜底**：如果 `req.user.permissions` 是字符串数组，支持以下匹配：
   - `${action}:${resource}` 或 `${resource}:${action}`
   - `action` 或 `*`（通配符）

#### 使用示例

```typescript
// 需要 JWT 认证 + 读取自己资料的权限
router.get('/profile', 
  authenticateJWT, 
  checkPermissions('profile', 'readOwn'), 
  (req, res) => {
    res.json(req.user);
  }
);

// 需要 JWT 认证 + 创建文章的权限
router.post('/create', 
  authenticateJWT, 
  checkPermissions('article', 'createOwn'), 
  async (req, res) => {
    // 创建文章逻辑
  }
);
```

---

## 📡 API 接口文档

### 基础信息

- **Base URL**: `http://localhost:3000`
- **认证方式**: JWT Bearer Token
- **请求头**: `Authorization: Bearer <token>`

### 用户相关接口

#### 1. 用户注册

```http
POST /api/user/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**：
```json
{
  "message": "注册成功，请查收邮件激活账号",
  "user": {
    "id": 1
  }
}
```

**说明**：
- 密码最少 8 位
- 邮箱必须唯一
- 注册成功后发送激活邮件
- 如果邮件发送失败，自动删除已注册用户

#### 2. 账号激活

```http
GET /api/user/activate?token=<activation_token>
```

**响应**：
```json
{
  "message": "激活成功",
  "user": { ... }
}
```

#### 3. 用户登录

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**：
```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": [
    {
      "id": 1,
      "email": "user@example.com",
      "roleId": 1,
      "status": "active"
    }
  ]
}
```

#### 4. 获取个人资料

```http
GET /api/user/profile
Authorization: Bearer <token>
```

**权限要求**：`readOwn` on `profile`

**响应**：
```json
{
  "id": 1,
  "email": "user@example.com",
  "roleId": 1,
  "roleName": "user",
  "permissions": [],
  "status": "active"
}
```

### 文章相关接口

#### 1. 创建文章

```http
POST /api/article/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容"
}
```

**权限要求**：`createOwn` on `article`

**响应**：
```json
{
  "message": "创建文章成功",
  "article": {
    "id": 1,
    "userId": 1,
    "title": "文章标题",
    "content": "文章内容"
  }
}
```

---

## ⚙️ 环境配置

### 必需的环境变量

在项目根目录创建 `.env` 文件（或使用系统环境变量）：

```env
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# JWT 配置
SECRET_KEY=your-secret-key-here
EXPIRES_IN=1d  # 或 2h, 7d 等

# 邮件服务配置（用于账号激活）
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# 服务器配置（可选）
PORT=3000
```

### 环境变量说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `DATABASE_URL` | ✅ | PostgreSQL 连接字符串 |
| `SECRET_KEY` | ✅ | JWT 签名密钥，建议使用强随机字符串 |
| `EXPIRES_IN` | ✅ | JWT 过期时间（如：`1d`、`2h`、`7d`） |
| `EMAIL_USER` | ✅ | 发送邮件的邮箱地址（Gmail） |
| `EMAIL_PASSWORD` | ✅ | 邮箱的应用密码（不是登录密码） |
| `PORT` | ❌ | 服务器端口，默认 3000 |

---

## 🚀 开发指南

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd client && npm install
```

### 启动开发服务器

#### 方式一：同时启动前后端（推荐）

```bash
npm run dev
```

#### 方式二：分别启动

```bash
# 启动后端
npm run server

# 启动前端（新终端）
npm run client
```

### 数据库迁移

使用 Drizzle Kit 进行数据库迁移：

```bash
# 生成迁移文件
npx drizzle-kit generate

# 执行迁移
npx drizzle-kit migrate
```

### 代码结构说明

#### 添加新的业务模块

1. **创建模型目录**：
   ```
   server/models/your-module/
     ├── schema.ts    # 表定义 + Zod 验证
     └── route.ts     # 路由定义
   ```

2. **在 `server/db/schema.ts` 中导出表**：
   ```typescript
   export { yourModuleTable } from '../models/your-module/schema';
   ```

3. **在 `server/server.ts` 中注册路由**：
   ```typescript
   const yourModuleRouter = require('./models/your-module/route.ts');
   app.use('/api/your-module', yourModuleRouter);
   ```

#### 添加新的权限

1. **在 `server/utils/permissions.ts` 中配置**：
   ```typescript
   ac.grant('user').readOwn('your-resource').updateOwn('your-resource');
   ac.grant('admin').readAny('your-resource').deleteAny('your-resource');
   ```

2. **在路由中使用**：
   ```typescript
   router.get('/list', 
     authenticateJWT, 
     checkPermissions('your-resource', 'readOwn'),
     handler
   );
   ```

---

## 🔒 安全特性

### 已实现的安全措施

1. **密码加密**：使用 bcrypt 加密存储，盐轮数 10
2. **JWT 认证**：基于 token 的无状态认证
3. **XSS 防护**：`express-xss-sanitizer` 自动清理用户输入
4. **输入验证**：使用 Zod 进行请求参数验证
5. **权限控制**：RBAC + 数据库权限双重保障
6. **CORS 配置**：支持跨域请求（开发环境）

### 安全建议

- 生产环境应使用 HTTPS
- 定期更新依赖包
- 使用强随机字符串作为 `SECRET_KEY`
- 限制 JWT 过期时间
- 实施请求频率限制（Rate Limiting）
- 使用环境变量管理敏感信息

---

## 📝 错误处理

### 错误响应格式

#### Zod 验证错误（400）

```json
{
  "code": 400,
  "message": "请求参数验证失败",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address",
      "code": "invalid_format"
    }
  ]
}
```

#### 自定义错误（带 statusCode）

```json
{
  "code": 401,
  "message": "用户不存在"
}
```

#### 服务器错误（500）

```json
{
  "code": 500,
  "message": "服务器内部错误，请稍后重试"
}
```

---

## 🧪 测试建议

### 测试场景

1. **用户注册流程**
   - 正常注册
   - 邮箱重复注册
   - 密码格式验证
   - 邮件发送失败处理

2. **账号激活**
   - 正常激活
   - Token 过期/无效
   - 重复激活

3. **用户登录**
   - 正常登录
   - 错误密码
   - 未激活账号登录
   - 不存在的用户

4. **权限控制**
   - 无 token 访问受保护接口
   - 无效 token
   - 权限不足访问

5. **文章管理**
   - 创建文章
   - 权限验证

---

## 📚 相关文档

- [快速开始指南](./quickstart.md) - 5 分钟快速了解项目
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Passport.js 文档](http://www.passportjs.org/)
- [AccessControl 文档](https://github.com/onury/accesscontrol)

---

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

---

## 📄 许可证

ISC

---

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。

