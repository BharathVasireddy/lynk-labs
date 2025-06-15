"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign, 
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Calendar,
  Eye,
  ShoppingCart,
  UserCheck,
  TestTube,
  Truck,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalTests: number;
    avgOrderValue: number;
    revenueGrowth: number;
    orderGrowth: number;
    userGrowth: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    finalAmount: number;
    status: string;
    createdAt: string;
    user: {
      name: string | null;
      phone: string;
    };
    orderItems: Array<{
      test: {
        name: string;
      };
    }>;
  }>;
  ordersByStatus: Array<{
    status: string;
    _count: {
      status: number;
    };
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topTests: Array<{
    name: string;
    orderCount: number;
    revenue: number;
  }>;
  homeVisitStats: {
    total: number;
    completed: number;
    pending: number;
    scheduled: number;
    inProgress: number;
  };
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalTests: number;
  avgOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
  completedOrders: number;
  pendingOrders: number;
  processingOrders: number;
  cancelledOrders: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalTests: 0,
    avgOrderValue: 0,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    userGrowth: 15.2,
    completedOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const result = await response.json();
        const analyticsData = result.analytics;
        setData(analyticsData);
        
        // Calculate additional stats
        const ordersByStatus = analyticsData.ordersByStatus || [];
        const statusCounts = ordersByStatus.reduce((acc: any, item: any) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {});

        const avgOrderValue = analyticsData.overview.totalOrders > 0 
          ? analyticsData.overview.totalRevenue / analyticsData.overview.totalOrders 
          : 0;

        setStats({
          totalRevenue: analyticsData.overview.totalRevenue,
          totalOrders: analyticsData.overview.totalOrders,
          totalUsers: analyticsData.overview.totalUsers,
          totalTests: analyticsData.overview.totalTests,
          avgOrderValue: analyticsData.overview.avgOrderValue,
          revenueGrowth: analyticsData.overview.revenueGrowth,
          orderGrowth: analyticsData.overview.orderGrowth,
          userGrowth: analyticsData.overview.userGrowth,
          completedOrders: statusCounts.COMPLETED || 0,
          pendingOrders: statusCounts.PENDING || 0,
          processingOrders: statusCounts.PROCESSING || 0,
          cancelledOrders: statusCounts.CANCELLED || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700 border-blue-200" },
      PROCESSING: { label: "Processing", className: "bg-purple-100 text-purple-700 border-purple-200" },
      COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" },
    };
    const statusConfig = config[status as keyof typeof config] || config.PENDING;
    return (
      <Badge className={cn("text-xs px-2 py-1 border", statusConfig.className)}>
        {statusConfig.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics - Shopify Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{formatPercentage(stats.revenueGrowth)}</span>
                </div>
              </div>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-lg font-semibold">{stats.totalOrders.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{formatPercentage(stats.orderGrowth)}</span>
                </div>
              </div>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-lg font-semibold">{stats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{formatPercentage(stats.userGrowth)}</span>
                </div>
              </div>
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Order Value</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.avgOrderValue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+5.2%</span>
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold text-green-600">{stats.completedOrders}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Processing</p>
                <p className="text-lg font-semibold text-blue-600">{stats.processingOrders}</p>
              </div>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-semibold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cancelled</p>
                <p className="text-lg font-semibold text-red-600">{stats.cancelledOrders}</p>
              </div>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {data.revenueByMonth.length > 0 ? (
              <div className="space-y-4">
                {data.revenueByMonth.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(item.month).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(item.revenue)}</p>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (item.revenue / Math.max(...data.revenueByMonth.map(r => r.revenue))) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentOrders.length > 0 ? (
              <div className="space-y-0">
                {data.recentOrders.slice(0, 8).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">#{order.orderNumber}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.user.name || `User ${order.user.phone.slice(-4)}`} • {formatDate(order.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.orderItems.length} test{order.orderItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(order.finalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TestTube className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Active Tests</span>
              </div>
              <span className="text-sm font-semibold">{stats.totalTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Active Users</span>
              </div>
              <span className="text-sm font-semibold">{stats.totalUsers}</span>
            </div>
                         <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Truck className="h-4 w-4 text-purple-500" />
                 <span className="text-sm">Home Visits</span>
               </div>
               <span className="text-sm font-semibold">
                 {data.homeVisitStats ? data.homeVisitStats.total : '--'}
               </span>
             </div>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <FileText className="h-4 w-4 text-orange-500" />
                 <span className="text-sm">Top Tests</span>
               </div>
               <span className="text-sm font-semibold">
                 {data.topTests ? data.topTests.length : '--'}
               </span>
             </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.ordersByStatus.map((status) => {
              const percentage = stats.totalOrders > 0 
                ? (status._count.status / stats.totalOrders * 100).toFixed(1)
                : '0';
              
              return (
                <div key={status.status} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{status.status.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-semibold">{status._count.status}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">{percentage}% of total orders</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

                 <Card className="border-0 shadow-sm">
           <CardHeader className="pb-3">
             <CardTitle className="text-lg font-semibold">Top Performing Tests</CardTitle>
           </CardHeader>
           <CardContent className="space-y-3">
             {data.topTests && data.topTests.length > 0 ? (
               data.topTests.slice(0, 5).map((test, index) => (
                 <div key={index} className="flex items-center justify-between">
                   <div className="flex-1">
                     <p className="text-sm font-medium truncate">{test.name}</p>
                     <p className="text-xs text-muted-foreground">
                       {test.orderCount} order{test.orderCount !== 1 ? 's' : ''}
                     </p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-semibold">{formatCurrency(test.revenue)}</p>
                     <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                       <div 
                         className="h-1.5 bg-blue-500 rounded-full" 
                         style={{ 
                           width: `${Math.min(100, (test.revenue / Math.max(...data.topTests.map(t => t.revenue))) * 100)}%` 
                         }}
                       ></div>
                     </div>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-4">
                 <TestTube className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                 <p className="text-sm text-muted-foreground">No test data available</p>
               </div>
             )}
             
             {data.homeVisitStats && (
               <div className="pt-3 border-t">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-sm font-medium">Home Visit Stats</span>
                   <span className="text-xs text-muted-foreground">
                     {data.homeVisitStats.total} total
                   </span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Completed</span>
                     <span className="font-medium text-green-600">
                       {data.homeVisitStats.completed}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Pending</span>
                     <span className="font-medium text-yellow-600">
                       {data.homeVisitStats.pending}
                     </span>
                   </div>
                 </div>
               </div>
             )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
} 