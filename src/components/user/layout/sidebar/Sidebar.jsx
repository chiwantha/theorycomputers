import { cn } from "@/lib/utils";
import { Menu, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

const paths = [
  {
    title: `Menu`,
    path: `/`,
    icon: <Menu />,
    className: `bg-blue-600 text-white hover:bg-blue-500`,
  },
  {
    title: `Pos`,
    path: `/`,
    icon: <ShoppingCartIcon />,
    className: `bg-abmer-600 text-white hover:bg-amber-500`,
  },
];
const Sidebar = () => {
  return (
    <div
      className="lg:w-70 md:w-20 p-4 overflow-y-auto border-r shadow-sm border-gray-100
      md:translate-x-0 fixed md:relative top-0 left-0 h-full z-51
      transform transition-transform duration-300 bg-white flex flex-col gap-4 -translate-x-full "
    >
      {paths.map((path, index) => (
        <div
          key={index}
          // href={path.path}
          className={cn(
            path.className,
            ` rounded-xl bg-gray-100 text-gray-600 
     hover:border-blue-300 flex items-center justify-center gap-2 
      border border-gray-300 px-4 py-2 lg:aspect-auto md:aspect-square aspect-auto`,
          )}
        >
          <div className="">{path.icon}</div>
          <div className="truncate block md:hidden lg:block">{path.title}</div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
