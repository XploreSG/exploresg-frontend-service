import React from "react";

const InlineLogoLoader: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <img
        src="/icon_s.png"
        alt="ExploreSG logo"
        style={{ width: size, height: size }}
        className="animate-bounce-logo rounded-full bg-white p-4 shadow-xl shadow-red-800"
      />
    </div>
  );
};

export default InlineLogoLoader;
