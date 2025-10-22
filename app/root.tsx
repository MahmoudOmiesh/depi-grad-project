import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  type QueryKey,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider defaultTheme="dark">
          <QueryClientProvider client={queryClient}>
            {children}

            <ScrollRestoration />
            <Scripts />
          </QueryClientProvider>
        </ThemeProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
