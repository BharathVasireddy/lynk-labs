"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Package, Save, Loader2, Plus, X, TestTube } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Test {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  category: {
    name: string;
  };
}

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    description: "",
    price: "",
    originalPrice: "",
    reportTime: "",
    idealFor: "",
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/admin/tests?limit=1000&status=active");
      if (response.ok) {
        const data = await response.json();
        setTests(data.tests || []);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast.error("Failed to load tests");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleTestSelection = (testId: string, checked: boolean) => {
    if (checked) {
      setSelectedTests([...selectedTests, testId]);
    } else {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    }
  };

  const calculateTotalPrice = () => {
    return selectedTests.reduce((total, testId) => {
      const test = tests.find(t => t.id === testId);
      if (test) {
        return total + (test.discountPrice || test.price);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Package name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
      toast.error("Original price must be greater than current price");
      return;
    }

    if (selectedTests.length === 0) {
      toast.error("Please select at least one test");
      return;
    }

    setLoading(true);

    try {
      const validFeatures = features.filter(f => f.trim() !== "");
      
      const payload = {
        name: formData.name.trim(),
        subtitle: formData.subtitle.trim() || undefined,
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        reportTime: formData.reportTime.trim() || undefined,
        idealFor: formData.idealFor.trim() || undefined,
        features: validFeatures,
        testIds: selectedTests,
        isPopular: formData.isPopular,
        isActive: formData.isActive,
      };

      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Package created successfully!");
        router.push("/admin/packages");
      } else {
        toast.error(data.error || "Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      toast.error("Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  const selectedTestsData = tests.filter(test => selectedTests.includes(test.id));
  const totalPrice = calculateTotalPrice();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Package</h1>
            <p className="text-gray-600">Create a new health package</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Package Information
                </CardTitle>
                <CardDescription>
                  Basic information about the health package
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Package Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Comprehensive Health Package"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    placeholder="e.g., Complete Health Assessment"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the package..."
                    rows={3}
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Package Price (₹) *</Label>
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
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportTime">Report Time</Label>
                    <Input
                      id="reportTime"
                      value={formData.reportTime}
                      onChange={(e) => handleInputChange("reportTime", e.target.value)}
                      placeholder="e.g., 24-48 hours"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idealFor">Ideal For</Label>
                    <Input
                      id="idealFor"
                      value={formData.idealFor}
                      onChange={(e) => handleInputChange("idealFor", e.target.value)}
                      placeholder="e.g., Adults 30-50 years"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Package Features</CardTitle>
                <CardDescription>
                  List the key features and benefits of this package
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter a feature..."
                      className="flex-1"
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            {/* Test Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="h-5 w-5 mr-2" />
                  Select Tests ({selectedTests.length})
                </CardTitle>
                <CardDescription>
                  Choose the tests to include in this package
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tests.length === 0 ? (
                  <p className="text-gray-500">No tests available</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tests.map((test) => (
                      <div key={test.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={test.id}
                          checked={selectedTests.includes(test.id)}
                          onCheckedChange={(checked) => handleTestSelection(test.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={test.id} className="font-medium cursor-pointer">
                            {test.name}
                          </Label>
                          <p className="text-sm text-gray-500">{test.category.name}</p>
                        </div>
                        <div className="text-right">
                          {test.discountPrice ? (
                            <div>
                              <span className="text-sm line-through text-gray-500">₹{test.price}</span>
                              <span className="ml-2 font-medium text-green-600">₹{test.discountPrice}</span>
                            </div>
                          ) : (
                            <span className="font-medium">₹{test.price}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings & Preview */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Package availability and status settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Popular Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPopular">Popular Package</Label>
                    <p className="text-sm text-gray-500">
                      Mark as popular package
                    </p>
                  </div>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active Status</Label>
                    <p className="text-sm text-gray-500">
                      Make this package available for booking
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

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <h3 className="font-medium">{formData.name || "Package Name"}</h3>
                    {formData.subtitle && (
                      <p className="text-sm text-gray-600">{formData.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {formData.originalPrice && formData.price ? (
                      <>
                        <span className="text-sm line-through text-gray-500">
                          ₹{formData.originalPrice}
                        </span>
                        <span className="font-medium text-green-600">
                          ₹{formData.price}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">
                        ₹{formData.price || "0"}
                      </span>
                    )}
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Tests:</strong> {selectedTests.length}</p>
                    {formData.reportTime && (
                      <p><strong>Report:</strong> {formData.reportTime}</p>
                    )}
                    {formData.idealFor && (
                      <p><strong>Ideal for:</strong> {formData.idealFor}</p>
                    )}
                  </div>

                  {selectedTests.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Selected Tests:</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {selectedTestsData.map((test) => (
                          <p key={test.id} className="text-xs text-gray-600">
                            • {test.name}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm font-medium mt-2">
                        Total Value: ₹{totalPrice.toLocaleString()}
                      </p>
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
            <Link href="/admin/packages">Cancel</Link>
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
                Create Package
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 