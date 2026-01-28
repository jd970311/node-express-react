const jwt = require('jsonwebtoken');
// 验证Token的中间件
export const verifyToken = (req: any, res: any, next: any) => {
  // 从请求头获取Token（前端一般把Token放在Authorization里，格式是 Bearer <token>）
  const authHeader = req.headers.authorization;
  console.log(authHeader, 'authHeader');

  // 检查请求头是否有Token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录，请先登录' });
  }

  // 提取纯Token（去掉Bearer前缀）
  const token = authHeader.split(' ')[1];

  try {
    // 验证Token并解析出payload
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded, 'decoded');
    // 把解析出的用户信息挂载到req对象上，后续接口可以直接用
    req.user = {
      id: decoded.id, // 这里的id就是你存在Token里的用户自增ID
    };

    // 验证通过，放行到下一个接口
    next();
  } catch (error: any) {
    // Token过期或无效
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '登录已过期，请重新登录' });
    }
    return res.status(401).json({ message: 'Token无效，请重新登录' });
  }
};
