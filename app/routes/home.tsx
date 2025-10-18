import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.greeting.hello.queryOptions());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
      {data}
    </div>
  );
}
