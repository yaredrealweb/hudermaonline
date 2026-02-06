import { type NextRequest, NextResponse } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isUploadRoute = nextUrl.pathname.startsWith("/api/upload");
  const isTrpcRoute = nextUrl.pathname.startsWith("/api/trpc");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute || isUploadRoute || isTrpcRoute || isPublicRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (session) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!session) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  const hasOnboarded = session.user.hasOnboarded;

  if (!hasOnboarded && nextUrl.pathname !== "/onboarding" && session) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (hasOnboarded && nextUrl.pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return null;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
