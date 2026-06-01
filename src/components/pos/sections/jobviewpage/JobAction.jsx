"use client";
import Button from "@/components/common/button/Button";
import { useJOBStore } from "@/store/jobStore";
import React from "react";

const JobAction = () => {
  const section = useJOBStore((state) => state.section);
  return (
    <div>
      <Button
        name={
          section == "HEADER"
            ? `Save Header`
            : section == `ITEMS`
              ? `Save Items`
              : `Error`
        }
      />
    </div>
  );
};

export default JobAction;
