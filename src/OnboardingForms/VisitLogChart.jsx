import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import SaveNextButton from "../components/common/SaveNextButton";

import ProgressBar from "../components/ProgressBar";

const VisitLogChart = ({ 
  onComplete, 
  savedData, 
  progressCurrent = 0, 
  progressTotal = 1, 
  onFormChange,
  isReadOnly = false,
  onNext
}) => {
  // Create an array for the rows to render
  const rows = Array.from({ length: 25 });

  // State management for form data
  const [formData, setFormData] = useState(
    rows.map(() => ({ date: "", name: "", title: "", purpose: "" })),
  );

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (index, field, value) => {
    if (isReadOnly) return;
    const updatedData = [...formData];
    updatedData[index][field] = value;
    setFormData(updatedData);
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData(savedData);
    }
  }, [savedData]);

  // Draft save: notify parent when form data changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

  // Handle form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;
    
    // Visit Log doesn't typically have strict required fields for every row, 
    // but we can ensure standard behavior.
    
    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(formData);
      } else {
        console.log("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-start bg-white text-black font-serif">
      <div className="sticky top-0 self-start hidden md:flex flex-col items-center py-8 shrink-0 bg-white/50 backdrop-blur-sm z-10 h-screen">
        <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />
      </div>

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <form
          onSubmit={handleSubmit}
          className="w-[98%] md:w-[85%] lg:w-[90%] p-2 md:p-12 text-[9px] md:text-base leading-snug flex flex-col shadow-lg rounded-lg bg-white"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-4 mb-2">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-20 object-contain"
              />
            </div>

            <h2 className="text-xl font-bold uppercase mt-6 mb-2 text-black">
              Visit Log Chart
            </h2>
          </div>

          {/* Table Section */}
          <div className="w-full border-2 border-black mb-6">
            <div className="grid grid-cols-12 border-b border-black font-bold text-center text-sm">
              <div className="col-span-2 border-r border-black p-1">Date</div>
              <div className="col-span-4 border-r border-black p-1">Name</div>
              <div className="col-span-2 border-r border-black p-1">Title</div>
              <div className="col-span-4 p-1">Purpose of Visit</div>
            </div>

            {rows.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-12 border-b border-black text-sm h-8"
              >
                <input
                  className="col-span-2 border-r border-black p-1 focus:bg-blue-50 outline-none h-full w-full"
                  type="text"
                  value={formData[index]?.date || ""}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  readOnly={isReadOnly}
                />
                <input
                  className="col-span-4 border-r border-black p-1 focus:bg-blue-50 outline-none h-full w-full"
                  type="text"
                  value={formData[index]?.name || ""}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  readOnly={isReadOnly}
                />
                <input
                  className="col-span-2 border-r border-black p-1 focus:bg-blue-50 outline-none h-full w-full"
                  type="text"
                  value={formData[index]?.title || ""}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  readOnly={isReadOnly}
                />
                <input
                  className="col-span-4 p-1 focus:bg-blue-50 outline-none h-full w-full"
                  type="text"
                  value={formData[index]?.purpose || ""}
                  onChange={(e) => handleChange(index, "purpose", e.target.value)}
                  readOnly={isReadOnly}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex justify-between items-center mt-12">
            <button
              type="button"
              className="px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide transform transition-transform"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              type="button"
              className="px-8 py-3 btn-premium-red text-white font-sans font-bold tracking-wide transform transition-transform"
              onClick={() => { window.location.href = "/my-application"; }}
            >
              Exit Application
            </button>
            <SaveNextButton 
              isSubmitting={isSubmitting} 
              type="submit" 
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitLogChart;
