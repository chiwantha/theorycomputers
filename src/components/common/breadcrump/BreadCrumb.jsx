"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BreadCrumb = () => {
  const pathname = usePathname();

  // Remove empty parts
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-sm">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        // Format text (about-us → About Us)
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        const isFirst = index === 0;
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex items-center gap-2">
            <Link
              href={href}
              className={`
                rounded-xl py-2 px-4 transition-colors duration-300 text-nowrap
                ${
                  isLast
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : isFirst
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }
              `}
            >
              {label === "Admin" ? "Home" : label}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
