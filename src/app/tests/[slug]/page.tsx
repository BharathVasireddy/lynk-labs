"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, ShoppingCart, Share2, Heart, CheckCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookTestButton } from "@/components/ui/book-test-button";

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

interface RelatedTest {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  category: {
    name: string;
  };
}

export default function TestDetailPage() {
  const [test, setTest] = useState<Test | null>(null);
  const [relatedTests, setRelatedTests] = useState<RelatedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;


  const fetchTestDetails = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch test details
      const response = await fetch(`/api/tests/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/tests');
          return;
        }
        throw new Error('Failed to fetch test details');
      }
      
      const testData = await response.json();
      setTest(testData);

      // Fetch related tests from same category
      if (testData.category.id) {
        const relatedResponse = await fetch(`/api/tests?categoryId=${testData.category.id}&limit=4`);
        const relatedData = await relatedResponse.json();
        setRelatedTests(relatedData.tests.filter((t: RelatedTest) => t.id !== testData.id));
      }
    } catch (error) {
      console.error("Error fetching test details:", error);
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    if (slug) {
      fetchTestDetails();
    }
  }, [slug, fetchTestDetails]);

  const calculateDiscount = (price: number, discountPrice: number | null) => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };



  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const shareTest = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: test?.name,
          text: test?.description,
          url: window.location.href,
        });
      } catch (error) {
        // Share failed, but don't show error to user
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="container-padding py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container-padding py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-semibold mb-2">Test not found</h3>
          <p className="text-muted-foreground mb-4">
            The test you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/tests">Browse All Tests</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-padding py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/tests">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Link>
        </Button>
        
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tests" className="hover:text-foreground">Tests</Link>
          <span className="mx-2">/</span>
          <Link href={`/tests?category=${test.category.id}`} className="hover:text-foreground">
            {test.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{test.name}</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  {test.category.name}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{test.name}</h1>
                <p className="text-lg text-muted-foreground">{test.description}</p>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleWishlist}
                  className={isWishlisted ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={shareTest}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  ₹{test.discountPrice || test.price}
                </span>
                {test.discountPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{test.price}
                    </span>
                    <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                      {calculateDiscount(test.price, test.discountPrice)}% OFF
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {test.reportTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Report in {test.reportTime}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>NABL Accredited</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Digital Report</span>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="preparation">Preparation</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What is this test?</h4>
                    <p className="text-muted-foreground">{test.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Why is this test done?</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>To assess overall health status</li>
                      <li>To detect early signs of disease</li>
                      <li>To monitor existing conditions</li>
                      <li>As part of routine health checkups</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">What does this test measure?</h4>
                    <p className="text-muted-foreground">
                      This test provides detailed insights into your health parameters and helps 
                      healthcare providers make informed decisions about your care.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preparation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Preparation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {test.preparationInstructions ? (
                    <div>
                      <h4 className="font-semibold mb-2">Preparation Instructions</h4>
                      <p className="text-muted-foreground">{test.preparationInstructions}</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold mb-2">No Special Preparation Required</h4>
                      <p className="text-muted-foreground">
                        You can take this test without any special preparation.
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">General Guidelines</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Stay hydrated by drinking water</li>
                      <li>Wear comfortable clothing</li>
                      <li>Bring a valid ID proof</li>
                      <li>Inform about any medications you&apos;re taking</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">How long does the test take?</h4>
                    <p className="text-muted-foreground">
                      The sample collection typically takes 5-10 minutes.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">When will I get my results?</h4>
                    <p className="text-muted-foreground">
                      Results are typically available within {test.reportTime || "24-48 hours"}.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Is home collection available?</h4>
                    <p className="text-muted-foreground">
                      Yes, we offer free home sample collection for your convenience.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">How will I receive my report?</h4>
                    <p className="text-muted-foreground">
                      Reports are delivered via WhatsApp, email, and are available for download from your dashboard.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Book This Test</CardTitle>
              <CardDescription>
                Get accurate results with home sample collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  ₹{test.discountPrice || test.price}
                </div>
                {test.discountPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    ₹{test.price}
                  </div>
                )}
              </div>
              
              <BookTestButton test={test} size="lg" />
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Free home collection • NABL accredited lab
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sample Type:</span>
                  <span>Blood</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Report Time:</span>
                  <span>{test.reportTime || "24-48 hours"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Home Collection:</span>
                  <span className="text-green-600">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Tests */}
          {relatedTests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Tests</CardTitle>
                <CardDescription>
                  Other tests in {test.category.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedTests.slice(0, 3).map((relatedTest) => (
                  <div key={relatedTest.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <Link 
                        href={`/tests/${relatedTest.slug}`}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {relatedTest.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {relatedTest.category.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        ₹{relatedTest.discountPrice || relatedTest.price}
                      </div>
                      {relatedTest.discountPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          ₹{relatedTest.price}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/tests?category=${test.category.id}`}>
                    View All in {test.category.name}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 