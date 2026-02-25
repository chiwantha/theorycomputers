"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { LabelStyle } from "@/constant/Forms";

const NextImageInput = ({
  label,
  className, // wrapper div
  imageClassName, // img styling
  onChange, // callback with selected file
  size = 120, // width & height of square
  accept = "image/*",
}) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className={LabelStyle}>{label}</label>}

      <div className="relative">
        {!preview && (
          <label
            htmlFor="next-image-input"
            className={cn(
              "cursor-pointer flex items-center justify-center border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 py-2",
              `w-[${size}px] h-[${size}px]`,
            )}
          >
            <span className="text-gray-400">Click to upload Image</span>
          </label>
        )}

        <input
          type="file"
          id="next-image-input"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {preview && (
          <div
            className={cn(
              "relative rounded-xl overflow-hidden border border-gray-300 max-w-[200px] aspect-square",
              `w-[${size}px] h-[${size}px]`,
            )}
          >
            <img
              src={preview}
              alt="preview"
              className={cn("object-cover w-full h-full", imageClassName)}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 bg-opacity-50 text-white rounded-lg p-1 hover:bg-opacity-70"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextImageInput;
