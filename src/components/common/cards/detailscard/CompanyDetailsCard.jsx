"use client";
import { useSIDEBARstore } from "@/store/sidebarStore";
import Image from "next/image";

const CompanyDetailsCard = () => {
  const posFullSidebar = useSIDEBARstore((state) => state.posFullSidebar);
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl shadow-md p-1">
      <div
        className={`${posFullSidebar ? `w-[50%] m-3` : `w-full`} aspect-square relative rounded-xl overflow-hidden`}
      >
        <Image
          src={`/app/logo.png`}
          alt="logo.png"
          sizes="33vw"
          loading="eager"
          className="object-contain object-center"
          fill
        />
      </div>
    </div>
  );
};

export default CompanyDetailsCard;
