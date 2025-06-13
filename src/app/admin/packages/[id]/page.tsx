"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Package, Save, Loader2, Plus, X, TestTube, AlertCircle, Trash2 } from "lucide-react";
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

interface PackageTest {
  id: string;
  testId: string;
  test: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    category: {
      name: string;
    };
  };
}

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
  updatedAt: string;
  packageTests: PackageTest[];
  _count: {
    orderItems: number;
  };
}

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pkg, setPkg] = useState<Package | null>(null);
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
    if (packageId) {
      fetchPackage();
      fetchTests();
    }
  }, [packageId]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/admin/packages/${packageId}`);
      if (response.ok) {
        const data = await response.json();
        const packageData = data.package;
        setPkg(packageData);
        
        setFormData({
          name: packageData.name,
          subtitle: packageData.subtitle || "",
          description: packageData.description || "",
          price: packageData.price.toString(),
          originalPrice: packageData.originalPrice?.toString() || "",
          reportTime: packageData.reportTime || "",
          idealFor: packageData.idealFor || "",
          isPopular: packageData.isPopular,
          isActive: packageData.isActive,
        });
        
        setFeatures(packageData.features.length > 0 ? packageData.features : [""]);
        setSelectedTests(packageData.packageTests.map((pt: PackageTest) => pt.testId));
      } else {
        toast.error("Failed to load package details");
        router.push("/admin/packages");
      }
    } catch (error) {
      console.error("Error fetching package:", error);
      toast.error("Failed to load package details");
      router.push("/admin/packages");
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);

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

      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Package updated successfully!");
        router.push("/admin/packages");
      } else {
        toast.error(data.error || "Failed to update package");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error("Failed to update package");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pkg) return;

    if (pkg._count.orderItems > 0) {
      toast.error("Cannot delete package with existing orders. Deactivate instead.");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Package deleted successfully");
        router.push("/admin/packages");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Package</h1>
            <p className="text-gray-600">Loading package details...</p>
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

  if (!pkg) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Package</h1>
            <p className="text-gray-600">Package not found</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Package not found</h3>
            <p className="text-gray-600 mb-4">The package you're looking for doesn't exist or has been deleted.</p>
            <Button asChild>
              <Link href="/admin/packages">Back to Packages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Edit Package</h1>
            <p className="text-gray-600">Update package information and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting || pkg._count.orderItems > 0}
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Package
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Warning for packages with orders */}
      {pkg._count.orderItems > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  This package has {pkg._count.orderItems} order(s) and cannot be deleted.
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
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Package Information
                </CardTitle>
                <CardDescription>
                  Update basic information about the health package
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
                    placeholder="e.g., Complete Health Checkup"
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
                    placeholder="Brief tagline for the package"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of the package..."
                    rows={4}
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Current Price (₹) *</Label>
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
                    <p className="text-xs text-gray-500">
                      Leave empty if no discount
                    </p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportTime">Report Time</Label>
                    <Input
                      id="reportTime"
                      value={formData.reportTime}
                      onChange={(e) => handleInputChange("reportTime", e.target.value)}
                      placeholder="e.g., Same day, 24 hours"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idealFor">Ideal For</Label>
                    <Input
                      id="idealFor"
                      value={formData.idealFor}
                      onChange={(e) => handleInputChange("idealFor", e.target.value)}
                      placeholder="e.g., Adults, Seniors, Athletes"
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
                  Key benefits and highlights of this package
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter a feature or benefit"
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

                {selectedTests.length > 0 && (
                  <div className="pt-4 border-t mt-4">
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
              </CardContent>
            </Card>
          </div>

          {/* Settings & Preview */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Package visibility and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPopular">Popular Package</Label>
                    <p className="text-sm text-gray-500">
                      {formData.isPopular ? "Highlighted as popular" : "Regular package"}
                    </p>
                  </div>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active Status</Label>
                    <p className="text-sm text-gray-500">
                      {formData.isActive ? "Package is available for booking" : "Package is hidden from customers"}
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

            {/* Package Info */}
            <Card>
              <CardHeader>
                <CardTitle>Package Information</CardTitle>
                <CardDescription>Current package details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Package ID</Label>
                  <p className="text-sm font-mono">{pkg.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Slug</Label>
                  <p className="text-sm font-mono">/{pkg.slug}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Current Tests</Label>
                  <p className="text-sm">{pkg.packageTests.length} test(s)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Orders</Label>
                  <p className="text-sm">{pkg._count.orderItems} order(s)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="text-sm">{new Date(pkg.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="text-sm">{new Date(pkg.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How this package will appear to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{formData.name || "Package Name"}</h3>
                      {formData.isPopular && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    {formData.subtitle && (
                      <p className="text-sm text-gray-600 mt-1">{formData.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {formData.originalPrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">₹{formData.price}</span>
                          <span className="text-sm line-through text-gray-500">₹{formData.originalPrice}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">₹{formData.price || "0"}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{selectedTests.length} tests</p>
                      {formData.reportTime && (
                        <p className="text-sm text-gray-500">{formData.reportTime}</p>
                      )}
                    </div>
                  </div>

                  {features.filter(f => f.trim()).length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Features:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {features.filter(f => f.trim()).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

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
            <Link href="/admin/packages">Cancel</Link>
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
                Update Package
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 