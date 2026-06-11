"use client";

import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";

import { Trash, Plus, Barcode } from "lucide-react";
import React, { useEffect } from "react";
import { divDisable } from "@/constant/Forms";
import { useINVOICEStore } from "@/store/invoiceStore";

const InvoiceRow = ({ item_list, warranty_list, defaultRows = false }) => {
  const rows = useINVOICEStore((state) => state.rows);
  const addRow = useINVOICEStore((state) => state.addRow);
  const updateRow = useINVOICEStore((state) => state.updateRow);
  const removeRow = useINVOICEStore((state) => state.removeRow);
  const setRows = useINVOICEStore((state) => state.setRows);
  const toggleSerials = useINVOICEStore((state) => state.toggleSerials);
  const updateSerial = useINVOICEStore((state) => state.updateSerial);
  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const discount = useINVOICEStore((state) => state.discount);
  const netTotal = useINVOICEStore((state) => state.netTotal);

  useEffect(() => {
    if (!Array.isArray(defaultRows) || defaultRows.length === 0) return;
    setRows(defaultRows);
  }, [defaultRows]);

  return (
    <div>
      <div className="overflow-x-auto lg:overflow-visible">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-sm">
              <th className="w-[30%] min-w-70 text-left pl-4 pb-2">Item</th>

              <th className="w-[30%] min-w-45 text-left pl-4 pb-2">Warranty</th>

              <th className="w-[12%] min-w-35 text-left pl-4 pb-2">
                Unit Price
              </th>

              <th className="w-[8%] min-w-30 text-left pl-4 pb-2">Quantity</th>

              <th className="w-[12%] min-w-35 text-left pl-4 pb-2">Total</th>

              <th className="w-[8%] min-w-30 text-left pl-4 pb-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              let itemType = "P";
              let itemStock = 0;
              let iteminStock = true;
              if (row.itemId && row.itemId !== ``) {
                const selectedItem = item_list.find(
                  (item) => item.value === row.itemId,
                );
                // console.log(`Selected Item : `, selectedItem);

                itemType = selectedItem?.type;
                itemStock = selectedItem?.stock;
                iteminStock = itemType == "P" ? itemStock > 0 : itemType == "S";
              }
              return (
                <React.Fragment key={row.tempId}>
                  <tr>
                    {/* ITEM */}
                    <td className="pb-2">
                      <NextDropdown
                        items={item_list}
                        value={row.itemId}
                        placeholder="Select Item"
                        className="w-full"
                        defaultValue={row.itemId}
                        onChange={(val) => {
                          const selected = item_list.find(
                            (item) => item.value === val,
                          );

                          const selectedWarranty = warranty_list.find(
                            (warranty) => warranty.id === selected?.warranty_id,
                          );

                          console.log(`Warranty : `, selectedWarranty?.name);
                          updateRow(
                            row.tempId,
                            "warrantyId",
                            selected?.warranty_id || null,
                          );
                          updateRow(
                            row.tempId,
                            `warrantyName`,
                            selectedWarranty?.name,
                          );

                          const duration = Number(
                            selectedWarranty?.duration || 0,
                          );

                          if (
                            duration === 0 ||
                            selectedWarranty?.duration == null
                          ) {
                            updateRow(row.tempId, "warrantyEndDate", null);
                          } else {
                            const warrantyEndDate = new Date();
                            warrantyEndDate.setDate(
                              warrantyEndDate.getDate() +
                                Math.round(duration * 30.44),
                            );

                            updateRow(
                              row.tempId,
                              "warrantyEndDate",
                              warrantyEndDate.toISOString().split("T")[0],
                            );
                          }

                          updateRow(row.tempId, "itemId", val);
                          updateRow(row.tempId, "itemName", selected?.name);
                          updateRow(row.tempId, "itemType", selected?.type);

                          updateRow(row.tempId, "cost", selected?.cost);
                          updateRow(row.tempId, "selling", selected?.selling);

                          updateRow(
                            row.tempId,
                            "quantity",
                            selected?.type == "S" ? 1 : 0,
                          );

                          updateRow(
                            row.tempId,
                            "serial",
                            selected?.is_serial || false,
                          );
                        }}
                      />
                    </td>

                    {/* warranty */}
                    <td className="pb-2 pl-2">
                      <NextDropdown
                        items={warranty_list}
                        value={2}
                        placeholder="Select Warranty"
                        className="w-full"
                        defaultValue={row.warrantyId}
                        onChange={(val) => {
                          const selectedWarranty = warranty_list.find(
                            (warranty) => warranty?.id === val,
                          );

                          updateRow(row.tempId, `warrantyId`, val);
                          updateRow(
                            row.tempId,
                            `warrantyName`,
                            selectedWarranty?.name,
                          );

                          const duration = Number(
                            selectedWarranty?.duration || 0,
                          );

                          if (
                            duration === 0 ||
                            selectedWarranty?.duration == null
                          ) {
                            updateRow(row.tempId, "warrantyEndDate", null);
                          } else {
                            const warrantyEndDate = new Date();
                            warrantyEndDate.setDate(
                              warrantyEndDate.getDate() +
                                Math.round(duration * 30.44),
                            );

                            updateRow(
                              row.tempId,
                              "warrantyEndDate",
                              warrantyEndDate.toISOString().split("T")[0],
                            );
                          }
                        }}
                      />
                    </td>

                    {/* SELLING PRICE */}
                    <td className="pb-2 pl-2">
                      <NextInput
                        name={`selling_price`}
                        inputClassName={`w-full`}
                        readonly={true}
                        value={Number(row.selling || 0).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      />
                    </td>

                    {/* QTY */}
                    <td className="pl-2 pb-2 ">
                      <NextInput
                        type={
                          !iteminStock || itemType == "S" ? `text` : "number"
                        }
                        value={
                          !iteminStock
                            ? `OUT OF STOCK`
                            : itemType == "P"
                              ? row.quantity
                              : `Auto`
                        }
                        inputClassName={`${!iteminStock && `bg-red-50 pointer-events-none`} `}
                        onChange={(e) =>
                          updateRow(
                            row.tempId,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        max={iteminStock ? itemStock : 0}
                        readonly={itemType == `S`}
                        className={`w-full`}
                      />
                    </td>

                    {/* TOTAL */}
                    <td className="pl-2 pb-2 ">
                      <NextInput
                        inputClassName={`w-full`}
                        name={`lineTotal`}
                        readonly={true}
                        value={Number(row.lineTotal || 0).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      />
                    </td>

                    {/* ACTION */}
                    <td className="pl-2 pb-2 whitespace-nowrap w-1">
                      <div className="flex gap-2">
                        <Button
                          name={<Barcode size={15} />}
                          pd="px-3 py-3"
                          disabled={!row.serial}
                          click={() => toggleSerials(row.tempId)}
                        />

                        <Button
                          name={<Trash size={15} />}
                          pd="px-3 py-3"
                          bg="bg-red-400 hover:bg-red-600 text-white"
                          click={() => removeRow(row.tempId)}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* SERIALS */}
                  {row.serial && row.showSerials && (
                    <tr>
                      <td colSpan={6} className="pl-4 pb-2 space-y-2">
                        <div className="flex flex-col gap-2 border-l-2 border-gray-300 pl-2">
                          {Array.from({
                            length: row.quantity,
                          }).map((_, i) => (
                            <NextDropdown
                              key={i}
                              items={
                                item_list.find(
                                  (item) => item.value === row.itemId,
                                )?.serials
                              }
                              placeholder={`Select Serial ${i + 1}`}
                              defaultValue={row.serials[i] || ``}
                              onChange={(val) =>
                                updateSerial(row.tempId, i, val)
                              }
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        <Button
          name={<Plus size={15} />}
          pd="px-3 py-3"
          click={() =>
            addRow({
              itemId: "",
              type: "",
              quantity: 0,
              serial: false,
            })
          }
        />
      </div>
    </div>
  );
};

export default InvoiceRow;
