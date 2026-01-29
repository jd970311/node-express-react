import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { usersTable } from '../user/schema.ts'
export const articlesTable = pgTable("articles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  userId: integer().references(() => usersTable.id).notNull(),
})

const articlesSelectSchema = createSelectSchema(articlesTable, {
  title: () => z.string().min(1),
  content: () => z.string().min(1),
})
export const articlesSchema = articlesSelectSchema.omit({ id: true, userId: true })