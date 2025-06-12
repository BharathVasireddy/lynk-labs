"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/store/cart";

interface Test {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  preparationInstructions: string | null;
  reportTime: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  _count: {
    tests: number;
  };
}

interface TestsResponse {
  tests: Test[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("name");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchTests();
  }, []);

  // Handle URL params
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    
    setSelectedCategory(category);
    setSearchQuery(search);
    setPagination(prev => ({ ...prev, page }));
  }, [searchParams]);

  // Fetch tests when filters change
  useEffect(() => {
    fetchTests();
  }, [selectedCategory, searchQuery, sortBy, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(sortBy && { sortBy: sortBy }),
      });

      const response = await fetch(`/api/tests?${params}`);
      const data: TestsResponse = await response.json();
      
      setTests(data.tests);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`/tests?${newParams.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    updateURL({ search: value, page: "1" });
  };

  const handleCategoryChange = (categoryId: string) => {
    const actualCategoryId = categoryId === "all" ? "" : categoryId;
    setSelectedCategory(actualCategoryId);
    setPagination(prev => ({ ...prev, page: 1 }));
    updateURL({ category: actualCategoryId, page: "1" });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    updateURL({ page: page.toString() });
  };

  const calculateDiscount = (price: number, discountPrice: number | null) => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const addToCart = (test: Test) => {
    addItem({
      id: test.id,
      name: test.name,
      slug: test.slug,
      price: test.price,
      discountPrice: test.discountPrice,
      category: {
        name: test.category.name,
      },
    });
  };

  return (
    <div className="container-padding py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Lab Tests</h1>
        <p className="text-lg text-muted-foreground">
          Choose from our comprehensive range of diagnostic tests with home sample collection
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 medical-input h-12 w-full"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full lg:w-64 h-12">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="animate-in fade-in-0 zoom-in-95 duration-200">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category._count.tests})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="animate-in fade-in-0 zoom-in-95 duration-200">
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {/* Active Filters */}
        {(selectedCategory || searchQuery) && (
          <div className="flex flex-wrap gap-2 page-transition">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-2 scale-hover">
                {categories.find(c => c.id === selectedCategory)?.name}
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 scale-hover"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-2 scale-hover">
                Search: "{searchQuery}"
                <button
                  onClick={() => handleSearch("")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 scale-hover"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          {loading ? "Loading..." : `${pagination.total} tests found`}
        </p>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="loading-shimmer h-full">
              <CardHeader className="pb-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="px-6 pb-4">
                <div className="h-16 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <div className="h-11 bg-muted rounded mb-2"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tests.map((test, index) => (
            <Card key={test.id} className="medical-card-hover page-transition test-card-equal-height overflow-hidden" style={{animationDelay: `${index * 0.05}s`}}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight mb-2">
                      <Link 
                        href={`/tests/${test.slug}`}
                        className="hover:text-primary liquid-hover line-clamp-2"
                      >
                        {test.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {test.category.name}
                    </CardDescription>
                  </div>
                  {test.discountPrice && (
                    <Badge variant="destructive" className="scale-hover flex-shrink-0 text-xs">
                      {calculateDiscount(test.price, test.discountPrice)}% OFF
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="test-card-body px-6 pb-4">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {test.description}
                </p>

                <div className="space-y-3">
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{test.discountPrice || test.price}
                    </span>
                    {test.discountPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{test.price}
                      </span>
                    )}
                  </div>

                  {/* Test Info */}
                  {test.reportTime && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Report in {test.reportTime}</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="test-card-footer p-6 pt-0 mt-auto">
                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full medical-button-primary h-11 font-medium"
                    onClick={() => addToCart(test)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full medical-button-outline h-10 text-sm" asChild>
                    <Link href={`/tests/${test.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="medical-button-outline"
            >
              Previous
            </Button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === pagination.page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className={`w-10 ${page === pagination.page ? "medical-button-primary" : "medical-button-outline"} scale-hover`}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && tests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-semibold mb-2">No tests found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedCategory("");
            updateURL({ search: "", category: "", page: "1" });
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 