前端 npm create vite@latest
后端 npm init -y 

express-xss-sanitizer 是一个专为 Express.js 框架设计的中间件，核心作用是清理用户输入中的跨站脚本（XSS）攻击代码，比如过滤掉 <script>、onclick 等危险标签 / 属性，保护你的 Node.js Web 应用免受 XSS 攻击。
简单来说：它就像一个 "安检员"，会检查用户提交的所有请求数据（req.body、req.query、req.params），并自动移除其中的恶意代码