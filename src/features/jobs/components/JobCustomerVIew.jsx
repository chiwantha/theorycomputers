"use client";

import ValueDisplay from "@/components/valuedisplay/ValueDisplay";
import { useCUSTOMERStore } from "@/store/customerStore";
import { useJOBStore } from "@/store/jobStore";
import { useEffect } from "react";

const JobCustomerVIew = ({ customerData }) => {
  const warranty = useJOBStore((state) => state.warranty);
  const resetJOB = useJOBStore((state) => state.resetJOB);
  const jobNo = useJOBStore((state) => state.jobNo);

  // const customerId = useCUSTOMERStore((state) => state.customerId);
  const firstName = useCUSTOMERStore((state) => state.firstName);
  const lastName = useCUSTOMERStore((state) => state.lastName);
  const phone = useCUSTOMERStore((state) => state.phone);
  const setCustomerField = useCUSTOMERStore((state) => state.setCustomerField);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  useEffect(() => {
    resetJOB();
    resetCustomer();
  }, []);

  useEffect(() => {
    // alert(JSON.stringify(customerData));
    // SET CUSTOMER
    setCustomerField(`customerId`, customerData.id);
    setCustomerField(`firstName`, customerData.first_name);
    setCustomerField(`lastName`, customerData.last_name);
    setCustomerField(`phone`, customerData.phone);
  }, [customerData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
      <div className="rounded-xl p-4 bg-white shadow-md items-center gap-4 grid grid-cols-2">
        <ValueDisplay
          title={`Name`}
          value={`${firstName} ${lastName || `#`}`}
        />
        <ValueDisplay title={`Phone`} value={phone} />
      </div>
      <div className="grid-cols-2 grid gap-4 items-center bg-blue-500 rounded-xl p-4">
        <ValueDisplay
          title={`Job No`}
          value={jobNo}
          titleClassName={`text-gray-100`}
          valueClassName={`text-white`}
        />
        <div className="rounded-lg p-4 bg-green-400 xl:text-xl text-ellipsis overflow-hidden uppercase font-bold text-white shadow-md  gap-4 flex items-center justify-center">
          <span>{warranty ? `Warranty` : `Normal`}</span>
        </div>
      </div>
    </div>
  );
};

export default JobCustomerVIew;
