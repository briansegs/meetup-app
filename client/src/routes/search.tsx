import { ExperienceFilters } from "@/features/experiences/components/ExperienceFilters";
import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { trpc } from "@/router";
import { experienceFiltersSchema } from "@meetup-app/shared/schema/experience";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: experienceFiltersSchema,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const experiencesQuery = trpc.experiences.search.useInfiniteQuery(search, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!search.q,
  });

  return (
    <main className="space-y-4">
      <ExperienceFilters
        onFilterChange={(filters) => {
          navigate({
            search: filters,
          });
        }}
      />

      <InfiniteScroll
        onLoadMore={!!search.q ? experiencesQuery.fetchNextPage : undefined}
      >
        <ExperienceList
          experiences={
            experiencesQuery.data?.pages.flatMap((page) => page.experiences) ??
            []
          }
          isLoading={
            experiencesQuery.isLoading || experiencesQuery.isFetchingNextPage
          }
          noExperiencesMessage={
            !!search.q ? "No experiences found" : "Search to find experiences"
          }
        />
      </InfiniteScroll>
    </main>
  );
}
