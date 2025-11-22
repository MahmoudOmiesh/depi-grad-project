import { ArrowLeftIcon } from "lucide-react";
import { Link, redirect } from "react-router";
import { MaxWidthWrapper } from "~/components/max-width-wrapper";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/add-property";
import { auth } from "~/lib/auth";
import { tryCatch } from "~/lib/utils";
import { PostPropertyForm } from "~/components/post-property-form/main";

export async function loader({ request }: Route.LoaderArgs) {
  const { data, error } = await tryCatch(
    auth.api.getSession({
      headers: request.headers,
    }),
  );

  if (error || !data) {
    return redirect("/register");
  }

  return {
    user: data.user,
  };
}

function AddPropertyRoute() {
  return (
    <>
      <header className="border-b py-4">
        <MaxWidthWrapper>
          <Button asChild size="icon" variant="ghost" className="rounded-full">
            <Link to="/">
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
        </MaxWidthWrapper>
      </header>
      <main className="flex-1 py-8">
        <MaxWidthWrapper className="max-w-3xl">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-bold">Add Your Property</h1>
            <p className="text-muted-foreground text-sm">
              Add your property details to the platform
            </p>
          </div>

          <PostPropertyForm />
        </MaxWidthWrapper>
      </main>
    </>
  );
}

export default AddPropertyRoute;
