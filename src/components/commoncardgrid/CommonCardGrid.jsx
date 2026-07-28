"use client";

import { useState, useMemo } from "react";
import NextInput from "@/components/form/nextinput/NextInput";
import Button from "../button/Button";

const CommonCardGrid = ({
  itemsList = [],
  children,
  grid,
  searchPlaceholder = "Search...",
  searchKeys = [], // new prop: ["name", "description"]
  itemsPerPageOptions = [10, 15, 20],
  defaultItemsPerPage = 10,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Filter items based on searchKeys
  const filteredItems = useMemo(() => {
    if (!searchKeys.length || !searchKeyword.trim()) return itemsList;

    const keyword = searchKeyword.toLowerCase();

    return itemsList.filter((item) =>
      searchKeys.some((key) =>
        item[key]?.toString().toLowerCase().includes(keyword),
      ),
    );
  }, [itemsList, searchKeyword, searchKeys]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-62.5 h-[calc(100vh-240px)] p-4   overflow-y-auto flex flex-col gap-4">
      {/* Search input */}
      <div className="flex gap-4">
        {searchKeys.length > 0 && (
          <NextInput
            type="search"
            placeholder={searchPlaceholder}
            className="w-full"
            value={searchKeyword}
            inputClassName={`rounded-lg`}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
          />
        )}

        {/* Pagination buttons */}
        <div className="flex items-center gap-2">
          <Button
            click={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            name={`Prev`}
            rounded={`rounded-lg`}
            bg={
              currentPage === 1
                ? `bg-gray-100 cursor-not-allowed`
                : `bg-blue-500 hover:bg-blue-400 text-white font-semibold`
            }
          />
          <span className="text-nowrap text-gray-600 font-semibold tracking-tighter mr-1 ml-0.5">
            {currentPage} / {totalPages || 1}
          </span>
          <Button
            click={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            name={`Next`}
            rounded={`rounded-lg`}
            bg={
              currentPage === totalPages || totalPages === 0
                ? `bg-gray-100 cursor-not-allowed`
                : `bg-blue-500 hover:bg-blue-400 text-white font-semibold`
            }
          />
        </div>
      </div>

      {/* Grid */}
      <div
        className={`grid ${grid || "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"} gap-4`}
      >
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <div key={item.id}>{children(item)}</div>
          ))
        ) : (
          <p className="text-center col-span-full">No Items</p>
        )}
      </div>

      {/* Items per page selector & pagination */}
      <div className="flex justify-between items-center mt-2">
        {/* Items per page */}
        {!defaultItemsPerPage && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              {itemsPerPageOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonCardGrid;
