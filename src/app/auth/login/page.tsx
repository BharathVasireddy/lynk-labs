"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login } = useAuth();
  
  const returnUrl = searchParams.get("returnUrl");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      // Check if there's a return URL
      if (returnUrl) {
        router.replace(returnUrl);
      } else {
        // Role-based redirect
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/profile");
        }
      }
    }
  }, [user, authLoading, router, returnUrl]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Register new user
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
            name: fullName.trim(),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to create account");
        }

        // Update auth context with user data
        login(data.user);

        // Redirect to return URL or default location
        if (returnUrl) {
          router.push(returnUrl);
        } else if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/profile");
        }
      } else {
        // Sign in existing user
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Invalid credentials");
        }

        // Update auth context with user data
        login(data.user);

        // Redirect to return URL or default location
        if (returnUrl) {
          router.push(returnUrl);
        } else if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/profile");
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Lynk Labs</h1>
          <p className="text-gray-600">Your trusted partner for diagnostic testing</p>
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Join Lynk Labs for convenient lab testing" 
                : "Access your account and manage your tests"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                  />
                </div>
              )}

              <Button 
                className="w-full"
                onClick={handleEmailAuth}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    {isSignUp ? "Create Account" : "Sign In"}
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setPassword("");
                    setConfirmPassword("");
                    setFullName("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                  disabled={loading}
                >
                  {isSignUp 
                    ? "Already have an account? Sign in" 
                    : "Don't have an account? Create one"
                  }
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-6">
              <p>
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-gray-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-gray-700">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
} 