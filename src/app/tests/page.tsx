"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InlineSpinner } from "@/components/ui/loading-spinner";
import { Search, Filter, ShoppingCart, Clock, ChevronDown, Plus, Minus } from "lucide-react";
import { BookTestButton } from "@/components/ui/book-test-button";

// Types
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
  _count?: {
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
    hasMore: boolean;
  };
}

function TestsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  
  const [tests, setTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalTests, setTotalTests] = useState(0);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?includeTestCount=true");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  // Fetch tests with load more functionality
  const fetchTests = async (page: number = 1, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && selectedCategory !== "all" && { category: selectedCategory }),
      });

      const response = await fetch(`/api/tests?${params}`);
      if (response.ok) {
        const data: TestsResponse = await response.json();
        
        if (append) {
          setTests(prev => [...prev, ...data.tests]);
        } else {
          setTests(data.tests);
        }
        
        setHasMore(data.pagination.hasMore);
        setTotalTests(data.pagination.total);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Failed to fetch tests:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more tests
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchTests(currentPage + 1, true);
    }
  };

  // Update URL without triggering navigation
  const updateURL = (params: Record<string, string>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateURL({ search: value, category: selectedCategory, page: "1" });
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const newCategory = categoryId === "all" ? "" : categoryId;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    updateURL({ search: searchQuery, category: newCategory, page: "1" });
  };

  const calculateDiscount = (price: number, discountPrice: number | null) => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };



  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchTests(1, false);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container-padding py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Lab Tests</h1>
        <p className="text-lg text-muted-foreground">
          Choose from our comprehensive range of diagnostic tests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search tests by name, description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="medical-input pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="medical-input">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.isArray(categories) && categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                    {category._count && ` (${category._count.tests})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory || searchQuery) && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-2 scale-hover">
                {Array.isArray(categories) && categories.find(c => c.id === selectedCategory)?.name}
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
                Search: &quot;{searchQuery}&quot;
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
          {loading ? "Loading..." : `${totalTests} tests found`}
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
                <div className="h-12 bg-muted rounded mb-2"></div>
                <div className="h-12 bg-muted rounded"></div>
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
                        className="hover:text-primary liquid-hover"
                      >
                        {test.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {test.category.name}
                    </CardDescription>
                  </div>
                  {test.discountPrice && (
                    <div className="flex-shrink-0">
                      <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                        {calculateDiscount(test.price, test.discountPrice)}% OFF
                      </div>
                    </div>
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
                <BookTestButton 
                  test={test} 
                  viewDetailsButton={
                    <Button variant="outline" className="flex-1 medical-button-outline text-xs px-3" asChild>
                      <Link href={`/tests/${test.slug}`}>
                        Details
                      </Link>
                    </Button>
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="medical-button-load-more"
            size="lg"
          >
            {loadingMore ? (
              <>
                <InlineSpinner size="sm" variant="white" className="mr-2" />
                Loading More Tests...
              </>
            ) : (
              <>
                Load More Tests
                <ChevronDown className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* End of Results Message */}
      {!hasMore && !loading && tests.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <span>🎉</span>
            <span>You&apos;ve seen all {totalTests} tests!</span>
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

export default function TestsPage() {
  return (
    <Suspense fallback={
      <div className="container-padding py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Lab Tests</h1>
          <p className="text-lg text-muted-foreground">Loading tests...</p>
        </div>
      </div>
    }>
      <TestsPageContent />
    </Suspense>
  );
} 