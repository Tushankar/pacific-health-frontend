import React from "react";

/**
 * Premium Save & Next button with professional loading animation.
 * Used across all onboarding forms for a consistent experience.
 */
const SaveNextButton = ({
  onClick,
  isSubmitting = false,
  type = "button",
  label = "Save & Next",
  isReadOnly = false,
  onNext,
}) => {
  if (isReadOnly) {
    return (
      <button
        type="button"
        className="relative w-full sm:w-auto px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide transform transition-all duration-300 overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
        onClick={onNext}
      >
        <span className="flex items-center justify-center gap-2.5">
          <span className="relative text-xs uppercase tracking-wider">
            Next Document
          </span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={isSubmitting}
      className={`
        relative w-full sm:w-auto px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide
        transform transition-all duration-300 overflow-hidden
        ${isSubmitting ? "opacity-90 cursor-not-allowed scale-[0.98]" : "hover:scale-[1.02] active:scale-[0.98]"}
      `}
      onClick={!isSubmitting ? onClick : undefined}
    >
      {/* Shimmer sweep effect while loading */}
      {isSubmitting && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: "shimmerSweep 1.5s ease-in-out infinite",
            }}
          />
        </div>
      )}

      <span
        className={`flex items-center justify-center gap-2.5 transition-all duration-300 ${isSubmitting ? "opacity-100" : ""}`}
      >
        {isSubmitting && (
          <>
            {/* Spinning ring */}
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </>
        )}

        <span className="relative">{isSubmitting ? "Saving..." : label}</span>

        {!isSubmitting && (
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        )}
      </span>

      {/* Inline keyframes for shimmer */}
      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
};

export default SaveNextButton;
