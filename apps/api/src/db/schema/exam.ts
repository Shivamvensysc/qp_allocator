import {
  mysqlTable,
  int,
  varchar,
  date,
  timestamp,
  boolean,
  json,
} from "drizzle-orm/mysql-core";
import { users } from "./users";

export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),

  examCode: varchar("exam_code", { length: 50 }).notNull().unique(),

  examName: varchar("exam_name", { length: 100 }).notNull(),

  examBodyName: varchar("exam_body_name", { length: 250 }).notNull(),

  academicYear: varchar("academic_year", { length: 50 }).notNull(),

  startDate: date("start_date").notNull(),

  endDate: date("end_date").notNull(),

  noOfIteration: int("no_of_iteration").notNull(),

  defaultConfiguration: json("default_configuration").$type<{
    colour: string;
    alphabet: string;
    number: string;
  }>(),

  configurationType: varchar("configuration_type", { length: 50 }).notNull(),

  // ✅ NEW: Rotation Type
  rotationType: varchar("rotation_type", { length: 20 })
    .$type<"manual_roll" | "automated_roll">()
    .default("manual_roll")
    .notNull(),

  // ✅ NEW: Reusable Set
  reUsableSet: varchar("re_usable_set", { length: 10 })
    .$type<"yes" | "no">()
    .default("no")
    .notNull(),

  // ✅ STATUS COLUMN
  status: varchar("status", { length: 20 })
    .$type<"draft" | "publish" | "complete">()
    .default("draft")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  createdBy: int("created_by")
    .references(() => users.id)
    .notNull(),

  isDeleted: boolean("is_deleted").default(false).notNull(),
});