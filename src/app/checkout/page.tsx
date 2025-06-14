"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, CreditCard, Shield, Plus, Check, Edit2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InlineSpinner } from "@/components/ui/loading-spinner";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, loading } = useAuth() || { user: null, loading: true };
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    type: "HOME"
  });

  const totalAmount = getTotalPrice();
  const discount = 0; // Calculate discount if needed
  const finalAmount = totalAmount - discount;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with return URL
      router.push('/auth/login?returnUrl=' + encodeURIComponent('/checkout'));
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push("/tests");
    }
  }, [items, router, orderPlaced]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses");
      
      if (response.ok) {
        const data = await response.json();
        const addresses = data.addresses || [];
        setAddresses(addresses);
        const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    setGeneralError("");

    switch (currentStep) {
      case 1: // Order Review - no validation needed
        break;
      case 2: // Address validation
        if (!selectedAddressId && !newAddress.line1.trim()) {
          newErrors.address = "Please select an existing address or add a new one";
        }
        if (newAddress.line1.trim()) {
          if (!newAddress.line1.trim()) {
            newErrors.line1 = "Address Line 1 is required";
          }
          if (!newAddress.city.trim()) {
            newErrors.city = "City is required";
          }
          if (!newAddress.state.trim()) {
            newErrors.state = "State is required";
          }
          if (!newAddress.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
          } else if (!/^\d{6}$/.test(newAddress.pincode)) {
            newErrors.pincode = "Pincode must be 6 digits";
          }
        }
        break;
      case 3: // Schedule validation
        if (!selectedDate) {
          newErrors.date = "Please select a preferred date";
        }
        if (!selectedTime) {
          newErrors.time = "Please select a preferred time slot";
        }
        break;
      case 4: // Payment validation
        if (!paymentMethod) {
          newErrors.payment = "Please select a payment method";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    const newErrors: Record<string, string> = {};
    setGeneralError("");

    // Address validation
    if (!selectedAddressId && !newAddress.line1.trim()) {
      newErrors.address = "Please select an existing address or add a new one";
    }
    if (newAddress.line1.trim()) {
      if (!newAddress.line1.trim()) {
        newErrors.line1 = "Address Line 1 is required";
      }
      if (!newAddress.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!newAddress.state.trim()) {
        newErrors.state = "State is required";
      }
      if (!newAddress.pincode.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(newAddress.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
    }

    // Schedule validation
    if (!selectedDate) {
      newErrors.date = "Please select a preferred date";
    }
    if (!selectedTime) {
      newErrors.time = "Please select a preferred time slot";
    }

    // Payment validation
    if (!paymentMethod) {
      newErrors.payment = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processOrder = async (addressId: string, date: string, time: string, method: string) => {
    const orderData = {
      items: items.map(item => ({
        testId: item.id,
        quantity: item.quantity,
        price: item.discountPrice || item.price
      })),
      addressId,
      scheduledDate: date,
      scheduledTime: time,
      paymentMethod: method,
      totalAmount: finalAmount
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create order");
    }

    const responseData = await response.json();
    const order = responseData.order;

    if (method === "cod") {
      setOrderPlaced(true);
      clearCart();
      router.push(`/orders/success?orderId=${order.id}`);
    } else {
      // Handle Razorpay payment
      await initiateRazorpayPayment(order);
    }
  };

  const initiateRazorpayPayment = async (order: any) => {
    try {
      const paymentResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          orderId: order.id
        })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initialize payment");
      }

      const paymentData = await paymentResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: "INR",
        name: "Lynk Labs",
        description: "Lab Test Payment",
        order_id: paymentData.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.id
              })
            });

            if (verifyResponse.ok) {
              setOrderPlaced(true);
              clearCart();
              router.push(`/orders/success?orderId=${order.id}`);
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(errorData.error || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setGeneralError("Payment verification failed. Please contact support.");
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.error("Payment cancelled");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#337B93"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      setGeneralError("Payment initialization failed. Please try again.");
      toast.error("Payment initialization failed");
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAllFields()) {
      setGeneralError("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);
    setIsSubmitting(true);
    setGeneralError("");
    
    try {
      const addressId = selectedAddressId || await createNewAddress();
      await processOrder(addressId, selectedDate, selectedTime, paymentMethod);
    } catch (error: any) {
      console.error("Order placement error:", error);
      setGeneralError(error.message || "Failed to place order. Please try again.");
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const createNewAddress = async () => {
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create address");
      }

      const responseData = await response.json();
      return responseData.address.id;
    } catch (error) {
      console.error("Address creation error:", error);
      throw error;
    }
  };

  // Generate time slots
  const timeSlots = [
    "06:00-09:00", "09:00-12:00", "12:00-15:00", 
    "15:00-18:00", "18:00-21:00"
  ];

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    };
  });

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (handled by useEffect)
  if (!user) {
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container-padding py-4">
          <div className="flex items-center gap-4">
            <Link href="/tests">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Checkout</h1>
              <p className="text-sm text-muted-foreground">Complete your order</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-padding py-8">
        {/* General Error Alert */}
        {generalError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Review */}
            <Card className="medical-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    Order Review
                  </CardTitle>
                  <Badge variant="secondary">
                    {items.length} {items.length === 1 ? 'test' : 'tests'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.category.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          Qty: {item.quantity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="font-semibold text-sm">
                        ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                      </div>
                      {item.discountPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  Sample Collection Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.address && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.address}</AlertDescription>
                  </Alert>
                )}
                
                {addresses.length > 0 && selectedAddressId && (
                  <div className="space-y-4">
                    {/* Selected Address Display */}
                    {(() => {
                      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
                      return selectedAddress ? (
                        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={selectedAddress.type === "HOME" ? "default" : "secondary"}>
                                {selectedAddress.type}
                              </Badge>
                              {selectedAddress.isDefault && (
                                <Badge variant="outline">Default</Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAddressId("")}
                              className="text-xs"
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Change
                            </Button>
                          </div>
                          <p className="text-sm font-medium">
                            {selectedAddress.line1}
                            {selectedAddress.line2 && `, ${selectedAddress.line2}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Address Selection (shown when no address selected or user clicks change) */}
                {(!selectedAddressId && addresses.length > 0) && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Select an address</h4>
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-start space-x-3">
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                            <div className="p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={address.type === "HOME" ? "default" : "secondary"}>
                                  {address.type}
                                </Badge>
                                {address.isDefault && (
                                  <Badge variant="outline">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm">
                                {address.line1}
                                {address.line2 && `, ${address.line2}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Add New Address */}
                {(!selectedAddressId || addresses.length === 0) && (
                  <div className={addresses.length > 0 ? "border-t pt-4" : ""}>
                    <h4 className="font-medium mb-3">
                      {addresses.length > 0 ? "Or add a new address" : "Add delivery address"}
                    </h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="line1" className="text-sm font-medium">
                          Address Line 1 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="line1"
                          name="line1"
                          placeholder="House/Flat No., Building Name"
                          value={newAddress.line1}
                          onChange={(e) => {
                            setNewAddress(prev => ({ ...prev, line1: e.target.value }));
                            if (errors.line1) {
                              setErrors(prev => ({ ...prev, line1: "" }));
                            }
                          }}
                          autoComplete="address-line1"
                          className={errors.line1 ? "border-red-500" : ""}
                        />
                        {errors.line1 && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.line1}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="line2" className="text-sm font-medium">
                          Address Line 2 <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>
                        </Label>
                        <Input
                          id="line2"
                          name="line2"
                          placeholder="Area, Landmark (Optional)"
                          value={newAddress.line2}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                          autoComplete="address-line2"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="Enter city"
                            value={newAddress.city}
                            onChange={(e) => {
                              setNewAddress(prev => ({ ...prev, city: e.target.value }));
                              if (errors.city) {
                                setErrors(prev => ({ ...prev, city: "" }));
                              }
                            }}
                            autoComplete="address-level2"
                            className={errors.city ? "border-red-500" : ""}
                          />
                          {errors.city && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.city}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pincode" className="text-sm font-medium">
                            Pincode <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            placeholder="000000"
                            value={newAddress.pincode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setNewAddress(prev => ({ ...prev, pincode: value }));
                              if (errors.pincode) {
                                setErrors(prev => ({ ...prev, pincode: "" }));
                              }
                            }}
                            autoComplete="postal-code"
                            className={errors.pincode ? "border-red-500" : ""}
                          />
                          {errors.pincode && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          placeholder="Enter state"
                          value={newAddress.state}
                          onChange={(e) => {
                            setNewAddress(prev => ({ ...prev, state: e.target.value }));
                            if (errors.state) {
                              setErrors(prev => ({ ...prev, state: "" }));
                            }
                          }}
                          autoComplete="address-level1"
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  Schedule Sample Collection
                </CardTitle>
                <CardDescription>
                  Our certified phlebotomist will visit your address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Preferred Date *
                  </Label>
                  <RadioGroup value={selectedDate} onValueChange={(value) => {
                    setSelectedDate(value);
                    if (errors.date) {
                      setErrors(prev => ({ ...prev, date: "" }));
                    }
                  }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableDates.map((date) => (
                        <div key={date.value} className="flex items-center space-x-3">
                          <RadioGroupItem value={date.value} id={date.value} />
                          <Label htmlFor={date.value} className="flex-1 cursor-pointer">
                            <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="font-medium text-sm">{date.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {date.value === availableDates[0]?.value ? "Tomorrow" : 
                                 date.value === availableDates[1]?.value ? "Day after" : "Available"}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  {errors.date && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Preferred Time Slot *
                  </Label>
                  <RadioGroup value={selectedTime} onValueChange={(value) => {
                    setSelectedTime(value);
                    if (errors.time) {
                      setErrors(prev => ({ ...prev, time: "" }));
                    }
                  }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <div key={slot} className="flex items-center space-x-3">
                          <RadioGroupItem value={slot} id={slot} />
                          <Label htmlFor={slot} className="flex-1 cursor-pointer">
                            <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="font-medium text-sm">{slot}</div>
                              <div className="text-xs text-muted-foreground">
                                {slot === "06:00-09:00" ? "Early Morning" :
                                 slot === "09:00-12:00" ? "Morning" :
                                 slot === "12:00-15:00" ? "Afternoon" :
                                 slot === "15:00-18:00" ? "Evening" : "Night"}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  {errors.time && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-4 py-2 px-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Secure Payment</span>
                  </div>
                  <div className="text-xs text-green-600">
                    Protected by 256-bit SSL encryption
                  </div>
                </div>
                
                <RadioGroup value={paymentMethod} onValueChange={(value) => {
                  setPaymentMethod(value);
                  if (errors.payment) {
                    setErrors(prev => ({ ...prev, payment: "" }));
                  }
                }}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="font-medium">Pay Online</span>
                            <Badge variant="secondary">Recommended</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            UPI, Cards, Wallets, Net Banking
                          </p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="font-medium">Cash on Sample Collection</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay when our executive visits for sample collection
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                {errors.payment && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.payment}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Desktop Place Order Button */}
            <div className="hidden md:block">
              <Button
                onClick={handlePlaceOrder}
                disabled={isLoading || isSubmitting}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {isLoading || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </div>
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="medical-card sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sample Collection</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{finalAmount.toLocaleString()}</span>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Inclusive of all taxes
                </p>

                {/* Place Order Button in Order Summary */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || isSubmitting}
                  className="w-full h-11 text-sm font-semibold mt-4"
                  size="lg"
                >
                  {isLoading || isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <InlineSpinner size="sm" variant="white" />
                      Processing...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="medical-card">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Shield className="h-3 w-3" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Shield className="h-3 w-3" />
                      <span>PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Shield className="h-3 w-3" />
                      <span>NABL Certified</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>100% Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>Free Sample Collection</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>NABL Certified Reports</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>24/7 Customer Support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'test' : 'tests'}
              </span>
            </div>
            <div className="text-right">
              <div className="font-semibold">₹{finalAmount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Inclusive of all taxes</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-1">
            <Shield className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Secure Payment</span>
            <Separator orientation="vertical" className="h-3" />
            <Clock className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-blue-600">Reports in 24-48hrs</span>
          </div>

          <Button
            onClick={handlePlaceOrder}
            disabled={isLoading || isSubmitting}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading || isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </div>
      <div className="h-32 md:hidden" />
    </div>
  );
}