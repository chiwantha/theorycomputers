"use client";

import Button from "@/components/button/Button";
import CancelConfirmModal from "@/components/form/confirmmodal/useCancelConfirm";
import ValueDisplay from "@/components/valuedisplay/ValueDisplay";
import { divDisable } from "@/constant/Forms";
import { formatDateTime, getTimeSince } from "@/lib/utils";
import { useCUSTOMERStore } from "@/store/customerStore";
import { useJOBStore } from "@/store/jobStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const JobCp = ({ paymentsRes }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const cancelModal = CancelConfirmModal();

  const grossTotal = useJOBStore((state) => state.grossTotal);
  const netTotal = useJOBStore((state) => state.netTotal);
  const advancedPayment = useJOBStore((state) => state.advancedPayment);
  const jobNo = useJOBStore((state) => state.jobNo);
  const invNo = useJOBStore((state) => state.invNo);
  const section = useJOBStore((state) => state.section);
  const jobId = useJOBStore((state) => state.jobId);
  const state = useJOBStore((state) => state.state);
  const rows = useJOBStore((state) => state.rows);
  const created_at = useJOBStore((state) => state.created_at);
  const deadline = useJOBStore((state) => state.deadline);
  const job_start = useJOBStore((state) => state.job_start);
  const job_finished = useJOBStore((state) => state.job_finished);
  const setHeaderField = useJOBStore((state) => state.setHeaderField);

  const phone = useCUSTOMERStore((state) => state.phone);
  const firstName = useCUSTOMERStore((state) => state.firstName);
  const lastName = useCUSTOMERStore((state) => state.lastName);

  const stateConfig = {
    0: {
      primary: {
        text: "START",
        bg: "bg-green-400 text-white hover:bg-green-500 font-bold text-lg",
        function: `Start`,
        value: 1,
        link: false,
      },
      secondary: {
        text: "CANCEL",
        bg: "bg-red-500 text-white hover:bg-red-600 font-bold text-lg",
        function: `Cancel`,
        value: 4,
        link: false,
      },
    },

    1: {
      primary: {
        text: "FINISH",
        bg: "bg-blue-500 text-white hover:bg-blue-600 font-bold text-lg",
        function: `Finish`,
        value: 2,
        link: false,
      },
      secondary: {
        text: "CANCEL",
        bg: "bg-red-500 text-white hover:bg-red-600 font-bold text-lg",
        function: `Cancel`,
        value: 4,
        link: false,
      },
    },

    2: {
      primary: {
        text: "CHECKOUT",
        bg: "bg-green-500 text-white hover:bg-green-600 font-bold text-lg",
        function: false,
        value: false,
        link: `/pos/terminal`,
      },
      secondary: {
        text: "RESTART",
        bg: "bg-amber-500 text-white hover:bg-amber-600 font-bold text-lg",
        function: `Restart`,
        value: 1,
        link: false,
      },
    },

    3: {
      primary: {
        text: "PAID | VIEW INVOICE",
        bg: "bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-lg",
        function: false,
        value: false,
        link: `/pos/terminal/${invNo}`,
        disabled: false,
      },
    },

    4: {
      primary: {
        text: "CANCELLED",
        bg: "bg-zinc-500 text-white font-bold text-lg",
        function: false,
        value: false,
        link: false,
        disabled: true,
      },
    },
  };

  useEffect(() => {
    // alert(JSON.stringify(paymentsRes));
    if (paymentsRes?.payment_type === `DOWN`) {
      setHeaderField(`advancedPayment`, Number(paymentsRes?.amount).toFixed(2));
    }
  }, [paymentsRes]);

  const currentState = stateConfig[state];

  const handleState = async (func, value, link) => {
    setPending(true);
    try {
      let reason = ``;
      if (func == `Cancel`) {
        const result = await cancelModal.askCancel();

        if (!result?.confirmed) {
          setPending(false);
          return;
        }
        reason = result?.reason;
      }

      if (!jobId) {
        toast.error(`Job Id Missing !`);
        return;
      }

      if (link) {
        setPending(false);
        router.push(link || `#`);
        return;
      }

      if (!value) {
        return;
      }

      if (func === `Finish`) {
        if (rows <= 0) {
          toast.error(`Cannot Finish Empty Job !`);
          return;
        }
      }

      const res = await fetch(`/api/pos/jobs/${jobId}/updateState`, {
        method: `PUT`,
        body: JSON.stringify({
          customer: {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            phone,
          },
          header: {
            jobNo,
            netTotal,
          },
          state: {
            state: value,
            action: func,
            reason,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        toast.error(`${func} failed !`);

        if (data.error) {
          toast.warning(data.error);
        }

        return;
      }

      router.refresh();
      toast.success(`${func} Done !`);
    } catch (err) {
      console.log(err);
      toast.error(`${func} Failed !`);
      return false;
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className={` ${section == `HEADER` ? divDisable : ``} flex flex-col  space-y-4 h-full`}
    >
      {cancelModal.modal}
      <div className="rounded-xl  space-y-4 flex flex-col  h-full">
        {/* job totals */}
        <div className="flex flex-col p-4 rounded-xl text-gray-600 shadow-md bg-white">
          <div className="grid grid-cols-2 gap-2  items-center">
            <span className="pl-4 ">Job Total</span>
            <span className=" py-1 font-semibold px-4 ">
              {grossTotal.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2  items-center bg-green-500 text-white rounded-lg my-3 p-2">
            <span className="pl-4 ">Net Total</span>
            <span className=" py-1  font-semibold px-4 ">
              {netTotal.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2  items-center">
            <span className="pl-4 ">Paid Total</span>
            <span className=" py-1  font-semibold px-4 ">
              {Number(advancedPayment).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-xl h-full justify-center shadow-md bg-white ">
          <div className="grid grid-cols-2 gap-2">
            <ValueDisplay
              title={`Time Passed`}
              value={getTimeSince(created_at)}
            />
            <ValueDisplay
              className={`bg-red-300 animate-pulse`}
              title={`Deadline`}
              value={deadline}
            />
            <ValueDisplay title={`Started`} value={formatDateTime(job_start)} />
            <ValueDisplay
              title={`Finished`}
              value={formatDateTime(job_finished)}
            />
          </div>
        </div>
      </div>
      {/* job manager */}
      <div className="flex gap-4 ">
        <Button
          pd={`px-4 py-4`}
          wfull={true}
          name={pending ? `Wait...!` : currentState?.primary?.text}
          bg={currentState?.primary?.bg}
          click={() => {
            handleState(
              currentState?.primary?.function,
              currentState?.primary?.value,
              currentState?.primary?.link,
            );
          }}
          disabled={currentState?.primary?.disabled || pending}
        />

        {currentState?.secondary && (
          <Button
            pd={`px-4 py-4`}
            wfull={true}
            name={pending ? `Wait...!` : currentState.secondary.text}
            bg={currentState.secondary.bg}
            click={() =>
              handleState(
                currentState?.secondary?.function,
                currentState?.secondary?.value,
                currentState?.secondary?.link,
              )
            }
            disabled={currentState?.secondary?.disabled || pending}
          />
        )}
      </div>
    </div>
  );
};

export default JobCp;
