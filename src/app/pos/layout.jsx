import Sidebar from "@/components/pos/layout/sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const ShopUserLayout = async ({ children }) => {
  const session = await getServerSession(authOptions);
  console.log(session);
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
          {/* Content */}
          <main className="flex-1 bg-gray-100 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ShopUserLayout;
