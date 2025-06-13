"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, User, Phone, Search, Filter, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HomeVisit {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  otp?: string;
  collectionTime?: string;
  notes?: string;
  createdAt: string;
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
  agent?: {
    id: string;
    name: string | null;
    phone: string;
  };
}

interface Agent {
  id: string;
  name: string | null;
  phone: string;
}

const statusConfig = {
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export default function HomeVisitsPage() {
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    date: "",
    search: "",
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<HomeVisit | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");

  const fetchHomeVisits = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.date) params.append("date", filters.date);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/admin/home-visits?${params}`);
      if (response.ok) {
        const data = await response.json();
        setHomeVisits(data.homeVisits || []);
      }
    } catch (error) {
      console.error("Error fetching home visits:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAgents = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/agents");
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  }, []);

  useEffect(() => {
    fetchHomeVisits();
  }, [fetchHomeVisits]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleAssignAgent = async () => {
    if (!selectedVisit || !selectedAgent) return;

    try {
      const response = await fetch(`/api/admin/home-visits/${selectedVisit.id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent,
          notes: assignmentNotes,
        }),
      });

      if (response.ok) {
        fetchHomeVisits();
        setAssignDialogOpen(false);
        setSelectedAgent("");
        setAssignmentNotes("");
        setSelectedVisit(null);
      }
    } catch (error) {
      console.error("Error assigning agent:", error);
    }
  };

  const handleStatusUpdate = async (visitId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/home-visits/${visitId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchHomeVisits();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Home Visits</h1>
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

  const totalVisits = homeVisits.length;
  const scheduledVisits = homeVisits.filter(v => v.status === "SCHEDULED").length;
  const inProgressVisits = homeVisits.filter(v => v.status === "IN_PROGRESS").length;
  const completedVisits = homeVisits.filter(v => v.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Visits</h1>
          <p className="text-gray-600">Manage home visit appointments and agent assignments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedVisits}</div>
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
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
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="next_week">Next Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={fetchHomeVisits} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Home Visits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Home Visits ({homeVisits.length})</CardTitle>
          <CardDescription>
            Manage and track all home visit appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homeVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{visit.order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(visit.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{visit.order.user.name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {visit.order.user.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatDate(visit.scheduledDate)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(visit.scheduledTime)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm">{visit.order.address.line1}</p>
                        <p className="text-sm text-muted-foreground">
                          {visit.order.address.city}, {visit.order.address.pincode}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm">
                          {visit.order.orderItems.length} test(s)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {visit.order.orderItems.slice(0, 2).map(item => item.test.name).join(", ")}
                          {visit.order.orderItems.length > 2 && "..."}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {visit.agent ? (
                        <div>
                          <p className="font-medium text-sm">{visit.agent.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{visit.agent.phone}</p>
                        </div>
                      ) : (
                        <Badge variant="outline">Unassigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(visit.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Home Visit Details</DialogTitle>
                              <DialogDescription>
                                Order {visit.order.orderNumber}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Customer</Label>
                                  <p className="text-sm">{visit.order.user.name || "N/A"}</p>
                                  <p className="text-sm text-muted-foreground">{visit.order.user.phone}</p>
                                </div>
                                <div>
                                  <Label>Scheduled</Label>
                                  <p className="text-sm">{formatDate(visit.scheduledDate)}</p>
                                  <p className="text-sm text-muted-foreground">{formatTime(visit.scheduledTime)}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Address</Label>
                                <p className="text-sm">
                                  {visit.order.address.line1}
                                  {visit.order.address.line2 && `, ${visit.order.address.line2}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {visit.order.address.city}, {visit.order.address.state} - {visit.order.address.pincode}
                                </p>
                                {visit.order.address.landmark && (
                                  <p className="text-sm text-muted-foreground">
                                    Landmark: {visit.order.address.landmark}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label>Tests</Label>
                                <div className="space-y-1">
                                  {visit.order.orderItems.map((item, index) => (
                                    <p key={index} className="text-sm">{item.test.name}</p>
                                  ))}
                                </div>
                              </div>
                              {visit.notes && (
                                <div>
                                  <Label>Notes</Label>
                                  <p className="text-sm">{visit.notes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {!visit.agent && visit.status === "SCHEDULED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVisit(visit);
                              setAssignDialogOpen(true);
                            }}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        )}

                        {visit.status === "SCHEDULED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(visit.id, "IN_PROGRESS")}
                          >
                            Start
                          </Button>
                        )}

                        {visit.status === "IN_PROGRESS" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(visit.id, "COMPLETED")}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {homeVisits.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No home visits found</h3>
              <p className="text-muted-foreground">
                No home visits match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Agent</DialogTitle>
            <DialogDescription>
              Assign a home visit agent to this appointment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Agent</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name || "N/A"} - {agent.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Any special instructions for the agent..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAssignAgent} disabled={!selectedAgent}>
                Assign Agent
              </Button>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 