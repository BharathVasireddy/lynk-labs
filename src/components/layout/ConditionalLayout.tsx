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
  
  // Check if current route is an admin or agent route
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAgentRoute = pathname?.startsWith('/agent');
  
  // For admin and agent routes, render children without customer header/footer
  if (isAdminRoute || isAgentRoute) {
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