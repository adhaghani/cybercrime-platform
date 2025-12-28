import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";
import { generateMetadata } from "@/lib/seo";

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-sm">
      <div className="animate-pulse">
        <div className="bg-gray-200 h-8 w-32 mb-4 rounded"></div>
        <div className="bg-gray-200 h-4 w-48 mb-6 rounded"></div>
        <div className="space-y-4">
          <div className="bg-gray-200 h-10 w-full rounded"></div>
          <div className="bg-gray-200 h-10 w-full rounded"></div>
          <div className="bg-gray-200 h-10 w-full rounded"></div>
        </div>
      </div>
    </div>
  );
}

export const metadata = generateMetadata({
  title: "Login - Cybercrime Reporting Platform",
  description: "Login to access your Cybercrime Reporting Platform account.",
    canonical: "/auth/login",
});

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
