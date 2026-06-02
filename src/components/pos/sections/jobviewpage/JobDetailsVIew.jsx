"use client";
import Button from "@/components/common/button/Button";
import NextInput from "@/components/common/form/nextinput/NextInput";
import ValueDisplay from "@/components/common/valuedisplay/ValueDisplay";
import { useJOBStore } from "@/store/jobStore";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

const JobDetailsVIew = ({ detailsData, headerData }) => {
  const jobId = useJOBStore((state) => state.jobId);
  const warranty = useJOBStore((state) => state.warranty);
  const model = useJOBStore((state) => state.model);
  const serialNo = useJOBStore((state) => state.serialNo);
  const username = useJOBStore((state) => state.username);
  const password = useJOBStore((state) => state.password);
  const accessories = useJOBStore((state) => state.accessories);
  const problem = useJOBStore((state) => state.problem);
  const setHeaderField = useJOBStore((state) => state.setHeaderField);
  const state = useJOBStore((state) => state.state);
  const section = useJOBStore((state) => state.section);

  useEffect(() => {
    setHeaderField(`jobId`, headerData?.id);
    setHeaderField(`jobNo`, headerData?.job_no);
    setHeaderField(`warranty`, headerData?.warranty ? true : false);
    setHeaderField(`state`, headerData?.state);
    setHeaderField(`created_at`, headerData?.created_at);

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
    <div className="perspective-[2000px] z-50">
      <div
        className={`relative duration-700 transform-style-preserve-3d ${
          section == "HEADER" ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT */}
        <div className="backface-hidden">
          <div className="relative rounded-xl p-4 bg-white shadow-md grid grid-cols-2 gap-4">
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

            {(state !== 3 || state !== 4) && (
              <Button
                rounded={`rounded-lg absolute top-4 right-4`}
                bg={`bg-amber-500 text-white hover:bg-amber-600`}
                name={<Pencil size={20} />}
                pd={`px-2 py-2`}
                click={() => setHeaderField(`section`, `HEADER`)}
              />
            )}
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden">
          <div className="rounded-xl p-4 bg-blue-200 shadow-md min-h-full ">
            <div className="grid grid-cols-2 gap-4">
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
              <Button
                rounded={`rounded-lg`}
                bg={`bg-red-500 text-white hover:bg-red-600`}
                name={<X size={20} />}
                pd={`px-2 py-2`}
                click={() => setHeaderField(`section`, `ITEMS`)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsVIew;
