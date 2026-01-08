import { useState, useEffect, useRef } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 1 hour)
  useSessionStorage?: boolean; // Use sessionStorage as fallback (default: true)
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_PREFIX = 'api_cache_';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(url: string): string {
  return `${CACHE_PREFIX}${url}`;
}

function isExpired(entry: CacheEntry<any>, ttl: number): boolean {
  return Date.now() - entry.timestamp > ttl;
}

function getCachedData<T>(url: string, ttl: number): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const cacheKey = getCacheKey(url);
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const entry: CacheEntry<T> = JSON.parse(cached);
      if (!isExpired(entry, ttl)) {
        return entry.data;
      }
      // Remove expired entry
      sessionStorage.removeItem(cacheKey);
    }
  } catch (error) {
    // Ignore errors (e.g., quota exceeded)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error reading from cache:', error);
    }
  }

  return null;
}

function setCachedData<T>(url: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheKey = getCacheKey(url);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    // Ignore errors (e.g., quota exceeded)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error writing to cache:', error);
    }
  }
}

export function useApiCache<T>(
  url: string,
  options: CacheOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { ttl = DEFAULT_TTL, useSessionStorage = true } = options;
  const [data, setData] = useState<T | null>(() => {
    return useSessionStorage ? getCachedData<T>(url, ttl) : null;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'max-age=3600',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData: T = await response.json();
      
      setData(jsonData);
      
      if (useSessionStorage) {
        setCachedData(url, jsonData);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err);
        
        // Try to use cached data as fallback
        if (useSessionStorage) {
          const cached = getCachedData<T>(url, ttl * 2); // Use expired cache as last resort
          if (cached) {
            setData(cached);
            setError(null);
          }
        }
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    // Only fetch if we don't have cached data
    if (!data) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url]);

  const refetch = () => {
    if (useSessionStorage && typeof window !== 'undefined') {
      const cacheKey = getCacheKey(url);
      sessionStorage.removeItem(cacheKey);
    }
    fetchData();
  };

  return { data, loading, error, refetch };
}
