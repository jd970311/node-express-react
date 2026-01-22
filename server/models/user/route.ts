const express = require('express')//引入express
const router = express.Router()//创建路由实例
import { usersTable } from './schema.ts' //引入用户表
import { processPassword, verifyPassword } from '../../utils/bcrypt' //引入密码加密函数
import { db, eq } from '../../index.ts' //引入数据库和等式函数
import { jsonParser, urlencodedParser } from '../../server.ts'
const secretKey = process.env.SECRET_KEY //获取密钥
const expiresIn = process.env.EXPIRES_IN //设置过期时间

const jwt = require('jsonwebtoken') //引入jwt
router.post('/register', jsonParser, async (req: any, res: any) => {
  console.log(req.body, 'req.body');

  const { email, password } = req.body //获取用户名和密码
  const hashedPassword = await processPassword(password) //加密密码
  const user = await db.insert(usersTable).values({ email, password: hashedPassword }) //插入用户
  res.status(200).json(user) //返回用户
})
router.post('/login', jsonParser, async (req: any, res: any) => {
  const { email, password } = req.body //获取用户名和密码
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
module.exports = router  