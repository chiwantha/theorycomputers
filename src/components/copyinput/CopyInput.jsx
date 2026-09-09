"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CopyInput = ({ value, displayValue, textClass = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`text-gray-500 font-bold tracking-tighter text-xl whitespace-nowrap pr-10 ${textClass}`}
      >
        {displayValue ?? value ?? ""}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy"}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 
        hover:scale-115 hover:text-blue-600 active:scale-95 transition-all duration-300"
      >
        {copied ? (
          <Check size={17} className="text-green-600" strokeWidth={2.5} />
        ) : (
          <Copy size={17} />
        )}
      </button>
    </div>
  );
};

export default CopyInput;
