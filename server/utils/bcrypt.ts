const bcrypt = require('bcryptjs');

const saltRounds = 10; // 盐轮数，通常在 10 和 12 之间

// 加密密码
const processPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
}

// 验证密码
const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
}
export { processPassword, verifyPassword }
