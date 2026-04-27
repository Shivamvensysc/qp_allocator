import { mysqlEnum } from "drizzle-orm/mysql-core";


export const userTypeEnum = mysqlEnum("user_type", [
  "selector",
  "admin",
]);

export const colourEnum = mysqlEnum("colour_type", [
  "red",
  "blue",
  "green",
  "yellow",
  "black",
]);

export const alphabetEnum = mysqlEnum("alphabet_type", [
  "A",
  "B",
  "C",
  "D",
  "E",
]);

export const numberEnum = mysqlEnum("number_type", [
  "1",
  "2",
  "3",
  "4",
  "5",
]);

export const examStatusEnum = mysqlEnum("exam_status", [
  "draft",
  "publish",
  "complete",
]);