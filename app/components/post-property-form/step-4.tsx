import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Step4Schema, usePostProperty, type StepComponentProps } from "./main";
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
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  PaymentMethods,
  PropertyPurposes,
  RentFrequencies,
} from "~/lib/schemas/entities/property";
import {
  PaymentMethodNamesMapping,
  PropertyPurposeNamesMapping,
  RentFrequencyNamesMapping,
} from "~/lib/schemas/mappings/property";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
export function Step4({ icon, label, description }: StepComponentProps) {
  const { previousStep } = usePostProperty();

  const form = useForm<z.infer<typeof Step4Schema>>({
    resolver: zodResolver(Step4Schema),
    defaultValues: {
      purpose: "SELL",
      sellDetails: {
        paymentMethod: "CASH",
      },
    },
  });

  const purpose = form.watch("purpose");
  const sellPaymentMethod = form.watch("sellDetails.paymentMethod");

  function handleSubmit(data: z.infer<typeof Step4Schema>) {
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
        <form id="step-4-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="mb-8">
            <Controller
              name="purpose"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend>Purpose</FieldLegend>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="grid grid-cols-2 gap-2"
                  >
                    {PropertyPurposes.map((purpose) => (
                      <FieldLabel
                        key={purpose}
                        htmlFor={`${field.name}-${purpose}`}
                        className="hover:bg-primary/10 cursor-pointer !rounded-full"
                      >
                        <Field
                          data-invalid={fieldState.invalid}
                          className="!p-2"
                        >
                          <FieldContent className="items-center">
                            <FieldTitle>
                              {PropertyPurposeNamesMapping[purpose]}
                            </FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            value={purpose}
                            id={`${field.name}-${purpose}`}
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

          {purpose === "SELL" && (
            <div className="space-y-4">
              <FieldGroup>
                <Controller
                  name="sellDetails.paymentMethod"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet data-invalid={fieldState.invalid}>
                      <FieldLegend className="!text-sm">
                        Payment Method
                      </FieldLegend>
                      <RadioGroup
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                        className="grid grid-cols-3 gap-2"
                      >
                        {PaymentMethods.map((paymentMethod) => (
                          <FieldLabel
                            key={paymentMethod}
                            htmlFor={`${field.name}-${paymentMethod}`}
                            className="hover:bg-primary/10 cursor-pointer !rounded-full"
                          >
                            <Field
                              data-invalid={fieldState.invalid}
                              className="!p-2"
                            >
                              <FieldContent className="items-center">
                                <FieldTitle>
                                  {PaymentMethodNamesMapping[paymentMethod]}
                                </FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value={paymentMethod}
                                id={`${field.name}-${paymentMethod}`}
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

              <FieldGroup>
                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-price`}>
                        Price
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          id={`${field.name}-price`}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter price"
                        />
                        <InputGroupAddon>
                          <InputGroupText>EGP</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {sellPaymentMethod !== "CASH" && (
                <FieldGroup>
                  <Controller
                    name="sellDetails.downPayment"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`${field.name}-downPayment`}>
                          Down Payment
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            id={`${field.name}-downPayment`}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter down payment"
                          />
                          <InputGroupAddon>
                            <InputGroupText>EGP</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              )}
            </div>
          )}

          {purpose === "RENT" && (
            <div className="space-y-4">
              <FieldGroup>
                <Controller
                  name="rentDetails.rentFrequency"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={`${field.name}-rentFrequency`}>
                          Rent Frequency
                        </FieldLabel>
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id={`${field.name}-rentFrequency`}
                          aria-invalid={fieldState.invalid}
                          className="min-w-[120px]"
                        >
                          <SelectValue placeholder="Select Rent Frequency" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {RentFrequencies.map((rentFrequency) => (
                            <SelectItem
                              key={rentFrequency}
                              value={rentFrequency}
                            >
                              {RentFrequencyNamesMapping[rentFrequency]}
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
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-price`}>
                        Rental Fee
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          id={`${field.name}-price`}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter price"
                        />
                        <InputGroupAddon>
                          <InputGroupText>EGP</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="rentDetails.deposit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-deposit`}>
                        Deposit
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          id={`${field.name}-deposit`}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter deposit"
                        />
                        <InputGroupAddon>
                          <InputGroupText>EGP</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="rentDetails.insurance"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${field.name}-insurance`}>
                        Insurance
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          id={`${field.name}-insurance`}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter insurance"
                        />
                        <InputGroupAddon>
                          <InputGroupText>EGP</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>

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
          form="step-4-form"
          size="icon"
          className="rounded-full"
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
