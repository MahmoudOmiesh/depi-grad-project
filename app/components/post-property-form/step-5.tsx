import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Step5Schema, usePostProperty, type StepComponentProps } from "./main";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type z from "zod";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ImageIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { api } from "~/lib/hono-client";
import { toast } from "sonner";
import {
  PropertyInsertSchema,
  type PropertyInsert,
} from "~/lib/schemas/queries/properties";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Spinner } from "../ui/spinner";

export function Step5({ icon, label, description }: StepComponentProps) {
  const navigate = useNavigate();
  const { previousStep, submittedData, setSubmittedData } = usePostProperty();

  const defaultValues = (submittedData.get(5) as z.infer<
    typeof Step5Schema
  >) ?? {
    mediaData: [],
  };

  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof Step5Schema>>({
    resolver: zodResolver(Step5Schema),
    defaultValues,
  });

  const mediaData = form.watch("mediaData");

  const createPropertyMutation = useMutation({
    mutationFn: async (data: PropertyInsert) => {
      const response = await api.me.properties.$post({
        json: data,
      });

      const propertyResponse = await response.json();

      if ("error" in propertyResponse) {
        throw new Error(propertyResponse.error);
      }
      return propertyResponse.id;
    },

    onSuccess: () => {
      void navigate("/");
    },

    meta: {
      onErrorMessage: "Failed to create property",
      onSuccessMessage: "Property created successfully!",
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        await uploadImage(file);
      }
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.log("FAILED TO UPLOAD IMAGES", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  }

  async function uploadImage(file: File) {
    // Generate unique file ID
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Step 1: Get presigned URL
    const presignedResponse = await api.media["presigned-url"].$post({
      json: {
        fileId,
        name: file.name,
        mimeType: file.type,
        size: file.size,
      },
    });

    if (!presignedResponse.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const presignedData = await presignedResponse.json();

    // Step 2: Upload to S3 using presigned URL
    const uploadResponse = await fetch(presignedData.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image to S3");
    }

    // Step 3: Create media entry in database
    const mediaResponse = await api.media.$post({
      json: {
        name: presignedData.name,
        url: presignedData.accessUrl,
        mimeType: presignedData.mimeType,
        order: mediaData.length,
      },
    });

    if (!mediaResponse.ok) {
      throw new Error("Failed to create media entry");
    }

    const mediaResponseData = await mediaResponse.json();

    // Step 4: Add to form state
    const currentMediaData = form.getValues("mediaData");
    form.setValue("mediaData", [
      ...currentMediaData,
      {
        id: mediaResponseData.mediaId,
        url: mediaResponseData.url,
        name: mediaResponseData.name,
      },
    ]);
  }

  function removeMedia(mediaId: number) {
    const currentMediaData = form.getValues("mediaData");
    form.setValue(
      "mediaData",
      currentMediaData.filter((media) => media.id !== mediaId),
    );
  }

  function createProperty() {
    const aggregatedData = Array.from(submittedData.entries()).reduce(
      (acc, [_, value]) => {
        return {
          ...acc,
          ...value,
        };
      },
      {} as Record<number, unknown>,
    );

    const result = PropertyInsertSchema.safeParse(aggregatedData);

    if (!result.success) {
      toast.error("Something went wrong");
      console.log("INVALID DATA", aggregatedData, result.error);
      return;
    }

    const propertyData = result.data;

    createPropertyMutation.mutate(propertyData);
  }

  function handleSubmit(data: z.infer<typeof Step5Schema>) {
    setSubmittedData(5, data);
    createProperty();
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-4">
        <span className="bg-primary/90 grid place-items-center rounded-full p-2 text-black">
          {icon}
        </span>
        <div>
          <CardTitle>{label}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form
          id="step-5-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {/* File Input */}
          <div>
            <label
              htmlFor="image-upload"
              className="bg-muted border-muted-foreground hover:bg-muted/50 flex h-42 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isUploading ? "Uploading..." : "Click to upload images"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, WEBP (MAX. 10MB)
                </p>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </div>

          {/* Image Previews */}
          {mediaData.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {mediaData.map((media) => (
                <div
                  key={media.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border"
                >
                  <img
                    src={media.url}
                    alt={media.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(media.id)}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {form.formState.errors.mediaData && (
            <p className="text-sm text-red-500">
              {form.formState.errors.mediaData.message}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={previousStep}
          disabled={isUploading}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <Button
          type="submit"
          form="step-5-form"
          className="rounded-full"
          disabled={isUploading || createPropertyMutation.isPending}
        >
          Create Property {createPropertyMutation.isPending && <Spinner />}
        </Button>
      </CardFooter>
    </Card>
  );
}
