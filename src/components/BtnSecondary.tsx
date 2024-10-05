import React from "react";

interface BtnProps {
  borderColor: string;
  textColor: string;
  label: string;
  onClick?: () => void;
}

const BtnSecondary: React.FC<BtnProps> = ({
  borderColor,
  textColor,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-block px-3 relative top-0 left-0 py-2 transition-all duration-100 border-2 ${borderColor} bg-background ${textColor}
              hover:top-[-2px] hover:left-[-2px]
              after:content-[''] after:absolute after:${borderColor} after:-z-10 after:border-2 after:h-full after:w-full after:transition-all after:duration-300 after:top-0 after:left-0 
              hover:after:translate-x-[6px] hover:after:translate-y-[6px]`}
    >
      {label}
    </button>
  );
};

export default BtnSecondary;
