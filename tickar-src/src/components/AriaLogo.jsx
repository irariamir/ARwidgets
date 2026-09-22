import React from 'react';

export function AriaLogo({ className = "w-10 h-10", rounded = "rounded-2xl" }) {
  return (
    <div className={`relative overflow-hidden ${rounded} ${className} shadow-md shrink-0 flex items-center justify-center bg-[#073821]`}>
      <img
        src="/brand/app-logo.png"
        alt="TickAR Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
