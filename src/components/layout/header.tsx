"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, UserCircle, Menu, X, LogOut, TestTube, Package, FileText, User, MapPin, ChevronRight } from "lucide-react";
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
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on Escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const cartItemsCount = mounted ? getTotalItems() : 0;

  const navigationItems = [
    { name: "Tests", href: "/tests", icon: TestTube },
    { name: "Health Packages", href: "/packages", icon: Package },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/tests?search=${encodeURIComponent(query.trim())}`);
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container-padding">
        {/* Main Header Row */}
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/lynk-logo.png"
                alt="Lynk Labs"
                width={64}
                height={64}
                priority
                className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-sm"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden h-14 w-14 sm:h-16 sm:w-16 items-center justify-center text-3xl sm:text-4xl">
                🧬
              </div>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 lg:h-5 lg:w-5" />
              <Input
                type="search"
                placeholder="Search tests, packages..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="medical-input pl-10 lg:pl-12 pr-4 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 h-9 lg:h-10 w-full text-sm lg:text-base rounded-lg lg:rounded-xl"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 mr-2 lg:mr-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Cart */}
            <div className="relative flex items-center">
              <button
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl group p-0 flex items-center justify-center hover:bg-transparent focus:outline-none focus:ring-0"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
              {cartItemsCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground border-2 border-background shadow-lg animate-pulse"
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
            </div>

            {/* User Menu */}
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl group p-0 flex items-center justify-center hover:bg-transparent focus:outline-none focus:ring-0">
                    <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-200" />
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
                <Button className="medical-button-primary shadow-md h-9 sm:h-10 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl group p-0 flex items-center justify-center hover:bg-transparent focus:outline-none focus:ring-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-200" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Enhanced Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[64px] sm:top-[72px] z-40 bg-background border-t border-border shadow-2xl transition-all duration-300 ease-out animate-fadeInUp">
          <div className="max-h-[calc(100vh-64px)] sm:max-h-[calc(100vh-72px)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="p-4 md:hidden border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search tests, packages..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="medical-input pl-10 pr-4 h-11 w-full rounded-xl bg-background border-border focus:bg-background focus:border-primary"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-4 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-primary/10 ${isMenuOpen ? 'animate-fadeInUp' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      animationDelay: isMenuOpen ? `${index * 100}ms` : '0ms'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Auth Button */}
            {!loading && !user && (
              <div className="p-4 border-t border-border bg-muted/20">
                <Button className="w-full medical-button-primary h-12 rounded-xl font-medium text-base shadow-md" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            )}

            {/* Enhanced Mobile User Menu */}
            {!loading && user && (
              <div className="border-t border-border bg-muted/20">
                <div className="p-4">
                  {/* User Profile Card */}
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl mb-4 border border-primary/20 shadow-sm">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                      <UserCircle className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user.name || `User ${user.phone?.slice(-4) || user.email?.split('@')[0] || 'Account'}`}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.phone || user.email}</p>
                    </div>
                  </div>

                  {/* User Menu Items */}
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-primary/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span>Profile</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-primary/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <span>My Orders</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                      href="/addresses"
                      className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-primary/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span>My Addresses</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>

                    {/* Logout Button */}
                    <div className="pt-2 mt-2 border-t border-border">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                            <LogOut className="h-4 w-4 text-red-600" />
                          </div>
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}