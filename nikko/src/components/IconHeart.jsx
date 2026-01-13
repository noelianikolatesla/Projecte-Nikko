import React from "react";

function IconHeart({ size = 25, color = "#7c3aed" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.3s-7.6-4.55-9.5-9.2C1.2 7.7 3.3 4.9 6.3 4.6c1.7-.17 3.3.62 4.2 1.92.9-1.3 2.5-2.1 4.2-1.92 3 .3 5.1 3.1 3.8 6.5-1.9 4.65-9.5 9.2-9.5 9.2Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IconHeart;
