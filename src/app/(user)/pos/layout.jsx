import Sidebar from "@/components/user/layout/sidebar/Sidebar";

const PosLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default PosLayout;
