import { cn } from "~/lib/utils";

export function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl px-4", className)}>
      {children}
    </div>
  );
}
