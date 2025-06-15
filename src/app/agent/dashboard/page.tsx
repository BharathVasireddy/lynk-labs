"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
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
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface HomeVisit {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  otp?: string;
  notes?: string;
  order: {
    id: string;
    orderNumber: string;
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

export default function AgentDashboard() {
  const { user } = useAuth();
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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

  const todayVisits = homeVisits.filter(visit => {
    const visitDate = new Date(visit.scheduledDate).toDateString();
    const today = new Date().toDateString();
    return visitDate === today;
  });

  const upcomingVisits = homeVisits.filter(visit => {
    const visitDate = new Date(visit.scheduledDate);
    const today = new Date();
    return visitDate > today;
  });

  const completedVisits = homeVisits.filter(visit => visit.status === "COMPLETED");
  const pendingVisits = homeVisits.filter(visit => ["SCHEDULED", "IN_PROGRESS"].includes(visit.status));

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || "Agent"}!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

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
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingVisits.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
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
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{upcomingVisits.length}</div>
              <p className="text-xs text-muted-foreground">
                Future visits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Home Visits Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Home Visits</CardTitle>
            <CardDescription>
              Your assigned home visit appointments
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

                {homeVisits.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No visits assigned</h3>
                    <p className="text-muted-foreground">
                      You don't have any home visits assigned yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 