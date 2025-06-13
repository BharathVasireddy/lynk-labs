"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, MapPin, Phone, Mail, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  finalAmount: number;
  paymentMethod: string;
  paymentId?: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    test: {
      id: string;
      name: string;
      slug: string;
      category: {
        name: string;
      };
    };
  }>;
  address: {
    type: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  homeVisit: {
    scheduledDate: string;
    scheduledTime: string;
    status: string;
  };
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      router.push("/orders");
      return;
    }

    fetchOrderDetails();
  }, [orderId, router]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        setError("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for choosing Lynk Labs. Your order has been successfully placed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order Summary
                  <Badge variant={order.status === "CONFIRMED" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Order #{order.orderNumber} • Placed on {formatDate(order.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.test.name}</h4>
                        <p className="text-sm text-gray-500">{item.test.category.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity} {item.quantity === 1 ? 'patient' : 'patients'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{order.finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Home Visit Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Home Visit Scheduled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{formatDate(order.homeVisit.scheduledDate)}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(order.homeVisit.scheduledTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Collection Address</p>
                      <p className="text-sm text-gray-600">
                        {order.address.line1}
                        {order.address.line2 && `, ${order.address.line2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.address.city}, {order.address.state} - {order.address.pincode}
                      </p>
                      {order.address.landmark && (
                        <p className="text-sm text-gray-500">
                          Near {order.address.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod === "razorpay" ? "Online Payment" : order.paymentMethod}
                    </span>
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm">{order.paymentId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium">₹{order.finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Confirmation Call</p>
                    <p className="text-sm text-gray-600">
                      Our team will call you within 30 minutes to confirm your appointment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Sample Collection</p>
                    <p className="text-sm text-gray-600">
                      Our phlebotomist will visit your address at the scheduled time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Report Delivery</p>
                    <p className="text-sm text-gray-600">
                      Your reports will be available within 24-48 hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email Us</p>
                    <p className="text-sm text-gray-600">support@lynklabs.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/orders">
                  View All Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
} 