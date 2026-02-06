"use client";

import { useLanguage } from "@/lib/language-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schema/auth"; // adjust path as needed
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useEffect, useState, useTransition } from "react";
import { loginAction } from "@/actions/auth-action";
import { Field, FieldGroup } from "@/components/ui/field";
import InputForm from "@/components/form/input-form";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth/auth-client";
import GoogleIcon from "@/components/icon/google-icon";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState<string | undefined>(undefined);

  const router = useRouter();
  const { t } = useLanguage();

  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: LoginFormData) => {
    try {
      startTransition(async () => {
        const res = await loginAction(value, callbackUrl);

        if (res?.success) {
          toast.success("Login successful!");
          router.refresh();
          router.push("/");
          setError(undefined);
        } else {
          setError(res?.message);
          toast.error("Login failed: " + (res?.message || "Unknown error"));
        }
      });
    } catch (err: any) {
      toast.error("An unexpected error occurred: " + err.message);
    }
  };

  const handleLoginWithGoogle = async () => {
    await signIn.social({
      provider: "google",
    });
  };

  useEffect(() => {
    const verified = searchParams.get("verified");

    if (verified === "true") {
      toast.success("Email verified successfully!");
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            {t("signIn.signInTab")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to your account to continue
          </p>
        </div>

        <form
          id="form-rhf-login"
          onSubmit={form.handleSubmit(onSubmit)}
          className=""
        >
          {error && (
            <Alert variant="destructive" className="bg-trasparent mb-4">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <FieldGroup>
            <InputForm
              name="email"
              control={form.control}
              label={t("signIn.email")}
              placeholder="you@example.com"
              type="email"
              icon={Mail}
            />
            <InputForm
              name="password"
              control={form.control}
              label={t("signIn.password")}
              placeholder="••••••••"
              type="password"
              icon={Lock}
            />
          </FieldGroup>
        </form>

        <Field>
          <Button
            type="submit"
            disabled={isPending}
            form="form-rhf-login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all mt-4 sm:mt-6 text-sm sm:text-base"
          >
            {isPending && <Spinner />}
            {t("signIn.signIn")}
          </Button>
        </Field>
        <div className="relative flex items-center py-5">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-gray-400 text-sm font-medium">
            OR
          </span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={handleLoginWithGoogle}
          className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2  sm:text-s bg-blue-600 text-white border-2 border-blue-600 `}
        >
          <GoogleIcon />
          <span className="hidden sm:inline">Continue with google</span>
          <span className="sm:hidden"> Continue with google</span>
        </button>

        <div className="mt-4 sm:mt-6 text-center">
          <Link
            href="/auth/signup"
            className="text-slate-400 hover:text-blue-400 transition-colors text-xs sm:text-sm"
          >
            {t("signIn.dontHaveAccount")}{" "}
            <span className="text-blue-400 font-semibold">
              {t("signIn.createOne")}
            </span>
          </Link>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <p className="text-slate-500 text-xs text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
