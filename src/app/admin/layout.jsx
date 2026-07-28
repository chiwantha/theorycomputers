import Sidebar from "@/components/layout/adminsidebar/Sidebar";
import Navbar from "@/components/layout/adminnavbar/Navbar";
import { SidebarProvider } from "@/context/SidebarContext";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Control Panel",
};

const AdminLayout = async ({ children }) => {
  const session = await auth();

  // console.log(session);
  if (!session || session?.user?.role !== 1) {
    redirect(`/auth/usr-login`);
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <SidebarProvider>
        <aside>
          <Sidebar />
        </aside>

        {/* Right Side */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
