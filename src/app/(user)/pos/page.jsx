import React from "react";

const Pos = () => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-80 bg-red-400"></div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Cards */}
        <div className="bg-green-500 h-[200px] grid-cols-5 grid gap-4 overflow-x-auto p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-300  h-full w-full flex-shrink-0"
            ></div>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Grid Area */}
          <div className="flex-1 bg-yellow-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto p-4">
            {Array.from({ length: 50 }).map((_, index) => (
              <div key={index} className="bg-gray-300 h-40"></div>
            ))}
          </div>

          {/* Right Cart Panel */}
          <div className="w-80 bg-blue-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Pos;
