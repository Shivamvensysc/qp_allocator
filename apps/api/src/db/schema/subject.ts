import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { exams } from "./exam"; // 👈 import exams table

export const subjects = mysqlTable("subjects", {
  id: int("id").autoincrement().primaryKey(),

  subjectName: varchar("subject_name", { length: 100 }).notNull(),

  setCount: int("set_count").notNull(),

  examId: int("exam_id") // 👈 NEW FIELD
    .references(() => exams.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  createdBy: int("created_by")
    .references(() => users.id)
    .notNull(),

  isDeleted: boolean("is_deleted").default(false).notNull(),
});