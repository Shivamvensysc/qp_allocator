import {
  mysqlTable,
  int,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { shiftSubjects } from "./shiftSubject";
import { users } from "./users";

export const iterations = mysqlTable("iterations", {
  id: int("id").autoincrement().primaryKey(),

  ssId: int("ss_id")
    .notNull()
    .references(() => shiftSubjects.id),

  ts: timestamp("ts").defaultNow().notNull(),

  iterationCount: int("iteration_count").notNull(),

  selectedSet: int("selected_set"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  createdBy: int("created_by")
    .notNull()
    .references(() => users.id),

  isDeleted: boolean("is_deleted").default(false).notNull(),
});