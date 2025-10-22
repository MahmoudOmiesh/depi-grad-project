import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { toast, Toaster } from "sonner";
import { Header } from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQueries?: QueryKey | QueryKey[];
      onSuccessMessage?: string;
      onErrorMessage?: string;
    };
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (_data, _variables, _context, mutation) => {
      if (_data && !(_data as { ok: boolean }).ok) {
        throw new Error(
          (_data as { error: { message: string } }).error.message,
        );
      }

      const invalidate = mutation.meta?.invalidateQueries;

      if (invalidate) {
        const isArrayOfQueryKeys = (
          value: QueryKey | QueryKey[],
        ): value is QueryKey[] =>
          Array.isArray(value) && Array.isArray(value[0]);

        if (isArrayOfQueryKeys(invalidate)) {
          await Promise.all(
            invalidate.map((queryKey) =>
              queryClient.invalidateQueries({ queryKey }),
            ),
          );
        } else {
          await queryClient.invalidateQueries({ queryKey: invalidate });
        }
      }

      if (mutation.meta?.onSuccessMessage) {
        toast.success(mutation.meta.onSuccessMessage);
      }
    },
    onError: (_error, _variables, _context, mutation) => {
      if (mutation.meta?.onErrorMessage) {
        toast.error(mutation.meta.onErrorMessage);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function Layout() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Toaster richColors position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
