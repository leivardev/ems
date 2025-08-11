import React from "react";

type ButtonProps = {
  label: string;
  className?: string;
  onClick?: () => void | Promise<void>; // <-- allow async function
  type?: 'submit' | 'reset' | 'button';
};

export default function Button({ label, onClick, className = "", type = "button" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-xl ${className}`}
    >
      {label}
    </button>
  );
}
