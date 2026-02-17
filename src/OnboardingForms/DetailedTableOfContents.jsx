import React, { useState, useEffect, useRef } from "react";
import SaveNextButton from "../components/common/SaveNextButton";

const DetailedTableOfContents = ({ onComplete, savedData, progressCurrent = 0, progressTotal = 1, onFormChange, isReadOnly = false, onNext, ...props }) => {
  const chapters = [
    {
      title: "Chapter I - Admission Packet-Nursing",
      rows: [
        {
          name: "Client Information Form",
          number: "1",
          desc: "Provide a placeholder for user to enter data in this form",
        },
        {
          name: "Service Agreement",
          number: "2",
          desc: "Make a fillable form",
        },
        {
          name: "Service Agreement Addendum",
          number: "3",
          desc: "Make a fillable form",
        },
        {
          name: "Service Care Plan",
          number: "4",
          desc: "Make a fillable form",
        },
        {
          name: "Initial Comprehensive Assessment",
          number: "5",
          desc: "Make a fillable form",
        },
        {
          name: "Risk Mitigation Plan",
          number: "6",
          desc: "Make a fillable form",
        },
        {
          name: "Self-Preservation",
          number: "7",
          desc: "Make a fillable form",
        },
        { name: "Medication List", number: "8", desc: "Make a fillable form" },
        {
          name: "Doctor's Orders",
          number: "9",
          desc: "Provide opportunity to upload form",
        },
        {
          name: "Abnormal Involuntary Movement Scale (AIMS)",
          number: "10",
          desc: "Provide opportunity to upload form",
        },
      ],
    },
    {
      title: "Chapter II - Admission Packet-Others",
      rows: [
        {
          name: "Client's Rights and Responsibilities",
          number: "11",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
        {
          name: "Code of Ethics",
          number: "12",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
        {
          name: "Release of Information",
          number: "13",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
        {
          name: "Vehicle/ Funds Policy",
          number: "14",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
        {
          name: "My Human Rights (Claudia to supply the most recent form)",
          number: "15",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
        {
          name: "Freedom of Choice (Provide opportunity to upload)",
          number: "16",
          desc: "Provide opportunity to upload form",
        },
        {
          name: "Advance Directives (Give opportunity to upload)",
          number: "17",
          desc: "Provide opportunity to upload form",
        },
        {
          name: "HIPAA/ Confidentiality",
          number: "18",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
        {
          name: "Complaints and Grievances",
          number: "19",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
        {
          name: "Abuse & Neglect",
          number: "20",
          desc: "Present the information in this form to the user to sign at the bottom",
        },
      ],
    },
    {
      title: "Chapter III - Tracking",
      extraText: "These forms are after onboarding",
      extraTextColor: "text-red-600",
      rows: [
        { name: "ISP/ Training Sign-off", number: "21", desc: "" },
        { name: "HRST/ Training Sign-off", number: "22", desc: "" },
        {
          name: "Behavior Support Plan (BSP)-(Optional)",
          number: "23",
          desc: "",
        },
        {
          name: "BSP Tracking/Progress Notes (Optional)",
          number: "24",
          desc: "",
        },
        {
          name: "Health Care Plan/ Protocols/ Training Sign-Off",
          number: "25",
          desc: "",
        },
        {
          name: "Medication Admin. Record (MAR)Training Sign-Off (Optional)",
          number: "26",
          desc: "",
        },
      ],
    },
    {
      title: "Chapter IV - Documentation",
      rows: [
        { name: "Visitor Log", number: "27", desc: "" },
        { name: "Rights Training/ Monthly Review", number: "28", desc: "" },
        { name: "Doctor's Appointment Log", number: "29", desc: "" },
        {
          name: "Chapter VI- Continuity of Medical Treatment",
          number: "",
          desc: "",
        },
        { name: "Supervisory Visit Documentation", number: "30", desc: "" },
        {
          name: "Annuals (Physical, TB, Dental, Vision)",
          number: "31",
          desc: "",
        },
      ],
    },
  ];

  const [formData, setFormData] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      [key]: file ? file.name : "", // Store filename for now, typically you'd handle file upload separately
    }));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Simple focus next input logic
      const form = e.target.form;
      if (form) {
        const index = Array.prototype.indexOf.call(form, e.target);
        if (form.elements[index + 1]) {
          form.elements[index + 1].focus();
        }
      }
    }
  };

  const logData = () => {
    console.log("DetailedTableOfContents Data:", formData);
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, [savedData]);
  // Draft save: notify parent when formData changes after user interaction
  // Draft save: notify parent when form data changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

  // Track user interaction on any input

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

  const renderInput = (desc, chapterIndex, rowIndex) => {
    const key = `c${chapterIndex}r${rowIndex}`;
    const commonProps = {
      name: key,
      className:
        "w-full bg-transparent border-b border-black outline-none min-w-0 flex-shrink",
      onKeyDown: handleEnter,
      // Using type="text" for most inputs to ensure consistent styling
    };

    if (!desc) {
      return (
        <input
          type="text"
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          {...commonProps}
        />
      );
    }

    const lowerDesc = desc.toLowerCase();

    if (lowerDesc.includes("upload")) {
      return (
        <div className="flex items-center w-full">
          <input
            type="file"
            className="text-[9px] w-full min-w-0"
            name={key}
            onChange={(e) => handleFileChange(key, e.target.files[0])}
          />
        </div>
      );
    } else if (lowerDesc.includes("sign")) {
      return (
        <input
          type="text"
          placeholder="Sign/Date"
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          {...commonProps}
        />
      );
    } else if (
      lowerDesc.includes("placeholder") ||
      lowerDesc.includes("enter data")
    ) {
      return (
        <input
          type="text"
          placeholder="Enter Data"
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          {...commonProps}
        />
      );
    } else if (lowerDesc.includes("fillable")) {
      return (
        <input
          type="text"
          placeholder="Fillable"
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          {...commonProps}
        />
      );
    } else {
      return (
        <input
          type="text"
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          {...commonProps}
        />
      );
    }
  };

  return (
    <div className="w-full bg-white text-black font-serif flex justify-center mt-4 mb-8">
      {/* Paper Container */}
      <div className="w-[98%] md:w-[85%] lg:w-[60%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug">
        {/* Log Data Button */}
        <div className="mt-4 flex justify-end no-print">
          <button
            type="button"
            onClick={logData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Log Data
          </button>
        </div>

        {/* Header */}
        <h1 className="text-sm md:text-lg font-bold uppercase text-center mb-6">
          TABLE OF CONTENTS
        </h1>

        {/* Table */}
        <form className="border border-black">
          {chapters.map((chapter, chapterIndex) => (
            <React.Fragment key={chapterIndex}>
              {/* Chapter Header */}
              <div className="grid grid-cols-[50%_10%_40%] border-b border-black font-bold">
                <div className="bg-yellow-400 p-1 border-r border-black flex items-center justify-between px-2">
                  <span>{chapter.title}</span>
                </div>
                <div className="bg-yellow-400 p-1 border-r border-black text-center flex items-center justify-center">
                  PAGE #
                </div>
                <div className="p-1 flex items-center justify-center bg-gray-300 md:bg-transparent">
                  {chapter.extraText && (
                    <span
                      className={`${chapter.extraTextColor} text-[8px] md:text-xs leading-none`}
                    >
                      {chapter.extraText}
                    </span>
                  )}
                </div>
              </div>

              {/* Column Headers */}
              {chapterIndex === 0 && (
                <div className="grid grid-cols-[50%_10%_40%] border-b border-black font-bold bg-gray-300 text-center">
                  <div className="p-1 border-r border-black">
                    Form Description
                  </div>
                  <div className="p-1 border-r border-black">Number</div>
                  <div className="p-1">Design Description</div>
                </div>
              )}

              {/* Rows */}
              {chapter.rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-[50%_10%_40%] border-b border-black text-[9px] md:text-sm min-h-[30px]"
                >
                  <div className="p-1 border-r border-black pl-2 flex items-center">
                    {row.name}
                  </div>
                  <div className="p-1 border-r border-black text-center flex items-center justify-center">
                    {row.number}
                  </div>
                  <div className="p-1 pl-2 flex items-center w-full">
                    {renderInput(row.desc, chapterIndex, rowIndex)}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          <div className="flex justify-center p-4">
            <SaveNextButton 
              isSubmitting={isSubmitting} 
              onClick={handleSubmit} 
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailedTableOfContents;
