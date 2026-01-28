// 加载环境变量配置文件（.env）
import 'dotenv/config';
// 导入 Drizzle ORM 的 PostgreSQL 适配器
import { drizzle } from 'drizzle-orm/node-postgres';
// 导入 Drizzle ORM 的相等比较操作符
import { eq } from 'drizzle-orm';

// 创建数据库连接实例，使用环境变量中的 DATABASE_URL
const db = drizzle(process.env.DATABASE_URL!);

// 导出数据库连接实例和相等比较操作符，供其他模块使用
export {
  db,
  eq,
}