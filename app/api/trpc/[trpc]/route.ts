import { appRouter } from "@/server";
import { createTRPCContext } from "@/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export const GET = handler;
export const POST = handler;
