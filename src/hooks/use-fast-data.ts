import { useState, useEffect, useCallback } from 'react';

interface FastDataOptions {
  endpoint: string;
  params?: Record<string, string>;
  cacheKey?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

// Client-side cache
const clientCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function useFastData<T>({
  endpoint,
  params = {},
  cacheKey,
  refreshInterval,
  enabled = true
}: FastDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const getCacheKey = useCallback(() => {
    if (cacheKey) return cacheKey;
    const paramString = new URLSearchParams(params).toString();
    return `${endpoint}${paramString ? `?${paramString}` : ''}`;
  }, [endpoint, params, cacheKey]);

  const fetchData = useCallback(async (useCache = true) => {
    if (!enabled) return;

    const key = getCacheKey();
    
    // Check cache first
    if (useCache) {
      const cached = clientCache.get(key);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        setData(cached.data);
        setLoading(false);
        return cached.data;
      }
    }

    try {
      setError(null);
      const url = new URL(endpoint, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      const startTime = performance.now();
      const response = await fetch(url.toString());
      const endTime = performance.now();
      
      // Log slow requests
      if (endTime - startTime > 1000) {
        console.warn(`Slow request: ${endpoint} took ${endTime - startTime}ms`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Cache the result (5 minutes default)
      clientCache.set(key, {
        data: result,
        timestamp: Date.now(),
        ttl: 5 * 60 * 1000
      });

      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(`Fast data fetch error for ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, params, enabled, getCacheKey]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!refreshInterval || !enabled) return;

    const interval = setInterval(() => {
      fetchData(false); // Skip cache on refresh
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, enabled]);

  const refetch = useCallback(() => fetchData(false), [fetchData]);
  const revalidate = useCallback(() => fetchData(true), [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    revalidate,
  };
}

// Specialized hooks for common endpoints
export function useFastTests(params: { search?: string; categoryId?: string; limit?: number } = {}) {
  return useFastData({
    endpoint: '/api/fast/tests',
    params: Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]).filter(([, v]) => v !== 'undefined')
    ),
    cacheKey: `fast-tests-${JSON.stringify(params)}`,
  });
}

export function useFastCategories() {
  return useFastData({
    endpoint: '/api/fast/categories',
    cacheKey: 'fast-categories',
  });
}

// Performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    apiCalls: 0,
    totalTime: 0,
    errors: 0,
    cacheHits: 0,
  });

  const recordApiCall = useCallback((duration: number, error?: boolean) => {
    setMetrics(prev => ({
      apiCalls: prev.apiCalls + 1,
      totalTime: prev.totalTime + duration,
      errors: prev.errors + (error ? 1 : 0),
      cacheHits: prev.cacheHits,
    }));
  }, []);

  const recordCacheHit = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      cacheHits: prev.cacheHits + 1,
    }));
  }, []);

  return {
    metrics: {
      ...metrics,
      averageTime: metrics.apiCalls > 0 ? metrics.totalTime / metrics.apiCalls : 0,
      errorRate: metrics.apiCalls > 0 ? (metrics.errors / metrics.apiCalls) * 100 : 0,
      cacheHitRate: metrics.apiCalls > 0 ? (metrics.cacheHits / metrics.apiCalls) * 100 : 0,
    },
    recordApiCall,
    recordCacheHit,
  };
}