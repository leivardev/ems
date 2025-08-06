import React from "react";

type ButtonProps = {
  label: string;
  className?: string;
  onClick: () => void;
};



export default function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-xl ${className}`}>
      {label}
    </button>
  );
}