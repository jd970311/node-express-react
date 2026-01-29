import express from 'express' // 引入express（使用ES模块导入，便于类型推断）
import { passportMiddleware } from './utils/passport.ts'
const app = express() //创建express的实例对象
const port = process.env.PORT || 3000//创建端口号 如果环境变量中没有PORT，则使用3000
const bodyParser = require('body-parser') // 引入body-parser
const cors = require('cors') // 引入cors
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded()
const { xss } = require('express-xss-sanitizer');
// import { verifyToken } from './utils/authmiddle.ts'
import { ZodError } from 'zod'
app.use(passportMiddleware)
app.use(cors())
// 应用 XSS 清理中间件（全局生效）
app.use(xss());
app.use(jsonParser)
app.use(urlencodedParser)
//注册路由
// 引入用户路由
const userRouter = require('./models/user/route.ts')
// 引入文章路由
const articleRouter = require('./models/article/route.ts')
// 挂载用户路由，必须以“/”开头
app.use('/api/user', userRouter)
// 挂载文章路由
app.use('/api/article', articleRouter)
app.get('/test', (req: any, res: any) => {
  res.send('Hello World')
})

// 错误处理中间件要放在所有路由之后,
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 处理 Zod 校验错误
  if (err instanceof ZodError) {
    // Zod 错误的结构：err.issues 是一个数组，包含所有验证错误
    const errors = err.issues.map(issue => ({
      field: issue.path.join('.'), // 字段路径，如 'email'
      message: issue.message, // 错误消息，如 'Invalid email address'
      code: issue.code, // 错误代码，如 'invalid_format'
    }))

    return res.status(400).json({
      code: 400,
      message: "请求参数验证失败",
      errors, // 返回所有字段的错误详情
    })
  }

  // 处理其他已知错误（自定义抛出的错误）
  if (err.statusCode && err.message) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
    })
  }

  // 未知错误，统一处理
  console.error('服务器内部错误：', err)
  return res.status(500).json({
    code: 500,
    message: '服务器内部错误，请稍后重试',
  })
})
//监听端口号 
app.listen(port, () => {
  console.log(`服务器启动成功，端口号为${port}`)
})