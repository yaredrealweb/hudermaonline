"use server";

import { auth } from "@/lib/auth";
import { linkSocial, listAccounts, updateUser } from "@/lib/auth/auth-client";
import { AuthFormData, LoginFormData, UpdateProfileData } from "@/schema/auth";

export const loginAction = async (
  data: LoginFormData,
  callbackUrl?: string | null,
) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl ?? undefined,
      },
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Login failed: " + (error as Error).message,
    };
  }
};

export const signupAction = async (data: AuthFormData) => {
  try {
    const res = await auth.api.signUpEmail({
      body: data,
    });

    if (res.user) {
      return {
        success: true,
        message: "Signup successful. Please verify your email.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Signup failed: " + (error as Error).message,
    };
  }
};

export const upgradeScopes = async () => {
  try {
    await linkSocial({
      provider: "google",
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    });
  } catch (error) {
    console.error("Failed to upgrade scopes:", error);
  }
};

export const checkScopes = async () => {
  const { data: accounts, error } = await listAccounts();

  if (error) {
    console.error(error.message);
    return;
  }

  const googleAccount = accounts?.find((acc) => acc.providerId === "google");

  if (googleAccount) {
    const hasCalendarScope = googleAccount.scopes.includes(
      "https://www.googleapis.com/auth/calendar",
    );

    const hasEventsScope = googleAccount.scopes.includes(
      "https://www.googleapis.com/auth/calendar.events",
    );

    if (!hasCalendarScope || !hasEventsScope) {
      await upgradeScopes();
    }
  }
};
