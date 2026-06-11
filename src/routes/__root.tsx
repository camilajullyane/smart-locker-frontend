import { Outlet, createRootRoute } from "@tanstack/react-router";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

function DashboardShell() {
  return (
    <TooltipProvider>
      <SidebarProvider className="dark min-h-screen bg-neutral-950 text-neutral-100">
        <DashboardSidebar />

        <SidebarInset className="bg-neutral-950 text-neutral-100">
          <header className="border-b border-neutral-800 px-4 py-4 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-neutral-300 hover:bg-neutral-900 hover:text-neutral-50" />

                <div>
                  <p className="text-sm text-neutral-400">Dashboard</p>
                  <h1 className="text-2xl font-semibold">Smart Locker</h1>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 md:px-8">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export const Route = createRootRoute({
  component: DashboardShell,
});
