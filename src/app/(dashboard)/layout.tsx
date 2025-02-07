import { DelayedSuspense } from "@/components/ui/delayed-suspense";
import DashboardEffects from "@/components/effects/dashboard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { FloatingNav } from "@/components/floating-navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <DelayedSuspense>{children}</DelayedSuspense>
        </SidebarInset>
        <FloatingNav />
      </SidebarProvider>
      <DashboardEffects />
    </>
  );
}
