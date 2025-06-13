"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Edit2, Trash2, Star, Home, Building, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";

interface Address {
  id: string;
  type: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: string;
}

const addressTypeIcons = {
  HOME: Home,
  WORK: Building,
  OTHER: MapIcon,
};

export default function AddressesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [addressForm, setAddressForm] = useState({
    type: "HOME",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?returnUrl=/addresses");
      return;
    }

    if (user) {
      fetchAddresses();
    }
  }, [user, loading, router]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAddressForm({
      type: "HOME",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setError("");
    setSuccess("");
  };

  const handleAddAddress = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      type: address.type,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || "",
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.line1.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.pincode.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/^\d{6}$/.test(addressForm.pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : "/api/addresses";
      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      if (response.ok) {
        setSuccess(editingAddress ? "Address updated successfully!" : "Address added successfully!");
        setIsDialogOpen(false);
        resetForm();
        await fetchAddresses();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save address");
      }
    } catch (error) {
      setError("Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Address deleted successfully!");
        await fetchAddresses();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete address");
      }
    } catch (error) {
      setError("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/default`, {
        method: "PUT",
      });

      if (response.ok) {
        setSuccess("Default address updated!");
        await fetchAddresses();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update default address");
      }
    } catch (error) {
      setError("Failed to update default address");
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medical-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Addresses</h1>
              <p className="text-muted-foreground">Manage your delivery addresses for home sample collection</p>
            </div>
            <Button onClick={handleAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first address to enable home sample collection
                </p>
                <Button onClick={handleAddAddress}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {addresses.map((address) => {
                const TypeIcon = addressTypeIcons[address.type as keyof typeof addressTypeIcons] || MapIcon;
                
                return (
                  <Card key={address.id} className="medical-card-hover">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {address.type}
                              {address.isDefault && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  Default
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              Added on {new Date(address.createdAt).toLocaleDateString('en-IN')}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(address.id)}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="font-medium">{address.line1}</p>
                        {address.line2 && <p className="text-muted-foreground">{address.line2}</p>}
                        <p className="text-muted-foreground">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        {address.landmark && (
                          <p className="text-sm text-muted-foreground">Near: {address.landmark}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Add/Edit Address Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </DialogTitle>
                <DialogDescription>
                  {editingAddress 
                    ? "Update your address details below"
                    : "Add a new address for home sample collection"
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Address Type */}
                <div className="space-y-2">
                  <Label>Address Type</Label>
                  <RadioGroup
                    value={addressForm.type}
                    onValueChange={(value) => setAddressForm(prev => ({ ...prev, type: value }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="HOME" id="home" />
                      <Label htmlFor="home" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Home
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="WORK" id="work" />
                      <Label htmlFor="work" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Work
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTHER" id="other" />
                      <Label htmlFor="other" className="flex items-center gap-2">
                        <MapIcon className="h-4 w-4" />
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Address Line 1 */}
                <div className="space-y-2">
                  <Label>Address Line 1 *</Label>
                  <Input
                    value={addressForm.line1}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                    placeholder="House/Flat No., Building Name"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-2">
                  <Label>Address Line 2</Label>
                  <Input
                    value={addressForm.line2}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                    placeholder="Street, Area, Locality"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State *</Label>
                    <Input
                      value={addressForm.state}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                    />
                  </div>
                </div>

                {/* Pincode and Landmark */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pincode *</Label>
                    <Input
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Landmark</Label>
                    <Input
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>

                {/* Set as Default */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isDefault">Set as default address</Label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveAddress} disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      editingAddress ? "Update Address" : "Add Address"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 