"use client";
import { Computer, LaptopMinimal, Monitor, Printer, Zap } from "lucide-react";
import SelectCustomer from "../customer/SelectCustomer";
import { useJOBStore } from "@/store/jobStore";
import { useEffect, useState } from "react";
import NextInput from "@/components/common/form/nextinput/NextInput";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import JobRow from "../../cards/inputCards/JobRow";
import Button from "@/components/common/button/Button";
import { useCUSTOMERStore } from "@/store/customerStore";

const DeviceTypes = [
  {
    type: `Laptop`,
    icon: <LaptopMinimal size={30} />,
    value: 1,
  },
  {
    type: `Desktop`,
    icon: <Computer size={30} />,
    value: 2,
  },
  {
    type: `Display`,
    icon: <Monitor size={30} />,
    value: 3,
  },
  {
    type: `Printer`,
    icon: <Printer size={30} />,
    value: 6,
  },
  {
    type: `Other`,
    icon: <Zap size={30} />,
    value: 30,
  },
];

const invItems = [
  {
    detailId: 10,
    label: `Dell Desktop Computer - 2Months Left - INV105025`,
    value: 25,
    serial: true,
    serial_no: `10508697`,
  },
];

const JobForm = ({ form_props }) => {
  const { customersList, categoriesList, brandsList, itemsList } =
    form_props || {};
  const [pending, setPending] = useState(false);

  const jobNo = useJOBStore((state) => state.jobNo);
  const warranty = useJOBStore((state) => state.warranty);
  const itemId = useJOBStore((state) => state.itemId);
  const category = useJOBStore((state) => state.category);
  const brand = useJOBStore((state) => state.brand);
  const model = useJOBStore((state) => state.model);
  const serial = useJOBStore((state) => state.serial);
  const serialNo = useJOBStore((state) => state.serialNo);
  const username = useJOBStore((state) => state.username);
  const password = useJOBStore((state) => state.password);
  const advancedPayment = useJOBStore((state) => state.advancedPayment);
  const accessories = useJOBStore((state) => state.accessories);
  const problem = useJOBStore((state) => state.problem);

  const customerId = useCUSTOMERStore((state) => state.customerId);

  const setHeaderField = useJOBStore((state) => state.setHeaderField);
  const resetJOB = useJOBStore((state) => state.resetJOB);

  useEffect(() => {
    resetJOB();
  }, []);

  useEffect(() => {
    {
      customerId && alert(customerId);
    }
  }, [customerId]);

  const handleCrud = async () => {
    console.log(`Customer Data : `, useCUSTOMERStore.getState());
    console.log(`Job Data : `, useJOBStore.getState());
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SelectCustomer customersList={customersList} />
        <div
          className={` grid-cols-5 lg:gap-4 gap-2 rounded-xl shadow-md bg-white p-4 hidden xl:grid `}
        >
          {DeviceTypes.map((type, index) => (
            <button
              className={`rounded-lg  flex items-center justify-center transition-colors duration-300 aspect-square md:aspect-auto group
               ${category == type.value ? `bg-blue-500 text-white hover:bg-blue-600` : `text-blue-500 bg-gray-100 hover:bg-gray-200`}
               ${warranty && `opacity-50 cursor-not-allowed`}`}
              key={index}
              onClick={() => {
                setHeaderField(`category`, type.value);
              }}
              disabled={warranty}
            >
              <span className="group-hover:scale-115 transition-transform duration-300">
                {type.icon}
              </span>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="grid grid-cols-2 bg-gray-200 hover:bg-gray-300 rounded-lg h-full">
            <button
              className={`px-4 py-1.5 rounded-lg  transition-colors duration-300 ${!warranty ? `bg-blue-500  text-white` : `text-gray-600`}`}
              onClick={() => {
                resetJOB();
                setHeaderField(`warranty`, false);
              }}
            >
              Normal
            </button>
            <button
              className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${warranty ? `bg-blue-500  text-white` : `text-gray-600`}`}
              onClick={() => {
                resetJOB();
                setHeaderField(`warranty`, true);
              }}
            >
              Warranty
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl shadow-md bg-white">
        {warranty ? (
          <>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <NextInput
                name={`jobNo`}
                placeholder={`JOB0002`}
                label={`Job No`}
                required={true}
                value={jobNo}
                inputClassName={`bg-red-50`}
                disabled={true}
              />
              <NextDropdown
                label={`Avaialable Claims`}
                name={`warrantyItem`}
                items={invItems}
                disabled={!customerId && true}
                defaultValue={itemId}
                onChange={(val) => {
                  const selected = invItems.find((item) => item.value === val);

                  setHeaderField(`serial`, selected?.serial || false);
                  setHeaderField(`serialNo`, selected?.serial_no || ``);
                  setHeaderField(`itemId`, val);
                }}
              />

              <NextInput
                name={`serialNo`}
                placeholder={serial ? `VBLX1504VA1058` : `Not a Serial Item`}
                label={`Serial No`}
                inputClassName={!serial && `bg-red-50`}
                disabled={serial}
                value={serialNo}
                readonly={true}
              />
            </div>
          </>
        ) : (
          <>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <NextInput
                name={`jobNo`}
                placeholder={`JOB0002`}
                label={`Job No`}
                required={true}
                value={jobNo}
                inputClassName={`bg-red-50`}
                disabled={true}
              />
              <NextDropdown
                name={`category`}
                items={categoriesList}
                label={`Category`}
                required={true}
                defaultValue={category}
                onChange={(val) => setHeaderField(`category`, val)}
              />
              <NextDropdown
                name={`brand`}
                items={brandsList}
                label={`Brand`}
                required={true}
                defaultValue={brand}
                onChange={(val) => setHeaderField(`brand`, val)}
              />
            </div>

            <NextInput
              name={`model`}
              placeholder={`VIVOBOOK 1504VA`}
              label={`Model`}
              value={model}
              onChange={(e) => setHeaderField(`model`, e.target.value)}
            />
            <NextInput
              name={`serialNo`}
              placeholder={`DE45328889823PQS`}
              label={`Serial No`}
              value={serialNo}
              onChange={(e) => setHeaderField(`serialNo`, e.target.value)}
            />
          </>
        )}
        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <NextInput
            name={`username`}
            placeholder={`Administrator`}
            label={`Device Username`}
            value={username}
            onChange={(e) => setHeaderField(`username`, e.target.value)}
          />
          <NextInput
            name={`password`}
            placeholder={`Admin123`}
            label={`Device Password`}
            value={password}
            onChange={(e) => setHeaderField(`password`, e.target.value)}
          />
          <NextInput
            name={`advancedPayment`}
            placeholder={`5000`}
            label={`Advance Payment`}
            type="number"
            value={advancedPayment}
            onChange={(e) => setHeaderField(`advancedPayment`, e.target.value)}
          />
        </div>
        <NextInput
          name={`accessories`}
          textarea
          textareaRows={4}
          label={`Received Accessories`}
          placeholder={`Charger, Mouse, Keyboard`}
          value={accessories}
          onChange={(e) => setHeaderField(`accessories`, e.target.value)}
        />
        <NextInput
          name={`problem`}
          textarea
          textareaRows={4}
          label={`Problem Description`}
          placeholder={`No Power !`}
          required={true}
          value={problem}
          onChange={(e) => setHeaderField(`problem`, e.target.value)}
        />
      </div>

      <div className="p-4 shadow-md bg-white rounded-xl">
        <JobRow item_list={itemsList} />
      </div>

      <Button
        name={pending ? `Processing !` : `Save Grn`}
        bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
        click={() => {
          handleCrud();
        }}
        disabled={pending}
      />
    </div>
  );
};

export default JobForm;
