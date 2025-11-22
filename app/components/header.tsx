import { authClient } from "~/lib/auth-client";
import { Spinner } from "./ui/spinner";
import { Link } from "react-router";
import { ProfileDropdown } from "./profile-dropdown";
import { AuthDialog } from "./auth-dialog";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = !!session?.user;

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky inset-x-0 top-0 z-50 border-b py-4 backdrop-blur">
      <MaxWidthWrapper className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="hidden text-2xl font-bold sm:block">DEPI</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/properties"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Properties
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            {isPending ? (
              <div className="grid h-9 place-items-center">
                <Spinner />
              </div>
            ) : isSignedIn ? (
              <>
                <ProfileDropdown
                  name={session.user.name}
                  email={session.user.email}
                  photoUrl={session.user.image ?? ""}
                />
              </>
            ) : (
              <>
                <ThemeToggle />
                <AuthDialog initialType="sign-in" />
                <AuthDialog initialType="sign-up" />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
