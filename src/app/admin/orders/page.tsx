"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  DollarSign
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  finalAmount: number;
  createdAt: string;
  user: {
    name: string | null;
    phone: string;
    email?: string | null;
  };
  orderItems: {
    quantity: number;
    price: number;
    test: {
      name: string;
    };
  }[];
  homeVisit?: {
    id: string;
    status: string;
    scheduledDate: string;
    agent?: {
      name: string | null;
    };
  };
  reports: {
    id: string;
    isDelivered: boolean;
  }[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SAMPLE_COLLECTION_SCHEDULED: "bg-purple-100 text-purple-800",
  SAMPLE_COLLECTED: "bg-indigo-100 text-indigo-800",
  REPORT_READY: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    date: "",
    search: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    revenue: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.date) params.append("date", filters.date);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/admin/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        
        // Calculate stats
        const total = data.orders.length;
        const pending = data.orders.filter((o: Order) => 
          ["PENDING", "CONFIRMED", "SAMPLE_COLLECTION_SCHEDULED"].includes(o.status)
        ).length;
        const completed = data.orders.filter((o: Order) => o.status === "COMPLETED").length;
        const revenue = data.orders
          .filter((o: Order) => o.status === "COMPLETED")
          .reduce((sum: number, o: Order) => sum + o.finalAmount, 0);
        
        setStats({ total, pending, completed, revenue });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Orders Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.revenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order number, customer..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="SAMPLE_COLLECTION_SCHEDULED">Sample Collection Scheduled</SelectItem>
                  <SelectItem value="SAMPLE_COLLECTED">Sample Collected</SelectItem>
                  <SelectItem value="REPORT_READY">Report Ready</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Select value={filters.date} onValueChange={(value) => setFilters({ ...filters, date: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={fetchOrders} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {order.id.slice(-8)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user.name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">{order.user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm">
                          {order.orderItems.length} test(s)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.orderItems.slice(0, 2).map(item => item.test.name).join(", ")}
                          {order.orderItems.length > 2 && "..."}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatCurrency(order.finalAmount)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(order.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                No orders match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={statusColors[selectedOrder.status as keyof typeof statusColors]}>
                    {selectedOrder.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p>{selectedOrder.user.name || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.user.phone}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="font-medium">{formatCurrency(selectedOrder.finalAmount)}</p>
                </div>
              </div>
              
              <div>
                <Label>Tests Ordered</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{item.test.name}</span>
                      <span>Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.homeVisit && (
                <div>
                  <Label>Home Visit</Label>
                  <div className="mt-2 p-3 bg-blue-50 rounded">
                    <p>Status: {selectedOrder.homeVisit.status}</p>
                    <p>Scheduled: {formatDate(selectedOrder.homeVisit.scheduledDate)}</p>
                    {selectedOrder.homeVisit.agent && (
                      <p>Agent: {selectedOrder.homeVisit.agent.name}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.reports.length > 0 && (
                <div>
                  <Label>Reports</Label>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.reports.map((report, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded">
                        <p>Report {index + 1}: {report.isDelivered ? "Delivered" : "Pending Delivery"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}