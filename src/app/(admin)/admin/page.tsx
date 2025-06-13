"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  TestTube, 
  Package, 
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalUsers: number;
  totalTests: number;
  totalOrders: number;
  pendingHomeVisits: number;
  todayRevenue: number;
  monthlyRevenue: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    user: { name: string | null; phone: string };
    status: string;
    finalAmount: number;
    createdAt: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string | null;
    phone: string;
    createdAt: string;
  }>;
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  SAMPLE_COLLECTION_SCHEDULED: { label: "Scheduled", color: "bg-purple-100 text-purple-800" },
  SAMPLE_COLLECTED: { label: "Collected", color: "bg-indigo-100 text-indigo-800" },
  PROCESSING: { label: "Processing", color: "bg-orange-100 text-orange-800" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
        <p className="text-muted-foreground">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Lynk Labs Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">
              Available test catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingHomeVisits}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              Require scheduling
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +22% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders placed on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent orders
                </p>
              ) : (
                stats.recentOrders.map((order) => {
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">#{order.orderNumber}</p>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.user.name || order.user.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.finalAmount)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New users who joined the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent users
                </p>
              ) : (
                stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {user.name || `User ${user.phone.slice(-4)}`}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <TestTube className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Add New Test</h3>
              <p className="text-sm text-muted-foreground">Create a new diagnostic test</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Schedule Home Visits</h3>
              <p className="text-sm text-muted-foreground">Manage sample collection</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">User Management</h3>
              <p className="text-sm text-muted-foreground">View and manage users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 