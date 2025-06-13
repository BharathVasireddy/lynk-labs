"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, CreditCard, Shield, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useCartStore } from "@/store/cart";
import { useAuth } from "@/contexts/auth-context";

interface Address {
  id: string;
  type: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user, loading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Address form state
  const [addressForm, setAddressForm] = useState({
    type: "HOME",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (items.length === 0) {
      router.push("/tests");
      return;
    }

    fetchAddresses();
    generateTimeSlots();
  }, [user, loading, items, router]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
        
        // Auto-select default address
        const defaultAddress = data.addresses?.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const generateTimeSlots = () => {
    // Generate next 7 days
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Auto-select tomorrow
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
      setSelectedTime("10:00-11:00");
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(prev => [...prev, data.address]);
        setSelectedAddress(data.address.id);
        setShowAddressForm(false);
        setAddressForm({
          type: "HOME",
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          landmark: "",
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: couponCode,
          orderAmount: getTotalPrice()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscount(data.discount);
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Invalid coupon code");
        setDiscount(0);
      }
    } catch (error) {
      setError("Failed to apply coupon");
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError("Please select a home visit time");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            testId: item.id,
            quantity: item.quantity,
            price: item.discountPrice || item.price,
          })),
          addressId: selectedAddress,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          couponCode: couponCode || null,
          paymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      if (paymentMethod === "razorpay") {
        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: (getTotalPrice() - discount) * 100, // Amount in paise
          currency: "INR",
          name: "Lynk Labs",
          description: "Health Test Booking",
          order_id: orderData.razorpayOrderId,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              clearCart();
              router.push(`/orders/${orderData.order.id}?success=true`);
            } else {
              setError("Payment verification failed");
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          theme: {
            color: "#0066CC",
          },
        };

        // @ts-expect-error - Razorpay is loaded via script tag
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Cash on delivery
        clearCart();
        router.push(`/orders/${orderData.order.id}?success=true`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = getTotalPrice();
  const finalAmount = totalAmount - discount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-medical-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/tests">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">Complete your order</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Order Summary ({getTotalItems()} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.discountPrice || item.price) * item.quantity}</p>
                      {item.discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">₹{item.price * item.quantity}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 ? (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{address.type}</Badge>
                              {address.isDefault && <Badge variant="secondary">Default</Badge>}
                            </div>
                            <p className="font-medium">{address.line1}</p>
                            {address.line2 && <p className="text-sm text-muted-foreground">{address.line2}</p>}
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            {address.landmark && (
                              <p className="text-sm text-muted-foreground">Near: {address.landmark}</p>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-muted-foreground">No addresses found</p>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>

                {showAddressForm && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Address Type</Label>
                        <RadioGroup
                          value={addressForm.type}
                          onValueChange={(value) => setAddressForm(prev => ({ ...prev, type: value }))}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="HOME" id="home" />
                            <Label htmlFor="home">Home</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="WORK" id="work" />
                            <Label htmlFor="work">Work</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="OTHER" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <Label>Address Line 1 *</Label>
                      <Input
                        value={addressForm.line1}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                        placeholder="House/Flat No., Building Name"
                      />
                    </div>

                    <div>
                      <Label>Address Line 2</Label>
                      <Input
                        value={addressForm.line2}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                        placeholder="Street, Area, Locality"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City *</Label>
                        <Input
                          value={addressForm.city}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label>State *</Label>
                        <Input
                          value={addressForm.state}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Pincode *</Label>
                        <Input
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="Pincode"
                        />
                      </div>
                      <div>
                        <Label>Landmark</Label>
                        <Input
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                          placeholder="Nearby landmark"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddAddress} className="flex-1">
                        Save Address
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Home Visit Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Schedule Home Visit
                </CardTitle>
                <CardDescription>
                  Our trained phlebotomist will visit your address for sample collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Date</Label>
                  <RadioGroup value={selectedDate} onValueChange={setSelectedDate} className="mt-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i + 1);
                      const dateStr = date.toISOString().split('T')[0];
                      const displayDate = date.toLocaleDateString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      });
                      
                      return (
                        <div key={dateStr} className="flex items-center space-x-2">
                          <RadioGroupItem value={dateStr} id={dateStr} />
                          <Label htmlFor={dateStr}>{displayDate}</Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Select Time Slot</Label>
                  <RadioGroup value={selectedTime} onValueChange={setSelectedTime} className="mt-2">
                    {[
                      "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
                      "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
                    ].map((slot) => (
                      <div key={slot} className="flex items-center space-x-2">
                        <RadioGroupItem value={slot} id={slot} />
                        <Label htmlFor={slot}>{slot}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Pay Online (Recommended)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Collection</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Home Collection</span>
                    <span>FREE</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{finalAmount}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <Label>Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                    />
                    <Button variant="outline" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress || !selectedDate || !selectedTime}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - ₹${finalAmount}`
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our Terms & Conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


    </div>
  );
} 