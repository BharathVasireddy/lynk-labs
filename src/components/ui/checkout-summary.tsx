import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Users, Clock, MapPin } from "lucide-react";

interface CheckoutSummaryProps {
  items: Array<{
    id: string;
    name: string;
    category: { name: string };
    price: number;
    discountPrice?: number;
    quantity: number;
  }>;
  totalAmount: number;
  discount: number;
  selectedAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    type: string;
  };
  selectedDate?: string;
  selectedTime?: string;
}

export function CheckoutSummary({
  items,
  totalAmount,
  discount,
  selectedAddress,
  selectedDate,
  selectedTime,
}: CheckoutSummaryProps) {
  const finalAmount = totalAmount - discount;
  const totalPatients = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="medical-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tests Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              {items.length} {items.length === 1 ? 'Test' : 'Tests'} • {totalPatients} {totalPatients === 1 ? 'Patient' : 'Patients'}
            </span>
          </div>
          
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
              <div className="flex-1 pr-4">
                <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {item.category.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    × {item.quantity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">₹{(item.discountPrice || item.price) * item.quantity}</p>
                {item.discountPrice && (
                  <p className="text-xs text-muted-foreground line-through">₹{item.price * item.quantity}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Collection Details */}
        {(selectedAddress || selectedDate) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Collection Details</h4>
              
              {selectedAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{selectedAddress.line1}</p>
                    {selectedAddress.line2 && (
                      <p className="text-muted-foreground">{selectedAddress.line2}</p>
                    )}
                    <p className="text-muted-foreground">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedDate && selectedTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(selectedDate)} • {selectedTime}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Price Breakdown */}
        <Separator />
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Home Collection</span>
            <span>FREE</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{finalAmount}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Inclusive of all taxes
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 