"use client";

import { useState } from "react";
import { Button } from "./button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import Link from "next/link";

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

interface BookTestButtonProps {
  test: Test;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function BookTestButton({ test, size = "default", className = "" }: BookTestButtonProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const [showingAdded, setShowingAdded] = useState(false);
  const [lastAddedQuantity, setLastAddedQuantity] = useState(1);

  const currentQuantity = getItemQuantity(test.id);

  const handleAddToCart = () => {
    setShowingAdded(true);
    setLastAddedQuantity(1);
    
    addItem({
      id: test.id,
      name: test.name,
      slug: test.slug,
      price: test.price,
      discountPrice: test.discountPrice,
      category: {
        name: test.category.name,
      },
    });
    
    // Hide the "added" message after 1.5 seconds
    setTimeout(() => {
      setShowingAdded(false);
    }, 1500);
  };

  const handleQuantityUpdate = (newQuantity: number) => {
    if (newQuantity <= 0) {
      updateQuantity(test.id, 0);
      return;
    }

    setShowingAdded(true);
    setLastAddedQuantity(newQuantity);
    
    updateQuantity(test.id, newQuantity);
    
    // Hide the "added" message after 1.5 seconds
    setTimeout(() => {
      setShowingAdded(false);
    }, 1500);
  };

  // Show "added" message
  if (showingAdded) {
    return (
      <div 
        className={`w-full font-medium relative overflow-hidden rounded-md flex items-center justify-center text-primary-foreground ${className}`}
        style={{ 
          backgroundColor: 'hsl(var(--primary))',
          height: size === 'lg' ? '44px' : size === 'sm' ? '36px' : '40px',
          padding: '0 24px',
          fontSize: size === 'lg' ? '16px' : size === 'sm' ? '14px' : '14px',
          fontWeight: '500'
        }}
      >
        <span className="relative z-10 text-primary-foreground font-medium">
          Test added for {lastAddedQuantity} {lastAddedQuantity === 1 ? 'patient' : 'patients'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[slideGlow_1.5s_ease-in-out] pointer-events-none"></div>
      </div>
    );
  }

  // Show quantity selector if item is in cart
  if (currentQuantity > 0) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
        <span className="text-sm font-medium text-primary">
          {currentQuantity} {currentQuantity === 1 ? 'patient' : 'patients'}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityUpdate(currentQuantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityUpdate(currentQuantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 ml-1"
            asChild
          >
            <Link href="/checkout">
              <ShoppingCart className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show initial "Book Now" button
  return (
    <Button 
      className={`w-full medical-button-primary font-medium ${className}`}
      size={size}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Book Now
    </Button>
  );
} 