"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, TestTube, Save, Loader2, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Test {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  preparationInstructions: string | null;
  reportTime: string | null;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    orderItems: number;
  };
}

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [test, setTest] = useState<Test | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    preparationInstructions: "",
    reportTime: "",
    categoryId: "",
    isActive: true,
  });

  useEffect(() => {
    if (testId) {
      fetchTest();
      fetchCategories();
    }
  }, [testId]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/admin/tests/${testId}`);
      if (response.ok) {
        const data = await response.json();
        const testData = data.test;
        setTest(testData);
        setFormData({
          name: testData.name,
          description: testData.description || "",
          price: testData.price.toString(),
          discountPrice: testData.discountPrice?.toString() || "",
          preparationInstructions: testData.preparationInstructions || "",
          reportTime: testData.reportTime || "",
          categoryId: testData.categoryId,
          isActive: testData.isActive,
        });
      } else {
        toast.error("Failed to load test details");
        router.push("/admin/tests");
      }
    } catch (error) {
      console.error("Error fetching test:", error);
      toast.error("Failed to load test details");
      router.push("/admin/tests");
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
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Test name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      toast.error("Discount price must be less than regular price");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        preparationInstructions: formData.preparationInstructions.trim() || undefined,
        reportTime: formData.reportTime.trim() || undefined,
        categoryId: formData.categoryId,
        isActive: formData.isActive,
      };

      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Test updated successfully!");
        router.push("/admin/tests");
      } else {
        toast.error(data.error || "Failed to update test");
      }
    } catch (error) {
      console.error("Error updating test:", error);
      toast.error("Failed to update test");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!test) return;

    if (test._count.orderItems > 0) {
      toast.error("Cannot delete test with existing orders. Deactivate instead.");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${test.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Test deleted successfully");
        router.push("/admin/tests");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("Failed to delete test");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/tests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tests
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Test</h1>
            <p className="text-gray-600">Loading test details...</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/tests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tests
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Test</h1>
            <p className="text-gray-600">Test not found</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Test not found</h3>
            <p className="text-gray-600 mb-4">The test you're looking for doesn't exist or has been deleted.</p>
            <Button asChild>
              <Link href="/admin/tests">Back to Tests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/tests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tests
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Test</h1>
            <p className="text-gray-600">Update test information and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting || test._count.orderItems > 0}
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Test
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Warning for tests with orders */}
      {test._count.orderItems > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  This test has {test._count.orderItems} order(s) and cannot be deleted.
                </p>
                <p className="text-sm text-orange-700">
                  You can deactivate it instead to prevent new orders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="h-5 w-5 mr-2" />
                  Test Information
                </CardTitle>
                <CardDescription>
                  Update basic information about the diagnostic test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Test Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Test Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Complete Blood Count (CBC)"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of what this test measures..."
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Regular Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="preparationInstructions">Preparation Instructions</Label>
                  <Textarea
                    id="preparationInstructions"
                    value={formData.preparationInstructions}
                    onChange={(e) => handleInputChange("preparationInstructions", e.target.value)}
                    placeholder="Any special instructions for the patient..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportTime">Report Time</Label>
                  <Input
                    id="reportTime"
                    value={formData.reportTime}
                    onChange={(e) => handleInputChange("reportTime", e.target.value)}
                    placeholder="e.g., Same day, 24 hours, 2-3 days"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings & Preview */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Test availability and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active Status</Label>
                    <p className="text-sm text-gray-500">
                      {formData.isActive ? "Test is available for booking" : "Test is hidden from customers"}
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Info */}
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
                <CardDescription>Current test details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Test ID</Label>
                  <p className="text-sm font-mono">{test.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Slug</Label>
                  <p className="text-sm font-mono">/{test.slug}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <p className="text-sm">{test.category.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Orders</Label>
                  <p className="text-sm">{test._count.orderItems} order(s)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="text-sm">{new Date(test.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="text-sm">{new Date(test.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How this test will appear to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{formData.name || "Test Name"}</h3>
                    {formData.description && (
                      <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {formData.discountPrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">₹{formData.discountPrice}</span>
                          <span className="text-sm line-through text-gray-500">₹{formData.price}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">₹{formData.price || "0"}</span>
                      )}
                    </div>
                    <div className="text-right">
                      {formData.reportTime && (
                        <p className="text-sm text-gray-500">{formData.reportTime}</p>
                      )}
                    </div>
                  </div>
                  {!formData.isActive && (
                    <div className="text-center py-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Inactive - Hidden from customers
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/tests">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Test
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 