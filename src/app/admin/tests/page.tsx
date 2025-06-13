"use client";

import { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, TestTube, Edit, Trash2, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

interface Test {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  preparationInstructions: string | null;
  reportTime: string | null;
  isActive: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    orderItems: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showTestDialog, setShowTestDialog] = useState(false);

  useEffect(() => {
    fetchTests();
    fetchCategories();
  }, [currentPage, searchQuery, categoryFilter, statusFilter]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/tests?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTests(data.tests || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleTestAction = async (testId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        await fetchTests(); // Refresh the list
      }
    } catch (error) {
      console.error("Error performing test action:", error);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTests(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting test:", error);
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const getPriceBadge = (price: number, discountPrice: number | null) => {
    if (discountPrice && discountPrice < price) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm line-through text-gray-500">{formatCurrency(price)}</span>
          <span className="font-medium text-green-600">{formatCurrency(discountPrice)}</span>
        </div>
      );
    }
    return <span className="font-medium">{formatCurrency(price)}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tests Management</h1>
          <p className="text-gray-600">Manage diagnostic tests and their configurations</p>
        </div>
        <Button asChild>
          <Link href="/admin/tests/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Test
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Reset Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tests ({tests.length})</CardTitle>
          <CardDescription>
            All diagnostic tests available on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tests found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add a new test</p>
              <Button className="mt-4" asChild>
                <Link href="/admin/tests/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Test
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Report Time</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <TestTube className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-gray-500">/{test.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{test.category.name}</Badge>
                      </TableCell>
                      <TableCell>{getPriceBadge(test.price, test.discountPrice)}</TableCell>
                      <TableCell>{getStatusBadge(test.isActive)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{test._count.orderItems}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{test.reportTime || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(test.createdAt)}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTest(test);
                                setShowTestDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/tests/${test.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Test
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigator.clipboard.writeText(test.slug)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Slug
                            </DropdownMenuItem>
                            {test.isActive ? (
                              <DropdownMenuItem
                                onClick={() => handleTestAction(test.id, "deactivate")}
                                className="text-orange-600"
                              >
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleTestAction(test.id, "activate")}
                                className="text-green-600"
                              >
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteTest(test.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Details Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Test Details</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Test Name</label>
                  <p className="font-medium">{selectedTest.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p>{selectedTest.category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p>{getPriceBadge(selectedTest.price, selectedTest.discountPrice)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Report Time</label>
                  <p>{selectedTest.reportTime || "Not specified"}</p>
                </div>
              </div>
              
              {selectedTest.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm mt-1">{selectedTest.description}</p>
                </div>
              )}
              
              {selectedTest.preparationInstructions && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Preparation Instructions</label>
                  <p className="text-sm mt-1">{selectedTest.preparationInstructions}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-500">Status: </span>
                  {getStatusBadge(selectedTest.isActive)}
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Orders: </span>
                  <span className="font-medium">{selectedTest._count.orderItems}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 