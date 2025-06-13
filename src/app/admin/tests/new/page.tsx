"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, TestTube, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    fetchCategories();
  }, []);

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

    setLoading(true);

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

      const response = await fetch("/api/admin/tests/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Test created successfully!");
        router.push("/admin/tests");
      } else {
        toast.error(data.error || "Failed to create test");
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Add New Test</h1>
            <p className="text-gray-600">Create a new diagnostic test</p>
          </div>
        </div>
      </div>

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
                  Basic information about the diagnostic test
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
                <div className="grid grid-cols-2 gap-4">
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

                {/* Report Time */}
                <div className="space-y-2">
                  <Label htmlFor="reportTime">Report Time</Label>
                  <Input
                    id="reportTime"
                    value={formData.reportTime}
                    onChange={(e) => handleInputChange("reportTime", e.target.value)}
                    placeholder="e.g., 24-48 hours, Same day"
                  />
                </div>

                {/* Preparation Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="preparationInstructions">Preparation Instructions</Label>
                  <Textarea
                    id="preparationInstructions"
                    value={formData.preparationInstructions}
                    onChange={(e) => handleInputChange("preparationInstructions", e.target.value)}
                    placeholder="Any special instructions for the patient before taking this test..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Test availability and status settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active Status</Label>
                    <p className="text-sm text-gray-500">
                      Make this test available for booking
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>

                {/* Preview */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <p className="font-medium">{formData.name || "Test Name"}</p>
                    <div className="flex items-center space-x-2">
                      {formData.discountPrice && formData.price ? (
                        <>
                          <span className="text-sm line-through text-gray-500">
                            ₹{formData.price}
                          </span>
                          <span className="font-medium text-green-600">
                            ₹{formData.discountPrice}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium">
                          ₹{formData.price || "0"}
                        </span>
                      )}
                    </div>
                    {formData.reportTime && (
                      <p className="text-sm text-gray-600">
                        Report: {formData.reportTime}
                      </p>
                    )}
                  </div>
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
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Test
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 