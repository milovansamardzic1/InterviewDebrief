"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh min-w-0 flex-col overflow-x-hidden bg-background">
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4">
          <SidebarTrigger className="size-9" />
        </header>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
