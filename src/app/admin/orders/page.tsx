"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateFilter } from "@/components/ui/date-filter";
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  DollarSign,
  Download,
  Printer,
  MoreHorizontal,
  Calendar as CalendarIcon,
  FileText,
  Users,
  Edit3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Package2,
  Star,
  MessageSquare,
  Copy,
  ExternalLink,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  };
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    test: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  homeVisit?: {
    id: string;
    status: string;
    scheduledDate: string;
    address: string;
    agent?: {
      id: string;
      name: string | null;
      phone: string;
    };
  };
  reports: {
    id: string;
    fileName: string;
    isDelivered: boolean;
    deliveredAt: string | null;
  }[];
  address?: {
    id: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
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
  { value: "SAMPLE_COLLECTION_SCHEDULED", label: "Sample Collection Scheduled", icon: Truck },
  { value: "SAMPLE_COLLECTED", label: "Sample Collected", icon: Package2 },
  { value: "PROCESSING", label: "Processing", icon: RefreshCw },
  { value: "REPORT_READY", label: "Report Ready", icon: FileText },
  { value: "COMPLETED", label: "Completed", icon: Check },
  { value: "CANCELLED", label: "Cancelled", icon: X },
];

interface Filters {
  status: string;
  paymentMethod: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  search: string;
  hasReport: string;
  amountRange: {
    min: string;
    max: string;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    paymentMethod: "all",
    dateRange: { from: undefined, to: undefined },
    search: "",
    hasReport: "all",
    amountRange: { min: "", max: "" },
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 20;

  // Dialogs
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);
  const [orderNotesDialog, setOrderNotesDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [bulkDeleteConfirmDialog, setBulkDeleteConfirmDialog] = useState(false);
  
  // Bulk action states
  const [bulkAction, setBulkAction] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkNotes, setBulkNotes] = useState("");
  const [selectedOrderForNotes, setSelectedOrderForNotes] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
    avgOrderValue: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.paymentMethod !== "all") params.append("paymentMethod", filters.paymentMethod);
      if (filters.search) params.append("search", filters.search);
      if (filters.hasReport !== "all") params.append("hasReport", filters.hasReport);
      if (filters.dateRange.from) params.append("dateFrom", filters.dateRange.from.toISOString());
      if (filters.dateRange.to) params.append("dateTo", filters.dateRange.to.toISOString());
      if (filters.amountRange.min) params.append("minAmount", filters.amountRange.min);
      if (filters.amountRange.max) params.append("maxAmount", filters.amountRange.max);
      
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());

      const response = await fetch(`/api/admin/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalOrders(data.pagination?.total || 0);
        
        // Calculate comprehensive stats
        const allOrders = data.orders || [];
        const total = allOrders.length;
        const pending = allOrders.filter((o: Order) => o.status === "PENDING").length;
        const confirmed = allOrders.filter((o: Order) => o.status === "CONFIRMED").length;
        const processing = allOrders.filter((o: Order) => 
          ["SAMPLE_COLLECTION_SCHEDULED", "SAMPLE_COLLECTED", "PROCESSING"].includes(o.status)
        ).length;
        const completed = allOrders.filter((o: Order) => o.status === "COMPLETED").length;
        const cancelled = allOrders.filter((o: Order) => o.status === "CANCELLED").length;
        const revenue = allOrders
          .filter((o: Order) => o.status === "COMPLETED")
          .reduce((sum: number, o: Order) => sum + o.finalAmount, 0);
        const avgOrderValue = total > 0 ? revenue / completed : 0;
        
        setStats({ total, pending, confirmed, processing, completed, cancelled, revenue, avgOrderValue });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;

    // Handle delete action separately with confirmation
    if (bulkAction === "delete_orders") {
      handleBulkDelete();
      return;
    }

    try {
      const response = await fetch("/api/admin/orders/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: bulkAction,
          orderIds: selectedOrders,
          status: bulkStatus,
          notes: bulkNotes,
        }),
      });

      if (response.ok) {
        await fetchOrders();
        setSelectedOrders([]);
        setBulkActionDialog(false);
        setBulkAction("");
        setBulkStatus("");
        setBulkNotes("");
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const handleExport = async (format: string) => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("format", format);

      const response = await fetch(`/api/admin/orders/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${format}-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting orders:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm(""); // Clear search input
    setFilters({
      status: "all",
      paymentMethod: "all",
      dateRange: { from: undefined, to: undefined },
      search: "",
      hasReport: "all",
      amountRange: { min: "", max: "" },
    });
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    const Icon = statusOption?.icon || Clock;
    return <Icon className="h-3 w-3" />;
  };

  const handleDeleteOrder = async (order: Order) => {
    setOrderToDelete(order);
    setDeleteConfirmDialog(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/orders/${orderToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove order from local state
        setOrders(orders.filter(o => o.id !== orderToDelete.id));
        setTotalOrders(prev => prev - 1);
        setDeleteConfirmDialog(false);
        setOrderToDelete(null);
        
        // Show success message
        alert('Order deleted successfully');
      } else {
        const error = await response.json();
        console.error('Failed to delete order:', error.message);
        // Show specific error message
        alert(`Cannot delete order: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrders.length === 0) return;
    setBulkDeleteConfirmDialog(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_orders',
          orderIds: selectedOrders,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Remove deleted orders from local state
        setOrders(orders.filter(o => !selectedOrders.includes(o.id)));
        setTotalOrders(prev => prev - selectedOrders.length);
        setSelectedOrders([]);
        setBulkDeleteConfirmDialog(false);
        
        alert(`Successfully deleted ${result.deletedCount} orders`);
      } else {
        const error = await response.json();
        console.error('Failed to delete orders:', error.message);
        // Show specific error message for bulk operations
        if (error.protectedOrderIds && error.protectedOrderIds.length > 0) {
          alert(`Cannot delete some orders due to their status: ${error.message}`);
        } else {
          alert(`Failed to delete orders: ${error.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error deleting orders:', error);
      alert('Error deleting orders. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">Manage and track all customer orders</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-sm text-muted-foreground">Comprehensive order management and analytics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={() => router.push("/admin/analytics")}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Compact Stats Cards - Shopify Style */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{totalOrders.toLocaleString()}</p>
              </div>
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-semibold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Processing</p>
                <p className="text-lg font-semibold text-blue-600">{stats.processing}</p>
              </div>
              <RefreshCw className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cancelled</p>
                <p className="text-lg font-semibold text-red-600">{stats.cancelled}</p>
              </div>
              <X className="h-4 w-4 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-sm font-semibold text-green-600">{formatCurrency(stats.revenue)}</p>
              </div>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Filters - Shopify Style */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="all">All Status</SelectItem>
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

            {/* Payment Method */}
            <Select value={filters.paymentMethod} onValueChange={(value) => setFilters({ ...filters, paymentMethod: value })}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="COD">COD</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <DateFilter
              value={filters.dateRange}
              onChange={(range) => setFilters({ ...filters, dateRange: range || { from: undefined, to: undefined } })}
            />

            {/* More Filters */}
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>

            <Button size="sm" className="h-8 text-xs" onClick={fetchOrders}>
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrders([])}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkActionDialog(true)}
                  className="h-7"
                >
                  <MoreHorizontal className="h-3 w-3 mr-1" />
                  Actions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusUpdateDialog(true)}
                  className="h-7"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact Orders Table - Shopify Style */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Orders</h2>
              <span className="text-sm text-muted-foreground">({totalOrders.toLocaleString()})</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-8 pl-4">
                    <Checkbox
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-medium">Order</TableHead>
                  <TableHead className="text-xs font-medium">Customer</TableHead>
                  <TableHead className="text-xs font-medium">Total</TableHead>
                  <TableHead className="text-xs font-medium">Payment</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Date</TableHead>
                  <TableHead className="text-xs font-medium w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className={cn(
                    "hover:bg-gray-50 border-b",
                    selectedOrders.includes(order.id) && "bg-blue-50"
                  )}>
                    <TableCell className="pl-4 py-3">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">#{order.orderNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => navigator.clipboard.writeText(order.orderNumber)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div>
                        <p className="font-medium text-sm">{order.user.name || "Guest"}</p>
                        <p className="text-xs text-muted-foreground">{order.user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div>
                        <p className="font-semibold text-sm">{formatCurrency(order.finalAmount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div>
                        <p className="text-sm">{order.paymentMethod}</p>
                        {order.paymentId && (
                          <p className="text-xs text-muted-foreground">
                            {order.paymentId.slice(-8)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge 
                        className={cn(
                          "text-xs px-2 py-1", 
                          statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                        )}
                      >
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrderForNotes(order);
                            setOrderNotesDialog(true);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                No orders match your current filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Compact Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <div className="text-xs text-muted-foreground">
                {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs px-2">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onOpenChange={setBulkActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Action</Label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="update_status">Update Status</SelectItem>
                  <SelectItem value="add_notes">Add Notes</SelectItem>
                  <SelectItem value="export_selected">Export Selected</SelectItem>
                  <SelectItem value="mark_priority">Mark Priority</SelectItem>
                  <SelectItem value="delete_orders" className="text-destructive">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Orders
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkAction === "update_status" && (
              <div>
                <Label>New Status</Label>
                <Select value={bulkStatus} onValueChange={setBulkStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
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
            )}

            {bulkAction === "add_notes" && (
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Enter notes for selected orders..."
                  value={bulkNotes}
                  onChange={(e) => setBulkNotes(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAction} disabled={!bulkAction}>
              {bulkAction === "delete_orders" ? "Delete" : "Apply to"} {selectedOrders.length} Order{selectedOrders.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialog} onOpenChange={setExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Orders</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export orders based on current filters
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  handleExport('csv');
                  setExportDialog(false);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleExport('xlsx');
                  setExportDialog(false);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleExport('pdf');
                  setExportDialog(false);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleExport('json');
                  setExportDialog(false);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Notes Dialog */}
      <Dialog open={orderNotesDialog} onOpenChange={setOrderNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Notes</DialogTitle>
          </DialogHeader>
          {selectedOrderForNotes && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-medium">Order: {selectedOrderForNotes.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  Customer: {selectedOrderForNotes.user.name}
                </p>
              </div>
              <div>
                <Label>Add Note</Label>
                <Textarea
                  placeholder="Enter note for this order..."
                  value={bulkNotes}
                  onChange={(e) => setBulkNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderNotesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle add note logic here
              setOrderNotesDialog(false);
              setBulkNotes("");
            }}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Are you sure you want to delete this order?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Order #{orderToDelete?.orderNumber} will be permanently deleted. This action cannot be undone.
                </p>
              </div>
            </div>
            {orderToDelete && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Order Details:</span>
                  <Badge className={cn(
                    "text-xs",
                    statusColors[orderToDelete.status as keyof typeof statusColors]
                  )}>
                    {orderToDelete.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Customer:</strong> {orderToDelete.user.name || "Guest"}</p>
                  <p><strong>Amount:</strong> {formatCurrency(orderToDelete.finalAmount)}</p>
                  <p><strong>Date:</strong> {formatDate(orderToDelete.createdAt)}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteOrder}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteConfirmDialog} onOpenChange={setBulkDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Orders</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Are you sure you want to delete {selectedOrders.length} orders?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All selected orders will be permanently deleted. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="font-medium mb-2">Orders to be deleted:</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {orders.filter(order => selectedOrders.includes(order.id)).map(order => (
                  <div key={order.id} className="flex justify-between items-center text-sm">
                    <span>#{order.orderNumber}</span>
                    <span>{formatCurrency(order.finalAmount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmBulkDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : `Delete ${selectedOrders.length} Orders`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}