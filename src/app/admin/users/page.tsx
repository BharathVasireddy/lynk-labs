"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MoreHorizontal, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  UserCheck,
  UserX,
  Crown,
  Filter,
  X,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  customers: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    customers: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all"
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 20;
  
  // Selection
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: filters.search,
        role: filters.role,
        status: filters.status,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.totalCount || 0);
        
        // Calculate stats
        const allUsers = data.users || [];
        setStats({
          total: data.pagination?.totalCount || 0,
          active: allUsers.filter((u: User) => u.isActive).length,
          inactive: allUsers.filter((u: User) => !u.isActive).length,
          admins: allUsers.filter((u: User) => u.role === 'ADMIN').length,
          customers: allUsers.filter((u: User) => u.role === 'CUSTOMER' || u.role === 'USER').length
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error performing user action:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRoleBadge = (role: string) => {
    const config = {
      ADMIN: { label: "Admin", className: "bg-red-100 text-red-700 border-red-200" },
      CUSTOMER: { label: "Customer", className: "bg-blue-100 text-blue-700 border-blue-200" },
      USER: { label: "User", className: "bg-blue-100 text-blue-700 border-blue-200" },
      LAB_TECHNICIAN: { label: "Lab Tech", className: "bg-purple-100 text-purple-700 border-purple-200" },
      HOME_VISIT_AGENT: { label: "Agent", className: "bg-green-100 text-green-700 border-green-200" },
    };
    const roleConfig = config[role as keyof typeof config] || config.USER;
    return (
      <Badge className={cn("text-xs px-2 py-1 border", roleConfig.className)}>
        {roleConfig.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={cn(
        "text-xs px-2 py-1 border",
        isActive 
          ? "bg-green-100 text-green-700 border-green-200" 
          : "bg-gray-100 text-gray-700 border-gray-200"
      )}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all"
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-muted-foreground">Manage platform users and permissions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Compact Stats Cards - Shopify Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-lg font-semibold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Inactive</p>
                <p className="text-lg font-semibold text-gray-600">{stats.inactive}</p>
              </div>
              <UserX className="h-4 w-4 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Admins</p>
                <p className="text-lg font-semibold text-red-600">{stats.admins}</p>
              </div>
              <Crown className="h-4 w-4 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Customers</p>
                <p className="text-lg font-semibold text-blue-600">{stats.customers}</p>
              </div>
              <User className="h-4 w-4 text-blue-500" />
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
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customers</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
                <SelectItem value="LAB_TECHNICIAN">Lab Techs</SelectItem>
                <SelectItem value="HOME_VISIT_AGENT">Agents</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>

            <Button size="sm" className="h-8 text-xs" onClick={fetchUsers}>
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                  className="h-7 text-xs"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Bulk Actions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact Users Table - Shopify Style */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Users</h2>
              <span className="text-sm text-muted-foreground">({totalUsers.toLocaleString()})</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="w-8 pl-4">
                      <Checkbox
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-xs font-medium">User</TableHead>
                    <TableHead className="text-xs font-medium">Contact</TableHead>
                    <TableHead className="text-xs font-medium">Role</TableHead>
                    <TableHead className="text-xs font-medium">Status</TableHead>
                    <TableHead className="text-xs font-medium">Orders</TableHead>
                    <TableHead className="text-xs font-medium">Joined</TableHead>
                    <TableHead className="text-xs font-medium w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className={cn(
                      "hover:bg-gray-50 border-b",
                      selectedUsers.includes(user.id) && "bg-blue-50"
                    )}>
                      <TableCell className="pl-4 py-3">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {user.name || `User ${user.phone.slice(-4)}`}
                            </p>
                            <div className="flex items-center gap-1">
                              <p className="text-xs text-muted-foreground">ID: {user.id.slice(-8)}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => navigator.clipboard.writeText(user.id)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                          {user.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="py-3">
                        {getStatusBadge(user.isActive)}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-medium text-sm">{user._count.orders}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[100]">
                              <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                                <Eye className="h-3 w-3 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/orders?user=${user.id}`)}>
                                <Eye className="h-3 w-3 mr-2" />
                                View Orders
                              </DropdownMenuItem>
                              {user.isActive ? (
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, "deactivate")}
                                  className="text-red-600"
                                >
                                  <UserX className="h-3 w-3 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, "activate")}
                                  className="text-green-600"
                                >
                                  <UserCheck className="h-3 w-3 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {user.role === "USER" && (
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, "make_admin")}
                                >
                                  <Crown className="h-3 w-3 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Compact Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <div className="text-xs text-muted-foreground">
                {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers}
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
    </div>
  );
} 