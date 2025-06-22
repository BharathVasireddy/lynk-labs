"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Clock, Zap, TrendingUp, X } from "lucide-react";

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  totalRequests: number;
}

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    // Show performance monitor in development or when explicitly enabled
    const showMonitor = 
      process.env.NODE_ENV === 'development' || 
      localStorage.getItem('show-performance-monitor') === 'true';
    
    setIsVisible(showMonitor);

    if (showMonitor) {
      // Monitor page load time
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        setMetrics(prev => ({
          ...prev,
          pageLoadTime: navTiming.loadEventEnd - navTiming.navigationStart,
        }));
      }

      // Monitor API calls
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('/api/')) {
            setMetrics(prev => ({
              ...prev,
              apiResponseTime: entry.duration,
              totalRequests: prev.totalRequests + 1,
            }));
          }
        }
      });

      observer.observe({ entryTypes: ['measure', 'resource'] });

      return () => observer.disconnect();
    }
  }, []);

  const getPerformanceStatus = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'bg-green-100 text-green-800' };
    if (value <= thresholds.poor) return { status: 'fair', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'poor', color: 'bg-red-100 text-red-800' };
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Performance</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Page Load Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3" />
              <span>Page Load</span>
            </div>
            <Badge 
              className={getPerformanceStatus(metrics.pageLoadTime, { good: 1500, poor: 3000 }).color}
            >
              {Math.round(metrics.pageLoadTime)}ms
            </Badge>
          </div>

          {/* API Response Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Zap className="h-3 w-3" />
              <span>API Response</span>
            </div>
            <Badge 
              className={getPerformanceStatus(metrics.apiResponseTime, { good: 500, poor: 2000 }).color}
            >
              {Math.round(metrics.apiResponseTime)}ms
            </Badge>
          </div>

          {/* Cache Hit Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>Cache Hits</span>
            </div>
            <Badge 
              className={getPerformanceStatus(100 - metrics.cacheHitRate, { good: 20, poor: 50 }).color}
            >
              {Math.round(metrics.cacheHitRate)}%
            </Badge>
          </div>

          {/* Total Requests */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Activity className="h-3 w-3" />
              <span>Requests</span>
            </div>
            <Badge variant="outline">
              {metrics.totalRequests}
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="w-full text-xs"
            >
              Force Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Enable performance monitor
export function enablePerformanceMonitor() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('show-performance-monitor', 'true');
    window.location.reload();
  }
}

// Disable performance monitor
export function disablePerformanceMonitor() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('show-performance-monitor', 'false');
    window.location.reload();
  }
}