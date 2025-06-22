"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function LoginRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "HOME_VISIT_AGENT") {
        router.push("/agent/dashboard");
      } else {
        router.push("/profile");
      }
    } else {
      // Redirect to the main auth login page
      router.push("/auth/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
}