import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { FloatingNav } from "@/components/floating-navbar";
import { Suspense } from "react";
import VerticalTiles from "@/components/ui/vertical-tiles";
import { MusicButton } from "@/components/ui/music-button";

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
      <VerticalTiles
        animationDelay={0.5}
        animationDuration={0.7}
        minTileWidth={32}
        stagger={0.02}
        tileClassName="z-50"
      />
      <MusicButton />
    </>
  );
}
