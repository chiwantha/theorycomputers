"use client";

import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import ValueDisplay from "@/components/common/valuedisplay/ValueDisplay";
import { useCUSTOMERStore } from "@/store/customerStore";
import { useJOBStore } from "@/store/jobStore";
import { use, useEffect } from "react";

const page = ({ params }) => {
  const { job_id } = use(params);

  const jobId = useJOBStore((state) => state.jobId);
  const jobNo = useJOBStore((state) => state.jobNo);
  const category = useJOBStore((state) => state.category);
  const brand = useJOBStore((state) => state.brand);
  const model = useJOBStore((state) => state.model);
  const serial = useJOBStore((state) => state.serial);
  const username = useJOBStore((state) => state.username);
  const password = useJOBStore((state) => state.password);
  const accessories = useJOBStore((state) => state.accessories);
  const problem = useJOBStore((state) => state.problem);
  const setHeaderField = useJOBStore((state) => state.setHeaderField);

  const customerId = useCUSTOMERStore((state) => state.customerId);
  const customerName = useCUSTOMERStore((state) => state.customerName);
  const customerPhone = useCUSTOMERStore((state) => state.customerPhone);
  const setCustomerField = useCUSTOMERStore((state) => state.setCustomerField);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/pos/jobs/${job_id}`,
        );

        if (!res.ok) return;

        const jobData = await res.json();

        console.log(jobData);

        // SET CUSTOMER
        setCustomerField(`customerId`, jobData?.customerRes[0]?.id);
        setCustomerField(`customerName`, jobData?.customerRes[0]?.customerName);
        setCustomerField(
          `customerPhone`,
          jobData?.customerRes[0]?.customerPhone,
        );

        // SET JOB DATA
        setHeaderField(`jobNo`, jobData?.headerRes[0]?.job_no);
        setHeaderField(`category`, jobData?.headerRes[0]?.job_no);
        setHeaderField(`category`, jobData?.detailsRes[0]?.category_name);
        setHeaderField(`brand`, jobData?.detailsRes[0]?.brand_name);
        setHeaderField(`model`, jobData?.detailsRes[0]?.model);
        setHeaderField(`serial`, jobData?.headerRes[0]?.serial);
        setHeaderField(`username`, jobData?.headerRes[0]?.username);
        setHeaderField(`password`, jobData?.headerRes[0]?.password);
        setHeaderField(`accessories`, jobData?.headerRes[0]?.accessories);
        setHeaderField(`problem`, jobData?.headerRes[0]?.problem);
      } catch (err) {
        console.log("Error Fetching Job :", err);
      }
    };

    loadJob();
  }, [job_id]);

  return (
    <div className="flex flex-col space-y-4">
      <BreadCrumb />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2  flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-4 ">
            <div className="rounded-xl p-4 bg-white shadow-md col-span-2 gap-4 grid grid-cols-3">
              <ValueDisplay title={`Customer Id`} value={customerId} />
              <ValueDisplay title={`Name`} value={customerName} />
              <ValueDisplay title={`Phone`} value={customerPhone} />
            </div>
            <div className="rounded-xl p-4 bg-white shadow-md grid  gap-4 "></div>
          </div>
          <div className="rounded-xl p-4 bg-white shadow-md grid grid-cols-2 gap-4 ">
            <ValueDisplay title={`Job No`} value={jobNo} />
            <ValueDisplay title={`Category`} value={category} />
            <ValueDisplay title={`Brand`} value={brand} />
            <ValueDisplay title={`Model`} value={model} />
            <ValueDisplay title={`Serial`} value={serial} />
            <ValueDisplay title={`Username`} value={username} />
            <ValueDisplay title={`Password`} value={password} />
            <ValueDisplay title={`Accessories`} value={accessories} />
            <ValueDisplay title={`Problem`} value={problem} />
          </div>
        </div>
        <div className="rounded-xl p-4 bg-white shadow-md  "></div>
      </div>
    </div>
  );
};

export default page;
