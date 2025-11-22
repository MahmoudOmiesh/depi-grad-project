import { redirect } from "react-router";
import type { Route } from "./+types/register";
import { auth } from "~/lib/auth";
import { tryCatch } from "~/lib/utils";
import { AuthContent } from "~/components/auth-dialog";

export async function loader({ request }: Route.LoaderArgs) {
  const { data, error } = await tryCatch(
    auth.api.getSession({
      headers: request.headers,
    }),
  );

  if (!error && data?.user) {
    return redirect("/");
  }

  return null;
}

export default function RegisterRoute() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="bg-background w-full max-w-[425px] rounded-lg border shadow-lg">
        <AuthContent initialType="sign-up" />
      </div>
    </div>
  );
}
