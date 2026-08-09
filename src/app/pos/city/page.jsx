"use client";

import React from "react";
import {
  provinceList,
  getJsonofCityAndDistrict,
} from "get-srilanka-districts-cities";

const Page = () => {
  const provinces = provinceList();

  const western = getJsonofCityAndDistrict("Western", "Gampaha");

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-4">Sri Lanka Cities</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Provinces</h2>

        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(provinces, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Western → Gampaha</h2>

        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(western, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Page;
