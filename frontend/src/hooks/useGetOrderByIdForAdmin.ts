import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, QueryClient } from "@tanstack/react-query";

import type { OrderResponse } from "@/types/api/orders";
import { getOrderByIdForAdmin } from "@/api/orderApi";

export const adminOrderQueryKey = (orderId: number | string) =>
  ["adminOrder", orderId] as const;

export const useGetOrderByIdForAdmin = (
  orderId?: number,
  options?: UseQueryOptions<
    OrderResponse,
    Error,
    OrderResponse,
    readonly (string | number)[]
  >,
) =>
  useQuery<OrderResponse, Error, OrderResponse, readonly (string | number)[]>({
    queryKey: adminOrderQueryKey(orderId ?? "undefined"),
    queryFn: async () => {
      if (!orderId) throw new Error("orderId is required");
      return getOrderByIdForAdmin(orderId);
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });

export const prefetchAdminOrder = async (
  queryClient: QueryClient,
  orderId: number,
) =>
  queryClient.prefetchQuery({
    queryKey: adminOrderQueryKey(orderId),
    queryFn: () => getOrderByIdForAdmin(orderId),
  });
