"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, FileText, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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

export default function ReportUploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      router.push("/admin/reports");
    }
  }, [orderId, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        alert("Order not found");
        router.push("/admin/reports");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Failed to fetch order details");
      router.push("/admin/reports");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!orderId || !uploadFile) {
      alert("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("orderId", orderId);
      formData.append("notes", uploadNotes);

      const response = await fetch("/api/admin/reports/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Report uploaded successfully!");
        router.push(`/admin/orders/${orderId}`);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Upload Report</h1>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/reports")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <h1 className="text-3xl font-bold">Upload Report</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
            <p className="text-muted-foreground">
              The specified order could not be found or you don't have permission to access it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Upload Report</h1>
          <p className="text-muted-foreground">Upload test report for order {order.orderNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Order Number</Label>
                <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge variant="outline">{order.status}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{order.user.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{order.user.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Tests Ordered</Label>
                <div className="mt-2 space-y-1">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {item.test.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Report File
              </CardTitle>
              <CardDescription>
                Upload the test report file for this order. Supported formats: PDF, JPG, PNG (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="report-file">Report File *</Label>
                <Input
                  id="report-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                {uploadFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, JPG, PNG. Maximum file size: 10MB
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload-notes">Notes (Optional)</Label>
                <Textarea
                  id="upload-notes"
                  placeholder="Any additional notes about the report..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleFileUpload}
                  disabled={!uploadFile || isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Report
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>

              {!uploadFile && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a file to upload</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a PDF, JPG, or PNG file containing the test report
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('report-file')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 