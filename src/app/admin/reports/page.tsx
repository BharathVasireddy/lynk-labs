"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Upload, Download, Eye, Search, Filter, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateFilter } from "@/components/ui/date-filter";

interface Report {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  isDelivered: boolean;
  deliveredAt?: string;
  order: {
    id: string;
    orderNumber: string;
    user: {
      name: string | null;
      phone: string;
    };
    orderItems: {
      test: {
        name: string;
      };
    }[];
  };
  uploader: {
    name: string | null;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  user: {
    name: string | null;
    phone: string;
  };
  orderItems: {
    test: {
      name: string;
    };
  }[];
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: { from: undefined, to: undefined } as { from: Date | undefined; to: Date | undefined },
    search: "",
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.dateRange.from) params.append("dateFrom", filters.dateRange.from.toISOString());
      if (filters.dateRange.to) params.append("dateTo", filters.dateRange.to.toISOString());
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/admin/reports?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
    fetchOrdersForUpload();
  }, [fetchReports]);

  const fetchOrdersForUpload = async () => {
    try {
      // Fetch orders that are eligible for report upload (sample collected or processing)
      const response = await fetch("/api/admin/orders?status=SAMPLE_COLLECTED,PROCESSING&hasReport=false");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error("Failed to fetch orders for upload:", response.status);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedOrder || !uploadFile) {
      alert("Please select an order and upload a file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("orderId", selectedOrder);
      formData.append("notes", uploadNotes);

      const response = await fetch("/api/admin/reports/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Report uploaded successfully!");
        fetchReports();
        fetchOrdersForUpload();
        setUploadDialogOpen(false);
        setSelectedOrder("");
        setUploadFile(null);
        setUploadNotes("");
      } else {
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading report:", error);
      alert("Upload failed: Network error or server unavailable");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMarkAsDelivered = async (reportId: string) => {
    try {
      console.log("🚀 Attempting to mark report as delivered:", reportId);
      
      const response = await fetch(`/api/admin/reports/${reportId}/deliver`, {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (response.ok) {
        alert("✅ Report marked as delivered successfully!");
        fetchReports();
      } else {
        console.error("❌ Delivery failed:", data);
        alert(`❌ Failed to mark as delivered: ${data.error || "Unknown error"}\n\nStatus: ${response.status}\nDetails: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error("💥 Network error marking report as delivered:", error);
      alert(`💥 Failed to mark as delivered: Network error\n\nError: ${error.message}\n\nPlease check your internet connection and try again.`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reports Management</h1>
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

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => !r.isDelivered).length;
  const deliveredReports = reports.filter(r => r.isDelivered).length;
  const ordersAwaitingReports = orders.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600">Upload and manage test reports</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveredReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Reports</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ordersAwaitingReports}</div>
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
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <DateFilter
                value={filters.dateRange}
                onChange={(range) => setFilters({ ...filters, dateRange: range })}
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={fetchReports} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ({reports.length})</CardTitle>
          <CardDescription>
            Manage uploaded test reports and delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Report File</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {report.order.id.slice(-8)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.order.user.name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">{report.order.user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm">
                          {report.order.orderItems.length} test(s)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {report.order.orderItems.slice(0, 2).map(item => item.test.name).join(", ")}
                          {report.order.orderItems.length > 2 && "..."}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{report.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(report.fileSize)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{formatDate(report.uploadedAt)}</p>
                        <p className="text-xs text-muted-foreground">
                          by {report.uploader.name || "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.isDelivered ? (
                        <div>
                          <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                          {report.deliveredAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(report.deliveredAt)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(report.fileUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = report.fileUrl;
                            link.download = report.fileName;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {!report.isDelivered && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsDelivered(report.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {reports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                No reports match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Report Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Upload Report</DialogTitle>
            <DialogDescription>
              Upload a test report for a completed order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Order</Label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an order" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.orderNumber} - {order.user.name || order.user.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Report File</Label>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: PDF, JPG, PNG (Max 10MB)
              </p>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Any additional notes about the report..."
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleFileUpload} 
                disabled={!selectedOrder || !uploadFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Report"}
              </Button>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 