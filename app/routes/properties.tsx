import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "~/lib/hono-client";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { MaxWidthWrapper } from "~/components/max-width-wrapper";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Governorates,
  PropertyPurposes,
  type PropertyPurpose,
  type Governorate,
} from "~/lib/schemas/entities/property";
import {
  PropertyTypeNames,
  type PropertyTypeName,
} from "~/lib/schemas/entities/property-type";
import type { PropertiesFilters as PropertiesFiltersType } from "~/lib/schemas/queries/properties";
import { PropertyPurposeNamesMapping } from "~/lib/schemas/mappings/property";
import { PropertyTypeNamesMapping } from "~/lib/schemas/mappings/property-type";
import { Filter, MapPin, Home, Maximize, AlertCircle } from "lucide-react";
import { Link } from "react-router";

export default function Properties() {
  const [filters, setFilters] = useState<PropertiesFiltersType>({});
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["properties", debouncedFilters],
      queryFn: async ({ pageParam }) => {
        const response = await api.properties.$get({
          query: {
            pageSize: "10",
            cursor: pageParam,
            ...(debouncedFilters.title && { title: debouncedFilters.title }),
            ...(debouncedFilters.propertyTypes && {
              propertyTypes: debouncedFilters.propertyTypes,
            }),
            ...(debouncedFilters.purpose && {
              purpose: debouncedFilters.purpose,
            }),
            ...(debouncedFilters.minPrice && {
              minPrice: debouncedFilters.minPrice.toString(),
            }),
            ...(debouncedFilters.maxPrice && {
              maxPrice: debouncedFilters.maxPrice.toString(),
            }),
            ...(debouncedFilters.governorates && {
              governorates: debouncedFilters.governorates,
            }),
            ...(debouncedFilters.city && { city: debouncedFilters.city }),
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

  const updateFilter = <K extends keyof PropertiesFiltersType>(
    key: K,
    value: PropertiesFiltersType[K] | "all",
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Remove undefined/empty values
      if (value === "" || value === undefined || value === "all") {
        delete newFilters[key];
      }
      return newFilters as PropertiesFiltersType;
    });
  };

  return (
    <div className="bg-muted/5 min-h-screen py-8">
      <MaxWidthWrapper>
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Mobile Filters Trigger */}
          <div className="lg:hidden">
            <Dialog
              open={isMobileFiltersOpen}
              onOpenChange={setIsMobileFiltersOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <FiltersContent
                  filters={filters}
                  updateFilter={updateFilter}
                  setFilters={setFilters}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="hidden w-64 shrink-0 space-y-6 lg:block">
            <div className="bg-card sticky top-20 rounded-lg border p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">Filters</h2>
              <FiltersContent
                filters={filters}
                updateFilter={updateFilter}
                setFilters={setFilters}
              />
            </div>
          </div>

          {/* Results Grid */}
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
                      No properties found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters to see more results.
                    </p>
                    <Button variant="outline" onClick={() => setFilters({})}>
                      Clear Filters
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
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

function FiltersContent({
  filters,
  updateFilter,
  setFilters,
}: {
  filters: PropertiesFiltersType;
  updateFilter: (
    key: keyof PropertiesFiltersType,
    value: PropertiesFiltersType[keyof PropertiesFiltersType],
  ) => void;
  setFilters: (filters: PropertiesFiltersType) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Title Search */}
      <div className="space-y-2">
        <Label htmlFor="title">Search</Label>
        <Input
          id="title"
          placeholder="Search by title..."
          value={filters.title ?? ""}
          onChange={(e) => updateFilter("title", e.target.value)}
        />
      </div>

      {/* Purpose */}
      <div className="space-y-2">
        <Label>Purpose</Label>
        <Select
          value={filters.purpose ?? "all"}
          onValueChange={(value) =>
            updateFilter(
              "purpose",
              value === "all" ? undefined : (value as PropertyPurpose),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Purpose</SelectItem>
            {PropertyPurposes.map((purpose) => (
              <SelectItem key={purpose} value={purpose}>
                {PropertyPurposeNamesMapping[purpose]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={
            (Array.isArray(filters.propertyTypes)
              ? filters.propertyTypes[0]
              : filters.propertyTypes) ?? "all"
          }
          onValueChange={(value) =>
            updateFilter(
              "propertyTypes",
              value === "all" ? undefined : ([value] as PropertyTypeName[]),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Type</SelectItem>
            {PropertyTypeNames.map((type) => (
              <SelectItem key={type} value={type}>
                {PropertyTypeNamesMapping[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range (EGP)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              updateFilter(
                "minPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              updateFilter(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Select
          value={
            (Array.isArray(filters.governorates)
              ? filters.governorates[0]
              : filters.governorates) ?? "all"
          }
          onValueChange={(value) =>
            updateFilter(
              "governorates",
              value === "all" ? undefined : ([value] as Governorate[]),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Governorates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Governorates</SelectItem>
            {Governorates.map((gov) => (
              <SelectItem key={gov} value={gov}>
                {gov.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="City..."
          value={filters.city ?? ""}
          onChange={(e) => updateFilter("city", e.target.value)}
        />
      </div>

      {/* Clear Filters */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setFilters({})}
      >
        Clear Filters
      </Button>
    </div>
  );
}

// Define a partial type for the card since the API returns a subset of Property
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
