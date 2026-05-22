import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { DashboardShell } from '@/components/dashboard/shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  // Verify the admin role to ensure only authorized users access the specialized layout
  const isAdmin = session.user?.roles?.some(r => ['admin', 'super-admin'].includes(r));
  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <DashboardShell className="dark bg-[#0B1120] text-slate-200 antialiased">
      <AdminSidebar session={session} />
      <div className="flex-1 flex flex-col min-h-screen max-w-[calc(100vw-16rem)]">
        <main className="flex-1 p-8 overflow-y-auto bg-[#0B1120]">
          {children}
        </main>
      </div>
    </DashboardShell>
  );
}
