"use client";

import Button from "@/components/button/Button";
import NextInput from "@/components/form/nextinput/NextInput";

import { Trash, Plus, Barcode } from "lucide-react";
import React, { useEffect } from "react";
import { useINVOICEStore } from "@/store/invoiceStore";
import ComboboxAdapter from "@/components/ui/combobox-adapter";
import RequiredSymbole from "@/components/form/required/RequiredSymbole";

const InvoiceRow = ({ item_list, warranty_list, defaultRows = false }) => {
  const rows = useINVOICEStore((state) => state.rows);
  const docType = useINVOICEStore((state) => state.docType);
  const addRow = useINVOICEStore((state) => state.addRow);
  const updateRow = useINVOICEStore((state) => state.updateRow);
  const removeRow = useINVOICEStore((state) => state.removeRow);
  const setRows = useINVOICEStore((state) => state.setRows);
  const toggleSerials = useINVOICEStore((state) => state.toggleSerials);
  const updateSerial = useINVOICEStore((state) => state.updateSerial);
  const billEdit = useINVOICEStore((state) => state.billEdit);

  useEffect(() => {
    if (!Array.isArray(defaultRows) || defaultRows.length === 0) return;
    setRows(defaultRows);
  }, [defaultRows]);

  return (
    <div>
      <div className="overflow-x-auto">
        <fieldset
          disabled={!billEdit}
          className={`${!billEdit ? `cursor-not-allowed` : ``} overflow-hidden `}
        >
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-sm text-gray-600">
                <th className="w-[30%] min-w-70 text-left pl-4 pb-2">
                  Item <RequiredSymbole />
                </th>

                <th className="w-[30%] min-w-45 text-left pl-4 pb-2">
                  Warranty
                </th>

                <th className="w-[12%] min-w-35 text-left pl-4 pb-2">
                  Unit Price <RequiredSymbole />
                </th>

                <th className="w-[8%] min-w-30 text-left pl-4 pb-2">
                  Quantity <RequiredSymbole />
                </th>

                <th className="w-[12%] min-w-35 text-left pl-4 pb-2">
                  Total <RequiredSymbole />
                </th>
                <th className="w-[12%] min-w-35 text-left pl-4 pb-2">Note</th>

                <th className="w-[8%] min-w-30 text-left pl-4 pb-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                let itemType = "P";
                let isSellingFlex = false;
                let itemStock = 0;
                let iteminStock = true;
                let reserved = row.reserved;
                let selectedRowItem;
                if (row.itemId && row.itemId !== ``) {
                  selectedRowItem = item_list.find(
                    (item) => item.value === row.itemId,
                  );

                  itemType = selectedRowItem?.type;
                  isSellingFlex = selectedRowItem?.is_selling_flex || false;
                  itemStock = Number(selectedRowItem?.stock) + Number(reserved);
                  iteminStock =
                    itemType == "P" ? itemStock > 0 : itemType == "S";
                }
                return (
                  <React.Fragment key={row.tempId}>
                    <tr>
                      {/* ITEM */}
                      <td className="pb-2">
                        <ComboboxAdapter
                          name={`item_lsit`}
                          items={item_list}
                          placeholder={`Select item`}
                          defaultValue={row.itemId}
                          onChange={(val, selected) => {
                            const selectedWarranty = warranty_list.find(
                              (warranty) =>
                                warranty.id === selected?.warranty_id,
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
                              selectedWarranty?.name || null,
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

                            updateRow(
                              row.tempId,
                              "cost",
                              Number(selected?.cost || 0).toFixed(2),
                            );
                            updateRow(
                              row.tempId,
                              "selling",
                              Number(selected?.selling || 0).toFixed(2),
                            );

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
                        <ComboboxAdapter
                          name={`warranty_selection`}
                          items={warranty_list}
                          placeholder={`Select Warranty`}
                          defaultValue={row.warrantyId}
                          onChange={(value, selectedWarranty) => {
                            updateRow(row.tempId, `warrantyId`, value);
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
                          name={`unit_price`}
                          readonly={!isSellingFlex}
                          inputClassName={isSellingFlex ? `bg-green-50` : ``}
                          value={row.selling || 0}
                          onChange={(e) =>
                            updateRow(
                              row.tempId,
                              `selling`,
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>

                      {/* QTY */}
                      <td className="pl-2 pb-2 ">
                        <NextInput
                          type={
                            !iteminStock && itemType == "P" ? `text` : "number"
                          }
                          value={!iteminStock ? `OUT OF STOCK` : row.quantity}
                          inputClassName={
                            !iteminStock && `bg-red-50 pointer-events-none`
                          }
                          onChange={(e) =>
                            updateRow(
                              row.tempId,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                          max={
                            itemType == "P"
                              ? iteminStock
                                ? itemStock
                                : 0
                              : itemType == "S"
                                ? 999
                                : 0
                          }
                          className={`min-w-30`}
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

                      {/* NOTE */}
                      <td className="pb-2 pl-2">
                        <NextInput
                          textarea
                          textareaRows={1}
                          max={250}
                          name={`note`}
                          placeholder={`Note`}
                          value={row.note}
                          onChange={(e) =>
                            updateRow(row.tempId, `note`, e.target.value)
                          }
                        />
                      </td>

                      {/* ACTION */}
                      <td className="pl-2 pb-2 whitespace-nowrap w-1">
                        <div className="flex gap-2">
                          <Button
                            name={<Barcode size={15} />}
                            pd="px-3 py-3"
                            disabled={!row.serial || docType === "QUOTATION"}
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
                    {row.serial && row.showSerials && docType === "INVOICE" && (
                      <tr>
                        <td colSpan={6} className="pl-4 pb-2 space-y-2">
                          <div className="flex flex-col gap-2 border-l-2 border-gray-300 pl-2">
                            {Array.from({
                              length: row.quantity,
                            }).map((_, i) => (
                              <ComboboxAdapter
                                key={i}
                                name={`Select Serial`}
                                items={selectedRowItem?.serials}
                                placeholder={`Select Serial ${i + 1}`}
                                defaultValue={row.serials[i] || ``}
                                onChange={(value) => {
                                  updateSerial(row.tempId, i, value);
                                }}
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
        </fieldset>
      </div>
      <div className="mt-2">
        <Button
          name={<Plus size={15} />}
          pd="px-3 py-3"
          disabled={!billEdit}
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
