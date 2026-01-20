const express = require('express')//引入express
const app = express()//创建express的实例对象
const port = process.env.PORT || 3000//创建端口号 如果环境变量中没有PORT，则使用3000
const bodyParser = require('body-parser') // 引入body-parser
app.use(bodyParser.json()) // 使用body-parser
app.use(bodyParser.urlencoded({ extended: true })) // 使用body-parser

// const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded()
//监听端口号 
app.listen(port, () => {
  console.log(`服务器启动成功，端口号为${port}`)
})