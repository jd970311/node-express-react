const express = require('express')//引入express
const router = express.Router()//创建路由实例
import { usersTable, usersSchema } from './schema.ts' //引入用户表
import { processPassword, verifyPassword } from '../../utils/bcrypt' //引入密码加密函数
import { db, eq } from '../../index.ts' //引入数据库和等式函数
import { jsonParser, urlencodedParser } from '../../server.ts'
import { authenticateJWT } from '../../utils/passport.ts'
import { checkPermissions } from '../../utils/checkPermissions.ts'
const secretKey = process.env.SECRET_KEY //获取密钥
const expiresIn = process.env.EXPIRES_IN //设置过期时间

const jwt = require('jsonwebtoken') //引入jwt
router.post('/register', jsonParser, async (req: any, res: any, next: any) => {
  try {
    const { email, password } = usersSchema.parse(req.body) //获取用户名和密码
    const hashedPassword = await processPassword(password) //加密密码
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
    if (existingUser.length) {
      return res.status(400).json({ message: ' 邮箱已存在 ' });
    };
    const user = await db.insert(usersTable).values({ email, password: hashedPassword }) //插入用户
    res.status(200).json(user) //返回用户
  } catch (error) {
    next(error)
  }
})
router.post('/login', jsonParser, async (req: any, res: any) => {
  const { email, password } = usersSchema.parse(req.body) //获取用户名和密码
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email)) //查询用户
  if (!user) {
    res.status(401).json({ message: '用户不存在' })
  }
  const isPasswordValid = await verifyPassword(password, user[0]?.password) //验证密码
  if (!isPasswordValid) {
    res.status(401).json({ message: '密码错误' })
  }
  // 生成 token
  const token = jwt.sign({ id: user[0].id }, secretKey, { expiresIn })
  console.log(token, 'token');
  // res.cookie('token', token, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'strict',
  //   maxAge: 24 * 60 * 60 * 1000,
  // });
  res.status(200).json({ message: '登录成功', token, user }) //返回用户
})
router.get('/profile', authenticateJWT, checkPermissions('profile', 'createOwn'), (req: any, res: any) => {
  console.log(req.user, 'req.user');
  res.json(req.user)
})
router.put('/profile', authenticateJWT, checkPermissions('profile', 'updateOwn'), (req: any, res: any) => {
  console.log(req.user, 'req.user');
  res.json(req.user)
})
router.delete('/profile', authenticateJWT, checkPermissions('article', 'deleteOwn'), (req: any, res: any) => {
  console.log(req.user, 'req.user');
  res.json(req.user)
})
module.exports = router  