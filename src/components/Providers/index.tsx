"use client";

import { Global } from "@/lib/client/globalContext";
import { getQueryClient } from "@/lib/shared/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, type ReactNode } from "react";

type Props = {
  userId: string;
  children: ReactNode;
};

export function Providers({ children, userId }: Props) {
  const queryClient = getQueryClient();

  useEffect(() => {
    if (document.cookie.includes("userId=")) {
      return;
    }

    document.cookie = `userId=${userId}; path=/; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 365
    )}`;
  }, [userId]);

  return (
    <Global.Provider value={{ userId }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Global.Provider>
  );
}
