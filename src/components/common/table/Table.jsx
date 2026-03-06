"use client";
import React, { useState, useMemo } from "react";
import Button from "../button/Button";
import Drawer from "../drawer/Drawer";
import ActionColumn from "../actioncolumn/ActionColumn";
import { format_date } from "@/lib/validation";

const Table = ({
  colunms,
  rows,
  searchkeys = [],
  tablename,
  form: FormComponent,
  form_props,
  action = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [changeData, setChangeData] = useState(null);

  const rowsPerPage = 12;

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;

    return rows.filter((row) =>
      searchkeys.some((key) =>
        String(row[key] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [rows, searchTerm, searchkeys]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = sortedRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg">
      {/* 🔍 Search */}
      <div className="flex justify-between items-center sm:flex-row flex-col ">
        <h2 className="text-lg font-semibold text-gray-700 px-2 sm:block hidden">
          {tablename || "Items"}
        </h2>

        <div className="flex gap-2">
          {form_props && (
            <Drawer
              form={
                <FormComponent
                  defaultData={changeData}
                  form_props={form_props}
                  close_drawer={() => setOpen(false)}
                />
              }
              open={open}
              setOpen={setOpen}
              rounded={`rounded-lg`}
              callback={() => {
                setChangeData(null);
              }}
            />
          )}
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-56 md:w-70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          {/* Header */}
          <thead className=" bg-red-300 overflow-hidden">
            <tr className="bg-blue-100 text-gray-600 uppercase text-xs">
              {colunms.map((col, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(col.data_name)}
                  className={`px-4 py-3 text-left font-semibold cursor-pointer select-none ${col.className}`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortKey === col.data_name && (
                      <span className="text-blue-500">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {action && (
                <th className="px-4 py-3 text-left font-semibold cursor-pointer select-none ">
                  Action
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-blue-50 transition duration-150"
                >
                  {colunms.map((col, idx) => (
                    <td
                      key={idx}
                      className={`px-4 py-3 ${col.className} ${col.data_className || `text-gray-600`}`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.data_name == "date"
                          ? format_date(row[col.data_name])
                          : row[col.data_name]}
                    </td>
                  ))}

                  {action && (
                    <td className="border-b border-gray-100 hover:bg-blue-50 transition duration-150">
                      <ActionColumn
                        setChangeData={setChangeData}
                        setOpen={setOpen}
                        row={row}
                        action={action}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={colunms.length}
                  className="text-center py-8 text-gray-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center">
        <span className="px-2 text-sm text-gray-400">
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <Button
            pd={`px-4 py-1`}
            rounded={`rounded-lg`}
            name={`Prev`}
            click={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          />
          <Button
            pd={`px-4 py-1`}
            rounded={`rounded-lg`}
            name={`Next`}
            click={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
