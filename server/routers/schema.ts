import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  phone: text("phone"),
  specialty: text("specialty"),
  licenseNumber: text("license_number"),
  faydaImage: text("fayda_image"),
  faydaId: text("fayda_id"),
  bio: text("bio"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 20, enum: ["male", "female"] }),
  role: varchar("role", {
    length: 50,
    enum: ["PATIENT", "DOCTOR", "ADMIN"],
  }).default("PATIENT"),
  isActive: boolean("is_active").default(true),
  hasOnboarded: boolean("has_onboarded").default(false).notNull(),
  lastSeen: timestamp("last_seen"),
  averageRating: integer("average_rating"),
  ratingCount: integer("rating_count").default(0),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const doctorRatingsTable = pgTable("doctor_ratings", {
  id: text("id").primaryKey(),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const doctorRatingsRelations = relations(
  doctorRatingsTable,
  ({ one }) => ({
    doctor: one(user, {
      fields: [doctorRatingsTable.doctorId],
      references: [user.id],
    }),
    patient: one(user, {
      fields: [doctorRatingsTable.patientId],
      references: [user.id],
    }),
  })
);

// appointment

export const doctorAvailability = pgTable(
  "doctor_availability",
  {
    id: text("id").primaryKey(),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),

    isBooked: boolean("is_booked").default(false).notNull(),

    timezone: varchar("timezone", { length: 50 }).default("Africa/Addis_Ababa"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("doctor_availability_doctor_idx").on(table.doctorId),
    index("doctor_availability_time_idx").on(table.startTime, table.endTime),
  ]
);

export const appointment = pgTable(
  "appointment",
  {
    id: text("id").primaryKey(),

    patientId: text("patient_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    doctorId: text("doctor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    availabilityId: text("availability_id")
      .notNull()
      .references(() => doctorAvailability.id, {
        onDelete: "restrict",
      }),

    appointmentType: varchar("appointment_type", {
      length: 20,
      enum: ["VIDEO", "IN_PERSON", "CHAT", "VOICE"],
    }).notNull(),

    status: varchar("status", {
      length: 20,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED", "NO_SHOW"],
    })
      .default("PENDING")
      .notNull(),

    reason: text("reason"),
    notes: text("notes"),

    scheduledStart: timestamp("scheduled_start").notNull(),
    scheduledEnd: timestamp("scheduled_end").notNull(),

    completedAt: timestamp("completed_at"),

    cancelledAt: timestamp("cancelled_at"),
    cancelledBy: varchar("cancelled_by", {
      length: 16,
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
    }),

    deletedAt: timestamp("deleted_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("appointment_patient_idx").on(table.patientId),
    index("appointment_doctor_idx").on(table.doctorId),
    index("appointment_status_idx").on(table.status),
  ]
);

export const appointmentReschedule = pgTable("appointment_reschedule", {
  id: text("id").primaryKey(),

  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointment.id, { onDelete: "cascade" }),

  oldAvailabilityId: text("old_availability_id"),
  newAvailabilityId: text("new_availability_id"),

  requestedBy: text("requested_by")
    .notNull()
    .references(() => user.id),

  status: varchar("status", {
    length: 20,
    enum: ["REQUESTED", "APPROVED"],
  }).default("REQUESTED"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointmentMeeting = pgTable("appointment_meeting", {
  id: text("id").primaryKey(),

  appointmentId: text("appointment_id").references(() => appointment.id, {
    onDelete: "cascade",
  }),

  meetLink: text("meet_link").notNull(),
  calendarEventId: text("calendar_event_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const doctorTimeOff = pgTable(
  "doctor_time_off",
  {
    id: text("id").primaryKey(),

    doctorId: text("doctor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),

    reason: text("reason"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("doctor_time_off_idx").on(table.doctorId)]
);

export const doctorAvailabilityRelations = relations(
  doctorAvailability,
  ({ one }) => ({
    doctor: one(user, {
      fields: [doctorAvailability.doctorId],
      references: [user.id],
    }),
  })
);

export const appointmentMeetingRelations = relations(
  appointmentMeeting,
  ({ one }) => ({
    appointment: one(appointment, {
      fields: [appointmentMeeting.appointmentId],
      references: [appointment.id],
    }),
  })
);

export const appointmentRescheduleRelations = relations(
  appointmentReschedule,
  ({ one }) => ({
    appointment: one(appointment, {
      fields: [appointmentReschedule.appointmentId],
      references: [appointment.id],
    }),
    oldAvailability: one(doctorAvailability, {
      fields: [appointmentReschedule.oldAvailabilityId],
      references: [doctorAvailability.id],
    }),
    newAvailability: one(doctorAvailability, {
      fields: [appointmentReschedule.newAvailabilityId],
      references: [doctorAvailability.id],
    }),
    requester: one(user, {
      fields: [appointmentReschedule.requestedBy],
      references: [user.id],
    }),
  })
);

//audit log
export const appointmentEvent = pgTable(
  "appointment_event",
  {
    id: text("id").primaryKey(),

    appointmentId: text("appointment_id")
      .notNull()
      .references(() => appointment.id, { onDelete: "cascade" }),

    oldStatus: varchar("old_status", {
      length: 20,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED", "NO_SHOW"],
    }),

    newStatus: varchar("new_status", {
      length: 20,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED", "NO_SHOW"],
    }).notNull(),

    changedBy: text("changed_by")
      .notNull()
      .references(() => user.id),

    actorRole: varchar("actor_role", {
      length: 16,
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
    }).notNull(),

    note: text("note"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("appointment_event_idx").on(table.appointmentId)]
);

export const appointmentEventRelations = relations(
  appointmentEvent,
  ({ one }) => ({
    appointment: one(appointment, {
      fields: [appointmentEvent.appointmentId],
      references: [appointment.id],
    }),
    actor: one(user, {
      fields: [appointmentEvent.changedBy],
      references: [user.id],
    }),
  })
);

export const appointmentRelations = relations(appointment, ({ one, many }) => ({
  patient: one(user, {
    fields: [appointment.patientId],
    references: [user.id],
  }),
  doctor: one(user, {
    fields: [appointment.doctorId],
    references: [user.id],
  }),
  availability: one(doctorAvailability, {
    fields: [appointment.availabilityId],
    references: [doctorAvailability.id],
  }),
  meeting: one(appointmentMeeting, {
    fields: [appointment.id],
    references: [appointmentMeeting.appointmentId],
  }),
  events: many(appointmentEvent),
  reschedules: many(appointmentReschedule),
}));

// notification
export const notification = pgTable("notification", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  appointmentId: text("appointment_id").references(() => appointment.id, {
    onDelete: "cascade",
  }),

  type: varchar("type", {
    length: 30,
    enum: ["EMAIL", "SMS", "PUSH"],
  }).notNull(),

  title: text("title").notNull(),
  message: text("message").notNull(),

  status: varchar("status", {
    length: 20,
    enum: ["PENDING", "SENT", "FAILED"],
  }).default("PENDING"),
  error: text("error"),

  sentAt: timestamp("sent_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
