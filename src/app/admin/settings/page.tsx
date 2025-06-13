"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Bell, 
  Shield, 
  Clock,
  Save
} from "lucide-react";

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  businessHours: {
    start: string;
    end: string;
  };
  homeVisitRadius: number;
  homeVisitLeadTime: number;
  freeDeliveryThreshold: number;
  taxRate: number;
  enableNotifications: boolean;
  enableSMS: boolean;
  enableEmail: boolean;
  enableWhatsApp: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Lynk Labs",
    siteDescription: "Professional lab testing services with home sample collection",
    contactEmail: "support@lynklabs.com",
    contactPhone: "+91 1800-123-4567",
    businessHours: {
      start: "09:00",
      end: "18:00",
    },
    homeVisitRadius: 25,
    homeVisitLeadTime: 24,
    freeDeliveryThreshold: 500,
    taxRate: 18,
    enableNotifications: true,
    enableSMS: true,
    enableEmail: true,
    enableWhatsApp: true,
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof SystemSettings] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure your application settings</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="business">
            <Clock className="h-4 w-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessStart">Business Hours Start</Label>
                  <Input
                    id="businessStart"
                    type="time"
                    value={settings.businessHours.start}
                    onChange={(e) => handleNestedInputChange("businessHours", "start", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEnd">Business Hours End</Label>
                  <Input
                    id="businessEnd"
                    type="time"
                    value={settings.businessHours.end}
                    onChange={(e) => handleNestedInputChange("businessHours", "end", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeVisitRadius">Home Visit Radius (km)</Label>
                  <Input
                    id="homeVisitRadius"
                    type="number"
                    value={settings.homeVisitRadius}
                    onChange={(e) => handleInputChange("homeVisitRadius", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeVisitLeadTime">Home Visit Lead Time (hours)</Label>
                  <Input
                    id="homeVisitLeadTime"
                    type="number"
                    value={settings.homeVisitLeadTime}
                    onChange={(e) => handleInputChange("homeVisitLeadTime", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold (₹)</Label>
                  <Input
                    id="freeDeliveryThreshold"
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => handleInputChange("freeDeliveryThreshold", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Enable browser push notifications</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleInputChange("enableNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-600">Send SMS updates to customers</p>
                </div>
                <Switch
                  checked={settings.enableSMS}
                  onCheckedChange={(checked) => handleInputChange("enableSMS", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Send email updates to customers</p>
                </div>
                <Switch
                  checked={settings.enableEmail}
                  onCheckedChange={(checked) => handleInputChange("enableEmail", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>WhatsApp Notifications</Label>
                  <p className="text-sm text-gray-600">Send WhatsApp updates to customers</p>
                </div>
                <Switch
                  checked={settings.enableWhatsApp}
                  onCheckedChange={(checked) => handleInputChange("enableWhatsApp", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Security Configuration</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Security settings are managed through environment variables and cannot be changed from the admin panel.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Current Security Features</Label>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• JWT-based authentication</li>
                    <li>• Role-based access control</li>
                    <li>• API rate limiting</li>
                    <li>• Input validation and sanitization</li>
                    <li>• HTTPS enforcement in production</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 