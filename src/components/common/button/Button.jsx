import Link from "next/link";
import React from "react";

const Button = ({
  name,
  link,
  click,
  bg,
  fg,
  mg,
  pd,
  wfull,
  rounded,
  disabled,
}) => {
  const baseStyles = `
    transition-all duration-300 select-none
    ${bg ? bg : `bg-blue-600 hover:bg-blue-700 text-white`}
    ${fg || ""}
    ${mg || ""}
    ${wfull ? `w-full` : `w-fit`}
    ${pd ? pd : `px-4 py-2`}
    ${disabled ? "opacity-75 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
    ${rounded ? rounded : `rounded-xl`}
  `;

  if (link) {
    return (
      <Link
        href={disabled ? "#" : link}
        className={baseStyles}
        aria-disabled={disabled}
      >
        {name || "Button"}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseStyles}
      onClick={!disabled ? click : undefined}
      disabled={disabled}
    >
      {name || "Button"}
    </button>
  );
};

export default Button;
