"use client";

import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";

import { Trash, Plus, Barcode } from "lucide-react";
import React, { useEffect } from "react";
import { useJOBStore } from "@/store/jobStore";
import { divDisable } from "@/constant/Forms";

const InvoiceRow = ({ item_list, defaultRows = false }) => {
  const warranty = useJOBStore((state) => state.warranty);
  const section = useJOBStore((state) => state.section);
  const rows = useJOBStore((state) => state.rows);
  const addRow = useJOBStore((state) => state.addRow);
  const updateRow = useJOBStore((state) => state.updateRow);
  const removeRow = useJOBStore((state) => state.removeRow);
  const setRows = useJOBStore((state) => state.setRows);
  const toggleSerials = useJOBStore((state) => state.toggleSerials);
  const updateSerial = useJOBStore((state) => state.updateSerial);
  const grossTotal = useJOBStore((state) => state.grossTotal);
  const discount = useJOBStore((state) => state.discount);
  const netTotal = useJOBStore((state) => state.netTotal);
  const state = useJOBStore((state) => state.state);

  useEffect(() => {
    if (!Array.isArray(defaultRows) || defaultRows.length === 0) return;
    // console.log(`My ROws : `, defaultRows);
    setRows(defaultRows);
    // console.log(`Row State : `, useJOBStore.getState());
  }, [defaultRows]);

  return (
    <div
      className={`${state == 3 || state == 4 || state == 2 ? `pointer-events-none` : ``} ${section == `HEADER` ? divDisable : ``}`}
    >
      <div className="overflow-x-auto lg:overflow-visible">
        <table className="min-w-full table-fixed">
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
                console.log(`Selected Item : `, selectedItem);

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

                          updateRow(row.tempId, "itemId", val);
                          updateRow(row.tempId, "itemName", selected?.name);
                          updateRow(row.tempId, "unitPrice", selected?.selling);
                          updateRow(row.tempId, "itemType", selected?.type);
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
                        items={[
                          { value: `NORMAL`, label: `Normal` },
                          { value: `WARRANTY`, label: `Warranty` },
                        ]}
                        value={row.billing}
                        placeholder="Normal"
                        className="w-full"
                        onChange={(val) => {
                          updateRow(row.tempId, "billing", val);
                        }}
                      />
                    </td>

                    {/* UNIT PRICE */}
                    <td className="pb-2 pl-2">
                      <NextInput
                        name={`unit_price`}
                        inputClassName={`w-full`}
                        readonly={true}
                        value={Number(row.unitPrice || 0).toLocaleString(
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
                      <td colSpan={5} className="pl-4 pb-2 space-y-2">
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
