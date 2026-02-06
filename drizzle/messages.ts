import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  varchar,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./schema";

// Conversations table - represents a conversation between doctor and patient
export const conversation = pgTable(
  "conversation",
  {
    id: text("id").primaryKey(),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    patientId: text("patient_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp("last_message_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("conversation_doctor_patient_idx").on(
      table.doctorId,
      table.patientId
    ),
    index("conversation_doctor_idx").on(table.doctorId),
    index("conversation_patient_idx").on(table.patientId),
    index("conversation_last_message_idx").on(table.lastMessageAt),
  ]
);

// Messages table - individual messages in a conversation
export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    type: varchar("type", {
      length: 20,
      enum: ["TEXT", "IMAGE", "FILE", "APPOINTMENT_LINK"],
    })
      .default("TEXT")
      .notNull(),

    // For file/image attachments
    attachmentUrl: text("attachment_url"),
    attachmentName: text("attachment_name"),
    attachmentSize: serial("attachment_size"),
    attachmentType: varchar("attachment_type", { length: 100 }),

    // For healthcare-specific data
    isRead: boolean("is_read").default(false).notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    editedAt: timestamp("edited_at"),
    editCount: integer("edit_count").default(0),

    // Metadata
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"), // Soft delete for audit trails
  },
  (table) => [
    index("message_conversation_idx").on(table.conversationId),
    index("message_sender_idx").on(table.senderId),
    index("message_created_idx").on(table.createdAt),
    index("message_is_read_idx").on(table.isRead),
    index("message_conversation_created_idx").on(
      table.conversationId,
      table.createdAt
    ),
  ]
);

// Message read receipts - track when messages are read
export const messageReadReceipt = pgTable(
  "message_read_receipt",
  {
    id: text("id").primaryKey(),
    messageId: text("message_id")
      .notNull()
      .references(() => message.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("message_read_receipt_message_idx").on(table.messageId),
    index("message_read_receipt_user_idx").on(table.userId),
  ]
);

// Message audit log - for compliance and security
export const messageAuditLog = pgTable(
  "message_audit_log",
  {
    id: text("id").primaryKey(),
    messageId: text("message_id")
      .notNull()
      .references(() => message.id, { onDelete: "cascade" }),
    action: varchar("action", {
      length: 20,
      enum: ["CREATED", "EDITED", "DELETED", "READ", "PINNED"],
    }).notNull(),
    performedBy: text("performed_by")
      .notNull()
      .references(() => user.id),
    oldContent: text("old_content"),
    newContent: text("new_content"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => [
    index("message_audit_log_message_idx").on(table.messageId),
    index("message_audit_log_action_idx").on(table.action),
    index("message_audit_log_timestamp_idx").on(table.timestamp),
  ]
);

// Relations
export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    doctor: one(user, {
      fields: [conversation.doctorId],
      references: [user.id],
    }),
    patient: one(user, {
      fields: [conversation.patientId],
      references: [user.id],
    }),
    messages: many(message),
  })
);

export const messageRelations = relations(message, ({ one, many }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
  }),
  readReceipts: many(messageReadReceipt),
  auditLogs: many(messageAuditLog),
}));

export const messageReadReceiptRelations = relations(
  messageReadReceipt,
  ({ one }) => ({
    message: one(message, {
      fields: [messageReadReceipt.messageId],
      references: [message.id],
    }),
    user: one(user, {
      fields: [messageReadReceipt.userId],
      references: [user.id],
    }),
  })
);

export const messageAuditLogRelations = relations(
  messageAuditLog,
  ({ one }) => ({
    message: one(message, {
      fields: [messageAuditLog.messageId],
      references: [message.id],
    }),
    performer: one(user, {
      fields: [messageAuditLog.performedBy],
      references: [user.id],
    }),
  })
);
