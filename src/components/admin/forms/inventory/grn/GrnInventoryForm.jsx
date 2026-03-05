"use client";

import GrnRow from "@/components/admin/cards/grnrow/GrnRow";
import Button from "@/components/common/button/Button";
import DeleteData from "@/components/common/form/deletedata/DeleteData";
import FormHeader from "@/components/common/form/formheader/FormHeader";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import Separator from "@/components/common/separator/Separator";
import { useEffect, useState } from "react";

const GrnInventoryForm = ({ defaultData, form_props, close_drawer }) => {
  const { suppliers, items } = form_props || null;
  const [pending, setPending] = useState(false);
  const [formData, setformdata] = useState({
    id: ``,
    grn_no: ``,
    supplier_id: ``,
    po_id: ``,
    invoice_no: ``,
    total: ``,
    products: [],
  });

  useEffect(() => {
    setPending(false);
    if (defaultData) {
      setformdata({
        id: ``,
        grn_no: ``,
        supplier_id: ``,
        po_id: ``,
        invoice_no: ``,
        total: ``,
        products: [],
      });
    } else {
      setformdata({
        id: ``,
        grn_no: ``,
        supplier_id: ``,
        po_id: ``,
        invoice_no: ``,
        total: ``,
        grn_items: [],
      });
    }
  }, [defaultData]);

  const handleCrud = async () => {
    alert(JSON.stringify(formData));
  };
  return (
    <div className="flex flex-col gap-6">
      <FormHeader defaultData={defaultData} title={`Grn Note`} />
      {!defaultData || defaultData?.type !== `delete` ? (
        <>
          <div className="hidden flex-col gap-6 md:flex">
            {/* Grn Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NextInput
                name={`id`}
                label={`Id`}
                placeholder={`000000`}
                disabled={!defaultData}
                value={formData.id}
                onChange={(e) =>
                  setformdata({ ...formData, id: e.target.value })
                }
              />
              <NextInput
                name={`grn_no`}
                label={`Grn No`}
                placeholder={`GRN0001`}
                value={formData.grn_no}
                onChange={(e) =>
                  setformdata({ ...formData, grn_no: e.target.value })
                }
              />
              <NextDropdown
                name={`supplier`}
                label={`Supplier`}
                items={suppliers}
                placeholder={`K-Chord (Pvt) Ltd`}
                className={`col-span-full`}
                defaultValue={formData.supplier_id}
                onChange={(val) =>
                  setformdata({ ...formData, supplier_id: val })
                }
              />
              <NextDropdown
                name={`po`}
                label={`Po Id`}
                items={[{ value: 0, label: `default` }]}
                placeholder={`PO0001`}
                defaultValue={formData.po_id}
                onChange={(val) => setformdata({ ...formData, po_id: val })}
              />
              <NextInput
                name={`invoice_no`}
                label={`Invoice No`}
                placeholder={`INV0001`}
                value={formData.invoice_no}
                onChange={(e) =>
                  setformdata({ ...formData, invoice_no: e.target.value })
                }
              />
            </div>
            <Separator title={`Grn Products`} />
            {/* grn products */}
            <div className="flex flex-col gap-4">
              <GrnRow
                item_list={items}
                grn_rows={(val) =>
                  setformdata((prev) => ({ ...prev, grn_items: val }))
                }
              />
            </div>

            <Button
              name={
                pending
                  ? `Processing !`
                  : `${defaultData ? `Update` : `Save`} Brand`
              }
              bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
              click={() => {
                handleCrud();
              }}
              disabled={pending}
            />
          </div>

          <div className="flex items-center justify-center md:hidden flex-col text-center px-4">
            <p className="text-lg font-semibold">
              This module is not supported on small screens.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please use a device with a larger screen (tablet, laptop, or
              desktop) to access the GRN system.
            </p>
          </div>
        </>
      ) : (
        <DeleteData defaultData={defaultData} click={() => handleCrud()} />
      )}
    </div>
  );
};

export default GrnInventoryForm;
