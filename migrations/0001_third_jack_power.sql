CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"type" varchar(20) DEFAULT 'TEXT' NOT NULL,
	"attachment_url" text,
	"attachment_name" text,
	"attachment_size" serial NOT NULL,
	"attachment_type" varchar(100),
	"is_read" boolean DEFAULT false NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp,
	"edit_count" serial DEFAULT 0 NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "message_audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"message_id" text NOT NULL,
	"action" varchar(20) NOT NULL,
	"performed_by" text NOT NULL,
	"old_content" text,
	"new_content" text,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_read_receipt" (
	"id" text PRIMARY KEY NOT NULL,
	"message_id" text NOT NULL,
	"user_id" text NOT NULL,
	"read_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_audit_log" ADD CONSTRAINT "message_audit_log_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_audit_log" ADD CONSTRAINT "message_audit_log_performed_by_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_read_receipt" ADD CONSTRAINT "message_read_receipt_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_read_receipt" ADD CONSTRAINT "message_read_receipt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_doctor_patient_idx" ON "conversation" USING btree ("doctor_id","patient_id");--> statement-breakpoint
CREATE INDEX "conversation_doctor_idx" ON "conversation" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "conversation_patient_idx" ON "conversation" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "conversation_last_message_idx" ON "conversation" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "message_conversation_idx" ON "message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_sender_idx" ON "message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_created_idx" ON "message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "message_is_read_idx" ON "message" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "message_conversation_created_idx" ON "message" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "message_audit_log_message_idx" ON "message_audit_log" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_audit_log_action_idx" ON "message_audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "message_audit_log_timestamp_idx" ON "message_audit_log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "message_read_receipt_message_idx" ON "message_read_receipt" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_read_receipt_user_idx" ON "message_read_receipt" USING btree ("user_id");