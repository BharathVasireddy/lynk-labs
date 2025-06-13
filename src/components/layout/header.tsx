"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
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
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:shadow-lg scale-hover overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="Lynk Labs"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
            <span className="font-bold text-xl text-foreground group-hover:text-primary liquid-hover whitespace-nowrap">Lynk Labs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary relative group liquid-hover whitespace-nowrap"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-500 ease-out group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search tests, packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="medical-input pl-10 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 h-12 w-full"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <div className="relative">
              <Button variant="ghost" className="h-12 w-12 hover:bg-primary/10 hover:text-primary scale-hover" onClick={openCart}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground border-0 shadow-md scale-hover animate-pulse"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Menu */}
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-12 w-12 hover:bg-primary/10 hover:text-primary scale-hover">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name || `User ${user.phone.slice(-4)}`}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/addresses">My Addresses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center">
                <Button className="medical-button-primary shadow-md h-12" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="lg:hidden h-12 w-12"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            {/* Mobile Search */}
            <div className="mb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search tests, packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="medical-input pl-10 h-12"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Button */}
            {!loading && !user && (
              <div className="mt-4 md:hidden">
                <Button className="w-full medical-button-primary h-12" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile User Menu */}
            {!loading && user && (
              <div className="mt-4 md:hidden space-y-2">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">{user.name || `User ${user.phone.slice(-4)}`}</p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  href="/addresses"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Addresses
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium transition-colors text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-2 inline" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
} 