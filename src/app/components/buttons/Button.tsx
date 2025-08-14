import React from "react";

type ButtonProps = {
  label: string;
  className?: string;
  onClick?: () => void | Promise<void> | undefined;
  type?: 'submit' | 'reset' | 'button' | undefined;
  disabled?: boolean;
};



export default function Button({ label, onClick, className, type }: ButtonProps) {
  return (
    <button onClick={onClick} type={type} className={`bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-xl ${className}`}>
      {label}
    </button>
  );
}