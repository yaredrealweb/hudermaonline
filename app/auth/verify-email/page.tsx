"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Card className="bg-transparent border-none shadow-none text-center">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Mail className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription className="text-base">
          We have sent a verification link to your email address.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {email && (
          <div className="text-sm">
            <p className="text-neutral-500">Sent to:</p>
            <p className="font-semibold text-white">{email}</p>
          </div>
        )}

        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 text-sm text-left space-y-3">
          <p className="font-medium text-neutral-800">Next steps:</p>
          <ul className="list-disc list-inside text-neutral-600 space-y-2">
            <li>Click the link in the email to verify your account</li>
            <li>
              Check your <strong>spam or promotions</strong> folder
            </li>
            <li>The link will expire in 24 hours</li>
          </ul>
        </div>

        <div className="pt-4">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full bg-primary hover:opacity-90 transition-opacity">
              Return to Login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const VerifyEmailSent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailSent;
