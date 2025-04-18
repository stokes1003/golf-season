import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 30 * 1000, // Consider data stale after 30 seconds
      retry: 1, // Only retry failed queries once
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      refetchOnMount: false, // Prevent refetch on component mount
      refetchOnReconnect: false, // Prevent refetch on reconnect
    },
  },
});
