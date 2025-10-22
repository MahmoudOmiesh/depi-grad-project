import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Header } from "~/components/header";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
