import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminDataProvider } from "@/components/admin/admin-data-provider";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDataProvider>
      <div className="flex h-screen overflow-hidden bg-[#f2efe8]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminMobileNav />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
