"use client";

import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";

import { Trash, Plus, Barcode } from "lucide-react";
import { useGRNStore } from "@/store/grnStore";
import React from "react";

const AdjRow = ({ item_list }) => {
  const rows = useGRNStore((state) => state.rows);
  const addRow = useGRNStore((state) => state.addRow);
  const updateRow = useGRNStore((state) => state.updateRow);
  const removeRow = useGRNStore((state) => state.removeRow);
  const toggleSerials = useGRNStore((state) => state.toggleSerials);
  const updateSerial = useGRNStore((state) => state.updateSerial);
  return (
    <div className="">
      <div className="overflow-x-auto lg:overflow-visible">
        <table className="min-w-full ">
          <thead>
            <tr>
              <th className="text-sm text-left pl-2 pb-2">Item</th>

              <th className="text-sm text-left pl-4 pb-2">Type</th>

              <th className="text-sm text-left pl-4 pb-2">Quantity</th>

              <th className="text-sm text-left pl-4 pb-2">Note</th>

              <th className="text-sm text-left pl-4 pb-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <React.Fragment key={row.tempId}>
                <tr>
                  {/* ITEM */}
                  <td className="pb-2">
                    <NextDropdown
                      items={item_list}
                      value={row.itemId}
                      placeholder="Select Item"
                      className="min-w-75"
                      onChange={(val) => {
                        const selected = item_list.find(
                          (item) => item.value === val,
                        );

                        updateRow(row.tempId, "itemId", val);

                        updateRow(
                          row.tempId,
                          "serial",
                          selected?.is_serial || false,
                        );
                      }}
                    />
                  </td>

                  {/* TYPE */}
                  <td className="pb-2 pl-2">
                    <NextDropdown
                      items={[
                        { value: `P`, label: `Plus` },
                        { value: `M`, label: `Minus` },
                      ]}
                      value={row.type}
                      placeholder="Adjustment Type"
                      className="max-w-75"
                      onChange={(val) => {
                        updateRow(row.tempId, "type", val);
                      }}
                    />
                  </td>

                  {/* QTY */}
                  <td className="pl-2 pb-2 ">
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

                  {/* NOTE */}
                  <td className="pl-2 pb-2">
                    <NextInput
                      type="text"
                      value={row.note}
                      placeholder={`Note`}
                      textarea
                      max={100}
                      textareaRows={1}
                      onChange={(e) =>
                        updateRow(row.tempId, "note", e.target.value)
                      }
                      className={`min-w-80`}
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

export default AdjRow;
