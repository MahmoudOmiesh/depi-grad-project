import { redirect } from "react-router";
import { auth } from "~/lib/auth";
import { tryCatch } from "~/lib/utils";
import type { Route } from "./+types/my-properties";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "~/lib/hono-client";
import { MaxWidthWrapper } from "~/components/max-width-wrapper";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { MapPin, Home, Maximize, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router";
import { PropertyTypeNamesMapping } from "~/lib/schemas/mappings/property-type";
import type { PropertyPurpose } from "~/lib/schemas/entities/property";
import type { PropertyTypeName } from "~/lib/schemas/entities/property-type";

export async function loader({ request }: Route.LoaderArgs) {
  const { data, error } = await tryCatch(
    auth.api.getSession({
      headers: request.headers,
    }),
  );

  if (error || !data) {
    return redirect("/register");
  }

  return {
    user: data.user,
  };
}

export default function MyProperties() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["my-properties"],
      queryFn: async ({ pageParam }) => {
        const response = await api.me.properties.$get({
          query: {
            pageSize: "10",
            cursor: pageParam,
          },
        });

        const json = await response.json();

        if (!json.ok) {
          throw new Error(json.error);
        }

        return json.data;
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  return (
    <div className="bg-muted/5 min-h-screen py-8">
      <MaxWidthWrapper>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
          <Button asChild>
            <Link to="/add-property">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>

        <div className="flex-1">
          {status === "pending" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : status === "error" ? (
            <div className="bg-card flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
              <AlertCircle className="text-destructive h-10 w-10" />
              <h3 className="text-lg font-semibold">
                Error loading properties
              </h3>
              <p className="text-muted-foreground">Please try again later.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <>
              {data.pages.every((page) => page.data.length === 0) ? (
                <div className="bg-card flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
                  <div className="bg-muted rounded-full p-4">
                    <Home className="text-muted-foreground h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    You haven&apos;t listed any properties yet
                  </h3>
                  <p className="text-muted-foreground">
                    Start by adding your first property.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/add-property">Add Property</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {data.pages.map((page) =>
                    page.data.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property as unknown as PropertyCardProps}
                      />
                    )),
                  )}
                </div>
              )}

              {hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    size="lg"
                    className="min-w-[150px]"
                  >
                    {isFetchingNextPage ? <>Loading...</> : "Load More"}
                  </Button>
                </div>
              )}

              {!hasNextPage && data.pages[0]?.data.length > 0 && (
                <div className="text-muted-foreground mt-12 flex items-center justify-center gap-2 text-sm">
                  <span>End of results</span>
                </div>
              )}
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

interface PropertyCardProps {
  id: number;
  title: string;
  price: number | string;
  city: string;
  governorate: string;
  area: number | null;
  purpose: PropertyPurpose;
  propertyType: {
    name: PropertyTypeName;
  };
  media: {
    url: string;
  }[];
}

function PropertyCard({ property }: { property: PropertyCardProps }) {
  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="group cursor-pointer overflow-hidden py-0 transition-all hover:shadow-md">
        <div className="bg-muted relative aspect-[4/3] overflow-hidden">
          {property.media && property.media.length > 0 ? (
            <img
              src={property.media[0].url}
              alt={property.title}
              className="h-full w-full object-cover group-hover:opacity-80"
            />
          ) : (
            <div className="bg-secondary text-muted-foreground flex h-full w-full items-center justify-center">
              <Home className="h-12 w-12 opacity-20" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant={property.purpose === "SELL" ? "default" : "secondary"}
              className="shadow-sm"
            >
              {property.purpose === "SELL" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        </div>
        <CardHeader className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <h3 className="group-hover:text-primary line-clamp-1 text-lg leading-tight font-semibold">
                {property.title}
              </h3>
              <div className="text-muted-foreground mt-1 flex items-center text-sm">
                <MapPin className="mr-1 h-3.5 w-3.5" />
                <span className="line-clamp-1">
                  {property.city}, {property.governorate.replaceAll("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-primary text-xl font-bold">
              {new Intl.NumberFormat("en-EG", {
                style: "currency",
                currency: "EGP",
                maximumFractionDigits: 0,
              }).format(Number(property.price))}
            </span>
            {property.purpose === "RENT" && (
              <span className="text-muted-foreground text-sm">/month</span>
            )}
          </div>

          <div className="text-muted-foreground mt-4 flex items-center gap-4 border-t pt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              <span>
                {PropertyTypeNamesMapping[property.propertyType.name]}
              </span>
            </div>
            {property.area && (
              <div className="flex items-center gap-1.5">
                <Maximize className="h-4 w-4" />
                <span>{property.area} m²</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 h-7 w-1/3" />
        <div className="mt-4 flex gap-4 border-t pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );
}
