CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"availability_id" text NOT NULL,
	"appointment_type" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"reason" text,
	"notes" text,
	"scheduled_start" timestamp NOT NULL,
	"scheduled_end" timestamp NOT NULL,
	"completed_at" timestamp,
	"cancelled_at" timestamp,
	"cancelled_by" varchar(16),
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_event" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"old_status" varchar(20),
	"new_status" varchar(20) NOT NULL,
	"changed_by" text NOT NULL,
	"actor_role" varchar(16) NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_meeting" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text,
	"meet_link" text NOT NULL,
	"calendar_event_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_reschedule" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"old_availability_id" text,
	"new_availability_id" text,
	"requested_by" text NOT NULL,
	"status" varchar(20) DEFAULT 'REQUESTED',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_availability" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"is_booked" boolean DEFAULT false NOT NULL,
	"timezone" varchar(50) DEFAULT 'Africa/Addis_Ababa',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_ratings" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_time_off" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"appointment_id" text,
	"type" varchar(30) NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING',
	"error" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"phone" text,
	"specialty" text,
	"license_number" text,
	"fayda_image" text,
	"fayda_id" text,
	"bio" text,
	"date_of_birth" timestamp,
	"gender" varchar(20),
	"role" varchar(50) DEFAULT 'PATIENT',
	"is_active" boolean DEFAULT true,
	"has_onboarded" boolean DEFAULT false NOT NULL,
	"last_seen" timestamp,
	"average_rating" integer,
	"rating_count" integer DEFAULT 0,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_availability_id_doctor_availability_id_fk" FOREIGN KEY ("availability_id") REFERENCES "public"."doctor_availability"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_event" ADD CONSTRAINT "appointment_event_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_event" ADD CONSTRAINT "appointment_event_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_meeting" ADD CONSTRAINT "appointment_meeting_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_reschedule" ADD CONSTRAINT "appointment_reschedule_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_reschedule" ADD CONSTRAINT "appointment_reschedule_requested_by_user_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_availability" ADD CONSTRAINT "doctor_availability_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_ratings" ADD CONSTRAINT "doctor_ratings_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_ratings" ADD CONSTRAINT "doctor_ratings_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_time_off" ADD CONSTRAINT "doctor_time_off_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "appointment_patient_idx" ON "appointment" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "appointment_doctor_idx" ON "appointment" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "appointment_status_idx" ON "appointment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "appointment_event_idx" ON "appointment_event" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "doctor_availability_doctor_idx" ON "doctor_availability" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_availability_time_idx" ON "doctor_availability" USING btree ("start_time","end_time");--> statement-breakpoint
CREATE INDEX "doctor_time_off_idx" ON "doctor_time_off" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");