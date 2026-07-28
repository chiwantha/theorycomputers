"use client";

import Button from "@/components/button/Button";
import NextDropdown from "@/components/form/nextinput/NextDropdown";
import NextInput from "@/components/form/nextinput/NextInput";

import { Trash, Plus, Barcode } from "lucide-react";
import { useGRNStore } from "@/store/grnStore";
import React from "react";
import ComboboxAdapter from "@/components/ui/combobox-adapter";

const GrnRow = ({ item_list }) => {
  const rows = useGRNStore((state) => state.rows);
  const addRow = useGRNStore((state) => state.addRow);
  const updateRow = useGRNStore((state) => state.updateRow);
  const removeRow = useGRNStore((state) => state.removeRow);
  const toggleSerials = useGRNStore((state) => state.toggleSerials);
  const updateSerial = useGRNStore((state) => state.updateSerial);

  const grossTotal = useGRNStore((state) => state.grossTotal);
  const discount = useGRNStore((state) => state.discount);
  const netTotal = useGRNStore((state) => state.netTotal);

  return (
    <div className="">
      <div className="overflow-x-auto lg:overflow-visible">
        <table className="min-w-full ">
          <thead>
            <tr>
              <th className="text-sm text-left pl-2 pb-2">Item</th>

              <th className="text-sm text-left pl-4 pb-2">Quantity</th>

              <th className="text-sm text-left pl-4 pb-2">Cost</th>

              <th className="text-sm text-left pl-4 pb-2">Total</th>

              <th className="text-sm text-left pl-4 pb-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <React.Fragment key={row.tempId}>
                <tr>
                  {/* ITEM */}
                  <td className="pb-2">
                    <ComboboxAdapter
                      items={item_list}
                      defaultValue={row.itemId}
                      placeholder="Select Item"
                      className="min-w-75"
                      onChange={(value, selected) => {
                        updateRow(row.tempId, "itemId", value);
                        updateRow(
                          row.tempId,
                          "serial",
                          selected?.is_serial || false,
                        );
                      }}
                    />
                  </td>

                  {/* QTY */}
                  <td className="pl-2 pb-2">
                    <NextInput
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        updateRow(
                          row.tempId,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                      className={`min-w-30`}
                    />
                  </td>

                  {/* COST */}
                  <td className="pl-2 pb-2">
                    <NextInput
                      type="number"
                      value={row.cost}
                      onChange={(e) =>
                        updateRow(row.tempId, "cost", Number(e.target.value))
                      }
                      className={`min-w-30`}
                    />
                  </td>

                  {/* TOTAL */}
                  <td className="pl-2 pb-2 min-w-20">
                    <div className="rounded-xl bg-gray-100 py-2 px-4 min-w-30">
                      {row.lineTotal}
                    </div>
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
                    <td colSpan={5} className="pl-4 pb-2">
                      <div className="flex flex-col gap-2 border-l-2 border-gray-300 pl-2">
                        {Array.from({
                          length: row.quantity,
                        }).map((_, i) => (
                          <NextInput
                            key={i}
                            placeholder={`Serial ${i + 1}`}
                            value={row.serials[i] || ""}
                            onChange={(e) =>
                              updateSerial(row.tempId, i, e.target.value)
                            }
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {rows.length > 0 && (
              <tr className="">
                <td colSpan={2}></td>
                <td colSpan={3} className="pl-2">
                  <div className="flex flex-col py-3 px-4 rounded-xl bg-blue-50  text-gray-600 space-y-1">
                    <div className="flex justify-between items-center font-semibold ">
                      <span className="">Gross Total</span>
                      <span className="">{grossTotal}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold ">
                      <span className="">Discount</span>
                      <span className="">- {discount}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold ">
                      <span className="">Net Total</span>
                      <span className="">{netTotal}</span>
                    </div>
                  </div>
                </td>
              </tr>
            )}
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
              quantity: 0,
              cost: 0,
              serial: false,
            })
          }
        />
      </div>
    </div>
  );
};

export default GrnRow;
