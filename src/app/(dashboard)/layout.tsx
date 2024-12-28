import { Suspense } from "react";
import dynamic from "next/dynamic";

const DashboardEffects = dynamic(
  () => import("@/components/effects/dashboard"),
);
const SidebarProvider = dynamic(() =>
  import("@/components/ui/sidebar").then((mod) => mod.SidebarProvider),
);
const SidebarInset = dynamic(() =>
  import("@/components/ui/sidebar").then((mod) => mod.SidebarInset),
);
const AppSidebar = dynamic(() =>
  import("@/components/app-sidebar").then((mod) => mod.AppSidebar),
);
const AppHeader = dynamic(() =>
  import("@/components/app-header").then((mod) => mod.AppHeader),
);
const FloatingNav = dynamic(() =>
  import("@/components/floating-navbar").then((mod) => mod.FloatingNav),
);

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
          <Suspense>{children}</Suspense>
        </SidebarInset>
        <FloatingNav />
      </SidebarProvider>
      <DashboardEffects />
    </>
  );
}
