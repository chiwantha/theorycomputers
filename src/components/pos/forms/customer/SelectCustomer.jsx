"use client";
import { useEffect, useState } from "react";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SelectCustomer = ({ customersList, setCustomer, defaultData }) => {
  const [tab, setTab] = useState("our_customer");

  // Single state for both existing & new
  const [customerData, setCustomerData] = useState({
    type: null, // "existing" or "new"
    id: null, // existing customer id
    name: null, // new customer name
    phone: null, // new customer phone
  });

  // Reset state when defaultData is null or drawer/form reload
  useEffect(() => {
    if (!defaultData) {
      setTab("our_customer"); // reset tab
      setCustomerData({
        type: null,
        id: null,
        name: null,
        phone: null,
      });
      setCustomer(null);
    }
  }, [defaultData, setCustomer]);

  // Tab change
  const handleTabChange = (value) => {
    setTab(value);

    // Reset state when switching tab
    setCustomerData({
      type: "",
      id: "",
      name: "",
      phone: "",
    });
    setCustomer(null);
  };

  // Existing customer selection
  const handleExistingSelect = (id) => {
    setCustomerData({
      type: "existing",
      id,
      name: "",
      phone: "",
    });
    setCustomer({
      type: "existing",
      id,
    });
  };

  // New customer input change
  const handleNewChange = (field, value) => {
    const updated = { ...customerData, [field]: value, type: "new", id: "" };
    setCustomerData(updated);

    // Simple validation
    if (updated.name && updated.phone) {
      setCustomer({
        type: "new",
        name: updated.name,
        phone: updated.phone,
      });
    } else {
      setCustomer(null);
    }
  };

  return (
    <div className="rounded-xl bg-white px-4 pt-5 pb-3 shadow">
      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="w-full space-y-2"
      >
        <TabsList>
          <TabsTrigger className={`rounded-lg`} value="our_customer">
            Select Customer
          </TabsTrigger>
          <TabsTrigger className={`rounded-lg`} value="new_customer">
            New Customer
          </TabsTrigger>
        </TabsList>

        {/* EXISTING */}
        <TabsContent value="our_customer">
          <NextDropdown
            name="customers"
            items={customersList}
            defaultValue={customerData.id}
            onChange={handleExistingSelect}
            className={`rounded-lg`}
          />
        </TabsContent>

        {/* NEW */}
        <TabsContent value="new_customer">
          <div className="grid-cols-2 grid gap-4">
            <NextInput
              name="customer_name"
              placeholder="Customer Name"
              value={customerData.name}
              required
              className={`rounded-lg`}
              onChange={(e) => handleNewChange("name", e.target.value)}
            />
            <NextInput
              name="customer_phone"
              placeholder="Customer Phone"
              value={customerData.phone}
              required
              onChange={(e) => handleNewChange("phone", e.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SelectCustomer;
