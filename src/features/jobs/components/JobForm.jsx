"use client";
import { Computer, LaptopMinimal, Monitor, Printer, Zap } from "lucide-react";
import { useJOBStore } from "@/store/jobStore";
import { useEffect, useState } from "react";
import NextInput from "@/components/form/nextinput/NextInput";
import NextDropdown from "@/components/form/nextinput/NextDropdown";
import Button from "@/components/button/Button";
import { useCUSTOMERStore } from "@/store/customerStore";
import { toast } from "react-toastify";
import { validateFields } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { generateDocNo } from "@/lib/utils";
import JobRow from "./JobRow";
import SelectCustomer from "@/features/customer/components/SelectCustomer";
import AniDiv from "@/components/animatedDiv/AniDiv";

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
    headerId: 10,
    detailId: 10,
    label: `Dell Desktop Computer - 2Months Left - INV105025`,
    value: 51,
    serial: true,
    serial_no: `10508697`,
  },
];

const JobForm = ({ form_props, rows = true }) => {
  const router = useRouter();
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
  const advance = useJOBStore((state) => state.advance);
  const accessories = useJOBStore((state) => state.accessories);
  const problem = useJOBStore((state) => state.problem);
  const customerId = useCUSTOMERStore((state) => state.customerId);
  const setHeaderField = useJOBStore((state) => state.setHeaderField);

  const resetJOB = useJOBStore((state) => state.resetJOB);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  useEffect(() => {
    resetJOB();
    resetCustomer();
    setHeaderField(`jobNo`, generateDocNo(`JOB`));
  }, []);

  useEffect(() => {
    {
      // customerId && alert(customerId);
    }
  }, [customerId]);

  const handleCrud = async () => {
    setPending(true);

    try {
      let validation;
      const customerData = useCUSTOMERStore.getState();
      const jobData = useJOBStore.getState();

      // Customer Validation
      if (warranty) {
        validation = validateFields(customerData, [`customerId`]);
        if (!validation.isValid) {
          toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
          return;
        }
      } else {
        validation = customerData.customerState
          ? customerData.firstName !== "" &&
            customerData.lastName !== "" &&
            customerData.phone !== ""
          : customerData.customerId !== null;
        if (!validation) {
          toast.error(`Missing Customer Details !`);
          return;
        }
      }

      // Job Details Validation
      if (warranty) {
        validation = validateFields(jobData, [
          `jobNo`,
          `itemId`,
          `invHeaderId`,
          `invDetailsId`,
          `problem`,
        ]);
        if (!validation.isValid) {
          toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
          return;
        }
      } else {
        validation = validateFields(jobData, [
          `jobNo`,
          `category`,
          `brand`,
          `problem`,
        ]);
        if (!validation.isValid) {
          toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
          return;
        }
      }

      if (jobData.rows.length > 0) {
        for (const row of jobData.rows) {
          if (!row.itemId) {
            toast.error(`Select Valid Item!`);
            return;
          }

          if (!row.billing && jobData.warranty) {
            toast.error(`Missing Billing on ${row?.itemName} !`);
            return;
          }

          if (!row.unitPrice) {
            toast.error(`Missing Unit Price on ${row?.itemName} !`);
            return;
          }

          if (!row.quantity) {
            toast.error(`Missing Quantity on ${row?.itemName} !`);
            return;
          }

          if (row.serial) {
            const validSerials = row.serials.filter(
              (serial) => serial?.trim() !== "",
            );

            if (validSerials.length !== row.quantity) {
              toast.error(
                `Mismatch in serial and quantity on ${row?.itemName} !`,
              );
              return;
            }
          }
        }
      }

      // const data = new FormData();
      // data.append(`jobNo`, jobData.jobNo);
      // data.append(`warranty`, jobData.warranty);

      // data.append(`invHeaderId`, jobData.invHeaderId);
      // data.append(`invDetailsId`, jobData.invDetailsId);
      // data.append(`itemId`, jobData.itemId);
      // data.append(`category`, jobData.category);
      // data.append(`brand`, jobData.brand);
      // data.append(`model`, jobData.model);
      // data.append(`serial`, jobData.serial);
      // data.append(`serialNo`, jobData.serialNo);
      // data.append(`username`, jobData.username);
      // data.append(`password`, jobData.password);
      // data.append(`advance`, jobData.advance);
      // data.append(`accessories`, jobData.accessories);
      // data.append(`problem`, jobData.problem);

      // data.append(`grossTotal`, jobData.grossTotal);
      // data.append(`netTotal`, jobData.netTotal);

      // data.append(`jobItems`, JSON.stringify(jobData.rows));

      const res = await fetch(`/api/pos/jobs`, {
        method: `POST`,
        body: JSON.stringify({
          customer: customerData,
          job: jobData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        toast.error("Job failed!");

        if (data.error) {
          toast.warning(data.error);
        }

        return;
      }

      toast.success(`Saved !`);
      router.push(`/pos/jobs`);
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong !");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 z-50">
        <AniDiv delayIndex={1}>
          <SelectCustomer customersList={customersList} />
        </AniDiv>

        <AniDiv
          delayIndex={2}
          className={`grid-cols-5 lg:gap-4 gap-2 rounded-xl shadow-md bg-white p-4 hidden xl:grid`}
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
        </AniDiv>

        <AniDiv delayIndex={3}>
          <div className="bg-white rounded-xl p-4 shadow-md h-full">
            <div className="grid grid-cols-2 bg-gray-200 hover:bg-gray-300 rounded-lg h-full">
              <button
                className={`px-4 py-1.5 rounded-lg  transition-colors duration-300 ${!warranty ? `bg-blue-500  text-white` : `text-gray-600`}`}
                onClick={() => {
                  resetJOB();
                  setHeaderField(`jobNo`, generateDocNo(`JOB`));
                  setHeaderField(`warranty`, false);
                }}
              >
                Normal
              </button>
              <button
                className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${warranty ? `bg-blue-500  text-white` : `text-gray-600`}`}
                onClick={() => {
                  resetJOB();
                  setHeaderField(`jobNo`, generateDocNo(`JOB`));
                  setHeaderField(`warranty`, true);
                }}
              >
                Warranty
              </button>
            </div>
          </div>
        </AniDiv>
      </div>

      <AniDiv delayIndex={4}>
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
                    const selected = invItems.find(
                      (item) => item.value === val,
                    );

                    setHeaderField(`serial`, selected?.serial || false);
                    setHeaderField(`serialNo`, selected?.serial_no || ``);
                    setHeaderField(`itemId`, val);
                    setHeaderField(`invHeaderId`, selected.headerId);
                    setHeaderField(`invDetailsId`, selected.detailId);
                  }}
                />

                <NextInput
                  name={`serialNo`}
                  placeholder={serial ? `VBLX1504VA1058` : `Not a Serial Item`}
                  label={`Serial No`}
                  inputClassName={!serial && `bg-red-50`}
                  disabled={serial}
                  value={serialNo}
                  max={100}
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
                max={100}
                onChange={(e) => setHeaderField(`model`, e.target.value)}
              />
              <NextInput
                name={`serialNo`}
                placeholder={`DE45328889823PQS`}
                label={`Serial No`}
                max={100}
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
              max={50}
              onChange={(e) => setHeaderField(`username`, e.target.value)}
            />
            <NextInput
              name={`password`}
              placeholder={`Admin123`}
              label={`Device Password`}
              max={50}
              value={password}
              onChange={(e) => setHeaderField(`password`, e.target.value)}
            />
            <NextInput
              name={`advancedPayment`}
              placeholder={`5000`}
              label={`Advance Payment`}
              type="number"
              value={advance}
              onChange={(e) => setHeaderField(`advance`, e.target.value)}
            />
          </div>
          <NextInput
            name={`accessories`}
            textarea
            textareaRows={4}
            label={`Received Accessories`}
            placeholder={`Charger, Mouse, Keyboard`}
            value={accessories}
            max={250}
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
      </AniDiv>

      {rows && (
        <AniDiv delayIndex={5}>
          <div className="p-4 shadow-md bg-white rounded-xl">
            <JobRow item_list={itemsList} />
          </div>
        </AniDiv>
      )}

      <AniDiv delayIndex={6}>
        <Button
          name={pending ? `Processing !` : `Save Job`}
          bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
          click={() => {
            handleCrud();
          }}
          disabled={pending}
        />
      </AniDiv>
    </div>
  );
};

export default JobForm;
