import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/auth";

export const currentUserQueryKey = ["auth", "current-user"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
