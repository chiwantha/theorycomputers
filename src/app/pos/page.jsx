import DashCardGrid from "@/components/pos/grid/dashcardgrid/DashCardGrid";
import UserShiftData from "@/components/pos/sections/dashboard/UserShift";

const ShopUserDashMenu = () => {
  return (
    <div className=" flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <UserShiftData />
        <DashCardGrid />
      </div>
    </div>
  );
};

export default ShopUserDashMenu;
