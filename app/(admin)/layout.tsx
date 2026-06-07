import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto h-full p-gutter lg:p-xl bg-surface">
        {children}
      </main>
    </div>
  );
}
