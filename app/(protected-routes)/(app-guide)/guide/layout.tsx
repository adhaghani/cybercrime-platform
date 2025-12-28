
import { GuideSidebar } from "@/components/guide/guide-sidebar"
import { SidebarInset } from "@/components/ui/sidebar";
import { generateMetadata } from "@/lib/seo";
export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  generateMetadata({
    title: "App Guide - Cybercrime Reporting Platform",
    description: "Learn how to use the Cybercrime Reporting Platform with our comprehensive app guide.",
    canonical: "/app/guide",
  });

  return (
    <div className="flex flex-1">
      <GuideSidebar />
      <SidebarInset className="flex-1 border-l border-r mx-auto max-w-5xl w-full overflow-auto">
        {children}
      </SidebarInset>
    </div>
  );
}
