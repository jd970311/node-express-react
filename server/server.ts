const express = require('express')//引入express
const app = express()//创建express的实例对象
const port = process.env.PORT || 3000//创建端口号 如果环境变量中没有PORT，则使用3000
const bodyParser = require('body-parser') // 引入body-parser
const cors = require('cors') // 引入cors
app.use(cors())


export const jsonParser = bodyParser.json()
export const urlencodedParser = bodyParser.urlencoded()
//注册路由
const userRouter = require('./models/user/route.ts')
// 挂载接口路由，必须以“/”开头
app.use('/api/user', userRouter)
//监听端口号 
app.listen(port, () => {
  console.log(`服务器启动成功，端口号为${port}`)
})