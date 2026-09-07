import { relations } from "drizzle-orm";
import {
    pgTable,
    serial,
    varchar,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),

    name: varchar("name", {
        length: 100,
    }).notNull(),

    email: varchar("email", {
        length: 255,
    }).notNull().unique(),

    password: varchar("password", {
        length: 255,
    }).notNull(),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull()
});


export const files = pgTable("files", {
    id: serial("id").primaryKey(),

    ownerId: integer("owner_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),

    filename: varchar("filename", {
        length: 255,
    }).notNull(),

    // orignalFilename: varchar("orignal_filename", {
    //     length: 255
    // }),

    mimeType: varchar("mime_type", {
        length: 100,
    }).notNull(),

    size: integer("size").notNull(),

    driveFileId: varchar("drive_file_id", {
        length: 255,
    }).notNull(),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});

//! Relations
export const usersRelations = relations(users, ({ many }) => ({
    files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
    owner: one(users, {
        fields: [files.ownerId],
        references: [users.id],
    }),
}));