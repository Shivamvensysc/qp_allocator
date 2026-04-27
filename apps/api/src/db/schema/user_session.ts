import {
    mysqlTable,
    int,
    boolean,
    varchar,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { exams } from "./exam";

export const userSessions = mysqlTable(
    "user_sessions",
    {
        id: int("id").autoincrement().primaryKey(),

        userId: int("user_id")
            .references(() => users.id)
            .notNull(),

        examId: int("exam_id")
            .references(() => exams.id),

        isActive: boolean("is_active").default(true).notNull(),

        // ✅ MUST be NOT NULL
        passiveHash: varchar("passive_hash", { length: 255 }).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        modifiedAt: timestamp("modified_at")
            .defaultNow()
            .onUpdateNow()
            .notNull(),
    },
    (table) => {
        return {
            uniqueUserSession: uniqueIndex("unique_user_active_hash").on(
                table.userId,
                table.isActive,
                table.passiveHash
            ),

            uniqueExamSession: uniqueIndex("unique_exam_active_hash").on(
                table.examId,
                table.isActive,
                table.passiveHash
            ),
        };
    }
);