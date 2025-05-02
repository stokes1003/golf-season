import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0, // No memory retention
      staleTime: 0, // Always considered stale
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // No auto-refetch on tab/window focus
      refetchOnMount: false, // No auto-refetch on remount
      refetchOnReconnect: false, // No auto-refetch when network reconnects
    },
  },
});
