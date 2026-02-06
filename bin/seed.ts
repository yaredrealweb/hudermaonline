import "dotenv/config";
import { db } from "../lib/db";
import * as schema from "../drizzle/schema"; // Import your entire schema object
import { seed, reset } from "drizzle-seed";

async function main() {
  // 1. (Optional) Reset the DB to start fresh
  console.log("Resetting database...");
  await reset(db, schema);

  // 2. Seed the database
  console.log("Seeding database...");
  await seed(db, schema).refine((f) => ({
    // Skip complex cyclic tables for now; they depend on scheduled logic
    appointment: { count: 0 },
    appointmentMeeting: { count: 0 },
    appointmentReschedule: { count: 0 },
  }));

  console.log("Seeding completed!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
