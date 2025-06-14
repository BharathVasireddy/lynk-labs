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
  viewDetailsButton?: React.ReactNode;
}

export function BookTestButton({ test, size = "default", className = "", viewDetailsButton }: BookTestButtonProps) {
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

  // Container with success message and buttons
  return (
    <div className={className}>
      {/* Success message */}
      {showingAdded && (
        <div className="mb-2 p-2 bg-primary/10 text-primary text-center text-sm font-medium rounded-md">
          Test added for {lastAddedQuantity} {lastAddedQuantity === 1 ? 'patient' : 'patients'}
        </div>
      )}
      
      {/* Buttons container */}
      <div className="flex gap-2">
        {/* Show quantity selector if item is in cart */}
        {currentQuantity > 0 ? (
          <div className="flex-1 flex items-center justify-between p-3 border rounded-lg bg-primary/5">
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
        ) : (
          /* Show initial "Book Now" button */
          <Button 
            className="flex-1 medical-button-primary font-medium"
            size={size}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        )}
        
        {/* View Details Button */}
        {viewDetailsButton}
      </div>
    </div>
  );
} 