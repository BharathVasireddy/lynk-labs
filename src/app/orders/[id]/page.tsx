"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  ArrowLeft, 
  Download, 
  Truck, 
  Mail,
  Home,
  CreditCard,
  Package,
  User,
  Shield,
  FileText,
  Share2,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
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
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  couponCode?: string;
  createdAt: string;
  address: {
    type: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  orderItems: OrderItem[];
  homeVisit: {
    scheduledDate: string;
    scheduledTime: string;
    status: string;
    agentId?: string;
  };
  reports: any[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSuccess = searchParams.get("success") === "true";
  const orderId = params.id as string;

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const url = isSuccess 
        ? `/api/orders/${orderId}?success=true`
        : `/api/orders/${orderId}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Order not found");
      }
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "SAMPLE_COLLECTED":
        return "bg-purple-100 text-purple-800";
      case "PROCESSING":
        return "bg-orange-100 text-orange-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order.orderNumber} - Lynk Labs`,
        text: `My health test order has been confirmed!`,
        url: window.location.href,
      });
    } else {
      copyOrderNumber();
    }
  };

  return (
    <div className="min-h-screen medical-background">
      {/* Success Banner */}
      {isSuccess && (
        <div className="bg-secondary border-b">
          <div className="container-padding py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Order Placed Successfully!</h2>
                <p className="text-muted-foreground">Your order #{order.orderNumber} has been confirmed.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-card border-b">
        <div className="container-padding py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-muted-foreground">Order #{order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-padding py-8">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Overview */}
            <Card className="medical-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order Information
                  </CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                      <p className="font-semibold">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <p className="font-medium capitalize">{order.paymentMethod.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="font-bold text-primary">₹{order.finalAmount}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Items */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Test Items ({order.orderItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.test.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.test.category.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{item.quantity} {item.quantity === 1 ? 'patient' : 'patients'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Billing Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{order.totalAmount}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-2">
                        <span>Discount</span>
                        {order.couponCode && (
                          <Badge variant="secondary" className="text-xs">
                            {order.couponCode}
                          </Badge>
                        )}
                      </span>
                      <span className="font-medium">-₹{order.discountAmount}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{order.finalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Collection Details */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Sample Collection Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Scheduled Date</p>
                    <p className="font-semibold">{formatDate(order.homeVisit.scheduledDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Time Slot</p>
                    <p className="font-semibold">{order.homeVisit.scheduledTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(order.homeVisit.status)}>
                    {order.homeVisit.status.replace("_", " ")}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>NABL Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collection Address */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Collection Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">
                    {order.address.type}
                  </Badge>
                  <p className="font-semibold">{order.address.line1}</p>
                  {order.address.line2 && (
                    <p className="text-muted-foreground">{order.address.line2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                  {order.address.landmark && (
                    <p className="text-sm text-muted-foreground">
                      Near: {order.address.landmark}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full medical-button-primary" asChild>
                  <Link href="/orders">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Link>
                </Button>
                
                {order.reports.length > 0 && (
                  <Button variant="outline" className="w-full medical-button-outline" asChild>
                    <Link href="/reports">
                      <Download className="h-4 w-4 mr-2" />
                      Download Reports
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" className="w-full medical-button-outline" asChild>
                  <Link href="/contact">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 