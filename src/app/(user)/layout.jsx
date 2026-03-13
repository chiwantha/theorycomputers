import Navbar from "@/components/user/layout/navbar/Navbar";
import Sidebar from "@/components/user/layout/sidebar/Sidebar";

const ShopUserLayout = ({ children }) => {
  return (
    <div className="h-screen flex">
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
        <main className="flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default ShopUserLayout;
