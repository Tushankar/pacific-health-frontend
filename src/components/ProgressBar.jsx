import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  // Determine color based on progress (example logic)
  let colorClass = "bg-blue-600";
  if (progress < 30) {
    colorClass = "bg-red-500";
  } else if (progress < 70) {
    colorClass = "bg-yellow-500";
  } else {
    colorClass = "bg-green-500";
  }
    // Override for a specific "professional" blue look if preferred, but user asked for "different color for different percentage"
    // So I will stick to the logic above or a gradient.
    // Let's use a gradient for a more "professional" look that shifts hue.
    
    const getGradient = (p) => {
        if (p < 30) return "linear-gradient(to top, #ef4444, #f43f5e)"; // Red to Rose
        if (p < 70) return "linear-gradient(to top, #facc15, #f59e0b)"; // Yellow to Amber
        return "linear-gradient(to top, #06b6d4, #3b82f6, #8b5cf6)"; // Cyan to Blue to Purple
    };

    const gradientStyle = {
        background: getGradient(progress),
        height: `${progress}%`,
        transition: 'height 1s ease-in-out',
        width: '100%',
        borderRadius: '9999px',
    };

  return (
    <div className="flex flex-col items-center py-8 sticky top-0 self-start hidden md:flex shrink-0 w-24 border-r border-gray-100 mr-4">
      <div className="h-[60vh] w-3 bg-gray-200 rounded-full relative overflow-hidden">
         {/* Fixed height for the bar track itself */}
        <div style={gradientStyle} className="absolute bottom-0 left-0 w-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"></div>
      </div>
      <div className="mt-4 text-center">
        <span className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</span>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Application<br/>Progress</p>
      </div>
    </div>
  );
};

export default ProgressBar;
