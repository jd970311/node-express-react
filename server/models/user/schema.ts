import { integer, pgTable, varchar, } from "drizzle-orm/pg-core";
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { rolesTable } from '../role.ts';
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  roleId: integer().references(() => rolesTable.id).default(1), // 外键约束，关联到 roles 表的 id 字段,实现多表关联，角色鉴权
});

// 用于查询的完整 schema（包含 id）
export const usersSelectSchema = createSelectSchema(usersTable, {
  email: () => z.string().email(),
  password: () => z.string().min(8),
})

// 用于输入验证的 schema（排除 id，因为 id 是自动生成的）
export const usersSchema = usersSelectSchema.omit({ id: true, roleId: true })
