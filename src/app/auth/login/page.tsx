"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  // WhatsApp login state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [whatsappStep, setWhatsappStep] = useState<"phone" | "otp" | "profile">("phone");
  
  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile completion state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("whatsapp");
  
  const router = useRouter();
  const { login } = useAuth();

  // WhatsApp Authentication Functions
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/whatsapp/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+91${phoneNumber}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      // In development, show the OTP for testing
      if (process.env.NODE_ENV === "development" && data.otp) {
        console.log("Development OTP:", data.otp);
        setError(`Development OTP: ${data.otp}`);
      }

      setWhatsappStep("otp");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/whatsapp/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+91${phoneNumber}`,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Check if user needs to complete profile
      if (data.requiresProfile) {
        setWhatsappStep("profile");
      } else {
        login(data.user);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete profile");
      }

      login(data.user);
      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  // Email Authentication Functions
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
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          ...(isSignUp && { name: fullName.trim() }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isSignUp ? "register" : "login"}`);
      }

      login(data.user);
      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${isSignUp ? "register" : "login"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-medical-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Lynk Labs</h1>
          <p className="text-muted-foreground">Sign in to access your health dashboard</p>
        </div>

        <Card className="medical-card-hover">
          <CardHeader className="text-center pb-4">
            <CardTitle>
              {whatsappStep === "profile" 
                ? "Complete Your Profile" 
                : activeTab === "email" && isSignUp 
                  ? "Create Account" 
                  : "Sign In"
              }
            </CardTitle>
            <CardDescription>
              {whatsappStep === "profile" 
                ? "Please provide your details to receive reports and manage your account"
                : activeTab === "email" && isSignUp
                  ? "Create your Lynk Labs account to get started"
                  : "Choose your preferred sign-in method"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {whatsappStep === "profile" ? (
              /* Profile Completion Form */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name *</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={(e) => {
                      setProfileData(prev => ({ ...prev, name: e.target.value }));
                      setError("");
                    }}
                    className="medical-input h-12"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={profileData.email}
                    onChange={(e) => {
                      setProfileData(prev => ({ ...prev, email: e.target.value }));
                      setError("");
                    }}
                    className="medical-input h-12"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                                            We&apos;ll send your test reports to this email address
                  </p>
                </div>

                <Button 
                  className="w-full medical-button-primary h-12"
                  onClick={handleCompleteProfile}
                  disabled={loading || !profileData.name.trim() || !profileData.email.trim()}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Completing Profile...
                    </div>
                  ) : (
                    "Complete Profile & Continue"
                  )}
                </Button>
              </div>
            ) : (
              /* Authentication Tabs */
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="whatsapp" className="space-y-4 mt-6">
                  {whatsappStep === "phone" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-lg h-12">
                            <span className="text-sm text-muted-foreground">+91</span>
                          </div>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) => {
                              setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                              setError("");
                            }}
                            className="medical-input rounded-l-none h-12"
                            maxLength={10}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <Button 
                        className="w-full medical-button-primary h-12"
                        onClick={handleSendOTP}
                        disabled={loading || phoneNumber.length < 10}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending OTP...
                          </div>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send OTP via WhatsApp
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {whatsappStep === "otp" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Verification Code</label>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                            setError("");
                          }}
                          className="medical-input text-center text-lg tracking-widest h-12"
                          maxLength={6}
                          disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          Code sent to +91 {phoneNumber}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline"
                          className="flex-1 medical-button-outline h-12"
                          onClick={() => {
                            setWhatsappStep("phone");
                            setOtp("");
                            setError("");
                          }}
                          disabled={loading}
                        >
                          Change Number
                        </Button>
                        <Button 
                          className="flex-1 medical-button-primary h-12"
                          onClick={handleVerifyOTP}
                          disabled={loading || otp.length !== 6}
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Verifying...
                            </div>
                          ) : (
                            "Verify & Continue"
                          )}
                        </Button>
                      </div>

                      <div className="text-center">
                        <button 
                          className="text-sm text-primary hover:text-primary/80 liquid-hover"
                          onClick={handleSendOTP}
                          disabled={loading}
                        >
                          Didn&apos;t receive code? Resend
                        </button>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="email" className="space-y-4 mt-6">
                  {isSignUp && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setError("");
                        }}
                        className="medical-input h-12"
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="medical-input h-12"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className="medical-input h-12 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Confirm Password</label>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        className="medical-input h-12"
                        disabled={loading}
                      />
                    </div>
                  )}

                  <Button 
                    className="w-full medical-button-primary h-12"
                    onClick={handleEmailAuth}
                    disabled={loading || !email.trim() || !password.trim() || (isSignUp && (!fullName.trim() || password !== confirmPassword))}
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
                      className="text-sm text-primary hover:text-primary/80 liquid-hover"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                        setPassword("");
                        setConfirmPassword("");
                        setFullName("");
                      }}
                      disabled={loading}
                    >
                      {isSignUp ? "Already have an account? Sign in" : "Don&apos;t have an account? Sign up"}
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>By continuing, you agree to our</p>
          <div className="flex justify-center gap-4 mt-1">
            <a href="/terms" className="text-primary hover:text-primary/80 liquid-hover">Terms of Service</a>
            <a href="/privacy" className="text-primary hover:text-primary/80 liquid-hover">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}