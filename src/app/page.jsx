import Button from "@/components/button/Button";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex h-screen w-full flex-col gap-4 justify-center items-center">
      <h1 className="text-lg">Welcome to Theoey Computers</h1>
      <div className="flex gap-2">
        <Button link={`/pos`} name={`POS`} />
        <Button
          link={`/admin`}
          bg={`bg-green-400 text-white hover:bg-green-500`}
          name={`SA`}
        />
      </div>
    </div>
  );
};

export default HomePage;
