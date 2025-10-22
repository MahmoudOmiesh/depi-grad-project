import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StepComponentProps } from "./main";
import {
  ApartmentSubtypes,
  CommercialSubtypes,
  LandSubtypes,
  PropertyTypeNames,
  PropertyTypeSchema,
  VillaSubtypes,
} from "~/lib/schemas/entities/property-type";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import type z from "zod";
import {
  ApartmentSubtypesMapping,
  CommercialSubtypesMapping,
  LandSubtypesMapping,
  PropertyTypeNamesMapping,
  VillaSubtypesMapping,
} from "~/lib/schemas/mappings/property-type";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

export function Step1({ icon, label, description }: StepComponentProps) {
  const form = useForm<z.infer<typeof PropertyTypeSchema>>({
    resolver: zodResolver(PropertyTypeSchema),
    defaultValues: {
      name: "APARTMENT",
      apartmentDetails: {
        furnished: true,
      },
    },
  });

  const selectedPropertyType = form.watch("name");

  function handleSubmit(data: z.infer<typeof PropertyTypeSchema>) {
    console.log(data);
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
        <form id="step-1-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="mb-8">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend>Property Type</FieldLegend>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="grid grid-cols-4 gap-2"
                  >
                    {PropertyTypeNames.map((type) => (
                      <FieldLabel
                        key={type}
                        htmlFor={`${field.name}-${type}`}
                        className="hover:bg-primary/10 cursor-pointer !rounded-full"
                      >
                        <Field
                          data-invalid={fieldState.invalid}
                          className="!p-2"
                        >
                          <FieldContent className="items-center">
                            <FieldTitle>
                              {PropertyTypeNamesMapping[type]}
                            </FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            value={type}
                            id={`${field.name}-${type}`}
                            aria-invalid={fieldState.invalid}
                            className="sr-only"
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
          </FieldGroup>

          {selectedPropertyType === "APARTMENT" && (
            <div className="space-y-4">
              <FieldGroup>
                <Controller
                  name="apartmentDetails.subtype"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={`${field.name}-subtype`}>
                          Apartment Subtype
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
                          <SelectValue placeholder="Select Apartment Subtype" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {ApartmentSubtypes.map((subtype) => (
                            <SelectItem key={subtype} value={subtype}>
                              {ApartmentSubtypesMapping[subtype]}
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
                  name="apartmentDetails.bedrooms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-bedrooms`}>
                        Bedrooms
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        id={`${field.name}-bedrooms`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter number of bedrooms"
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
                  name="apartmentDetails.bathrooms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-bathrooms`}>
                        Bathrooms
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        id={`${field.name}-bathrooms`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter number of bathrooms"
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
                  name="apartmentDetails.level"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-level`}>
                        Level (Optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        id={`${field.name}-level`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter level"
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
                  name="apartmentDetails.furnished"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Badge
                        className={cn(
                          "cursor-pointer px-3 py-1.5 text-sm transition-none",
                          !field.value && "hover:bg-primary/10",
                        )}
                        onClick={() => field.onChange(true)}
                        variant={field.value ? "default" : "outline"}
                      >
                        Furnished
                      </Badge>
                      <Badge
                        className={cn(
                          "cursor-pointer px-3 py-1.5 text-sm transition-none",
                          field.value && "hover:bg-primary/10",
                        )}
                        onClick={() => field.onChange(false)}
                        variant={field.value ? "outline" : "default"}
                      >
                        Not Furnished
                      </Badge>
                      <FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          )}

          {selectedPropertyType === "VILLA" && (
            <div className="space-y-4">
              <FieldGroup>
                <Controller
                  name="villaDetails.subtype"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={`${field.name}-subtype`}>
                          Villa Subtype
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
                          <SelectValue placeholder="Select Villa Subtype" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {VillaSubtypes.map((subtype) => (
                            <SelectItem key={subtype} value={subtype}>
                              {VillaSubtypesMapping[subtype]}
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
                  name="villaDetails.bedrooms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-bedrooms`}>
                        Bedrooms
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        id={`${field.name}-bedrooms`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter number of bedrooms"
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
                  name="villaDetails.bathrooms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-bathrooms`}>
                        Bathrooms
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        id={`${field.name}-bathrooms`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter number of bathrooms"
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
                  name="villaDetails.furnished"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Badge
                        className={cn(
                          "cursor-pointer px-3 py-1.5 text-sm transition-none",
                          !field.value && "hover:bg-primary/10",
                        )}
                        onClick={() => field.onChange(true)}
                        variant={field.value ? "default" : "outline"}
                      >
                        Furnished
                      </Badge>
                      <Badge
                        className={cn(
                          "cursor-pointer px-3 py-1.5 text-sm transition-none",
                          field.value && "hover:bg-primary/10",
                        )}
                        onClick={() => field.onChange(false)}
                        variant={field.value ? "outline" : "default"}
                      >
                        Not Furnished
                      </Badge>
                      <FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          )}
          {selectedPropertyType === "COMMERCIAL" && (
            <div>
              <FieldGroup>
                <Controller
                  name="commercialDetails.subtype"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={`${field.name}-subtype`}>
                          Commercial Subtype
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
                          <SelectValue placeholder="Select Commercial Subtype" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {CommercialSubtypes.map((subtype) => (
                            <SelectItem key={subtype} value={subtype}>
                              {CommercialSubtypesMapping[subtype]}
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
            </div>
          )}
          {selectedPropertyType === "LAND" && (
            <div>
              <FieldGroup>
                <Controller
                  name="landDetails.subtype"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={`${field.name}-subtype`}>
                          Land Subtype
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
                          <SelectValue placeholder="Select Land Subtype" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {LandSubtypes.map((subtype) => (
                            <SelectItem key={subtype} value={subtype}>
                              {LandSubtypesMapping[subtype]}
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
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="step-1-form" className="ml-auto">
            Next
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
