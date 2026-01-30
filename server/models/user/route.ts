const express = require('express')//引入express
const router = express.Router()//创建路由实例
import { usersTable, usersSchema } from './schema.ts' //引入用户表
import { processPassword, verifyPassword } from '../../utils/bcrypt' //引入密码加密函数
import { db, eq } from '../../index.ts' //引入数据库和等式函数
import { authenticateJWT } from '../../utils/passport.ts'
import { checkPermissions } from '../../utils/checkPermissions.ts'
// 引入发送邮件函数
import { sendEmail } from '../../utils/emailServe.ts'
const secretKey = process.env.SECRET_KEY //获取密钥
const expiresIn = process.env.EXPIRES_IN //设置过期时间

const jwt = require('jsonwebtoken') //引入jwt
router.post('/register', async (req: any, res: any, next: any) => {
  try {
    const { email, password } = usersSchema.parse(req.body) //获取用户名和密码
    const hashedPassword = await processPassword(password) //加密密码
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
    if (existingUser.length) {
      return res.status(400).json({ message: ' 邮箱已存在 ' });
    };
    const user = await db.insert(usersTable).values({ email, password: hashedPassword }).returning({ id: usersTable.id }) //插入用户
    // 发送邮件
    try {
      const token = jwt.sign({ id: user[0].id }, secretKey, { expiresIn: '15min' })
      await sendEmail({
        to: email,
        subject: '注册成功',
        text: '注册成功，请点击链接激活账号：http://192.168.0.233:3000/api/user/activate?token=' + token,
        html: '<p>注册成功，请点击链接激活账号：<a href="http://192.168.0.233:3000/api/user/activate?token=' + token + '">点击激活</a></p>',
      })
    } catch (error) {
      //如果报错 删除注册的用户
      await db.delete(usersTable).where(eq(usersTable.id, user[0].id))
      return res.status(500).json({ message: '发送邮件失败' })
    }
    res.status(200).json({ message: '注册成功，请查收邮件激活账号', user: user[0] }) //返回用户
  } catch (error) {
    next(error)
  }
})
// 激活账号
router.get('/activate', async (req: any, res: any) => {
  const { token } = req.query
  console.log(token, 'token');
  if (!token) {
    return res.status(401).json({ message: '未登录' })
  }
  const decoded = jwt.verify(token, secretKey)
  console.log(decoded, 'decoded');
  const user = await db.select().from(usersTable).where(eq(usersTable.id, decoded.id))
  if (!user) {
    return res.status(401).json({ message: '用户不存在或已激活' })
  }
  await db.update(usersTable).set({ status: 'active' }).where(eq(usersTable.id, decoded.id))
  res.status(200).json({ message: '激活成功', user: user[0] })
})

router.post('/login', async (req: any, res: any) => {
  const { email, password } = usersSchema.parse(req.body) //获取用户名和密码
  // 1. 判断用户是否存在
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email)) //查询用户
  if (!user || user.length === 0) {
    return res.status(401).json({ message: '用户不存在' })
  }
  // 2. 判断密码是否正确
  const isPasswordValid = await verifyPassword(password, user[0]?.password) //验证密码
  if (!isPasswordValid) {
    return res.status(401).json({ message: '密码错误' })
  }
  // 3. 检查用户激活状态
  if (user[0].status !== 'active') {
    return res.status(403).json({ message: '账号未激活，请先激活账号' })
  }
  // 4. 生成 token返回给前端
  const token = jwt.sign({ id: user[0].id }, secretKey, { expiresIn })
  // res.cookie('token', token, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'strict',
  //   maxAge: 24 * 60 * 60 * 1000,
  // });
  res.status(200).json({ message: '登录成功', token, user }) //返回用户
})
router.get('/profile', authenticateJWT, checkPermissions('profile', 'readOwn'), (req: any, res: any) => {
  res.json(req.user)
})
module.exports = router  