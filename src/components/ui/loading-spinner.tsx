import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "primary" | "white" | "muted";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
};

const dotSizeClasses = {
  sm: "w-1 h-1",
  md: "w-1.5 h-1.5", 
  lg: "w-2 h-2",
  xl: "w-3 h-3"
};

const variantClasses = {
  primary: "bg-primary",
  white: "bg-white",
  muted: "bg-muted-foreground"
};

export function LoadingSpinner({ 
  size = "md", 
  className, 
  text,
  variant = "primary" 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="text-center">
        <div 
          className={cn(
            "flex items-center justify-center space-x-1 mx-auto",
            sizeClasses[size],
            text && "mb-4"
          )}
          role="status"
          aria-label={text || "Loading"}
        >
          <div 
            className={cn(
              "rounded-full animate-pulse",
              dotSizeClasses[size],
              variantClasses[variant]
            )}
            style={{ animationDelay: "0ms", animationDuration: "1000ms" }}
          />
          <div 
            className={cn(
              "rounded-full animate-pulse",
              dotSizeClasses[size],
              variantClasses[variant]
            )}
            style={{ animationDelay: "200ms", animationDuration: "1000ms" }}
          />
          <div 
            className={cn(
              "rounded-full animate-pulse",
              dotSizeClasses[size],
              variantClasses[variant]
            )}
            style={{ animationDelay: "400ms", animationDuration: "1000ms" }}
          />
        </div>
        {text && (
          <p className="text-muted-foreground text-sm">{text}</p>
        )}
      </div>
    </div>
  );
}

// Inline spinner for buttons and small spaces
export function InlineSpinner({ 
  size = "sm", 
  variant = "white",
  className 
}: Omit<LoadingSpinnerProps, "text">) {
  return (
    <div 
      className={cn(
        "flex items-center space-x-0.5",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <div 
        className={cn(
          "rounded-full animate-pulse",
          dotSizeClasses[size],
          variantClasses[variant]
        )}
        style={{ animationDelay: "0ms", animationDuration: "1000ms" }}
      />
      <div 
        className={cn(
          "rounded-full animate-pulse",
          dotSizeClasses[size],
          variantClasses[variant]
        )}
        style={{ animationDelay: "200ms", animationDuration: "1000ms" }}
      />
      <div 
        className={cn(
          "rounded-full animate-pulse",
          dotSizeClasses[size],
          variantClasses[variant]
        )}
        style={{ animationDelay: "400ms", animationDuration: "1000ms" }}
      />
    </div>
  );
} 