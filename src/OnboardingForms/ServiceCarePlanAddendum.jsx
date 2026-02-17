import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import SaveNextButton from "../components/common/SaveNextButton";

const ServiceCarePlanAddendum = ({ 
  onComplete, 
  savedData, 
  progressCurrent = 0, 
  progressTotal = 1, 
  onFormChange,
  isReadOnly = false,
  onNext
}) => {
  // State management for form data
  const [formData, setFormData] = useState([
    { change: "", reason: "", date: "", acknowledgement: "" },
    { change: "", reason: "", date: "", acknowledgement: "" },
    { change: "", reason: "", date: "", acknowledgement: "" },
    { change: "", reason: "", date: "", acknowledgement: "" },
  ]);

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
    <div className="w-full flex justify-center bg-white min-h-screen mt-4 mb-8 text-black font-sans">
      {/* Paper Container */}
      <form
        onSubmit={handleSubmit}
        className="w-[98%] md:w-[85%] lg:w-[90%] p-2 md:p-12 text-[9px] md:text-base leading-snug flex flex-col items-center"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 w-full">
          <div className="flex items-center gap-4 mb-8">
            {/* Logo image */}
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-20 object-contain"
            />
          </div>

          <h2 className="text-xl font-bold text-black mb-4">
            Addendum to Service Care Plan
          </h2>
          <p className="italic font-bold text-sm text-center max-w-lg">
            This form should be completed when there are revisions to the
            original service care plan.
          </p>
        </div>

        {/* Table Section */}
        <div className="w-full border-2 border-black mb-6">
          {/* Table Header */}
          <div className="grid grid-cols-4 border-b border-black font-bold text-sm">
            <div className="border-r border-black p-2 h-full flex items-center">
              Specific Change to be Made
            </div>
            <div className="border-r border-black p-2 h-full flex items-center">
              Reason for Change/Type of Service
            </div>
            <div className="border-r border-black p-2 h-full flex items-center">
              Date Change to Begin
            </div>
            <div className="p-2 h-full flex items-center">
              Client Acknowledgement
            </div>
          </div>

          {/* Table Rows (4 large rows as per image) */}
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="grid grid-cols-4 border-b border-black last:border-b-0 h-32"
            >
              <textarea
                className="border-r border-black p-2 resize-none outline-none focus:bg-blue-50 h-full w-full"
                value={formData[index].change}
                onChange={(e) => handleChange(index, "change", e.target.value)}
                readOnly={isReadOnly}
              />
              <textarea
                className="border-r border-black p-2 resize-none outline-none focus:bg-blue-50 h-full w-full"
                value={formData[index].reason}
                onChange={(e) => handleChange(index, "reason", e.target.value)}
                readOnly={isReadOnly}
              />
              <textarea
                className="border-r border-black p-2 resize-none outline-none focus:bg-blue-50 h-full w-full"
                value={formData[index].date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
                readOnly={isReadOnly}
              />
              <textarea
                className="p-2 resize-none outline-none focus:bg-blue-50 h-full w-full"
                value={formData[index].acknowledgement}
                onChange={(e) =>
                  handleChange(index, "acknowledgement", e.target.value)
                }
                readOnly={isReadOnly}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
            <SaveNextButton 
              isSubmitting={isSubmitting} 
              type="submit" 
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
        </div>
        {/* Submit Button */}
      </form>
    </div>
  );
};

export default ServiceCarePlanAddendum;
