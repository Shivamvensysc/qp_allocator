import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";
import { userTypeEnum } from "./enums";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),

  username: varchar("username", { length: 50 }).notNull().unique(),

  password: text("password").notNull(),

  mobileNumber: varchar("mobile_number", { length: 15 })
    .notNull()
    .unique(),

  // ✅ FIXED ENUM USAGE
  type: userTypeEnum.notNull().default("selector"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow(),
});