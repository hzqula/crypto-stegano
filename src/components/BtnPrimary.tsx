import React from "react";

interface BtnProps {
  bgColor: string;
  borderColor: string;
  label: string;
  onClick?: () => void;
}

const BtnPrimary: React.FC<BtnProps> = ({
  bgColor,
  borderColor,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-block w-full py-2 px-4 transition-all font-text text-sm text-background font-semibold duration-300 relative text-center ${bgColor}
      hover:translate-x-[-2px] hover:translate-y-[-2px]
      after:content-[''] after:absolute after:${borderColor} after:-z-10 after:border-2 after:h-full after:w-full after:transition-all after:duration-300 after:top-0 after:left-0 
      hover:after:translate-x-[4px] hover:after:translate-y-[4px]`}
    >
      {label}
    </button>
  );
};

export default BtnPrimary;
