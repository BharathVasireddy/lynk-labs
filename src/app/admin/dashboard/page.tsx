"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlineSpinner } from "@/components/ui/loading-spinner";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  TestTube, 
  Package, 
  ShoppingCart, 
  Calendar, 
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  RefreshCw,
  UserPlus,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Star,
  Truck,
  FileText,
  Target,
  Zap,
  Globe,
  Smartphone,
  CreditCard,
  MapPin,
  Calendar as CalendarIcon,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  TrendingUpIcon,
  Award,
  Heart,
  MessageSquare,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalUsers: number;
  totalTests: number;
  totalPackages: number;
  totalOrders: number;
  totalHomeVisits: number;
  pendingHomeVisits: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  todayOrders: number;
  monthlyOrders: number;
  activeTests: number;
  activePackages: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    user: { name: string | null; email: string; phone: string | null };
    status: string;
    finalAmount: number;
    createdAt: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
  }>;
  topTests: Array<{
    id: string;
    name: string;
    orderCount: number;
    revenue: number;
  }>;
  topPackages: Array<{
    id: string;
    name: string;
    orderCount: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStats = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Pending" },
      CONFIRMED: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Confirmed" },
      PROCESSING: { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Processing" },
      COMPLETED: { color: "bg-green-100 text-green-700 border-green-200", label: "Completed" },
      CANCELLED: { color: "bg-red-100 text-red-700 border-red-200", label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={cn("text-xs px-2 py-1 border", config.color)}>{config.label}</Badge>;
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          <span className="text-xs font-medium">+{growth.toFixed(1)}%</span>
        </div>
      );
    } else if (growth < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDownRight className="h-3 w-3 mr-1" />
          <span className="text-xs font-medium">{growth.toFixed(1)}%</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-500">
        <span className="text-xs font-medium">0%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-gray-600 mb-4">Unable to load dashboard statistics</p>
            <Button onClick={() => fetchStats()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header - Shopify Style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
          >
            {refreshing ? (
              <InlineSpinner size="sm" variant="primary" className="mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators - Shopify Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.totalRevenue)}</p>
                {getGrowthIndicator(stats.revenueGrowth)}
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-lg font-semibold">{stats.totalOrders.toLocaleString()}</p>
                {getGrowthIndicator(stats.ordersGrowth)}
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-lg font-semibold">{stats.totalUsers.toLocaleString()}</p>
                {getGrowthIndicator(stats.usersGrowth)}
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Order Value</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
                </p>
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+5.2%</span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Performance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.todayRevenue)}</p>
              </div>
              <Zap className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Today's Orders</p>
                <p className="text-lg font-semibold">{stats.todayOrders}</p>
              </div>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending Visits</p>
                <p className="text-lg font-semibold">{stats.pendingHomeVisits}</p>
              </div>
              <Truck className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Tests</p>
                <p className="text-lg font-semibold">{stats.activeTests}</p>
              </div>
              <TestTube className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Shopify Style */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <Button asChild className="h-auto p-3 flex-col bg-primary hover:bg-primary/90">
              <Link href="/admin/tests/new">
                <Plus className="h-4 w-4 mb-1" />
                <span className="text-xs">Add Test</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-3 flex-col">
              <Link href="/admin/packages/new">
                <Package className="h-4 w-4 mb-1" />
                <span className="text-xs">Add Package</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-3 flex-col">
              <Link href="/admin/orders">
                <ShoppingCart className="h-4 w-4 mb-1" />
                <span className="text-xs">Orders</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-3 flex-col">
              <Link href="/admin/users">
                <Users className="h-4 w-4 mb-1" />
                <span className="text-xs">Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-3 flex-col">
              <Link href="/admin/home-visits">
                <Truck className="h-4 w-4 mb-1" />
                <span className="text-xs">Visits</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-3 flex-col">
              <Link href="/admin/reports">
                <FileText className="h-4 w-4 mb-1" />
                <span className="text-xs">Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Progress */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Order Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
              <Progress 
                value={stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0} 
                className="mt-2 h-1"
              />
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalOrders - stats.completedOrders - stats.cancelledOrders}</p>
              <p className="text-xs text-muted-foreground">Processing</p>
              <Progress 
                value={stats.totalOrders > 0 ? ((stats.totalOrders - stats.completedOrders - stats.cancelledOrders) / stats.totalOrders) * 100 : 0} 
                className="mt-2 h-1"
              />
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
              <Progress 
                value={stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0} 
                className="mt-2 h-1"
              />
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
              <Progress 
                value={stats.totalOrders > 0 ? (stats.cancelledOrders / stats.totalOrders) * 100 : 0} 
                className="mt-2 h-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs - Shopify Style */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/orders">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {stats.recentOrders && stats.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">No recent orders</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {stats.recentOrders?.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">#{order.orderNumber}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {order.user.name || `User ${order.user.phone?.slice(-4)}`} • {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatCurrency(order.finalAmount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/users">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {stats.recentUsers && stats.recentUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">No recent users</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {stats.recentUsers?.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground">{user.phone || user.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders Today</p>
                    <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Orders</p>
                    <p className="text-2xl font-bold">{stats.monthlyOrders}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : '0'}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Top Tests */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Top Performing Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topTests && stats.topTests.length === 0 ? (
                  <div className="text-center py-8">
                    <TestTube className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">No test data available</p>
                  </div>
                ) : (
                  stats.topTests?.slice(0, 5).map((test, index) => (
                    <div key={test.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{test.name}</p>
                          <p className="text-xs text-muted-foreground">{test.orderCount} orders</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(test.revenue)}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Top Packages */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Top Performing Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topPackages && stats.topPackages.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">No package data available</p>
                  </div>
                ) : (
                  stats.topPackages?.slice(0, 5).map((pkg, index) => (
                    <div key={pkg.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pkg.name}</p>
                          <p className="text-xs text-muted-foreground">{pkg.orderCount} orders</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(pkg.revenue)}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Business Insights */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-lg font-semibold">Business Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUpIcon className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-800">Revenue Growth</p>
                  </div>
                  <p className="text-xs text-green-700">
                    Your revenue has grown by {stats.revenueGrowth.toFixed(1)}% compared to last period. Keep up the great work!
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Top Performance</p>
                  </div>
                  <p className="text-xs text-blue-700">
                    {stats.topTests?.[0]?.name || 'No data'} is your best-performing test with {stats.topTests?.[0]?.orderCount || 0} orders.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-800">User Growth</p>
                  </div>
                  <p className="text-xs text-purple-700">
                    You've gained {stats.usersGrowth.toFixed(1)}% more users. Consider expanding your marketing efforts.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TestTube className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Total Tests</span>
                  </div>
                  <span className="text-sm font-semibold">{stats.totalTests}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Total Packages</span>
                  </div>
                  <span className="text-sm font-semibold">{stats.totalPackages}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Home Visits</span>
                  </div>
                  <span className="text-sm font-semibold">{stats.totalHomeVisits}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Monthly Revenue</span>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(stats.monthlyRevenue)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Help Center
              </Button>
              <Button size="sm" asChild>
                <Link href="/admin/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 