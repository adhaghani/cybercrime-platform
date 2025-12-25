
import { GuideSidebar } from "@/components/guide/guide-sidebar"
import { SidebarInset } from "@/components/ui/sidebar";
export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <GuideSidebar />
      <SidebarInset className="flex-1 border-l border-r mx-auto max-w-5xl w-full overflow-auto">
        {children}
      </SidebarInset>
    </div>
  );
}
