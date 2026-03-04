const AdminDashboard = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col gap-3 animate-pulse"
          >
            <div className="h-3 w-1/3 bg-gray-300 rounded-lg" />
            <div className="h-6 w-1/2 bg-gray-400 rounded-lg" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
            <div className="h-3 w-1/4 bg-gray-300 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Chart + Side Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
          <div className="h-4 w-1/4 bg-gray-300 rounded-lg mb-4" />
          <div className="h-62.5 bg-gray-200 rounded-lg" />
        </div>

        {/* Side Stats */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3 w-1/3 bg-gray-300 rounded-lg" />
              <div className="h-4 w-1/4 bg-gray-400 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="h-4 w-1/4 bg-gray-300 rounded-lg mb-4" />

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 items-center">
              <div className="h-3 bg-gray-300 rounded-lg" />
              <div className="h-3 bg-gray-300 rounded-lg" />
              <div className="h-3 bg-gray-300 rounded-lg" />
              <div className="h-3 bg-gray-300 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
