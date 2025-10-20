import { useLoaderData } from "react-router";

export async function loader() {
  const res = await fetch("http://localhost:5173/api/properties");
  const data = (await res.json()) as { message: string };
  return { data };
}

export default function Home() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center justify-center">
      {JSON.stringify(data)}
    </div>
  );
}
