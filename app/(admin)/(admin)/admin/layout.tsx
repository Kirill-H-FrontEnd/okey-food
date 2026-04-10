import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminDataProvider } from "@/components/admin/admin-data-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDataProvider>
      <div className="flex min-h-screen bg-[#f2efe8]">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AdminDataProvider>
  );
}
