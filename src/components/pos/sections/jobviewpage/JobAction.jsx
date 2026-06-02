"use client";
import Button from "@/components/common/button/Button";
import { validateFields } from "@/lib/validation";
import { useJOBStore } from "@/store/jobStore";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const JobAction = () => {
  const router = useRouter();
  const params = useParams();
  const [pending, setPending] = useState();
  const setHeaderField = useJOBStore((state) => state.setHeaderField);

  const handleCrud = async () => {
    setPending(true);
    const { job_id } = params;
    try {
      let validation;
      const jobData = useJOBStore.getState();

      console.log(jobData);

      if (!job_id) {
        toast.warning(`Job It Not Found !`);
        return;
      }

      if (jobData?.section === `HEADER`) {
        validation = validateFields(jobData, [`problem`]);
      } else if (jobData?.section === `ITEMS`) {
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

            if (!row.quantity && row.itemType == "P") {
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
      } else {
        toast.error(`Something Wrong With Job Action !`);
      }

      const data = new FormData();

      data.append(`section`, jobData.section);
      data.append(`username`, jobData.username);
      data.append(`password`, jobData.password);
      data.append(`accessories`, jobData.accessories);
      data.append(`problem`, jobData.problem);

      data.append(`grossTotal`, jobData.grossTotal);
      data.append(`discount`, jobData.discount);
      data.append(`netTotal`, jobData.netTotal);

      data.append(`jobItems`, JSON.stringify(jobData.rows));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/pos/jobs/${job_id}`,
        {
          method: `PUT`,
          body: data,
        },
      );

      if (!res.ok) {
        const data = await res.json();

        toast.error("Job Update failed!");

        if (data.error) {
          toast.warning(data.error);
        }

        return;
      }

      toast.success(`Saved !`);
      setHeaderField(`section`, `ITEMS`);
      router.push(`/pos/jobs/${job_id}`);
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong here !");
    } finally {
      setPending(false);
    }
  };
  const section = useJOBStore((state) => state.section);
  return (
    <div>
      <Button
        disabled={pending}
        name={
          pending
            ? `Processing...!`
            : section == "HEADER"
              ? `Save Header`
              : section == `ITEMS`
                ? `Save Items`
                : `Error`
        }
        click={() => handleCrud()}
        bg={`bg-green-400 text-white hover:bg-green-500`}
      />
    </div>
  );
};

export default JobAction;
