CREATE TABLE "prescription" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"title" text,
	"note" text,
	"image_url" text NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prescription_doctor_idx" ON "prescription" USING btree ("doctor_id", "created_at");--> statement-breakpoint
CREATE INDEX "prescription_patient_idx" ON "prescription" USING btree ("patient_id", "created_at");