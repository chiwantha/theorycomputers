import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div className=" w-full h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="relative aspect-square w-75">
        <Image
          src={`/app/loading.gif`}
          alt="loading.gif"
          fill
          unoptimized
          className="object-center object-contain"
        />
      </div>
    </div>
  );
};

export default Loading;
