"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              {totalItems > 0 && (
                <Badge variant="secondary">{totalItems}</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Add some tests to get started
                </p>
                <Button asChild onClick={closeCart}>
                  <Link href="/tests">Browse Tests</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm leading-tight">
                        <Link
                          href={`/tests/${item.slug}`}
                          className="hover:text-primary transition-colors"
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.category.name}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            ₹{item.discountPrice || item.price}
                          </span>
                          {item.discountPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{item.price}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center text-sm">
                            {item.quantity} {item.quantity === 1 ? 'patient' : 'patients'}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'patient' : 'patients'})</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Home Collection</span>
                  <span>FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tests" onClick={closeCart}>
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 