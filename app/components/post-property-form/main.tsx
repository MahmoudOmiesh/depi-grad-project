import { Building2Icon, MapPinIcon } from "lucide-react";
import { PropertyTypeSchema } from "~/lib/schemas/entities/property-type";
import { Step1 } from "./step-1";
import type z from "zod";
import { createContext, useContext, useState } from "react";
import { Step2 } from "./step-2";
import { PropertyBaseSchema } from "~/lib/schemas/entities/property";

export type StepComponentProps = Pick<Step, "icon" | "label" | "description">;

type Step = {
  label: string;
  description: string;
  icon: React.ReactNode;
  schema: z.ZodSchema;
  component: React.ComponentType<StepComponentProps>;
};

export const Step1Schema = PropertyTypeSchema;
export const Step2Schema = PropertyBaseSchema.pick({
  title: true,
  description: true,
  ownerName: true,
  ownerPhone: true,
});

const STEPS = [
  {
    label: "Property Type",
    description: "Select the type of property you are posting",
    icon: <Building2Icon className="size-4" />,
    schema: Step1Schema,
    component: Step1,
  },
  {
    label: "no idea",
    description: "no idea",
    icon: <MapPinIcon className="size-4" />,
    schema: Step2Schema,
    component: Step2,
  },
] as const satisfies readonly Step[];

type InferredSchemas = {
  [K in keyof typeof STEPS]: (typeof STEPS)[K] extends Step
    ? z.infer<(typeof STEPS)[K]["schema"]>
    : never;
};
type AnyStepSchema = InferredSchemas[number];

interface PostPropertyContext {
  step: number;
  nextStep: () => void;
  previousStep: () => void;
  submittedData: Map<number, AnyStepSchema>;
  setSubmittedData(step: number, data: AnyStepSchema): void;
}

const submittedData = new Map<number, AnyStepSchema>();
const PostPropertyContext = createContext<PostPropertyContext | null>(null);

export function usePostProperty() {
  const context = useContext(PostPropertyContext);
  if (!context) {
    throw new Error(
      "usePostProperty must be used within a PostPropertyProvider",
    );
  }

  return context;
}

export function PostPropertyForm() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(Math.min(step + 1, STEPS.length - 1));
  const previousStep = () => setStep(Math.max(step - 1, 0));

  function setSubmittedData(step: number, data: AnyStepSchema) {
    submittedData.set(step, data);
  }

  const Component = STEPS[step].component;

  return (
    <PostPropertyContext.Provider
      value={{ step, nextStep, previousStep, submittedData, setSubmittedData }}
    >
      <Component
        icon={STEPS[step].icon}
        label={STEPS[step].label}
        description={STEPS[step].description}
      />
    </PostPropertyContext.Provider>
  );
}
