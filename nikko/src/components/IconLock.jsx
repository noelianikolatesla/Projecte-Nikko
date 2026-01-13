import React from "react";
function IconLock({ size = 25, color = "#2f6fed" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {" "}
      <path
        d="M7.5 10V8.2a4.5 4.5 0 0 1 9 0V10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />{" "}
      <path
        d="M6.6 10h10.8c.9 0 1.6.7 1.6 1.6v7.2c0 .9-.7 1.6-1.6 1.6H6.6c-.9 0-1.6-.7-1.6-1.6v-7.2c0-.9.7-1.6 1.6-1.6Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />{" "}
      <path
        d="M12 14v3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />{" "}
    </svg>
  );
}
export default IconLock;
