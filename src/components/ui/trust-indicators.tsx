import { Shield, Lock, Award, Users, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrustIndicatorsProps {
  variant?: "compact" | "detailed";
  className?: string;
}

export function TrustIndicators({ variant = "compact", className }: TrustIndicatorsProps) {
  const trustSignals = [
    {
      icon: Shield,
      title: "256-bit SSL Encryption",
      description: "Your data is protected with bank-level security",
      color: "text-green-600"
    },
    {
      icon: Lock,
      title: "PCI DSS Compliant",
      description: "Certified secure payment processing",
      color: "text-blue-600"
    },
    {
      icon: Award,
      title: "NABL Accredited",
      description: "Government certified lab standards",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "50,000+ Happy Customers",
      description: "Trusted by families across India",
      color: "text-orange-600"
    }
  ];

  const guarantees = [
    "100% Secure Payments",
    "Free Sample Collection",
    "NABL Certified Reports",
    "24/7 Customer Support"
  ];

  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Shield className="h-3 w-3" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Lock className="h-3 w-3" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Award className="h-3 w-3" />
            <span>NABL Certified</span>
          </div>
        </div>

        {/* Quick guarantees */}
        <div className="grid grid-cols-2 gap-2">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>{guarantee}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("medical-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Your Security is Our Priority</h3>
        </div>

        <div className="grid gap-4 mb-6">
          {trustSignals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg bg-gray-50", signal.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{signal.title}</h4>
                  <p className="text-xs text-muted-foreground">{signal.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Our Guarantees</h4>
          <div className="grid gap-1">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{guarantee}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Processing time:</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Reports in 24-48 hours</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentSecurityBadge() {
  return (
    <div className="flex items-center justify-center gap-4 py-2 px-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-1">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">Secure Payment</span>
      </div>
      <div className="text-xs text-green-600">
        Protected by 256-bit SSL encryption
      </div>
    </div>
  );
} 