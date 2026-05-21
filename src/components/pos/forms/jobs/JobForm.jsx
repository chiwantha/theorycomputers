"use client";
import { Computer, LaptopMinimal, Monitor, Printer, Zap } from "lucide-react";
import SelectCustomer from "../customer/SelectCustomer";
import { useJOBStore } from "@/store/jobStore";
import { useEffect } from "react";
import NextInput from "@/components/common/form/nextinput/NextInput";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";

const DeviceTypes = [
  {
    type: `Laptop`,
    icon: <LaptopMinimal size={35} />,
    value: 1,
  },
  {
    type: `Desktop`,
    icon: <Computer size={35} />,
    value: 2,
  },
  {
    type: `Display`,
    icon: <Monitor size={35} />,
    value: 3,
  },
  {
    type: `Printer`,
    icon: <Printer size={35} />,
    value: 6,
  },
  {
    type: `Other`,
    icon: <Zap size={35} />,
    value: 0,
  },
];

const JobForm = ({ form_props }) => {
  const deviceType = useJOBStore((state) => state.deviceType);
  const setHeaderField = useJOBStore((state) => state.setHeaderField);
  const resetJOB = useJOBStore((state) => state.resetJOB);
  const { customersList, categoriesList, brandsList } = form_props || {};

  useEffect(() => {
    resetJOB();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectCustomer customersList={customersList} />
        <div className="grid grid-cols-5 lg:gap-4 gap-2 rounded-xl shadow-md bg-white p-4">
          {DeviceTypes.map((type, index) => (
            <button
              className={`rounded-lg  flex items-center justify-center transition-colors duration-300 aspect-square md:aspect-auto
               ${deviceType == type.value ? `bg-blue-500 text-white hover:bg-blue-600` : `text-blue-500 bg-gray-100 hover:bg-gray-200`}`}
              key={index}
              onClick={() => {
                setHeaderField(`deviceType`, type.value);
                console.log(deviceType);
              }}
            >
              {type.icon}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl shadow-md bg-white">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <NextInput
            name={`jobNo`}
            placeholder={`JOB0002`}
            label={`Job No`}
            required={true}
          />
          <NextDropdown
            name={`category`}
            items={categoriesList}
            label={`Category`}
            required={true}
          />
          <NextDropdown
            name={`brand`}
            items={brandsList}
            label={`Brand`}
            required={true}
          />
        </div>

        <NextInput
          name={`modelNo`}
          placeholder={`VIVOBOOK 1504VA`}
          label={`Model No`}
        />
        <NextInput
          name={`serialNo`}
          placeholder={`DE45328889823PQS`}
          label={`Serial No`}
        />
        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <NextInput
            name={`username`}
            placeholder={`Administratoe`}
            label={`Device Username`}
          />
          <NextInput
            name={`password`}
            placeholder={`Admin123`}
            label={`Device Password`}
          />
          <NextInput
            name={`advancedPayment`}
            placeholder={`5000`}
            label={`Advance Payment`}
            type="number"
          />
        </div>
        <NextInput
          name={`accessories`}
          textarea
          textareaRows={4}
          label={`Received Accessories`}
          placeholder={`Charger, Mouse, Keyboard`}
        />
        <NextInput
          name={`problemDescription`}
          textarea
          textareaRows={4}
          label={`Problem`}
          placeholder={`No Power !`}
          required={true}
        />
      </div>
    </div>
  );
};

export default JobForm;
