import { QueryClient } from "@tanstack/react-query";
import { MINUTE } from "../constant";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * MINUTE,
      gcTime: 5 * MINUTE
    },
  },
});
