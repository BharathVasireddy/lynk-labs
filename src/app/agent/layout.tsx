"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // CRITICAL: Enforce agent authentication
    if (!loading && (!user || user.role !== "HOME_VISIT_AGENT")) {
      router.push("/auth/login?returnUrl=/agent/dashboard");
      return;
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying agent access...</p>
        </div>
      </div>
    );
  }

  // Block access if not agent
  if (!user || user.role !== "HOME_VISIT_AGENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access the agent panel. Please contact your administrator if you believe this is an error.
          </p>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content - No Header or Footer */}
      <main className="h-screen">
        {children}
      </main>
    </div>
  );
} 