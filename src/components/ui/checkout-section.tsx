import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CheckoutSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  completed?: boolean;
}

export function CheckoutSection({
  title,
  description,
  icon: Icon,
  children,
  className,
  completed = false,
}: CheckoutSectionProps) {
  return (
    <Card className={cn("medical-card", completed && "border-primary/20 bg-primary/5", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {Icon && (
            <Icon className={cn("h-5 w-5", completed ? "text-primary" : "text-muted-foreground")} />
          )}
          {title}
          {completed && (
            <div className="ml-auto">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
          )}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
} 