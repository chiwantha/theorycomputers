import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { Trash, Plus, Barcode } from "lucide-react";
import React, { useState } from "react";

const GrnRow = ({ item_list, grn_rows }) => {
  const [rows, setRows] = useState([
    {
      item_id: "",
      quantity: 0,
      cost: 0,
      total: 0,
      is_serial: 0,
      showSerials: false,
      serials: [],
    },
  ]);

  const updateRows = (newRows) => {
    setRows(newRows);
    if (grn_rows) grn_rows(newRows);
  };

  const handleAddRow = () => {
    updateRows([
      ...rows,
      {
        item_id: "",
        quantity: 0,
        cost: 0,
        total: 0,
        is_serial: 0,
        showSerials: false,
        serials: [],
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    updateRows(updated);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    if (field === "item_id") {
      const selected = item_list.find((item) => item.value === value);
      updated[index].is_serial = selected?.is_serial || 0;

      if (selected?.is_serial === 0) updated[index].serials = [];
    }

    // Update total when quantity OR cost changes
    if (field === "quantity" || field === "cost") {
      updated[index].total = updated[index].quantity * updated[index].cost;
    }

    // Adjust serials ONLY when quantity changes
    if (field === "quantity" && updated[index].is_serial === 1) {
      const qty = updated[index].quantity;
      const currentLength = updated[index].serials.length;

      if (qty > currentLength) {
        updated[index].serials = [
          ...updated[index].serials,
          ...Array(qty - currentLength).fill(""),
        ];
      } else if (qty < currentLength) {
        updated[index].serials = updated[index].serials.slice(0, qty);
      }
    }

    updateRows(updated);
  };

  const handleToggleSerials = (index) => {
    const updated = [...rows];
    if (updated[index].is_serial === 1) {
      updated[index].showSerials = !updated[index].showSerials;

      // Initialize serials only if empty
      if (updated[index].serials.length === 0 && updated[index].quantity > 0) {
        updated[index].serials = Array(updated[index].quantity).fill("");
      }
    }
    updateRows(updated);
  };

  const handleSerialChange = (rowIndex, serialIndex, value) => {
    const updated = [...rows];
    updated[rowIndex].serials[serialIndex] = value;
    updateRows(updated);
  };

  return (
    <div className="">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-sm capitalize text-gray-600 text-left pl-2 pb-2">
              Item
            </th>
            <th className="text-sm capitalize text-gray-600 text-left pl-4 pb-2">
              Quantity
            </th>
            <th className="text-sm capitalize text-gray-600 text-left pl-4 pb-2">
              Cost
            </th>
            <th className="text-sm capitalize text-gray-600 text-left pl-4 pb-2">
              Total
            </th>
            <th className="text-sm capitalize text-gray-600 text-left pl-4 pb-2">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="pb-2">
                  <NextDropdown
                    name={`product_${index}`}
                    placeholder={`Select Item`}
                    items={item_list}
                    value={row.item_id}
                    onChange={(val) => handleRowChange(index, "item_id", val)}
                    className={`min-w-75`}
                  />
                </td>
                <td className="pl-2 pb-2">
                  <NextInput
                    name={`quantity_${index}`}
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(index, "quantity", Number(e.target.value))
                    }
                    placeholder={`0`}
                  />
                </td>
                <td className="pl-2 pb-2">
                  <NextInput
                    name={`cost_${index}`}
                    type="number"
                    value={row.cost}
                    onChange={(e) =>
                      handleRowChange(index, "cost", Number(e.target.value))
                    }
                    placeholder={`0`}
                  />
                </td>
                <td className="pl-2 pb-2 min-w-20">
                  <div
                    className={`outline-none w-full rounded-xl bg-gray-100 py-2 px-4`}
                  >
                    {row.total}
                  </div>
                </td>
                <td className="pl-2 pb-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-fit">
                      <Button
                        name={<Barcode size={15} />}
                        pd={`px-3 py-3`}
                        disabled={row.is_serial === 0}
                        click={() => handleToggleSerials(index)}
                      />
                      <Button
                        name={<Trash size={15} />}
                        pd={`px-3 py-3`}
                        bg={`bg-red-400 hover:bg-red-600 text-white`}
                        click={() => handleDeleteRow(index)}
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {row.is_serial === 1 && row.showSerials && (
                <tr>
                  <td colSpan={5} className="pl-4 pb-2">
                    <div className="flex flex-col gap-2 border-l-2 border-gray-300 pl-2">
                      {row.serials.map((s, i) => (
                        <NextInput
                          key={i}
                          name={`serial_${index}_${i}`}
                          placeholder={`Serial ${i + 1}`}
                          value={s}
                          onChange={(e) =>
                            handleSerialChange(index, i, e.target.value)
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

      <div className="mt-2">
        <Button name={<Plus size={15} />} pd="px-3 py-3" click={handleAddRow} />
      </div>
    </div>
  );
};

export default GrnRow;
