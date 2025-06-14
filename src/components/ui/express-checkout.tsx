import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Zap, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpressCheckoutProps {
  totalAmount: number;
  onExpressCheckout: (method: string) => void;
  className?: string;
}

export function ExpressCheckout({ totalAmount, onExpressCheckout, className }: ExpressCheckoutProps) {
  const expressOptions = [
    {
      id: "razorpay-upi",
      name: "UPI",
      icon: Smartphone,
      color: "bg-blue-600 hover:bg-blue-700",
      description: "Pay instantly with UPI",
      time: "< 10 seconds"
    },
    {
      id: "razorpay-wallet",
      name: "Digital Wallet",
      icon: CreditCard,
      color: "bg-purple-600 hover:bg-purple-700", 
      description: "Paytm, PhonePe, Google Pay",
      time: "< 15 seconds"
    },
    {
      id: "razorpay-card",
      name: "Saved Cards",
      icon: CreditCard,
      color: "bg-green-600 hover:bg-green-700",
      description: "Use your saved payment method",
      time: "< 20 seconds"
    }
  ];

  return (
    <Card className={cn("medical-card border-primary/20", className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Express Checkout</h3>
          <Badge variant="secondary" className="ml-auto">
            <Clock className="h-3 w-3 mr-1" />
            Fastest
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Skip the forms and pay instantly with your preferred method
        </p>

        <div className="grid gap-3 mb-4">
          {expressOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                onClick={() => onExpressCheckout(option.id)}
                className={cn(
                  "h-14 justify-start gap-3 text-white",
                  option.color
                )}
                size="lg"
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs opacity-90">{option.description}</div>
                </div>
                <div className="text-xs opacity-75">{option.time}</div>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>256-bit SSL encrypted • PCI DSS compliant</span>
        </div>

        <Separator className="my-4" />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Or continue with regular checkout below
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 