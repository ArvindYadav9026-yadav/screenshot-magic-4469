import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { hasAppAccess } from "@/lib/auth-session";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (!(await hasAppAccess())) throw redirect({ to: "/" });
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}