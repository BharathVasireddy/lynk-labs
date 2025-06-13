"use client";

import { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, Package, Edit, Trash2, Eye, Copy, Star, StarOff } from "lucide-react";
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
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  originalPrice: number | null;
  testCount: number;
  reportTime: string | null;
  idealFor: string | null;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  _count: {
    packageTests: number;
    orderItems: number;
  };
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPackageDialog, setShowPackageDialog] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [currentPage, searchQuery, statusFilter]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        search: searchQuery,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/packages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handlePackageAction = async (packageId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        await fetchPackages(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || "Action failed");
      }
    } catch (error) {
      console.error("Error performing package action:", error);
      toast.error("Action failed");
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (!confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Package deleted successfully");
        await fetchPackages(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
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

  const getPriceBadge = (price: number, originalPrice: number | null) => {
    if (originalPrice && originalPrice > price) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm line-through text-gray-500">{formatCurrency(originalPrice)}</span>
          <span className="font-medium text-green-600">{formatCurrency(price)}</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
          <p className="text-gray-600">Manage health packages and their configurations</p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Package
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

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
                setStatusFilter("all");
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Packages ({packages.length})</CardTitle>
          <CardDescription>
            All health packages available on the platform
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
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No packages found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add a new package</p>
              <Button className="mt-4" asChild>
                <Link href="/admin/packages/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Package
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{pkg.name}</p>
                              {pkg.isPopular && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">/{pkg.slug}</p>
                            {pkg.subtitle && (
                              <p className="text-sm text-gray-600">{pkg.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPriceBadge(pkg.price, pkg.originalPrice)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{pkg._count.packageTests}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(pkg.isActive)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{pkg._count.orderItems}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(pkg.createdAt)}</span>
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
                                setSelectedPackage(pkg);
                                setShowPackageDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/packages/${pkg.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Package
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigator.clipboard.writeText(pkg.slug)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Slug
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handlePackageAction(pkg.id, "toggle-popular")}
                              className={pkg.isPopular ? "text-orange-600" : "text-yellow-600"}
                            >
                              {pkg.isPopular ? (
                                <>
                                  <StarOff className="h-4 w-4 mr-2" />
                                  Remove from Popular
                                </>
                              ) : (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  Mark as Popular
                                </>
                              )}
                            </DropdownMenuItem>
                            {pkg.isActive ? (
                              <DropdownMenuItem
                                onClick={() => handlePackageAction(pkg.id, "deactivate")}
                                className="text-orange-600"
                              >
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handlePackageAction(pkg.id, "activate")}
                                className="text-green-600"
                              >
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeletePackage(pkg.id)}
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

      {/* Package Details Dialog */}
      <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Package Name</label>
                    <p className="font-medium">{selectedPackage.name}</p>
                  </div>
                  {selectedPackage.subtitle && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subtitle</label>
                      <p>{selectedPackage.subtitle}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Price</label>
                    <p>{getPriceBadge(selectedPackage.price, selectedPackage.originalPrice)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tests Count</label>
                    <p>{selectedPackage._count.packageTests}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Report Time</label>
                    <p>{selectedPackage.reportTime || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ideal For</label>
                    <p>{selectedPackage.idealFor || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedPackage.isActive)}
                      {selectedPackage.isPopular && (
                        <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedPackage.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm mt-1">{selectedPackage.description}</p>
                </div>
              )}
              
              {selectedPackage.features.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Features</label>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {selectedPackage.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-500">Total Orders: </span>
                  <span className="font-medium">{selectedPackage._count.orderItems}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Created: </span>
                  <span className="font-medium">{formatDate(selectedPackage.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 