"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  TestTube,
  Clock,
  CheckCircle 
} from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  testId?: string;
  packageId?: string;
  quantity: number;
  test?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    reportTime: string | null;
    category: {
      name: string;
    };
  };
  package?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    testCount: number;
    reportTime: string | null;
  };
}

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { items, updateQuantity: updateCartQuantity, removeItem: removeCartItem, getTotalPrice, getTotalItems } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Initialize loading state
  useEffect(() => {
    setLoading(false);
  }, []);

  // Update item quantity using Zustand
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    updateCartQuantity(itemId, newQuantity);
    toast.success("Cart updated");
    setUpdating(null);
  };

  // Remove item from cart using Zustand
  const handleRemoveItem = (itemId: string) => {
    setUpdating(itemId);
    removeCartItem(itemId);
    toast.success("Item removed from cart");
    setUpdating(null);
  };

  // Calculate totals using Zustand
  const calculateTotals = () => {
    let subtotal = getTotalPrice();
    let savings = 0;

    items.forEach(item => {
      const price = item.discountPrice || item.price;
      if (item.discountPrice) {
        savings += (item.price - item.discountPrice) * item.quantity;
      }
    });

    return { subtotal, savings, total: subtotal };
  };

  // Remove the API fetch useEffect since we're using Zustand

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Please Login</h1>
          <p className="text-muted-foreground mb-6">
            You need to login to view your cart
          </p>
          <Button asChild>
            <Link href="/auth/login">Login Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { subtotal, savings, total } = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            Review your selected tests and packages
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-8 w-24 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some tests or packages to get started
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/tests">Browse Tests</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/packages">View Packages</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = item.discountPrice || item.price;
                const originalPrice = item.price;

                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Product Icon */}
                        <div className="flex-shrink-0 h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TestTube className="h-8 w-8 text-primary" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">
                            {item.name}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="secondary">
                              {item.category.name}
                            </Badge>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-xl font-bold text-primary">
                              ₹{price}
                            </span>
                            {item.discountPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{originalPrice}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">Quantity:</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updating === item.id}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={updating === item.id}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updating === item.id}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            ₹{(price * item.quantity).toLocaleString()}
                          </div>
                          {item.discountPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span>-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => router.push("/checkout")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link href="/tests">Continue Shopping</Link>
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Free home sample collection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Accurate & reliable results</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Reports delivered digitally</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}