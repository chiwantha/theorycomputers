"use client";

import Button from "@/components/common/button/Button";
import { useJOBStore } from "@/store/jobStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const JobCp = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const grossTotal = useJOBStore((state) => state.grossTotal);
  const discount = useJOBStore((state) => state.discount);
  const netTotal = useJOBStore((state) => state.netTotal);
  const jobId = useJOBStore((state) => state.jobId);
  const state = useJOBStore((state) => state.state);

  const stateConfig = {
    0: {
      primary: {
        text: "START",
        bg: "bg-green-400 text-white hover:bg-green-500",
        function: `Start`,
        value: 1,
        link: false,
      },
      secondary: {
        text: "CANCEL",
        bg: "bg-red-500 text-white hover:bg-red-600",
        function: `Cancel`,
        value: 4,
        link: false,
      },
    },

    1: {
      primary: {
        text: "FINISH",
        bg: "bg-blue-500 text-white hover:bg-blue-600",
        function: `Finish`,
        value: 2,
        link: false,
      },
      secondary: {
        text: "CANCEL",
        bg: "bg-red-500 text-white hover:bg-red-600",
        function: `Cancel`,
        value: 4,
        link: false,
      },
    },

    2: {
      primary: {
        text: "CHECKOUT",
        bg: "bg-purple-500 text-white hover:bg-purple-600",
        function: false,
        value: false,
        link: true,
      },
      secondary: {
        text: "RESTART",
        bg: "bg-amber-500 text-white hover:bg-amber-600",
        function: `Restart`,
        value: 1,
        link: false,
      },
    },

    3: {
      primary: {
        text: "PAID",
        bg: "bg-emerald-500 text-white hover:bg-emerald-600",
        function: false,
        value: false,
        link: false,
        disabled: true,
      },
    },

    4: {
      primary: {
        text: "CANCELLED",
        bg: "bg-zinc-500 text-white",
        function: false,
        value: false,
        link: false,
        disabled: true,
      },
    },
  };

  const currentState = stateConfig[state];

  const handleState = async (func, value, link) => {
    setPending(true);

    if (!jobId) {
      toast.error(`Job Id Missing !`);
      return;
    }

    if (link) {
      setPending(false);
      router.push(`/pos/terminal`);
      return;
    }

    if (!value) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/pos/jobs/${jobId}/updateState`,
        {
          method: `PUT`,
          body: JSON.stringify({
            state: value,
          }),
        },
      );

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
      toast.error(`${func} Failed !`);
      return false;
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col order-1 md:order-2 space-y-4">
      <div className="rounded-xl p-4 bg-white shadow-md space-y-4 flex flex-col justify-between h-full">
        {/* job totals */}
        <div className="flex flex-col  gap-2 text-gray-600">
          <div className="grid grid-cols-2 gap-2 rounded-lg  bg-gray-100 items-center">
            <span className="pl-4 ">Gross Total</span>
            <span className="rounded-lg py-2 font-semibold px-4 bg-gray-200">
              {grossTotal}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg  bg-red-100 items-center">
            <span className="pl-4 ">Discount</span>
            <span className="rounded-lg py-2 font-semibold px-4 bg-gray-200">
              {discount}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg  bg-gray-100 items-center">
            <span className="pl-4 ">Net Total</span>
            <span className="rounded-lg py-2  font-semibold px-4 bg-gray-200">
              {netTotal}
            </span>
          </div>
        </div>
        {/* job manager */}
        <div className="flex gap-2 ">
          <Button
            pd={`px-4 py-4`}
            rounded={`rounded-lg`}
            wfull={true}
            name={currentState?.primary?.text}
            bg={currentState?.primary?.bg}
            click={() => {
              handleState(
                currentState?.primary?.function,
                currentState?.primary?.value,
                currentState?.primary?.link,
              );
            }}
            disabled={currentState?.primary?.disabled}
          />

          {currentState?.secondary && (
            <Button
              pd={`px-4 py-4`}
              rounded={`rounded-lg`}
              wfull={true}
              name={currentState.secondary.text}
              bg={currentState.secondary.bg}
              click={() =>
                handleState(
                  currentState?.secondary?.function,
                  currentState?.secondary?.value,
                  currentState?.secondary?.link,
                )
              }
              disabled={currentState?.secondary?.disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCp;
