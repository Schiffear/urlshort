import { integer, PgSerial, pgTable, serial, smallint, smallserial, text, timestamp } from "drizzle-orm/pg-core";

export const tags = pgTable('tags', {
  id: text().primaryKey(),
  name: text().unique().notNull(),
  color: text().notNull(),
})