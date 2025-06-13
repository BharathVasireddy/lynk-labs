"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, UserCircle, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const { getTotalItems, openCart } = useCartStore();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = mounted ? getTotalItems() : 0;

  const navigationItems = [
    { name: "Tests", href: "/tests" },
    { name: "Health Packages", href: "/packages" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container-padding">
        {/* Main Header Row */}
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative h-32 w-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/lynk-logo.png"
                alt="Lynk Labs"
                width={128}
                height={128}
                priority
                className="h-32 w-32 object-contain drop-shadow-sm"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden h-32 w-32 items-center justify-center text-8xl">
                🧬
              </div>
            </div>
          </Link>

          {/* Center Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
              <Input
                type="search"
                placeholder="Search tests, packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="medical-input pl-14 pr-4 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 h-12 w-full text-base rounded-xl"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 mr-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Cart */}
            <div className="relative flex items-center">
              <button 
                className="h-24 w-24 rounded-xl group p-0 flex items-center justify-center hover:bg-transparent focus:outline-none focus:ring-0" 
                onClick={openCart}
              >
                <ShoppingBag className="h-24 w-24 group-hover:scale-110 transition-transform duration-200" />
              </button>
              {cartItemsCount > 0 && (
                <Badge
                  className="absolute top-0 right-0 h-8 w-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground border-2 border-background shadow-lg animate-pulse"
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
            </div>

            {/* User Menu */}
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-24 w-24 rounded-xl group p-0 flex items-center justify-center hover:bg-transparent focus:outline-none focus:ring-0">
                    <UserCircle className="h-24 w-24 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.name || `User ${user.phone?.slice(-4) || user.email?.split('@')[0] || 'Account'}`}</p>
                    <p className="text-xs text-muted-foreground">{user.phone || user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/addresses" className="cursor-pointer">My Addresses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center">
                <Button className="medical-button-primary shadow-md h-12 px-6 rounded-xl font-medium" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden h-24 w-24 rounded-xl group p-0 flex items-center justify-center hover:bg-transparent focus:outline-none focus:ring-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-24 w-24 group-hover:scale-110 transition-transform duration-200" /> : <Menu className="h-24 w-24 group-hover:scale-110 transition-transform duration-200" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background/98 backdrop-blur-sm">
            {/* Mobile Search */}
            <div className="p-4 md:hidden border-b border-border/40">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                <Input
                  type="search"
                  placeholder="Search tests, packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="medical-input pl-14 pr-4 h-12 w-full text-base rounded-xl bg-muted/30"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Button */}
            {!loading && !user && (
              <div className="p-4 border-t border-border/40 sm:hidden">
                <Button className="w-full medical-button-primary h-12 rounded-xl font-medium text-base" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile User Menu */}
            {!loading && user && (
              <div className="border-t border-border/40">
                <div className="p-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl mb-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserCircle className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name || `User ${user.phone?.slice(-4) || user.email?.split('@')[0] || 'Account'}`}</p>
                      <p className="text-xs text-muted-foreground">{user.phone || user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/addresses"
                      className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Addresses
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <LogOut className="h-6 w-6 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
} 