"use client";

import { useState, useEffect, useRef } from 'react';

interface OrderStatus {
  orderId: string;
  status: string;
  updatedAt: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

interface UseRealtimeOrdersReturn {
  orderStatuses: Map<string, OrderStatus>;
  isConnected: boolean;
  subscribe: (orderId: string) => void;
  unsubscribe: (orderId: string) => void;
  getOrderStatus: (orderId: string) => OrderStatus | undefined;
}

export function useRealtimeOrders(): UseRealtimeOrdersReturn {
  const [orderStatuses, setOrderStatuses] = useState<Map<string, OrderStatus>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const subscriptions = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrderStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`);
      if (response.ok) {
        const status: OrderStatus = await response.json();
        setOrderStatuses(prev => new Map(prev).set(orderId, status));
      }
    } catch (error) {
      console.error(`Failed to fetch status for order ${orderId}:`, error);
    }
  };

  const subscribe = (orderId: string) => {
    subscriptions.current.add(orderId);
    fetchOrderStatus(orderId); // Immediate fetch
  };

  const unsubscribe = (orderId: string) => {
    subscriptions.current.delete(orderId);
    setOrderStatuses(prev => {
      const newMap = new Map(prev);
      newMap.delete(orderId);
      return newMap;
    });
  };

  const getOrderStatus = (orderId: string): OrderStatus | undefined => {
    return orderStatuses.get(orderId);
  };

  // Polling mechanism for real-time updates
  useEffect(() => {
    const pollForUpdates = async () => {
      if (subscriptions.current.size === 0) {
        setIsConnected(false);
        return;
      }

      setIsConnected(true);
      
      // Fetch status for all subscribed orders
      const promises = Array.from(subscriptions.current).map(orderId => 
        fetchOrderStatus(orderId)
      );
      
      await Promise.allSettled(promises);
    };

    // Start polling every 10 seconds
    intervalRef.current = setInterval(pollForUpdates, 10000);
    
    // Initial poll
    pollForUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    orderStatuses,
    isConnected,
    subscribe,
    unsubscribe,
    getOrderStatus,
  };
}