import { authClient } from "~/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";

const dialogTexts = {
  "sign-in": {
    title: "Welcome Back",
    description: "Sign in to your account",
    badgeText: "Don't have an account?",
    badgeLinkText: "Create an account",
  },
  "sign-up": {
    title: "Create an account",
    description: "Create an account to get started",
    badgeText: "Already have an account?",
    badgeLinkText: "Sign in to your account",
  },
};

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 262"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      ></path>
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      ></path>
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
      ></path>
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      ></path>
    </svg>
  );
}

export function AuthDialog({
  initialType,
}: {
  initialType: "sign-in" | "sign-up";
}) {
  const buttonVariant = initialType === "sign-in" ? "ghost-text" : "default";
  const buttonText = initialType === "sign-in" ? "Sign In" : "Sign Up";
  const { title } = dialogTexts[initialType];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="block p-0 sm:max-w-[425px]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <AuthContent initialType={initialType} />
      </DialogContent>
    </Dialog>
  );
}

export function AuthContent({
  initialType,
  callbackURL,
}: {
  initialType: "sign-in" | "sign-up";
  callbackURL?: string;
}) {
  const [type, setType] = useState<"sign-in" | "sign-up">(initialType);
  const { title, description, badgeText, badgeLinkText } = dialogTexts[type];

  const googleSignInMutation = useMutation({
    mutationFn: () =>
      authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL && `/${callbackURL}`,
      }),
  });

  const isLoading = googleSignInMutation.isPending;

  return (
    <div className="grid gap-6 p-6">
      <div className="flex flex-col items-center text-center">
        <p className="text-3xl font-bold">{title}</p>
        <p className="text-base">{description}</p>
      </div>
      <div className="grid gap-2">
        <Button
          className="relative"
          variant="outline"
          disabled={isLoading}
          onClick={() => googleSignInMutation.mutate()}
        >
          <GoogleLogo className="size-4" /> Continue with Google
          {googleSignInMutation.isPending && (
            <Spinner className="absolute top-1/2 right-4 -translate-y-1/2" />
          )}
        </Button>
      </div>
      <div className="flex flex-col gap-0 sm:flex-col sm:justify-center">
        <div className="relative flex justify-center">
          <Badge variant="secondary" className="rounded-none">
            {badgeText}
          </Badge>
          <div className="bg-border absolute top-1/2 right-0 left-0 -z-10 h-px -translate-y-1/2" />
        </div>
        <Button
          className="self-center"
          variant="link"
          onClick={() => setType(type === "sign-in" ? "sign-up" : "sign-in")}
        >
          {badgeLinkText}
        </Button>
      </div>
    </div>
  );
}
