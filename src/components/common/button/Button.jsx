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
             transition-all duration-300
        ${bg ? bg : `bg-blue-600 hover:bg-blue-700 text-white`}
        ${fg}
        ${mg}
        ${wfull ? `w-full` : `w-fit`}
        ${pd ? pd : `px-4 py-2`}
        ${disabled && "opacity-75"}
        ${rounded ? rounded : `rounded-xl`}`;

  if (link) {
    return (
      <Link href={link || `#`} className={baseStyles}>
        {name || `Button`}
      </Link>
    );
  } else {
    return (
      <button className={baseStyles} onClick={click} disabled={disabled}>
        {name || `Button`}
      </button>
    );
  }
};

export default Button;
