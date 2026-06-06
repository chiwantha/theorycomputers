import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { useCUSTOMERStore } from "@/store/customerStore";
import { useINVOICEStore } from "@/store/invoiceStore";
import { RefreshCcw } from "lucide-react";

const SelectTrnDoc = ({ island = true, jobList, quoteList }) => {
  const invType = useINVOICEStore((state) => state.invType);
  const jobId = useINVOICEStore((state) => state.jobId);
  const quoteId = useINVOICEStore((state) => state.quoteId);
  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const setCustomerField = useCUSTOMERStore((state) => state.setCustomerField);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  const resetInvType = () => {
    setHeaderField(`invType`, `DIRECT`);
    setHeaderField(`jobId`, ``);
    setHeaderField(`quoteId`, ``);
    setHeaderField(`docType`, `INVOICE`);
  };

  return (
    <div
      className={`${island && `bg-white rounded-xl shadow-md  p-4`} flex flex-col space-y-4`}
    >
      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center bg-gray-200 hover:bg-gray-300 rounded-xl">
          <button
            className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${invType == `DIRECT` ? `bg-blue-500  text-white` : `text-gray-600`}`}
            onClick={() => {
              setHeaderField(`invType`, `DIRECT`);
              setHeaderField(`jobId`, ``);
              setHeaderField(`quoteId`, ``);
              resetCustomer();
            }}
          >
            Direct
          </button>
          <button
            className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${invType == `JOB` ? `bg-blue-500  text-white` : `text-gray-600`}`}
            onClick={() => {
              setHeaderField(`invType`, `JOB`);
              setHeaderField(`docType`, `INVOICE`);
              setHeaderField(`jobId`, ``);
              setHeaderField(`quoteId`, ``);
              resetCustomer();
            }}
          >
            Job
          </button>
          <button
            className={`px-4 py-1.5 rounded-xl  transition-colors duration-300 ${invType == `QUOTATION` ? `bg-blue-500  text-white` : `text-gray-600`}`}
            onClick={() => {
              setHeaderField(`invType`, `QUOTATION`);
              setHeaderField(`docType`, `INVOICE`);
              setHeaderField(`jobId`, ``);
              setHeaderField(`quoteId`, ``);
              resetCustomer();
            }}
          >
            Quote
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={resetInvType}
            className={`px-3 text-white py-1.5 rounded-xl text-ellipsis line-clamp-1 ${(jobId !== `` || quoteId !== ``) && `scale-100`} scale-0 transition-all group bg-green-400 hover:bg-green-600 duration-300`}
          >
            {invType == `JOB` ? `Load Job` : `Load Quote`}
          </button>
          <button
            onClick={resetInvType}
            className="px-2 text-white py-2 rounded-xl group bg-red-400 hover:bg-red-600 transition-colors duration-300"
          >
            <RefreshCcw
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
      {/* exsisting customer */}
      {invType == `JOB` ? (
        <div className="">
          <NextDropdown
            placeholder={`Select Job ...`}
            name={`job`}
            items={
              jobList || [
                { value: 0, label: `Job 1` },
                { value: 1, label: `Job 2` },
                { value: 2, label: `Job 3` },
              ]
            }
            defaultValue={jobId}
            onChange={(val) => {
              const selected = jobList.find((job) => (job.id = val));
              setCustomerField(`customerState`, 0);
              setCustomerField(`customerId`, selected?.customer_id);
              setHeaderField(`jobId`, val);
            }}
          />
        </div>
      ) : invType == `QUOTATION` ? (
        <div className="">
          <NextDropdown
            placeholder={`Select Quote ...`}
            name={`quote`}
            items={
              quoteList || [
                { value: 0, label: `Qoute 1` },
                { value: 1, label: `Qoute 2` },
                { value: 2, label: `Qoute 3` },
              ]
            }
            defaultValue={quoteId}
            onChange={(val) => setHeaderField(`quoteId`, val)}
          />
        </div>
      ) : (
        <div className="">
          <NextInput
            readonly={true}
            value={`Direct Invoice Mode`}
            inputClassName={`bg-red-100`}
            name={`direct`}
          />
        </div>
      )}
    </div>
  );
};

export default SelectTrnDoc;
