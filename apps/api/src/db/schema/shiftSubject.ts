import {
  mysqlTable,
  int,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { shifts } from "./shift";
import { subjects } from "./subject";
import { users } from "./users";

export const shiftSubjects = mysqlTable("shift_subjects", {
  // ✅ Primary Key (IMPORTANT FIX)
  id: int("id").autoincrement().primaryKey(),

  // ✅ Foreign Keys (correctly mapped)
  ssId: int("ss_id")
    .notNull()
    .references(() => shifts.id),

  subjectId: int("subject_id")
    .notNull()
    .references(() => subjects.id),

  finalSelectedSet: int("final_selected_set"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  createdBy: int("created_by")
    .notNull()
    .references(() => users.id),

  isDeleted: boolean("is_deleted").default(false).notNull(),
});