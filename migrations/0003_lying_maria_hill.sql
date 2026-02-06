CREATE TABLE "doctor_patient" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctor_patient" ADD CONSTRAINT "doctor_patient_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_patient" ADD CONSTRAINT "doctor_patient_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "doctor_patient_doctor_idx" ON "doctor_patient" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_patient_patient_idx" ON "doctor_patient" USING btree ("patient_id");