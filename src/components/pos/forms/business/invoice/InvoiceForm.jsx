"use client";

import FormHeader from "@/components/common/form/formheader/FormHeader";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import Separator from "@/components/common/separator/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const InvoiceForm = () => {
  const [customerAv, setCUstomerAv] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <FormHeader defaultData={null} title={`Invoice`} />
      <Separator title={`Customer`} />
      <Tabs defaultValue={`our_customer`} className={`w-full space-y-2`}>
        <TabsList>
          <TabsTrigger value={`our_customer`}>Select Customer</TabsTrigger>
          <TabsTrigger value={`new_customer`}>New Customer</TabsTrigger>
        </TabsList>
        <TabsContent value={`our_customer`}>
          <NextDropdown
            name={`customers`}
            items={[
              { value: 0, label: "Kasun Chiwantha" },
              { value: 1, label: "Nethmi HImasha" },
            ]}
          />
        </TabsContent>
        <TabsContent value={`new_customer`}>
          <div className=" w-full  rounded-xl shadow-md p-4 bg-gray-50 grid sm:grid-cols-2 grid-cols-2">
            New CUstomer
          </div>
        </TabsContent>
      </Tabs>
      <Separator />
    </div>
  );
};

export default InvoiceForm;
