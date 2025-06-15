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
  Copy,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  PauseCircle,
  Star,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface Report {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  isDelivered: boolean;
  deliveredAt: string | null;
}

interface StatusHistory {
  id: string;
  status: string;
  notes: string | null;
  createdAt: string;
  creator: {
    name: string;
    role: string;
  } | null;
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
  user: {
    id: string;
    name: string | null;
    phone: string;
    email?: string | null;
  };
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
  reports: Report[];
  statusHistory: StatusHistory[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

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
      case "CONFIRMED":
      case "SAMPLE_COLLECTION_SCHEDULED":
      case "SAMPLE_COLLECTED":
        return "bg-primary text-primary-foreground";
      case "PROCESSING":
        return "bg-secondary text-secondary-foreground";
      case "COMPLETED":
        return "bg-primary text-primary-foreground";
      case "CANCELLED":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
      case "CONFIRMED":
      case "SAMPLE_COLLECTION_SCHEDULED":
      case "SAMPLE_COLLECTED":
        return "bg-primary/10 text-primary border-primary/20";
      case "PROCESSING":
        return "bg-secondary text-secondary-foreground border-secondary";
      case "COMPLETED":
        return "bg-primary/10 text-primary border-primary/20";
      case "CANCELLED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5" />;
      case "CONFIRMED":
        return <CheckCircle2 className="h-5 w-5" />;
      case "SAMPLE_COLLECTION_SCHEDULED":
        return <Calendar className="h-5 w-5" />;
      case "SAMPLE_COLLECTED":
        return <Package className="h-5 w-5" />;
      case "PROCESSING":
        return <PlayCircle className="h-5 w-5" />;
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateReportFileName = (report: Report, order: Order) => {
    const userName = order.user?.name || 'Patient';
    const orderNumber = order.orderNumber;
    const fileExtension = report.fileName.split('.').pop() || 'pdf';
    return `${userName}_${orderNumber}_Report.${fileExtension}`;
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      setDownloadingReport(report.id);
      
      // Create a download link with auto-renamed file
      const link = document.createElement('a');
      link.href = report.fileUrl;
      link.download = generateReportFileName(report, order!);
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloadingReport(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen medical-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen medical-background flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild className="w-full">
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
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
        <div className="bg-primary text-primary-foreground shadow-lg">
          <div className="container-padding py-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">🎉 Order Placed Successfully!</h2>
                <p className="text-primary-foreground/80">Your order #{order?.orderNumber} has been confirmed and is being processed.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container-padding py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/orders">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-primary">Order Details</h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-muted-foreground">Order #{order.orderNumber}</p>
                  <Badge className={`${getStatusBadgeColor(order.status)} border`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status.replace(/_/g, " ")}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={shareOrder}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={copyOrderNumber}>
                <Copy className="h-4 w-4 mr-2" />
                Copy ID
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-padding py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Reports Section */}
            {order.reports && order.reports.length > 0 && (
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Test Reports
                    <Badge variant="secondary">
                      {order.reports.length} Available
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.reports.map((report, index) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <div>
                            <h4 className="font-semibold">{generateReportFileName(report, order)}</h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span>Size: {formatFileSize(report.fileSize)}</span>
                              <span>Uploaded: {formatDateTime(report.uploadedAt)}</span>
                              {report.isDelivered && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Delivered
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadReport(report)}
                        disabled={downloadingReport === report.id}
                        size="sm"
                      >
                        {downloadingReport === report.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                  
                  {order.status !== "COMPLETED" && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Reports in Progress:</strong> Your test reports will be available once processing is complete. 
                        You'll receive a notification when they're ready for download.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timeline Section */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.statusHistory && order.statusHistory.length > 0 ? (
                    <div className="relative">
                      {order.statusHistory.map((history, index) => (
                        <div key={history.id} className="flex items-center gap-6 pb-6 last:pb-0">
                          {/* Timeline line */}
                          {index < order.statusHistory.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-12 bg-border"></div>
                          )}
                          
                          {/* Status icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(history.status)}`}>
                            {getStatusIcon(history.status)}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">
                                {history.status.replace(/_/g, " ")}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatDateTime(history.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="font-medium">No timeline events available</p>
                      <p className="text-sm">Timeline will update as your order progresses</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Test Items */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Test Items
                  <Badge variant="secondary">
                    {order.orderItems.length} Tests
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.test.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.test.category.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.quantity} {item.quantity === 1 ? 'patient' : 'patients'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                {/* Billing Summary */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Billing Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">₹{order.totalAmount}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span className="flex items-center gap-2">
                          <span>Discount Applied</span>
                          {order.couponCode && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              {order.couponCode}
                            </Badge>
                          )}
                        </span>
                        <span className="font-semibold">-₹{order.discountAmount}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{order.finalAmount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Collection Details */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Sample Collection Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Scheduled Date</p>
                    <p className="font-bold">{formatDate(order.homeVisit.scheduledDate)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Time Slot</p>
                    <p className="font-bold">{order.homeVisit.scheduledTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                  <Badge className={`${getStatusBadgeColor(order.homeVisit.status)} border`}>
                    {getStatusIcon(order.homeVisit.status)}
                    <span className="ml-2">{order.homeVisit.status.replace("_", " ")}</span>
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-medium">NABL Certified Lab</span>
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
                  <Home className="h-4 w-4 text-primary" />
                  Collection Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className="bg-primary text-primary-foreground">
                    {order.address.type}
                  </Badge>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="font-semibold mb-1">{order.address.line1}</p>
                    {order.address.line2 && (
                      <p className="text-muted-foreground mb-1">{order.address.line2}</p>
                    )}
                    <p className="text-muted-foreground mb-2">
                      {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                    {order.address.landmark && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Near: {order.address.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/orders">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Link>
                </Button>
                
                {order.reports.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const firstReport = order.reports[0];
                      if (firstReport) {
                        handleDownloadReport(firstReport);
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Latest Report
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" asChild>
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