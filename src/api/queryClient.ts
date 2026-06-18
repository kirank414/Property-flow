import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry failed requests once to prevent locking up thread pools
      refetchOnWindowFocus: false, // Turn off automatic focus refetching for predictable performance
      staleTime: 5 * 60 * 1000, // Cache reads are considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Garbage collect unused caches after 10 minutes (replaces cacheTime in v5)
    },
    mutations: {
      onError: (error: any) => {
        const message = error.response?.data?.message || error.message || 'Operation failed.';
        console.error('❌ Global Mutation Error:', message);
      },
    },
  },
});

export default queryClient;
