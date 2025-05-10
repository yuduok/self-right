import { cache } from 'react';
import 'server-only';

/**
 * Cached fetch function for server components
 * Uses React's cache function to memoize fetch requests
 */
export const fetchWithCache = cache(async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      next: {
        // Default revalidation time of 60 seconds
        revalidate: options.revalidate || 60,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch with cache error:', error);
    throw error;
  }
});

/**
 * Preload function to start data fetching early
 * Can be exported from a component to allow parent components to trigger data loading
 */
export const preload = (url, options) => {
  void fetchWithCache(url, options);
};

/**
 * Fetch function for client components
 * Uses SWR-like pattern with custom cache implementation
 */
export async function clientFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Client fetch error:', error);
    throw error;
  }
}
