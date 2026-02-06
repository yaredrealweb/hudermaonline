import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100 p-4">
      <Card className="border-0 shadow-lg max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="text-5xl">🔐</div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-600">
            Your current role doesn't have access to this page. If you believe
            this is an error, please contact support.
          </p>

          <Link href="/" className="block">
            <Button className="w-full bg-primary hover:bg-primary-dark">
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/auth/login" className="block">
            <Button
              variant="outline"
              className="w-full border-neutral-300 bg-transparent"
            >
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
