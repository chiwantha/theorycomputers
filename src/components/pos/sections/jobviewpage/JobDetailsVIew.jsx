"use client";
import ValueDisplay from "@/components/common/valuedisplay/ValueDisplay";
import { useJOBStore } from "@/store/jobStore";
import { useEffect } from "react";

const JobDetailsVIew = ({ detailsData, headerData }) => {
  const jobId = useJOBStore((state) => state.jobId);
  const jobNo = useJOBStore((state) => state.jobNo);
  const warranty = useJOBStore((state) => state.warranty);
  const category = useJOBStore((state) => state.category);
  const brand = useJOBStore((state) => state.brand);
  const model = useJOBStore((state) => state.model);
  const serial = useJOBStore((state) => state.serial);
  const serialNo = useJOBStore((state) => state.serialNo);
  const username = useJOBStore((state) => state.username);
  const password = useJOBStore((state) => state.password);
  const accessories = useJOBStore((state) => state.accessories);
  const problem = useJOBStore((state) => state.problem);
  const setHeaderField = useJOBStore((state) => state.setHeaderField);

  useEffect(() => {
    setHeaderField(`jobId`, headerData?.id);
    setHeaderField(`jobNo`, headerData?.job_no);
    setHeaderField(`warranty`, headerData?.warranty ? true : false);

    setHeaderField(`itemId`, headerData?.item_id || ``);
    setHeaderField(`category`, detailsData?.category_id);
    setHeaderField(`brand`, detailsData?.brand_id);
    setHeaderField(`model`, detailsData?.model || ``);
    setHeaderField(`serial`, detailsData?.serial ? true : false);
    setHeaderField(`serialNo`, detailsData?.serial || ``);

    setHeaderField(`username`, detailsData?.username || ``);
    setHeaderField(`password`, detailsData?.password || ``);
    setHeaderField(`accessories`, detailsData?.accessories || ``);
    setHeaderField(`problem`, detailsData?.problem);
  }, [detailsData, headerData]);

  return (
    <div className="">
      <div className="rounded-xl p-4 bg-white shadow-md grid grid-cols-2 gap-4 ">
        {warranty ? (
          <>
            <ValueDisplay title={`Item`} value={detailsData?.item_name} />
            <ValueDisplay title={`Serial`} value={serialNo} />
            <ValueDisplay
              title={`Category`}
              value={detailsData?.category_name}
            />
            <ValueDisplay title={`Brand`} value={detailsData?.brand_name} />
          </>
        ) : (
          <>
            <ValueDisplay
              title={`Category`}
              value={detailsData?.category_name}
            />
            <ValueDisplay title={`Brand`} value={detailsData?.brand_name} />
            <ValueDisplay title={`Model`} value={model} />
            <ValueDisplay title={`Serial`} value={serialNo} />
          </>
        )}
        <ValueDisplay title={`Username`} value={username} />
        <ValueDisplay
          title={`Password`}
          value={password}
          type={`password`}
          className={`bg-red-100 rounded-lg`}
        />
        <ValueDisplay title={`Accessories`} value={accessories} />
        <ValueDisplay title={`Problem`} value={problem} />
      </div>
    </div>
  );
};

export default JobDetailsVIew;
