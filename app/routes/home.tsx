import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { MapPin, Home as HomeIcon, Maximize, ArrowRight } from "lucide-react";
import { api } from "~/lib/hono-client";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { MaxWidthWrapper } from "~/components/max-width-wrapper";
import { PropertyTypeNamesMapping } from "~/lib/schemas/mappings/property-type";
import { type PropertyPurpose } from "~/lib/schemas/entities/property";
import { type PropertyTypeName } from "~/lib/schemas/entities/property-type";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const response = await api.properties.$get({
        query: {
          pageSize: "3",
        },
      });
      const json = await response.json();
      if (!json.ok) {
        throw new Error(json.error);
      }
      return json.data;
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/40 py-20 lg:py-32">
        <MaxWidthWrapper>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
              Find Your Dream Home
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
              Discover the perfect property that fits your lifestyle. Browse our
              curated list of homes, apartments, and villas.
            </p>
            <div className="mt-10 flex gap-4">
              <Button size="lg" asChild>
                <Link to="/properties">Browse Properties</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/add-property">List Your Property</Link>
              </Button>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <MaxWidthWrapper>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Properties
              </h2>
              <p className="text-muted-foreground mt-2">
                Check out our latest listings.
              </p>
            </div>
            <Button variant="ghost" className="hidden gap-2 sm:flex" asChild>
              <Link to="/properties">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-destructive">Failed to load properties.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data?.data.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property as unknown as PropertyCardProps}
                />
              ))}
            </div>
          )}
          <div className="mt-10 flex justify-center sm:hidden">
            <Button variant="outline" className="w-full gap-2" asChild>
              <Link to="/properties">
                View all properties <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </MaxWidthWrapper>
      </section>
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
              <HomeIcon className="h-12 w-12 opacity-20" />
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
              <HomeIcon className="h-4 w-4" />
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
