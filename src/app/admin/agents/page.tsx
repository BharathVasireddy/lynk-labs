"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  UserCheck,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string | null;
  phone: string;
  email?: string | null;
  createdAt: string;
  role: string;
}

interface NewAgentForm {
  name: string;
  phone: string;
  email: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<NewAgentForm>({
    name: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<NewAgentForm>>({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdAgentInfo, setCreatedAgentInfo] = useState<any>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/agents");
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      } else {
        toast.error("Failed to fetch agents");
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const validateForm = (): boolean => {
    const errors: Partial<NewAgentForm> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{9,14}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAgent = async () => {
    if (!validateForm()) {
      return;
    }

    setCreating(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.replace(/\s/g, ""),
        email: formData.email.trim() || undefined,
      };

      console.log("Creating agent with payload:", payload);

      const response = await fetch("/api/admin/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setCreatedAgentInfo(data);
        setSuccessDialogOpen(true);
        setCreateDialogOpen(false);
        setFormData({ name: "", phone: "", email: "" });
        setFormErrors({});
        fetchAgents(); // Refresh the list
      } else {
        console.error("API Error:", data);
        toast.error(data.error || `Failed to create agent (${response.status})`);
      }
    } catch (error) {
      console.error("Network error creating agent:", error);
      toast.error("Network error: Failed to create agent");
    } finally {
      setCreating(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.phone.includes(searchQuery) ||
    agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.role === "HOME_VISIT_AGENT").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-600">Manage home visit agents and their information</p>
          <p className="text-sm text-blue-600 mt-1">
            Agents login at <code className="bg-gray-100 px-1 rounded">/auth/login</code> with phone + password
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Add a new home visit agent to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter agent's full name"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="agent@example.com"
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateAgent} 
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Agent
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCreateDialogOpen(false);
                    setFormData({ name: "", phone: "", email: "" });
                    setFormErrors({});
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              All registered agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              Available for home visits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Agents</CardTitle>
          <CardDescription>Find agents by name, phone, or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agents List</CardTitle>
          <CardDescription>
            All registered home visit agents ({filteredAgents.length} of {totalAgents})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading agents...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Details</TableHead>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {agent.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">ID: {agent.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {agent.phone}
                          </div>
                          {agent.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {agent.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Home Visit Agent
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(agent.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAgents.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No agents found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "No agents match your search criteria." 
                      : "No agents have been created yet."
                    }
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Agent
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Agent Created Successfully!
            </DialogTitle>
            <DialogDescription>
              The agent has been created and can now login to the system.
            </DialogDescription>
          </DialogHeader>
          {createdAgentInfo && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Agent Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {createdAgentInfo.agent?.name}</p>
                  <p><strong>Phone:</strong> {createdAgentInfo.agent?.phone}</p>
                  {createdAgentInfo.agent?.email && (
                    <p><strong>Email:</strong> {createdAgentInfo.agent?.email}</p>
                  )}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Login Credentials</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Phone:</strong> {createdAgentInfo.loginInfo?.phone}</p>
                  <p><strong>Temporary Password:</strong> {createdAgentInfo.loginInfo?.temporaryPassword}</p>
                <p className="text-sm text-amber-600 mt-2">⚠️ {createdAgentInfo.loginInfo?.note}</p>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  The agent can login at /auth/login using these credentials
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Login Details:\nPhone: ${createdAgentInfo.loginInfo?.phone}\nTemporary Password: ${createdAgentInfo.loginInfo?.temporaryPassword}\n\nNote: ${createdAgentInfo.loginInfo?.note}`
                    );
                    toast.success("Login details copied to clipboard!");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Copy Details
                </Button>
                <Button 
                  onClick={() => setSuccessDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 