import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { db } from '../index.ts';
import { usersTable, rolesTable } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

// JWT 策略配置选项
const jwtOptions = {
  // 从请求头 Authorization 中提取 token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 用于验证 token 的密钥
  secretOrKey: process.env.SECRET_KEY,
};

// 配置 JWT 策略
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // 从 token payload 中获取用户 id
      const userId = payload.id;

      // 从数据库查询用户及其角色信息，只选取需要的字段
      const [row] = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          password: usersTable.password,
          roleId: usersTable.roleId,
          roleName: rolesTable.roleName,
          permissions: rolesTable.permissions,
        })
        .from(usersTable)
        .leftJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
        .where(eq(usersTable.id, userId))
        .limit(1);

      // 如果找到用户，返回用户信息
      if (row) {
        // 不返回密码字段
        const { password, ...userWithoutPassword } = row;
        // done(null, { ...userWithoutPassword, permissions: row.permissions }) 自动把用户信息，角色权限挂在 req.user 上
        return done(null, { ...userWithoutPassword, permissions: row.permissions });
      } else {
        // 用户不存在
        return done(null, false);
      }
    } catch (error) {
      // 发生错误
      return done(error, false);
    }
  })
);

// 导出 passport 中间件
export const passportMiddleware = passport.initialize();

// 导出 JWT 认证中间件
export const authenticateJWT = passport.authenticate('jwt', { session: false });

