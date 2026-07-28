import Sidebar from "@/components/layout/possidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";
import Navbar from "@/components/layout/posnavbar/Navbar";

const ShopUserLayout = async ({ children }) => {
  const session = await auth();
  // console.log(session);
  if (!session || (session?.user?.role !== 0 && session?.user?.role !== 1)) {
    redirect("/auth/usr-login");
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex">
        <aside>
          <Sidebar />
        </aside>

        {/* Right Side */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          {/* Content */}
          <main className="flex-1 bg-gray-100 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ShopUserLayout;
