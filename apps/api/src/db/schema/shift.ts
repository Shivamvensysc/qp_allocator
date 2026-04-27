import {
  mysqlTable,
  int,
  date,
  time,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { exams } from "./exam";
import { users } from "./users";

export const shifts = mysqlTable("shifts", {
  id: int("id").autoincrement().primaryKey(),

  date: date("date").notNull(),

  startTime: time("start_time").notNull(),

  endTime: time("end_time").notNull(),

  examId: int("exam_id")
    .references(() => exams.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  createdBy: int("created_by")
    .references(() => users.id)
    .notNull(),

  isDeleted: boolean("is_deleted").default(false).notNull(),
});