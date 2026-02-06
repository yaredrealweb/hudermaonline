CREATE TABLE "lab_report" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"name" text NOT NULL,
	"date" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'normal',
	"notes" text,
	"file_url" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_history" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"condition" text NOT NULL,
	"status" varchar(20) DEFAULT 'ongoing',
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"notes" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medication" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"name" text NOT NULL,
	"dosage" text NOT NULL,
	"reason" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"adherence" integer DEFAULT 0,
	"side_effects" text,
	"effectiveness_rating" integer DEFAULT 0,
	"notes" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medication_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"medication_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lab_report" ADD CONSTRAINT "lab_report_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_report" ADD CONSTRAINT "lab_report_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication" ADD CONSTRAINT "medication_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication" ADD CONSTRAINT "medication_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_progress" ADD CONSTRAINT "medication_progress_medication_id_medication_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lab_report_doctor_idx" ON "lab_report" USING btree ("doctor_id","created_at");--> statement-breakpoint
CREATE INDEX "lab_report_patient_idx" ON "lab_report" USING btree ("patient_id","created_at");--> statement-breakpoint
CREATE INDEX "medical_history_doctor_idx" ON "medical_history" USING btree ("doctor_id","created_at");--> statement-breakpoint
CREATE INDEX "medical_history_patient_idx" ON "medical_history" USING btree ("patient_id","created_at");--> statement-breakpoint
CREATE INDEX "medication_doctor_idx" ON "medication" USING btree ("doctor_id","created_at");--> statement-breakpoint
CREATE INDEX "medication_patient_idx" ON "medication" USING btree ("patient_id","created_at");--> statement-breakpoint
CREATE INDEX "medication_progress_medication_idx" ON "medication_progress" USING btree ("medication_id","date");