"use client";
import React, { useState } from "react";

const Table = ({ colunms, rows, searchkeys, tablename }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Logic to filter rows based on searchkeys
  const filteredRows = rows.filter((row) => {
    if (!searchTerm) return true;

    // searchkeys might be ["name, selling, id"] or ["name", "selling", "id"]
    // We normalize it to ensure we can iterate through the keys
    const keys = searchkeys[0].includes(",")
      ? searchkeys[0].split(",").map((k) => k.trim())
      : searchkeys;

    return keys.some((key) => {
      const value = row[key];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  return (
    <div className="flex flex-col">
      {/* Simple input to trigger the search */}
      <input
        type="text"
        placeholder={`Search ${tablename || `Table`}...`}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="">
        <thead>
          <tr>
            {colunms.map((col, index) => (
              <th key={index} title={col.data_name} className="text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, index) => (
            <tr key={index}>
              {colunms.map((dn, idx) => (
                <td key={idx}>{row[dn.data_name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
