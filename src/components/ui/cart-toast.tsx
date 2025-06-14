"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "./button";

export interface CartToast {
  id: string;
  message: string;
  duration?: number;
}

interface CartToastProps {
  toast: CartToast;
  onRemove: (id: string) => void;
}

export function CartToastItem({ toast, onRemove }: CartToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto remove after duration
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 bg-white border border-green-200 rounded-lg shadow-lg
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
      <p className="text-sm font-medium text-gray-900 flex-1">{toast.message}</p>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-gray-400 hover:text-gray-600"
        onClick={handleClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface CartToastContainerProps {
  toasts: CartToast[];
  onRemove: (id: string) => void;
}

export function CartToastContainer({ toasts, onRemove }: CartToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <CartToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
} 