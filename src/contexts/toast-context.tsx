"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartToast, CartToastContainer } from "@/components/ui/cart-toast";

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<CartToast[]>([]);

  const showToast = (message: string, duration = 3000) => {
    const id = Date.now().toString();
    const newToast: CartToast = { id, message, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CartToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
} 