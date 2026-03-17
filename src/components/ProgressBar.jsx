import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  const getGradient = (p) => {
    if (p < 30) return "linear-gradient(to top, #ef4444, #f43f5e)";
    if (p < 70) return "linear-gradient(to top, #facc15, #f59e0b)";
    return "linear-gradient(to top, #06b6d4, #3b82f6, #8b5cf6)";
  };

  const gradientStyle = {
    background: getGradient(progress),
    height: `${progress}%`,
    transition: "height 1s ease-in-out",
    width: "100%",
    borderRadius: "9999px",
  };

  const horizontalGradient = {
    background: getGradient(progress),
    width: `${progress}%`,
    transition: "width 1s ease-in-out",
    height: "100%",
    borderRadius: "9999px",
  };

  return (
    <>
      {/* Desktop: vertical sidebar (lg and above) */}
      <div className="hidden lg:flex sticky top-0 self-start h-screen w-24 shrink-0 mr-4 border-r border-gray-100 bg-white/70 backdrop-blur-sm z-20 flex-col items-center py-8">
        <div className="h-[60vh] w-3 bg-gray-200 rounded-full relative overflow-hidden">
          <div
            style={gradientStyle}
            className="absolute bottom-0 left-0 w-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"
          ></div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-gray-800">
            {Math.round(progress)}%
          </span>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
            Application
            <br />
            Progress
          </p>
        </div>
      </div>

      {/* Mobile / Tablet: horizontal bar below form (below lg) */}
      <div className="flex lg:hidden w-full px-4 py-3 flex-col gap-1.5 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Application Progress
          </p>
          <span className="text-sm font-bold text-gray-800">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            style={horizontalGradient}
            className="h-full rounded-full shadow-sm"
          />
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
