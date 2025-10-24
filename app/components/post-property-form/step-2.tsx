import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Step2Schema, usePostProperty, type StepComponentProps } from "./main";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useLoaderData } from "react-router";
import type { User } from "better-auth";

const MAX_DESCRIPTION_LENGTH = 2000;

export function Step2({ icon, label, description }: StepComponentProps) {
  const { previousStep, nextStep, submittedData, setSubmittedData } =
    usePostProperty();
  const { user } = useLoaderData<{ user: User }>();

  const defaultValues = (submittedData.get(2) as z.infer<
    typeof Step2Schema
  >) ?? {
    title: "",
    description: "",
    ownerName: user.name,
    ownerPhone: "",
  };

  const form = useForm<z.infer<typeof Step2Schema>>({
    resolver: zodResolver(Step2Schema),
    defaultValues,
  });

  function handleSubmit(data: z.infer<typeof Step2Schema>) {
    setSubmittedData(2, data);
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
        <form id="step-2-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${field.name}-bedrooms`}>
                      Ad Title
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${field.name}-title`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Ad Title"
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
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${field.name}-description`}>
                      Ad Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      onChange={(e) => {
                        if (e.target.value.length > MAX_DESCRIPTION_LENGTH) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        field.onChange(e);
                      }}
                      id={`${field.name}-description`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Ad Description"
                      className="h-[170px] max-h-[170px] resize-none overflow-y-auto"
                    />
                    <FieldDescription className="text-muted-foreground text-right text-xs">
                      {field.value?.length ?? 0} / {MAX_DESCRIPTION_LENGTH}{" "}
                      characters left
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="ownerName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${field.name}-description`}>
                      Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${field.name}-ownerName`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Name"
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
                name="ownerPhone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${field.name}-ownerPhone`}>
                      Phone
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={`${field.name}-ownerPhone`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Phone"
                      />
                      <InputGroupAddon>
                        <InputGroupText>+20</InputGroupText>
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
          form="step-2-form"
          size="icon"
          className="rounded-full"
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
