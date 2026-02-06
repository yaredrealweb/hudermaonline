import { LoginForm } from "@/features/auth/components/login-form";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

export default Page;
