"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle, Eye, Download, Calendar, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  createdAt: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderItems: {
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
  }[];
  homeVisit: {
    id: string;
    scheduledDate: string;
    scheduledTime: string;
    status: string;
    collectionTime?: string;
    agentId?: string;
  } | null;
  reports: {
    id: string;
    fileName: string;
    uploadedAt: string;
  }[];
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  SAMPLE_COLLECTION_SCHEDULED: { label: "Collection Scheduled", color: "bg-purple-100 text-purple-800", icon: Calendar },
  SAMPLE_COLLECTED: { label: "Sample Collected", color: "bg-indigo-100 text-indigo-800", icon: Package },
  PROCESSING: { label: "Processing", color: "bg-orange-100 text-orange-800", icon: Clock },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatScheduledDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medical-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track your test bookings and download reports</p>
          </div>

          {/* Status Filter Tabs */}
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
              <TabsTrigger value="SAMPLE_COLLECTION_SCHEDULED">Scheduled</TabsTrigger>
              <TabsTrigger value="SAMPLE_COLLECTED">Collected</TabsTrigger>
              <TabsTrigger value="PROCESSING">Processing</TabsTrigger>
              <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
              <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {selectedStatus === "all" ? "No orders found" : `No ${statusConfig[selectedStatus as keyof typeof statusConfig]?.label.toLowerCase()} orders`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {selectedStatus === "all" 
                    ? "You haven't placed any orders yet. Browse our tests to get started."
                    : "No orders match the selected status filter."
                  }
                </p>
                {selectedStatus === "all" && (
                  <Button asChild>
                    <Link href="/tests">Browse Tests</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = statusInfo?.icon || Package;

                return (
                  <Card key={order.id} className="medical-card-hover">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order #{order.orderNumber}
                          </CardTitle>
                          <CardDescription>
                            Placed on {formatDate(order.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusInfo?.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo?.label}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-2">Tests Ordered ({order.orderItems.length})</h4>
                        <div className="space-y-2">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">{item.test.name}</p>
                                <p className="text-sm text-muted-foreground">{item.test.category.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{item.price}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Home Visit Info */}
                      {order.homeVisit && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Home Visit
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Date:</strong> {formatScheduledDate(order.homeVisit.scheduledDate)}</p>
                              <p><strong>Time:</strong> {order.homeVisit.scheduledTime}</p>
                              <p><strong>Status:</strong> 
                                <Badge variant="outline" className="ml-2">
                                  {order.homeVisit.status.replace(/_/g, ' ')}
                                </Badge>
                              </p>
                              {order.homeVisit.collectionTime && (
                                <p><strong>Collected:</strong> {formatDate(order.homeVisit.collectionTime)}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Collection Address
                            </h4>
                            <div className="text-sm space-y-1">
                              <p>{order.address.line1}</p>
                              {order.address.line2 && <p>{order.address.line2}</p>}
                              <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Order Summary & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm">
                            <span>Subtotal: ₹{order.totalAmount}</span>
                            {order.discountAmount > 0 && (
                              <span className="text-green-600">Discount: -₹{order.discountAmount}</span>
                            )}
                          </div>
                          <p className="font-semibold">Total: ₹{order.finalAmount}</p>
                          <p className="text-sm text-muted-foreground">
                            Payment: {order.paymentMethod === "razorpay" ? "Online" : "Cash on Collection"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Download Reports */}
                          {order.reports.length > 0 && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download Reports ({order.reports.length})
                            </Button>
                          )}

                          {/* Reorder */}
                          {order.status === "COMPLETED" && (
                            <Button variant="outline" size="sm">
                              <Package className="h-4 w-4 mr-2" />
                              Reorder
                            </Button>
                          )}

                          {/* Contact Support */}
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Support
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 