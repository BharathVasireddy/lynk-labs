import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InlineSpinner } from "@/components/ui/loading-spinner";
import { ShoppingCart, Shield, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCheckoutFooterProps {
  totalAmount: number;
  itemCount: number;
  onPlaceOrder: () => void;
  isLoading?: boolean;
  isValid?: boolean;
  className?: string;
}

export function MobileCheckoutFooter({
  totalAmount,
  itemCount,
  onPlaceOrder,
  isLoading = false,
  isValid = true,
  className
}: MobileCheckoutFooterProps) {
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden", className)}>
      <Card className="rounded-none border-0 shadow-none">
        <div className="p-4 space-y-3">
          {/* Order summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'test' : 'tests'}
              </span>
            </div>
            <div className="text-right">
              <div className="font-semibold">₹{totalAmount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Inclusive of all taxes</div>
            </div>
          </div>

          {/* Security indicator */}
          <div className="flex items-center justify-center gap-2 py-1">
            <Shield className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Secure Payment</span>
            <Separator orientation="vertical" className="h-3" />
            <Clock className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-blue-600">Reports in 24-48hrs</span>
          </div>

          {/* Place order button */}
          <Button
            onClick={onPlaceOrder}
            disabled={!isValid || isLoading}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <InlineSpinner size="sm" variant="white" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Place Order</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>

          {/* Additional trust signals */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Free Sample Collection</span>
            <Separator orientation="vertical" className="h-3" />
            <span>NABL Certified</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function MobileCheckoutSpacer() {
  return <div className="h-32 md:hidden" />;
} 