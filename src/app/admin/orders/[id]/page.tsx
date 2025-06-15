"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Edit3,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Truck,
  FileText,
  Clock,
  CheckCircle,
  X,
  Check,
  RefreshCw,
  Calendar,
  Package2,
  AlertCircle,
  User,
  DollarSign,
  Copy,
  ExternalLink,
  MessageSquare,
  Plus,
  Trash2,
  Star,
  History,
  Settings,
  Flag,
  Send,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast, { Toaster } from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  finalAmount: number;
  totalAmount: number;
  discountAmount: number;
  paymentMethod: string;
  paymentId: string | null;
  couponCode: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    phone: string;
    email?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
  };
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    test: {
      id: string;
      name: string;
      slug: string;
      description?: string;
      category?: {
        name: string;
      };
      sampleType?: string;
      preparationInstructions?: string;
    };
  }[];
  homeVisit?: {
    id: string;
    status: string;
    scheduledDate: string;
    address: string;
    notes?: string;
    agent?: {
      id: string;
      name: string | null;
      phone: string;
      email?: string;
    };
    completedAt?: string;
  };
  reports: {
    id: string;
    fileName: string;
    filePath: string;
    isDelivered: boolean;
    deliveredAt: string | null;
    uploadedAt: string;
  }[];
  address: {
    id: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
  };
  notes: {
    id: string;
    content: string;
    isInternal: boolean;
    createdAt: string;
    author: {
      name: string;
      role: string;
    };
  }[];
  timeline: {
    id: string;
    action: string;
    description: string;
    timestamp: string;
    actor: {
      name: string;
      role: string;
    };
  }[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  SAMPLE_COLLECTION_SCHEDULED: "bg-purple-100 text-purple-800 border-purple-200",
  SAMPLE_COLLECTED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  PROCESSING: "bg-orange-100 text-orange-800 border-orange-200",
  REPORT_READY: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusOptions = [
  { value: "PENDING", label: "Pending", icon: Clock },
  { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { value: "SAMPLE_COLLECTION_SCHEDULED", label: "Sample Collection Scheduled", icon: Calendar },
  { value: "SAMPLE_COLLECTED", label: "Sample Collected", icon: Package2 },
  { value: "PROCESSING", label: "Processing", icon: RefreshCw },
  { value: "REPORT_READY", label: "Report Ready", icon: FileText },
  { value: "COMPLETED", label: "Completed", icon: Check },
  { value: "CANCELLED", label: "Cancelled", icon: X },
];

const homeVisitStatuses = [
  { value: "SCHEDULED", label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  { value: "AGENT_ASSIGNED", label: "Agent Assigned", color: "bg-purple-100 text-purple-800" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-orange-100 text-orange-800" },
  { value: "SAMPLE_COLLECTED", label: "Sample Collected", color: "bg-green-100 text-green-800" },
  { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [editStatusDialog, setEditStatusDialog] = useState(false);
  const [addNoteDialog, setAddNoteDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [assignAgentDialog, setAssignAgentDialog] = useState(false);
  const [deliverReportDialog, setDeliverReportDialog] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(true);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  
  // Additional states for new functionality
  const [isPriority, setIsPriority] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    autoDeliver: false,
  });
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    priority: false,
    duplicate: false,
    cancel: false,
    notifications: false,
  });

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Order not found");
      }
      const data = await response.json();
      setOrder(data.order);
      setNewStatus(data.order.status);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/admin/agents");
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote,
        }),
      });

      if (response.ok) {
        await fetchOrder();
        setEditStatusDialog(false);
        setStatusNote("");
        toast.success('Order status updated successfully!');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddNote = async () => {
    if (!order || !noteContent.trim()) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: noteContent,
          isInternal: isInternalNote,
        }),
      });

      if (response.ok) {
        await fetchOrder();
        setAddNoteDialog(false);
        setNoteContent("");
        toast.success('Note added successfully!');
      } else {
        toast.error('Failed to add note');
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleAssignAgent = async () => {
    if (!order?.homeVisit || !selectedAgent) return;

    try {
      const response = await fetch(`/api/admin/home-visits/${order.homeVisit.id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent,
        }),
      });

      if (response.ok) {
        await fetchOrder();
        setAssignAgentDialog(false);
        setSelectedAgent("");
        toast.success('Agent assigned successfully!');
      } else {
        toast.error('Failed to assign agent');
      }
    } catch (error) {
      console.error("Error assigning agent:", error);
    }
  };

  const handleDeliverReport = async (reportId: string) => {
    try {
      console.log("🚀 Attempting to deliver report:", reportId);
      
      const response = await fetch(`/api/admin/reports/${reportId}/deliver`, {
        method: "POST", // Fixed: Changed from PUT to POST
        credentials: "include", // Ensure cookies are sent
        headers: { "Content-Type": "application/json" },
      });

      console.log("📡 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", data);

      if (response.ok) {
        await fetchOrder();
        toast.success('✅ Report delivered successfully!');
      } else {
        console.error("❌ Delivery failed:", data);
        toast.error(`❌ Failed to deliver report: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("💥 Network error delivering report:", error);
      toast.error(`💥 Error delivering report: ${error.message}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    const Icon = statusOption?.icon || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleMarkPriority = async () => {
    setLoadingStates(prev => ({ ...prev, priority: true }));
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/priority`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPriority: !isPriority }),
      });

      if (response.ok) {
        setIsPriority(!isPriority);
        await fetchOrder();
        toast.success(isPriority ? 'Priority removed successfully!' : 'Order marked as priority!');
      } else {
        toast.error('Failed to update priority status');
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error('Error updating priority status');
    } finally {
      setLoadingStates(prev => ({ ...prev, priority: false }));
    }
  };

  const handleDuplicateOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Order duplicated successfully!');
        router.push(`/admin/orders/${data.newOrderId}`);
      } else {
        toast.error('Failed to duplicate order');
      }
    } catch (error) {
      console.error("Error duplicating order:", error);
      toast.error('Error duplicating order');
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          note: "Order cancelled by admin",
        }),
      });

      if (response.ok) {
        await fetchOrder();
        toast.success('Order cancelled successfully!');
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error('Error cancelling order');
    }
  };

  const handleNotificationToggle = async (type: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: enabled }),
      });

      if (response.ok) {
        setNotifications(prev => ({ ...prev, [type]: enabled }));
        toast.success('Notification settings updated!');
      } else {
        toast.error('Failed to update notification settings');
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error('Error updating notification settings');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error || "The order you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.push("/admin/orders")}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(order.orderNumber)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <Badge className={cn("border", statusColors[order.status as keyof typeof statusColors])}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {order.status.replace(/_/g, " ")}
                </div>
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created: {formatDate(order.createdAt)}
              </span>
              <span className="text-sm text-muted-foreground">
                Updated: {formatDate(order.updatedAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditStatusDialog(true)}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Update Status
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              const url = `/api/admin/orders/export?format=pdf&orderIds=${order.id}`;
              window.open(url, '_blank');
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Customer View
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes ({order.notes?.length || 0})</TabsTrigger>
          <TabsTrigger value="reports">Reports ({order.reports.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">Tests Ordered</h4>
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium">{item.test.name}</h5>
                          <p className="text-sm text-muted-foreground">
                                                          Slug: {item.test.slug}
                          </p>
                          {item.test.category && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {item.test.category.name}
                            </Badge>
                          )}
                          {item.test.sampleType && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Sample: {item.test.sampleType}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {item.quantity} × {formatCurrency(item.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.quantity * item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>
                          Discount
                          {order.couponCode && ` (${order.couponCode})`}
                        </span>
                        <span>-{formatCurrency(order.discountAmount)}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.finalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer & Address */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{order.user.name || "N/A"}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {order.user.phone}
                    </div>
                    {order.user.email && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {order.user.email}
                      </div>
                    )}
                  </div>
                  {order.user.dateOfBirth && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        DOB: {format(new Date(order.user.dateOfBirth), "dd/MM/yyyy")}
                      </p>
                    </div>
                  )}
                  {order.user.gender && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Gender: {order.user.gender}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (order.user.email) {
                          window.open(`mailto:${order.user.email}?subject=Regarding Order ${order.orderNumber}`, '_blank');
                        }
                      }}
                      disabled={!order.user.email}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        window.open(`tel:${order.user.phone}`, '_blank');
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                                            <p className="font-medium">{order.address.line1}</p>
                        {order.address.line2 && <p className="font-medium">{order.address.line2}</p>}
                    {order.address.landmark && (
                      <p className="text-sm text-muted-foreground">
                        Near: {order.address.landmark}
                      </p>
                    )}
                    <p className="text-sm">
                      {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                    {order.address.isDefault && (
                      <Badge variant="secondary" size="sm">Default Address</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{order.paymentMethod}</p>
                    {order.paymentId && (
                      <p className="text-sm text-muted-foreground">
                        Payment ID: {order.paymentId}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(order.finalAmount)}
                    </span>
                  </div>
                  {order.paymentMethod === "ONLINE" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        // Generate receipt URL or download receipt
                        const receiptUrl = `/api/admin/orders/${order.id}/receipt`;
                        window.open(receiptUrl, '_blank');
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Home Visit & Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Home Visit */}
            {order.homeVisit && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Sample Collection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge className={
                      homeVisitStatuses.find(s => s.value === order.homeVisit?.status)?.color || "bg-gray-100 text-gray-800"
                    }>
                      {order.homeVisit.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scheduled Date</span>
                    <span>{formatDate(order.homeVisit.scheduledDate)}</span>
                  </div>
                  {order.homeVisit.agent && (
                    <div>
                      <p className="font-medium">Assigned Agent</p>
                      <div className="mt-1">
                        <p className="text-sm">{order.homeVisit.agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.homeVisit.agent.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.homeVisit.notes && (
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.homeVisit.notes}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        fetchAgents();
                        setAssignAgentDialog(true);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {order.homeVisit.agent ? "Reassign" : "Assign"} Agent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Open reschedule dialog or navigate to reschedule page
                        router.push(`/admin/home-visits/${order.homeVisit?.id}/reschedule`);
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Test Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.reports.length > 0 ? (
                  <div className="space-y-3">
                    {order.reports.map((report, index) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">Report {index + 1}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {formatDate(report.uploadedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={report.isDelivered ? "default" : "secondary"}>
                            {report.isDelivered ? "Delivered" : "Pending"}
                          </Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                window.open(report.filePath, '_blank');
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = report.filePath;
                                link.download = report.fileName;
                                link.click();
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {!report.isDelivered && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeliverReport(report.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No reports uploaded yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        router.push(`/admin/reports/upload?orderId=${order.id}`);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {order.timeline?.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        {index < (order.timeline?.length || 0) - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.action}</h4>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          by {event.actor.name} ({event.actor.role})
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No timeline events yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Order Notes
                </CardTitle>
                <Button onClick={() => setAddNoteDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {order.notes?.map((note) => (
                    <div key={note.id} className={cn(
                      "p-4 rounded-lg border-l-4",
                      note.isInternal 
                        ? "bg-yellow-50 border-l-yellow-500" 
                        : "bg-blue-50 border-l-blue-500"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={note.isInternal ? "secondary" : "default"}>
                            {note.isInternal ? "Internal" : "Customer"}
                          </Badge>
                          <span className="text-sm font-medium">
                            {note.author.name} ({note.author.role})
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No notes added yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Test Reports Management
                </CardTitle>
                <Button
                  onClick={() => {
                    router.push(`/admin/reports/upload?orderId=${order.id}`);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {order.reports.length > 0 ? (
                <div className="space-y-4">
                  {order.reports.map((report, index) => (
                    <Card key={report.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">Report {index + 1}</h4>
                            <p className="text-sm text-muted-foreground">{report.fileName}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Uploaded: {formatDate(report.uploadedAt)}</span>
                              {report.deliveredAt && (
                                <span>Delivered: {formatDate(report.deliveredAt)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={report.isDelivered ? "default" : "secondary"}>
                              {report.isDelivered ? "Delivered" : "Pending Delivery"}
                            </Badge>
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  window.open(report.filePath, '_blank');
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = report.filePath;
                                  link.download = report.fileName;
                                  link.click();
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  router.push(`/admin/reports/${report.id}/edit`);
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              {!report.isDelivered && (
                                <Button
                                  size="sm"
                                  onClick={() => handleDeliverReport(report.id)}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Deliver
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Reports</h3>
                  <p className="text-muted-foreground mb-4">
                    No test reports have been uploaded for this order yet.
                  </p>
                  <Button
                    onClick={() => {
                      router.push(`/admin/reports/upload?orderId=${order.id}`);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Order Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleMarkPriority}
                  disabled={loadingStates.priority}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {loadingStates.priority ? "Updating..." : (isPriority ? "Remove Priority" : "Mark as Priority")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setRefundDialog(true)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Refund
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDuplicateOrder}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Order
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleCancelOrder}
                  disabled={order.status === "CANCELLED" || order.status === "COMPLETED"}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleNotificationToggle('email', !notifications.email)}
                  >
                    {notifications.email ? "Disable" : "Enable"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleNotificationToggle('sms', !notifications.sms)}
                  >
                    {notifications.sms ? "Disable" : "Enable"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-deliver Reports</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleNotificationToggle('autoDeliver', !notifications.autoDeliver)}
                  >
                    {notifications.autoDeliver ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Status Dialog */}
      <Dialog open={editStatusDialog} onOpenChange={setEditStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status.value)}
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status Update Note</Label>
              <Textarea
                placeholder="Add a note about this status change..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!newStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={addNoteDialog} onOpenChange={setAddNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Order Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note Type</Label>
              <Select value={isInternalNote ? "internal" : "customer"} onValueChange={(value) => setIsInternalNote(value === "internal")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Note</SelectItem>
                  <SelectItem value="customer">Customer Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Note Content</Label>
              <Textarea
                placeholder="Enter your note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={assignAgentDialog} onOpenChange={setAssignAgentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Collection Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Agent</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name} - {agent.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignAgentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignAgent} disabled={!selectedAgent}>
              Assign Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialog} onOpenChange={setRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Refund Amount</Label>
              <Input
                type="number"
                placeholder="Enter refund amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                max={order.finalAmount}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum refundable: {formatCurrency(order.finalAmount)}
              </p>
            </div>
            <div>
              <Label>Refund Reason</Label>
              <Textarea
                placeholder="Enter reason for refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Handle refund logic here
                setRefundDialog(false);
              }} 
              disabled={!refundAmount || !refundReason}
            >
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 