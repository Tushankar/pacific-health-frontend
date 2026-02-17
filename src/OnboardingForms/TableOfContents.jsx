import React, { useState, useEffect, useRef } from "react";
import SaveNextButton from "../components/common/SaveNextButton";

const TableOfContents = ({ 
  onComplete, 
  savedData, 
  progressCurrent = 0, 
  progressTotal = 1, 
  onFormChange,
  isReadOnly = false,
  onNext,
  ...props 
}) => {
  const chapters = [
    {
      title: "Chapter I - Admission Packet",
      items: [
        "Client Information Form",
        "Service Agreement",
        "Service Agreement Addendum",
        "Service Care Plan",
        "Initial Comprehensive Assessment",
        "Risk Mitigation Plan",
        "Self-Preservation",
        "Medication List",
        "Doctor's Orders",
        "Abnormal Involuntary Movement Scale (AIMS)",
      ],
    },
    {
      title: "Chapter II - Admission Packet (Continued)",
      items: [
        "Client's Rights and Responsibilities",
        "Code of Ethics",
        "Release of Information",
        "Vehicle/ Funds Policy",
        "My Human Rights",
        "Freedom of Choice",
        "Advance Directives",
        "HIPAA/ Confidentiality",
        "Complaints and Grievances",
        "Abuse & Neglect",
      ],
    },
    {
      title: "Chapter III - Tracking",
      items: [
        "ISP/ Training Sign-off",
        "HRST/ Training Sign-off",
        "Behavior Support Plan (BSP) (Optional)",
        "BSP Tracking/Progress Notes (Optional)",
        "Health Care Plan/ Protocols/ Training Sign-Off",
        "Medication Admin. Record (MAR) Training Sign-Off (Optional)",
      ],
    },
    {
      title: "Chapter IV - Documentation",
      items: [
        "Visitor Log",
        "Rights Training/ Monthly Review",
        "Doctor's Appointment Log",
      ],
    },
    {
      title: "Chapter VI - Continuity of Medical Treatment",
      items: [
        "Supervisory Visit Documentation",
        "Annuals (Physical, TB, Dental, Vision)",
      ],
    },
  ];

  // Helper to generate initial state for all items
  const getInitialItemsState = () => {
    const state = {};
    chapters.forEach((chapter, chIdx) => {
      chapter.items.forEach((_, itemIdx) => {
        state[`ch${chIdx}-${itemIdx}`] = {
          yes: false,
          no: false,
          na: false,
          page: "",
        };
      });
    });
    return state;
  };

  const [formData, setFormData] = useState({
    name: "",
    services: {
      cls: false,
      cag: false,
      cai: false,
      sms: false,
      cra: false,
      respite: false,
    },
    items: getInitialItemsState(),
  });

  const handleChange = (field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (service) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service],
      },
    }));
  };

  const handleItemChange = (key, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [key]: {
          ...prev.items[key],
          [field]: value,
        },
      },
    }));
  };

  // Ensure mutual exclusivity for Yes/No/NA if desired, or allow multiple.
  // Usually these are mutually exclusive checkboxes.
  const handleItemCheckboxChange = (key, field) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [key]: {
          ...prev.items[key],
          yes: field === "yes" ? !prev.items[key].yes : false,
          no: field === "no" ? !prev.items[key].no : false,
          na: field === "na" ? !prev.items[key].na : false,
          // Note: The logic above toggles the selected one and unchecks others.
          // If we want simple toggle without forcing others off, replace 'false' with existing value.
          // But typically Yes/No/NA are exclusive.
        },
      },
    }));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      if (form) {
        const index = Array.prototype.indexOf.call(form, e.target);
        if (form.elements[index + 1]) form.elements[index + 1].focus();
      }
    }
  };

  const logData = () => {
    console.log("TableOfContents Data:", formData);
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, [savedData]);

  // Draft save: notify parent when form data changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

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
    <div className="w-full flex justify-center bg-gray-100 min-h-screen p-8 text-black font-sans">
      {/* Paper Container */}
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] relative flex flex-col text-[10px] leading-tight border border-gray-300">
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
        <h1 className="text-xl md:text-2xl font-bold uppercase text-center mb-6">
          TABLE OF CONTENTS
        </h1>

        <div className="flex flex-col gap-4 mb-6 font-bold">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Name:</span>
            <input
              type="text"
              className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onKeyDown={handleEnter}
              readOnly={isReadOnly}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1 w-full">
            <span>Service(s):</span>
            {Object.keys(formData.services).map((service) => (
              <label
                key={service}
                className="flex items-center gap-1 uppercase cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mx-0.5"
                  checked={formData.services[service]}
                  onChange={() => handleServiceChange(service)}
                  disabled={isReadOnly}
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border border-black">
          {/* Header Row */}
          <div className="grid grid-cols-[45%_12%_12%_12%_19%] md:grid-cols-[1fr_60px_60px_60px_80px] border-b border-black font-bold text-center">
            <div className="p-1 border-r border-black flex items-center justify-center"></div>
            <div className="p-1 border-r border-black flex items-center justify-center">
              YES
            </div>
            <div className="p-1 border-r border-black flex items-center justify-center">
              NO
            </div>
            <div className="p-1 border-r border-black flex items-center justify-center">
              N/A
            </div>
            <div className="p-1 flex items-center justify-center">PAGE #</div>
          </div>

          {chapters.map((chapter, chIdx) => (
            <React.Fragment key={chIdx}>
              <div className="bg-[#bc78f0] text-[#f5e211] font-bold text-center p-1 border-b border-black">
                {chapter.title}
              </div>
              {chapter.items.map((doc, itemIdx) => {
                const key = `ch${chIdx}-${itemIdx}`;
                const itemState = formData.items[key] || {
                  yes: false,
                  no: false,
                  na: false,
                  page: "",
                }; // Fallback safe

                return (
                  <div
                    key={key}
                    className="grid grid-cols-[45%_12%_12%_12%_19%] md:grid-cols-[1fr_60px_60px_60px_80px] border-b border-black text-xs md:text-sm"
                  >
                    <div className="p-1 border-r border-black pl-2 flex items-center break-words leading-tight text-left">
                      {doc}
                    </div>
                    <div className="p-1 border-r border-black flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="mx-0.5"
                        checked={itemState.yes}
                        onChange={() => handleItemCheckboxChange(key, "yes")}
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="p-1 border-r border-black flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="mx-0.5"
                        checked={itemState.no}
                        onChange={() => handleItemCheckboxChange(key, "no")}
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="p-1 border-r border-black flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="mx-0.5"
                        checked={itemState.na}
                        onChange={() => handleItemCheckboxChange(key, "na")}
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="p-1 flex items-center justify-center">
                      <input
                        type="text"
                        className="w-full min-w-0 text-center outline-none bg-transparent"
                        value={itemState.page}
                        onChange={(e) =>
                          handleItemChange(key, "page", e.target.value)
                        }
                        onKeyDown={handleEnter}
                        readOnly={isReadOnly}
                      />
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center p-4">
            <SaveNextButton 
              isSubmitting={isSubmitting} 
              onClick={handleSubmit} 
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
