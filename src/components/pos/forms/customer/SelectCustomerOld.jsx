"use client";

import { useState, useEffect } from "react";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SelectCustomerOld = ({
  customersList,
  customer, // centralized customer object
  setCustomer, // centralized setter
  defaultCustomerId = null, // optional default
}) => {
  const [tab, setTab] = useState("our_customer");

  // Local input states (controlled by centralized customer)
  const [customerData, setCustomerData] = useState({
    type: null,
    id: null,
    name: "",
    phone: "",
  });

  // Sync centralized customer with local state
  useEffect(() => {
    if (customer) {
      setCustomerData({
        type: customer.type,
        id: customer.id || null,
        name: customer.name || "",
        phone: customer.phone || "",
      });
      setTab(customer.type === "new" ? "new_customer" : "our_customer");
    } else if (defaultCustomerId) {
      // Preload default customer if provided
      const found = customersList.find((c) => c.id === defaultCustomerId);
      if (found) {
        setCustomer({
          type: "existing",
          id: found.id,
        });
      }
    } else {
      // reset
      setCustomerData({ type: null, id: null, name: "", phone: "" });
      setTab("our_customer");
    }
  }, [customer, defaultCustomerId, customersList, setCustomer]);

  // Handle tab change
  const handleTabChange = (value) => {
    setTab(value);
    setCustomerData({
      type: value === "new_customer" ? "new" : null,
      id: null,
      name: "",
      phone: "",
    });
    setCustomer(null); // clear centralized customer
  };

  const handleExistingSelect = (id) => {
    setCustomerData({ type: "existing", id, name: "", phone: "" });
    setCustomer({ type: "existing", id });
  };

  const handleNewChange = (field, value) => {
    const updated = { ...customerData, [field]: value, type: "new", id: null };
    setCustomerData(updated);

    if (updated.name && updated.phone) {
      setCustomer({ type: "new", name: updated.name, phone: updated.phone });
    } else {
      setCustomer(null);
    }
  };

  // Function to externally reset the form
  const resetCustomer = () => {
    setCustomer(null);
    setCustomerData({ type: null, id: null, name: "", phone: "" });
    setTab("our_customer");
  };

  return (
    <div className="rounded-xl bg-white px-4 pt-5 pb-3 shadow">
      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="w-full space-y-2"
      >
        <TabsList className={`w-full sm:w-fit`}>
          <TabsTrigger value="our_customer" className="rounded-lg">
            <span className="flex gap-2">
              Select<span className="sm:block hidden">Customer</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="new_customer" className="rounded-lg">
            <span className="flex gap-2">
              New<span className="sm:block hidden">Customer</span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Existing customer */}
        <TabsContent value="our_customer">
          <NextDropdown
            name="customers"
            items={customersList}
            value={customerData.id || ""}
            onChange={handleExistingSelect}
            className="rounded-lg"
          />
        </TabsContent>

        {/* New customer */}
        <TabsContent value="new_customer">
          <div className="grid gap-2 sm:gap-4 mb-2 sm:grid-cols-2">
            <NextInput
              name="customer_name"
              placeholder="Customer Name"
              value={customerData.name}
              onChange={(e) => handleNewChange("name", e.target.value)}
              required
              className="rounded-lg"
            />
            <NextInput
              name="customer_phone"
              placeholder="Customer Phone"
              value={customerData.phone}
              onChange={(e) => handleNewChange("phone", e.target.value)}
              required
              className="rounded-lg"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SelectCustomerOld;
