import { createFileRoute } from "@tanstack/react-router";

import { UsersDashboard } from "@/components/users/users-dashboard";

function UsersPage() {
  return <UsersDashboard />;
}

export const Route = createFileRoute("/users")({
  component: UsersPage,
});
