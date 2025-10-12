  "use client";

  export default function Card({ children, className = "" }) {
    return (
      <div
        className={`
          bg-white 
          border border-none 
          rounded-[8px] 
          p-3
          shadow-sm
          transition-all 
          duration-300 
          ease-in-out 
          hover:shadow-lg 
          hover:-translate-y-1 
          active:scale-[0.98]
          sm:p-4 
          sm:shadow-md 
          ${className}
        `}
      >
        {children}
      </div>
    );
  }
