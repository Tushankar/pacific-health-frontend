import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.jpg";
import bodyDiagram from "../assets/body_diagram.png";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const SkinIntegrityForm = ({ 
  onComplete, 
  savedData, 
  progressCurrent = 0, 
  progressTotal = 1, 
  onFormChange,
  isReadOnly = false,
  onNext
}) => {
  const [formData, setFormData] = useState({
    clientInfo: {
      name: "",
      date: "",
      staffName: "",
      timeShift: "",
      skinIntact: "",
      skinNotIntact: "",
    },
    description: {
      markOnBody: false,
      broken: false,
      scratched: false,
      lesions: false,
      ulcers: false,
      other: false,
      otherText: "",
    },
    color: {
      normal: false,
      pink: false,
      red: false,
      purpleBlue: false,
      yellow: false,
      black: false,
    },
    size: {
      quarter: false,
      dime: false,
      nickel: false,
      other: false,
      otherText: "",
    },
    assistance: {
      ambulation: { yes: "", no: "" },
      transfer: { yes: "", no: "" },
      toileting: { yes: "", no: "" },
    },
    status: {
      independent: "",
      dependent: "",
      continence: "",
      incontinence: "",
    },
    comments: "",
  });

  const handleChange = (section, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: { ...prev[section][subsection], [field]: value },
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
    console.log("SkinIntegrityForm Data:", formData);
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientInfo.name?.trim()) newErrors.name = true;
    if (!formData.clientInfo.date?.trim()) newErrors.date = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in the client name and date.");
      setTimeout(() => {
        const firstErrorField = document.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (firstErrorField.tagName === "INPUT") firstErrorField.focus();
        }
      }, 100);
      return;
    }

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

  const getStyle = (field) => ({
    outline: "none",
    background: errors[field] ? "#fee2e2" : "transparent",
    borderBottom: errors[field] ? "2px solid #ef4444" : "1px solid black",
    transition: "all 0.2s"
  });

  const RequiredStar = () => <span className="text-red-500 ml-1 font-bold">*</span>;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center bg-gray-100 min-h-screen p-8 text-black font-sans gap-8"
    >
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] relative flex flex-col text-[10px] leading-tight">
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
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Pacific Health Systems Logo"
            className="h-16 md:h-20 object-contain mb-2"
          />
          <h1 className="text-xl md:text-2xl font">Skin Integrity Form</h1>
        </div>

        <div className="flex flex-col gap-4 mb-6 text-[9px] md:text-sm">
           <div className="flex items-end">
              <span className="font-bold mr-2 whitespace-nowrap">Client Name: <RequiredStar /></span>
              <input 
                type="text"
                value={formData.clientInfo.name}
                onChange={(e) => {
                    handleChange("clientInfo", "name", e.target.value);
                    if(errors.name) setErrors(prev => ({...prev, name: null}));
                }}
                style={getStyle("name")}
                className={`flex-grow ${errors.name ? "border-red-500" : ""}`}
                readOnly={isReadOnly}
              />
           </div>
           <div className="flex items-end">
              <span className="font-bold mr-2 whitespace-nowrap">Date: <RequiredStar /></span>
              <input 
                type="date"
                value={formData.clientInfo.date}
                onChange={(e) => {
                    handleChange("clientInfo", "date", e.target.value);
                    if(errors.date) setErrors(prev => ({...prev, date: null}));
                }}
                style={getStyle("date")}
                className={`w-36 ${errors.date ? "border-red-500" : ""}`}
                readOnly={isReadOnly}
              />
           </div>
        </div>
        <div>Test Content</div>
        <div className="mt-8 flex justify-center">
            <SaveNextButton 
              isSubmitting={isSubmitting} 
              type="submit" 
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
        </div>
      </div>
    </form>
  );
};

export default SkinIntegrityForm;
