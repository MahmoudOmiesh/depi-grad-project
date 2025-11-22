import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router";
import { api } from "~/lib/hono-client";
import { MaxWidthWrapper } from "~/components/max-width-wrapper";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  MapPin,
  Home,
  Phone,
  User,
  ArrowLeft,
  Trash,
  BedDouble,
  Bath,
  Armchair,
  Building,
  ListChecks,
  Settings,
  Ruler,
  Images,
  Calendar,
  Hash,
} from "lucide-react";
import {
  AmenitiesMapping,
  PaymentMethodNamesMapping,
  PropertyPurposeNamesMapping,
  RentFrequencyNamesMapping,
} from "~/lib/schemas/mappings/property";
import { PropertyTypeNamesMapping } from "~/lib/schemas/mappings/property-type";
import { authClient } from "~/lib/auth-client";
import { Spinner } from "~/components/ui/spinner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

export default function Property() {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Property ID is required");
      }

      const response = await api.properties[":id"].$get({
        param: {
          id,
        },
      });

      const json = await response.json();

      if (!json.ok) {
        throw new Error(json.error);
      }

      return json.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <PropertySkeleton />;
  }

  if (error || !property) {
    return (
      <MaxWidthWrapper className="py-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
          <p className="text-muted-foreground">
            {error?.message ??
              "The property you are looking for does not exist."}
          </p>
          <Button asChild>
            <Link to="/properties">Back to Properties</Link>
          </Button>
        </div>
      </MaxWidthWrapper>
    );
  }

  const apartmentDetails =
    property.propertyType.name === "APARTMENT"
      ? property.propertyType.apartmentDetails
      : null;
  const villaDetails =
    property.propertyType.name === "VILLA"
      ? property.propertyType.villaDetails
      : null;

  const bedrooms = apartmentDetails?.bedrooms ?? villaDetails?.bedrooms;
  const bathrooms = apartmentDetails?.bathrooms ?? villaDetails?.bathrooms;
  const furnished = apartmentDetails?.furnished ?? villaDetails?.furnished;
  const level = apartmentDetails?.level;

  const images = property.media || [];
  const displayImages = images.slice(0, 3);
  const remainingImages = images.length > 3 ? images.length - 3 : 0;

  return (
    <div className="bg-muted/5 min-h-screen pb-12">
      <MaxWidthWrapper className="py-8">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="hover:text-primary gap-2 pl-0 hover:bg-transparent"
            asChild
          >
            <Link to="/properties">
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Link>
          </Button>

          <PropertyDelete propertyId={property.id} userId={property.userId} />
        </div>

        {/* Images Section */}
        <Dialog>
          {images.length > 0 && (
            <div className="mb-8 grid h-[55vh] grid-cols-1 gap-4 overflow-hidden rounded-xl md:grid-cols-12">
              {/* Main Image (Clickable Trigger) */}
              <div
                className="group relative h-full cursor-pointer md:col-span-8"
                onClick={() => setSelectedImageIndex(0)}
              >
                <DialogTrigger asChild>
                  <div className="h-full w-full">
                    <img
                      src={images[0].url}
                      alt="Main Property"
                      className="h-full w-full rounded-xl object-cover shadow-sm transition-opacity group-hover:opacity-90"
                    />
                  </div>
                </DialogTrigger>
              </div>

              {/* Secondary Images */}
              <div className="flex h-full flex-col gap-4 md:col-span-4">
                {displayImages.slice(1).map((img, idx) => (
                  <div
                    key={img.id}
                    className="group relative h-1/2 flex-1 cursor-pointer"
                    onClick={() => setSelectedImageIndex(idx + 1)}
                  >
                    <DialogTrigger asChild>
                      <div className="h-full w-full">
                        <img
                          src={img.url}
                          alt={`Property view ${idx + 1}`}
                          className="absolute inset-0 h-full w-full rounded-xl object-cover shadow-sm transition-opacity group-hover:opacity-90"
                        />
                        {/* Overlay for the last image if there are more */}
                        {idx === 1 && remainingImages > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                            <div className="flex items-center gap-2 text-xl font-bold text-white">
                              <Images className="h-6 w-6" />+{remainingImages}{" "}
                              photos
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogTrigger>
                  </div>
                ))}
                {images.length < 2 && (
                  <div className="bg-muted flex h-full items-center justify-center rounded-xl border border-dashed">
                    <Home className="text-muted-foreground/20 h-12 w-12" />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
            <VisuallyHidden>
              <DialogTitle>Property Images</DialogTitle>
            </VisuallyHidden>
            <div className="relative flex h-[80vh] items-center justify-center">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  startIndex: selectedImageIndex,
                }}
                className="w-full max-w-4xl"
              >
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem
                      key={img.id}
                      className="flex h-[70vh] items-center justify-center"
                    >
                      <img
                        src={img.url}
                        alt={`Slide ${index + 1}`}
                        className="h-full max-h-full w-full max-w-full rounded-md object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 border-white/20 bg-black/50 text-white hover:bg-black/70 md:-left-12" />
                <CarouselNext className="right-2 border-white/20 bg-black/50 text-white hover:bg-black/70 md:-right-12" />
              </Carousel>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Main Info & Features */}
          <div className="space-y-6 lg:col-span-2">
            {/* Main Info Card */}
            <Card className="shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{property.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-sm font-medium">
                      {PropertyTypeNamesMapping[property.propertyType.name]}
                    </span>
                  </div>
                </div>

                <div className="text-primary text-3xl font-bold">
                  {new Intl.NumberFormat("en-EG", {
                    style: "currency",
                    currency: "EGP",
                    maximumFractionDigits: 0,
                  }).format(Number(property.price))}
                  {property.purpose === "RENT" && (
                    <span className="text-muted-foreground ml-1 text-lg font-normal">
                      /{" "}
                      {
                        RentFrequencyNamesMapping[
                          property.rentDetails?.rentFrequency ?? "MONTHLY"
                        ]
                      }
                    </span>
                  )}
                </div>

                <div className="text-foreground flex items-center gap-2 text-lg">
                  <MapPin className="text-primary h-5 w-5 shrink-0" />
                  <span>
                    {property.city}, {property.governorate.replaceAll("_", " ")}
                  </span>
                </div>

                {property.description && (
                  <div className="pt-2">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      <span className="text-foreground font-semibold">
                        Description:{" "}
                      </span>
                      {property.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="text-primary h-5 w-5" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-muted/30 flex items-center gap-3 rounded-lg p-3">
                    <Ruler className="text-primary h-5 w-5" />
                    <span className="font-medium">
                      Area: {property.area} sqm
                    </span>
                  </div>

                  {bedrooms !== undefined && bedrooms !== null && (
                    <div className="bg-muted/30 flex items-center gap-3 rounded-lg p-3">
                      <BedDouble className="text-primary h-5 w-5" />
                      <span className="font-medium">Bedrooms: {bedrooms}</span>
                    </div>
                  )}

                  {bathrooms !== undefined && bathrooms !== null && (
                    <div className="bg-muted/30 flex items-center gap-3 rounded-lg p-3">
                      <Bath className="text-primary h-5 w-5" />
                      <span className="font-medium">
                        Bathrooms: {bathrooms}
                      </span>
                    </div>
                  )}

                  {furnished !== undefined && furnished !== null && (
                    <div className="bg-muted/30 flex items-center gap-3 rounded-lg p-3">
                      <Armchair className="text-primary h-5 w-5" />
                      <span className="font-medium">
                        Furnished: {furnished ? "Yes" : "No"}
                      </span>
                    </div>
                  )}

                  {level !== undefined && level !== null && (
                    <div className="bg-muted/30 flex items-center gap-3 rounded-lg p-3">
                      <Building className="text-primary h-5 w-5" />
                      <span className="font-medium">Level: {level}</span>
                    </div>
                  )}
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-start gap-2">
                      <ListChecks className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <div>
                        <span className="mb-2 block font-semibold">
                          Amenities:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm"
                            >
                              {AmenitiesMapping[amenity]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Sidebar (Owner & Payment) */}
          <div className="space-y-6 lg:col-span-1">
            {/* Owner Details Card */}
            {(property.ownerName || property.ownerPhone) && (
              <Card className="border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {property.ownerName && (
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <User className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                          Name
                        </p>
                        <p className="font-semibold">{property.ownerName}</p>
                      </div>
                    </div>
                  )}
                  {property.ownerPhone && (
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Phone className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                          Phone
                        </p>
                        <a
                          href={`tel:${property.ownerPhone}`}
                          className="hover:text-primary block font-semibold hover:underline"
                        >
                          {property.ownerPhone}
                        </a>
                      </div>
                    </div>
                  )}
                  {property.ownerPhone && (
                    <Button className="mt-2 w-full gap-2" asChild>
                      <a href={`tel:${property.ownerPhone}`}>
                        <Phone className="h-4 w-4" /> Call Owner
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Purpose & Payment Card */}
            {(property.purpose || property.sellDetails?.paymentMethod) && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Property Reference ID */}
                  <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span>Reference</span>
                    </div>
                    <span className="font-semibold">#{property.id}</span>
                  </div>

                  {/* Date Added */}
                  <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Listed</span>
                    </div>
                    <span className="font-semibold">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {property.purpose && (
                    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <span className="text-muted-foreground">Purpose</span>
                      <span className="font-semibold">
                        {PropertyPurposeNamesMapping[property.purpose]}
                      </span>
                    </div>
                  )}

                  {property.sellDetails?.paymentMethod && (
                    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <span className="text-muted-foreground">Payment</span>
                      <span className="font-semibold">
                        {
                          PaymentMethodNamesMapping[
                            property.sellDetails.paymentMethod
                          ]
                        }
                      </span>
                    </div>
                  )}

                  {property.sellDetails &&
                    "downPayment" in property.sellDetails &&
                    property.sellDetails.downPayment && (
                      <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <span className="text-muted-foreground">
                          Down Payment
                        </span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("en-EG", {
                            style: "currency",
                            currency: "EGP",
                            maximumFractionDigits: 0,
                          }).format(Number(property.sellDetails.downPayment))}
                        </span>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

function PropertySkeleton() {
  return (
    <div className="bg-muted/5 min-h-screen pb-12">
      <MaxWidthWrapper className="py-8">
        <Skeleton className="mb-6 h-6 w-32" />
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-12">
          <Skeleton className="h-[55vh] rounded-xl md:col-span-8" />
          <div className="flex h-[55vh] flex-col gap-4 md:col-span-4">
            <Skeleton className="h-1/2 w-full rounded-xl" />
            <Skeleton className="h-1/2 w-full rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6 lg:col-span-1">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

function PropertyDelete({
  propertyId,
  userId,
}: {
  propertyId: number;
  userId: string;
}) {
  const navigate = useNavigate();

  const deletePropertyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.me.properties[":id"].$delete({
        param: {
          id: String(propertyId),
        },
      });

      const json = await response.json();

      return json;
    },
    onSuccess: () => {
      void navigate("/properties");
    },
    meta: {
      onErrorMessage: "Failed to delete property",
    },
  });

  const { data: session, isPending, error } = authClient.useSession();

  if (isPending || error || !session) {
    return null;
  }

  if (session.user.id !== userId) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => deletePropertyMutation.mutate()}
      disabled={deletePropertyMutation.isPending}
    >
      {deletePropertyMutation.isPending ? (
        <Spinner />
      ) : (
        <Trash className="h-4 w-4" />
      )}
      Delete Property
    </Button>
  );
}
