"use client";

import { RoleSelector } from "@/features/auth/components/role-selector";
import { useSession } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/types";
import { UpdateProfileData, updateProfileSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Field, FieldGroup } from "@/components/ui/field";
import { Alert, AlertTitle } from "@/components/ui/alert";
import InputForm from "@/components/form/input-form";
import {
  Mail,
  User,
  Lock,
  GraduationCap,
  Copyright,
  IdCard,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { GenderSelector } from "@/features/auth/components/gender-selector";
import TeaxtareaForm from "@/components/form/textarea-form";
import { ImageUpload } from "@/components/upload/image-upload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useUpdateProfile } from "@/hooks/use-auth-mutation";

function page() {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useLanguage();

  const [role, setRole] = useState<UserRole>("PATIENT");

  const methods = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",

      gender: "male",
      dateOfBirth: undefined,
      phone: undefined,
      specialty: undefined,
      licenseNumber: undefined,
      bio: undefined,
      role,
      faydaImage: undefined,
      faydaId: undefined,
      hasOnboarded: true,
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue } = methods;

  const {
    mutateAsync: updateProfile,
    isPending: isUpdatingProfile,
    error,
  } = useUpdateProfile();

  const onSubmit = async (data: UpdateProfileData) => {
    await updateProfile(data);
    router.push("/");
  };

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
      setValue("avatarUrl", session.user.image || "");
    }
  }, [session, router]);

  useEffect(() => {
    console.log(methods.formState.errors);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setValue("role", newRole);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <FormProvider {...methods}>
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
            <RoleSelector role={role} setRole={handleRoleChange} />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
              id="form-rhf-signup"
            >
              {error && (
                <Alert variant="destructive" className="bg-trasparent mb-4">
                  <AlertTitle>{error.message}</AlertTitle>
                </Alert>
              )}
              <FieldGroup>
                <InputForm
                  name="name"
                  label={t("signIn.fullName")}
                  placeholder="John Doe"
                  icon={User}
                  control={methods.control}
                  disable={!!session?.user.name}
                />

                <InputForm
                  name="email"
                  label={t("signIn.email")}
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  control={methods.control}
                  disable={!!session?.user.email}
                />

                <GenderSelector label={t("signIn.gender")} />

                {role === "DOCTOR" && (
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
                )}
              </FieldGroup>
            </form>

            <Field>
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                form="form-rhf-signup"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all mt-4 sm:mt-6 text-sm sm:text-base"
              >
                {isUpdatingProfile && <Spinner />} {t("signIn.continue")}
              </Button>
            </Field>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}

export default page;
