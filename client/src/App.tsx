import { useState } from "react";

import { httpBatchLink } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { env } from "./lib/utils/env";
import { ExperienceList } from "./features/experiences/components/ExperienceList";
import Navbar from "./features/shared/components/Navbar";
import { ThemeProvider } from "./features/shared/components/ThemeProvider";
import { Toaster } from "./features/shared/components/ui/Toaster";
import { trpc } from "./router";
import { InfiniteScroll } from "./features/shared/components/InfiniteScroll";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: env.VITE_SERVER_BASE_URL,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <Toaster />
          <div className="flex justify-center gap-8 pb-8">
            <Navbar />
            <div className="min-h-screen w-full max-w-2xl">
              <header className="mb-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
                <h1 className="text-center text-xl font-bold">Meetup App</h1>
                <p className="text-center text-sm text-neutral-500">
                  <b>
                    <span className="dark:text-primary-500">BAS</span> Solutions
                  </b>
                </p>
              </header>

              <Index />
            </div>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Index() {
  const experiencesQuery = trpc.experiences.feed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <InfiniteScroll onLoadMore={experiencesQuery.fetchNextPage}>
      <ExperienceList
        experiences={
          experiencesQuery.data?.pages.flatMap((page) => page.experiences) ?? []
        }
        isLoading={
          experiencesQuery.isLoading || experiencesQuery.isFetchingNextPage
        }
      />
    </InfiniteScroll>
  );
}
