import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  type Step1Schema,
  Step3Schema,
  usePostProperty,
  type StepComponentProps,
} from "./main";
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
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Governorates } from "~/lib/schemas/entities/property";
import { Input } from "../ui/input";
import {
  AmenitiesMapping,
  AmenitiesPerPropertyType,
} from "~/lib/schemas/mappings/property";
import { Badge } from "../ui/badge";

export function Step3({ icon, label, description }: StepComponentProps) {
  const { previousStep, nextStep, submittedData, setSubmittedData } =
    usePostProperty();

  const defaultValues = (submittedData.get(3) as z.infer<
    typeof Step3Schema
  >) ?? {
    city: "",
    amenities: [],
  };

  const propertyType = (submittedData.get(1) as z.infer<typeof Step1Schema>)
    ?.propertyType.name;

  const form = useForm<z.infer<typeof Step3Schema>>({
    resolver: zodResolver(Step3Schema),
    defaultValues,
  });

  function handleSubmit(data: z.infer<typeof Step3Schema>) {
    setSubmittedData(3, data);
    nextStep();
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
        <form id="step-3-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            <FieldGroup>
              <Controller
                name="governorate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={`${field.name}-governorate`}>
                        Governorate
                      </FieldLabel>
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={`${field.name}-subtype`}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select Governorate" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {Governorates.map((governorate) => (
                          <SelectItem key={governorate} value={governorate}>
                            {governorate.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${field.name}-city`}>City</FieldLabel>
                    <Input
                      {...field}
                      id={`${field.name}-city`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter City"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="area"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${field.name}-area`}>
                      Approximate Area (in square meters)
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      id={`${field.name}-area`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter approximate area in square meters"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="amenities"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Amenities</FieldLegend>
                    <FieldGroup data-slot="checkbox-group">
                      <Field
                        orientation="horizontal"
                        className="flex-wrap gap-2"
                      >
                        {AmenitiesPerPropertyType[propertyType].map(
                          (amenity) => (
                            <Badge
                              key={amenity}
                              className="cursor-pointer border px-3 py-1.5 transition-none"
                              variant={
                                field.value.includes(amenity)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                field.onChange(
                                  field.value.includes(amenity)
                                    ? field.value.filter((a) => a !== amenity)
                                    : [...field.value, amenity],
                                )
                              }
                            >
                              {AmenitiesMapping[amenity]}
                            </Badge>
                          ),
                        )}
                      </Field>
                    </FieldGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />
            </FieldGroup>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={previousStep}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <Button
          type="submit"
          form="step-3-form"
          size="icon"
          className="rounded-full"
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
