"use client";

export default function Button({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-[8px] 
        py-2
        px-3
        transition-all 
        duration-300 
        ease-in-out
        pointer-cursor
        ${className}
      `}
    >
      {children}
    </div>
  );
}
