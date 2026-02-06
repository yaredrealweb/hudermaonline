"use client";

import { useLanguage } from "@/lib/language-context";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormData, authSchema } from "@/schema/auth";
import { RoleSelector } from "./role-selector";
import {
  Mail,
  User,
  Lock,
  GraduationCap,
  Copyright,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { UserRole } from "@/lib/types";
import { GenderSelector } from "./gender-selector";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { signupAction } from "@/actions/auth-action";
import { ImageUpload } from "@/components/upload/image-upload";
import InputForm from "@/components/form/input-form";
import TeaxtareaForm from "@/components/form/textarea-form";
import { Field, FieldGroup } from "@/components/ui/field";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { signIn } from "@/lib/auth/auth-client";
import GoogleIcon from "@/components/icon/google-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("PATIENT");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const { t } = useLanguage();

  const methods = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: "",
      gender: "male",
      dateOfBirth: undefined,
      phone: undefined,
      specialty: undefined,
      licenseNumber: undefined,
      bio: undefined,
      role,
      faydaImage: undefined,
      faydaId: undefined,
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue } = methods;

  const ethiopianCities = [
    "Addis Ababa",
    "Adama",
    "Dire Dawa",
    "Hawassa",
    "Bahir Dar",
    "Mekelle",
    "Gondar",
    "Jimma",
    "Harar",
    "Jijiga",
  ];

  const handleLoginWithGoogle = async () => {
    await signIn.social({
      provider: "google",
    });
  };

  const onSubmit = async (data: AuthFormData) => {
    try {
      startTransition(async () => {
        const res = await signupAction(data);

        if (!res?.success) {
          setError(res?.message);
        }

        if (res?.success) {
          router.push(
            "/auth/verify-email?email=" + encodeURIComponent(data.email)
          );
          setError(undefined);
        }
      });
    } catch (err: any) {
      toast.error("An unexpected error occurred: " + err.message);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setValue("role", newRole);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
          <RoleSelector role={role} setRole={handleRoleChange} />

          {role === "PATIENT" && (
            <>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
                id="form-rhf-signup"
              >
                {error && (
                  <Alert variant="destructive" className="bg-trasparent mb-4">
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <FieldGroup>
                  <InputForm
                    name="name"
                    label={t("signIn.fullName")}
                    placeholder="John Doe"
                    icon={User}
                    control={methods.control}
                  />

                  <InputForm
                    name="email"
                    label={t("signIn.email")}
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    control={methods.control}
                  />

                  <GenderSelector label={t("signIn.gender")} />

                  <Controller
                    control={methods.control}
                    name="location"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label
                          htmlFor="location"
                          className="text-sm font-medium text-white"
                        >
                          Location
                        </label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="location"
                            className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                          >
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 text-white border-white/20">
                            {ethiopianCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <p className="text-sm text-destructive mt-1">
                            {fieldState.error?.message}
                          </p>
                        )}
                      </Field>
                    )}
                  />

                  {/* {role === "DOCTOR" && (
                <>
                  <InputForm
                    name="specialty"
                    label="Specialty"
                    placeholder="e.g. Cardiology"
                    icon={GraduationCap}
                    control={methods.control}
                  />

                  <InputForm
                    name="licenseNumber"
                    label="License Number"
                    placeholder="Enter your license number"
                    icon={Copyright}
                    control={methods.control}
                  />

                  <InputForm
                    name="faydaId"
                    label="Fayda ID"
                    placeholder="Enter your fayda id"
                    icon={IdCard}
                    control={methods.control}
                  />

                  <ImageUpload
                    onUploadSuccess={(url) => setValue("faydaImage", url)}
                    label="Fayda Image"
                  />
                  <TeaxtareaForm
                    name="bio"
                    label="Bio"
                    placeholder="Tell us about yourself"
                    control={methods.control}
                  />
                </>
              )} */}

                  <InputForm
                    name="password"
                    label={t("signIn.password")}
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    control={methods.control}
                  />
                </FieldGroup>
              </form>

              <Field>
                <Button
                  type="submit"
                  disabled={isPending}
                  form="form-rhf-signup"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all mt-4 sm:mt-6 text-sm sm:text-base"
                >
                  {isPending && <Spinner />} {t("signIn.signUp")}
                </Button>
              </Field>
              <div className="relative flex items-center py-5">
                <div className="grow border-t border-gray-300"></div>
                <span className="shrink mx-4 text-gray-400 text-sm font-medium">
                  OR
                </span>
                <div className="grow border-t border-gray-300"></div>
              </div>
            </>
          )}
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2  sm:text-s bg-blue-600 text-white border-2 border-blue-600`}
          >
            <GoogleIcon />
            <span className="hidden sm:inline">Continue with google</span>
            <span className="sm:hidden"> Continue with google</span>
          </button>

          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-slate-400 hover:text-blue-400 transition-colors text-xs sm:text-sm"
            >
              <span className="text-blue-400 font-semibold">
                {t("signIn.signIn")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
