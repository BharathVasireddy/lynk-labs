"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/layout/CartSidebar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // For admin routes, render children without customer header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // For customer routes, render with header and footer
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
} 