import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { ulid } from "ulid";
import { z } from "zod";

import {
  conversation,
  message,
  messageAuditLog,
  messageReadReceipt,
} from "@/drizzle/messages";
import { pusherServer } from "@/lib/pusher";
import { db } from "@/lib/db";
import { protectedProcedure, router } from "@/server/trpc";

const MESSAGE_PAGE_SIZE = 50;

export const messagesRouter = router({
  // Get all conversations for current user
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const conversations = await db.query.conversation.findMany({
      where: or(
        eq(conversation.doctorId, userId),
        eq(conversation.patientId, userId)
      ),
      orderBy: desc(conversation.lastMessageAt),
      with: {
        doctor: true,
        patient: true,
        messages: {
          limit: 1,
          orderBy: desc(message.createdAt),
        },
      },
    });

    return conversations.map((conv) => ({
      ...conv,
      otherUser: conv.doctorId === userId ? conv.patient : conv.doctor,
      lastMessage: conv.messages[0] || null,
    }));
  }),

  // Create or get conversation with another user
  getOrCreateConversation: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const callerId = ctx.user.id;
      const callerRole = ctx.user.role;

      // Determine which side is doctor vs patient based on caller role
      const doctorId = callerRole === "DOCTOR" ? callerId : input.userId;
      const patientId = callerRole === "DOCTOR" ? input.userId : callerId;

      // Check if conversation already exists between these two users
      const existingConv = await db.query.conversation.findFirst({
        where: or(
          and(
            eq(conversation.doctorId, doctorId),
            eq(conversation.patientId, patientId)
          ),
          and(
            eq(conversation.doctorId, patientId),
            eq(conversation.patientId, doctorId)
          )
        ),
      });

      if (existingConv) {
        return existingConv;
      }

      const now = new Date();
      const newConv = {
        id: ulid(),
        doctorId,
        patientId,
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(conversation).values(newConv);
      return newConv;
    }),

  // Get messages for a conversation with pagination
  getMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(MESSAGE_PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify user has access to this conversation
      const conv = await db.query.conversation.findFirst({
        where: and(
          eq(conversation.id, input.conversationId),
          or(
            eq(conversation.doctorId, userId),
            eq(conversation.patientId, userId)
          )
        ),
      });

      if (!conv) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Fetch messages
      const messages = await db.query.message.findMany({
        where: and(
          eq(message.conversationId, input.conversationId),
          input.cursor
            ? lt(message.createdAt, new Date(input.cursor))
            : undefined
        ),
        orderBy: desc(message.createdAt),
        limit: input.limit + 1,
        with: {
          sender: true,
        },
      });

      const hasMore = messages.length > input.limit;
      const items = messages.slice(0, input.limit).reverse();

      return {
        items,
        hasMore,
        nextCursor:
          items.length > 0 ? items[0].createdAt.toISOString() : undefined,
      };
    }),

  // Send a message
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().min(1).max(5000),
        type: z
          .enum(["TEXT", "IMAGE", "FILE", "APPOINTMENT_LINK"])
          .default("TEXT"),
        attachmentUrl: z.string().optional(),
        attachmentName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify conversation access
      const conv = await db.query.conversation.findFirst({
        where: and(
          eq(conversation.id, input.conversationId),
          or(
            eq(conversation.doctorId, userId),
            eq(conversation.patientId, userId)
          )
        ),
      });

      if (!conv) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const messageId = ulid();
      const now = new Date();

      await db.insert(message).values({
        id: messageId,
        conversationId: input.conversationId,
        senderId: userId,
        content: input.content,
        type: input.type,
        attachmentUrl: input.attachmentUrl,
        attachmentName: input.attachmentName,
        isRead: false,
        isPinned: false,
        createdAt: now,
      });

      // Update conversation lastMessageAt
      await db
        .update(conversation)
        .set({ lastMessageAt: now })
        .where(eq(conversation.id, input.conversationId));

      // Create audit log
      await db.insert(messageAuditLog).values({
        id: ulid(),
        messageId,
        action: "CREATED",
        performedBy: userId,
        newContent: input.content,
        timestamp: now,
      });

      const sentMessage = await db.query.message.findFirst({
        where: eq(message.id, messageId),
        with: { sender: true },
      });

      if (sentMessage) {
        // Real-time message in the chat area
        await pusherServer.trigger(
          `conversation-${input.conversationId}`,
          "new-message",
          sentMessage
        );

        // Real-time update for the conversation list for both users
        await pusherServer.trigger(
          `user-${conv.doctorId}`,
          "conversation-update",
          {}
        );
        await pusherServer.trigger(
          `user-${conv.patientId}`,
          "conversation-update",
          {}
        );
      }

      return sentMessage;
    }),

  // Mark messages as read
  markAsRead: protectedProcedure
    .input(
      z.object({
        messageIds: z.array(z.string()).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const now = new Date();

      // Get all messages to verify access
      const messages = await db.query.message.findMany({
        where: eq(message.id, input.messageIds[0]),
        with: { conversation: true },
      });

      if (!messages.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const conv = messages[0].conversation;
      if (conv.doctorId !== userId && conv.patientId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Mark all messages as read
      for (const messageId of input.messageIds) {
        const msg = await db.query.message.findFirst({
          where: eq(message.id, messageId),
        });

        if (!msg) continue;

        // Update message
        await db
          .update(message)
          .set({ isRead: true })
          .where(eq(message.id, messageId));

        // Create read receipt
        await db.insert(messageReadReceipt).values({
          id: ulid(),
          messageId,
          userId,
          readAt: now,
          createdAt: now,
        });

        // Create audit log
        await db.insert(messageAuditLog).values({
          id: ulid(),
          messageId,
          action: "READ",
          performedBy: userId,
          timestamp: now,
        });
      }

      return { success: true };
    }),

  // Pin/unpin message
  togglePin: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
        pinned: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const msg = await db.query.message.findFirst({
        where: eq(message.id, input.messageId),
        with: { conversation: true },
      });

      if (!msg) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Only doctor can pin messages
      if (msg.conversation.doctorId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db
        .update(message)
        .set({ isPinned: input.pinned })
        .where(eq(message.id, input.messageId));

      // Create audit log
      await db.insert(messageAuditLog).values({
        id: ulid(),
        messageId: input.messageId,
        action: "PINNED",
        performedBy: userId,
        timestamp: new Date(),
      });

      return { success: true };
    }),

  // Delete message (soft delete)
  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const msg = await db.query.message.findFirst({
        where: eq(message.id, input.messageId),
      });

      if (!msg) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (msg.senderId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Soft delete
      await db
        .update(message)
        .set({ deletedAt: new Date() })
        .where(eq(message.id, input.messageId));

      // Create audit log
      await db.insert(messageAuditLog).values({
        id: ulid(),
        messageId: input.messageId,
        action: "DELETED",
        performedBy: userId,
        oldContent: msg.content,
        timestamp: new Date(),
      });

      return { success: true };
    }),
});
