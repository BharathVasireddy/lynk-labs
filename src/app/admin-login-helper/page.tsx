"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn } from "lucide-react";

export default function AdminLoginHelper() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("+919999999999");
  const [password, setPassword] = useState("password123");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: phone, // NextAuth expects 'email' field name, but we're sending phone number
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/admin/agents");
      } else {
        alert("Login failed: " + result?.error);
      }
    } catch (error) {
      alert("Login error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login Helper</CardTitle>
          <CardDescription>
            Quick login to access the agent management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Admin Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919999999999"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Admin Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
            />
          </div>
          
          <Button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Logging in..." : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login as Admin
              </>
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p><strong>Default Admin Credentials:</strong></p>
            <p>Phone: +919999999999</p>
            <p>Password: password123</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
            <p className="text-blue-800">
              <strong>After login, you'll be redirected to:</strong><br />
              /admin/agents - Agent Management System
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 