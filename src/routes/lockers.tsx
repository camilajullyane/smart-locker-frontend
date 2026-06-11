import { createFileRoute } from "@tanstack/react-router";

import { LockersDashboard } from "@/components/lockers/lockers-dashboard";

function LockersPage() {
  return <LockersDashboard />;
}

export const Route = createFileRoute("/lockers")({
  component: LockersPage,
});
