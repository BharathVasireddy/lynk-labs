import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartFormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete?: string;
  mask?: "phone" | "pincode" | "none";
  suggestions?: string[];
  className?: string;
}

export function SmartFormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  optional = false,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  mask = "none",
  suggestions = [],
  className
}: SmartFormFieldProps) {
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Input masking
  const applyMask = (inputValue: string) => {
    switch (mask) {
      case "phone":
        // Indian phone number format: +91 XXXXX XXXXX
        const phoneDigits = inputValue.replace(/\D/g, "");
        if (phoneDigits.length <= 10) {
          return phoneDigits.replace(/(\d{5})(\d{0,5})/, "$1 $2").trim();
        }
        return phoneDigits.slice(0, 10).replace(/(\d{5})(\d{5})/, "$1 $2");
      
      case "pincode":
        // Indian pincode format: XXXXXX
        return inputValue.replace(/\D/g, "").slice(0, 6);
      
      default:
        return inputValue;
    }
  };

  // Validation
  useEffect(() => {
    if (!value) {
      setIsValid(false);
      return;
    }

    switch (type) {
      case "email":
        setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        break;
      case "tel":
        setIsValid(/^\d{5}\s\d{5}$/.test(value) || /^\d{10}$/.test(value.replace(/\s/g, "")));
        break;
      default:
        setIsValid(value.length > 0);
    }
  }, [value, type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyMask(e.target.value);
    onChange(maskedValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {optional && (
            <Badge variant="outline" className="ml-2 text-xs">
              Optional
            </Badge>
          )}
        </Label>
        {isValid && value && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
      </div>

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setFocused(true);
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
            onBlur?.();
          }}
          autoComplete={autoComplete}
          className={cn(
            "transition-all duration-200",
            focused && "ring-2 ring-primary/20 border-primary",
            error && "border-red-500 focus:ring-red-200",
            isValid && value && "border-green-500"
          )}
        />

        {/* Auto-suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-3 w-3 text-gray-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input format hint */}
        {mask === "phone" && focused && !value && (
          <div className="absolute top-full left-0 mt-1 text-xs text-muted-foreground">
            Format: XXXXX XXXXX
          </div>
        )}
        
        {mask === "pincode" && focused && !value && (
          <div className="absolute top-full left-0 mt-1 text-xs text-muted-foreground">
            6-digit pincode
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      {/* Success message for specific fields */}
      {isValid && value && type === "email" && (
        <div className="text-xs text-green-600">
          ✓ Valid email address
        </div>
      )}
    </div>
  );
} 