import { pgTable, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  roleName: varchar({ length: 255 }).notNull().unique(),
  permissions: jsonb().notNull().default('[]'),
})

const rolesSelectSchema = createSelectSchema(rolesTable, {
  roleName: () => z.string().min(1),
  permissions: () => z.array(z.string()),
})

const rolesSchema = rolesSelectSchema.omit({ id: true })

export { rolesTable, rolesSelectSchema, rolesSchema }