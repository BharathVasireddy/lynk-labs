"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  TestTube,
  CheckCircle,
  AlertCircle,
  Navigation,
  Activity,
  Loader2,
  LogOut,
  Target,
  ListTodo,
  TrendingUp,
  Bell
} from "lucide-react";
import { toast } from "sonner";

interface HomeVisit {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  priority?: string;
  otp?: string;
  notes?: string;
  order: {
    id: string;
    orderNumber: string;
    priority?: string;
    user: {
      name: string | null;
      phone: string;
    };
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
    };
    orderItems: {
      test: {
        name: string;
      };
    }[];
  };
}

const statusConfig = {
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-800", icon: Calendar },
  IN_PROGRESS: { label: "In Progress", color: "bg-yellow-100 text-yellow-800", icon: Activity },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

const priorityConfig = {
  HIGH: { label: "High", color: "bg-red-100 text-red-800", icon: AlertCircle },
  MEDIUM: { label: "Medium", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  LOW: { label: "Low", color: "bg-green-100 text-green-800", icon: CheckCircle },
  NORMAL: { label: "Normal", color: "bg-blue-100 text-blue-800", icon: Target },
};

// Custom Agent Header Component
function AgentHeader({ user, onLogout, todayVisits, totalAssigned, highPriorityToday }: {
  user: any;
  onLogout: () => void;
  todayVisits: HomeVisit[];
  totalAssigned: number;
  highPriorityToday: number;
}) {
  const currentTime = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Agent Info */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Agent Dashboard</h1>
              <p className="text-blue-100">Welcome, {user?.name || "Agent"}</p>
            </div>
          </div>

          {/* Center Section - Priority Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Target className="h-5 w-5 text-blue-200" />
                <span className="text-2xl font-bold">{todayVisits.length}</span>
              </div>
              <p className="text-xs text-blue-200">Today's Visits</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-300" />
                <span className="text-2xl font-bold text-red-200">{highPriorityToday}</span>
              </div>
              <p className="text-xs text-blue-200">High Priority</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <ListTodo className="h-5 w-5 text-blue-200" />
                <span className="text-2xl font-bold">{totalAssigned}</span>
              </div>
              <p className="text-xs text-blue-200">Total Assigned</p>
            </div>
          </div>

          {/* Right Section - Time & Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-blue-200">Current Time</p>
              <p className="text-lg font-semibold">{currentTime}</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Priority Stats */}
        <div className="md:hidden mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-blue-200" />
              <span className="text-lg font-bold">{todayVisits.length}</span>
            </div>
            <p className="text-xs text-blue-200">Today</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <span className="text-lg font-bold text-red-200">{highPriorityToday}</span>
            </div>
            <p className="text-xs text-blue-200">Priority</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ListTodo className="h-4 w-4 text-blue-200" />
              <span className="text-lg font-bold">{totalAssigned}</span>
            </div>
            <p className="text-xs text-blue-200">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const fetchHomeVisits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agent/home-visits");
      if (response.ok) {
        const data = await response.json();
        setHomeVisits(data.homeVisits || []);
      } else {
        toast.error("Failed to fetch home visits");
      }
    } catch (error) {
      console.error("Error fetching home visits:", error);
      toast.error("Failed to fetch home visits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "HOME_VISIT_AGENT") {
      fetchHomeVisits();
    }
  }, [user, fetchHomeVisits]);

  const updateVisitStatus = async (visitId: string, newStatus: string) => {
    setUpdating(visitId);
    try {
      const response = await fetch(`/api/agent/home-visits/${visitId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Visit ${newStatus.toLowerCase()} successfully`);
        fetchHomeVisits();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update visit status");
      }
    } catch (error) {
      console.error("Error updating visit status:", error);
      toast.error("Failed to update visit status");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.NORMAL;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getFullAddress = (address: any) => {
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.pincode
    ].filter(Boolean);
    return parts.join(", ");
  };

  // Enhanced filtering with priority
  const todayVisits = homeVisits.filter(visit => {
    const visitDate = new Date(visit.scheduledDate).toDateString();
    const today = new Date().toDateString();
    return visitDate === today;
  });

  // Sort today's visits by priority (HIGH -> MEDIUM -> LOW -> NORMAL)
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, NORMAL: 3 };
  const todayVisitsSorted = [...todayVisits].sort((a, b) => {
    const aPriority = a.order.priority || 'NORMAL';
    const bPriority = b.order.priority || 'NORMAL';
    return priorityOrder[aPriority as keyof typeof priorityOrder] - priorityOrder[bPriority as keyof typeof priorityOrder];
  });

  const upcomingVisits = homeVisits.filter(visit => {
    const visitDate = new Date(visit.scheduledDate);
    const today = new Date();
    return visitDate > today;
  });

  const completedVisits = homeVisits.filter(visit => visit.status === "COMPLETED");
  const pendingVisits = homeVisits.filter(visit => ["SCHEDULED", "IN_PROGRESS"].includes(visit.status));
  const highPriorityToday = todayVisits.filter(visit => visit.order.priority === "HIGH").length;
  const totalAssigned = homeVisits.length;

  if (user?.role !== "HOME_VISIT_AGENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This dashboard is only accessible to home visit agents.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Agent Header */}
      <AgentHeader 
        user={user}
        onLogout={handleLogout}
        todayVisits={todayVisits}
        totalAssigned={totalAssigned}
        highPriorityToday={highPriorityToday}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Priority Today's Visits Section */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Today's Priority Visits</span>
                </CardTitle>
                <CardDescription>
                  Your visits for today, sorted by priority
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {todayVisits.length} visits
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {todayVisitsSorted.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No visits scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayVisitsSorted.map((visit) => (
                  <div key={visit.id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getPriorityBadge(visit.order.priority || 'NORMAL')}
                        {getStatusBadge(visit.status)}
                        <span className="text-sm text-gray-600">
                          Order: {visit.order.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {formatTime(visit.scheduledTime)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Patient</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{visit.order.user.name || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{visit.order.user.phone}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Address</p>
                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{getFullAddress(visit.order.address)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Tests</p>
                        <div className="space-y-1">
                          {visit.order.orderItems.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <TestTube className="h-3 w-3" />
                              <span className="truncate">{item.test.name}</span>
                            </div>
                          ))}
                          {visit.order.orderItems.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{visit.order.orderItems.length - 2} more tests
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      {visit.status === "SCHEDULED" && (
                        <Button
                          size="sm"
                          onClick={() => updateVisitStatus(visit.id, "IN_PROGRESS")}
                          disabled={updating === visit.id}
                        >
                          {updating === visit.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Activity className="h-4 w-4 mr-2" />
                          )}
                          Start Visit
                        </Button>
                      )}
                      {visit.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          onClick={() => updateVisitStatus(visit.id, "COMPLETED")}
                          disabled={updating === visit.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {updating === visit.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Complete Visit
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayVisits.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highPriorityToday}</div>
              <p className="text-xs text-muted-foreground">
                Priority visits today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedVisits.length}</div>
              <p className="text-xs text-muted-foreground">
                Total completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalAssigned}</div>
              <p className="text-xs text-muted-foreground">
                All assigned visits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* All Home Visits Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Home Visits</CardTitle>
            <CardDescription>
              Complete list of your assigned home visit appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading visits...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visit Details</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Patient Info</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {homeVisits.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(visit.scheduledDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              {formatTime(visit.scheduledTime)}
                            </div>
                            <p className="text-xs text-gray-500">
                              Order: {visit.order.orderNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(visit.order.priority || 'NORMAL')}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              {visit.order.user.name || "N/A"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {visit.order.user.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="flex items-start text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 text-xs leading-relaxed">
                                {getFullAddress(visit.order.address)}
                              </span>
                            </div>
                            {visit.order.address.landmark && (
                              <p className="text-xs text-gray-500 ml-6 mt-1">
                                Landmark: {visit.order.address.landmark}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 max-w-xs">
                            {visit.order.orderItems.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <TestTube className="h-3 w-3 mr-1 text-gray-400" />
                                <span className="text-gray-600 truncate">
                                  {item.test.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(visit.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {visit.status === "SCHEDULED" && (
                              <Button
                                size="sm"
                                onClick={() => updateVisitStatus(visit.id, "IN_PROGRESS")}
                                disabled={updating === visit.id}
                              >
                                {updating === visit.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Start"
                                )}
                              </Button>
                            )}
                            {visit.status === "IN_PROGRESS" && (
                              <Button
                                size="sm"
                                onClick={() => updateVisitStatus(visit.id, "COMPLETED")}
                                disabled={updating === visit.id}
                              >
                                {updating === visit.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Complete"
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 