import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const Hipaaprivacy = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    signature: "",
    date: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({ ...prev, ...savedData }));
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = true;
    if (!formData.signature?.trim()) newErrors.signature = true;
    if (!formData.date?.trim()) newErrors.date = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      setTimeout(() => {
        const firstErrorField = document.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          firstErrorField.focus();
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

  const borderStyle = (field) => ({
    outline: "none",
    background: errors[field] ? "#fee2e2" : "transparent",
    borderBottom: errors[field] ? "2px solid #ef4444" : "1px solid black",
    transition: "all 0.2s",
  });

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-12 md:h-16 object-contain mb-2"
              />
              <div className="text-center font-bold text-sm md:text-lg italic">
                HIPAA / Privacy Statement
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 text-justify">
              <p>
                One of the most valuable assets of any home health agency is
                proprietary information about employees, clients, care plans,
                services, and systems. Information that is not public is
                considered proprietary.
              </p>

              <p>
                The nature of the healthcare industry requires, by law, that
                client and employee information is kept confidential. Normal
                business operations, as well as client information, must not be
                discussed outside the office or with persons outside of Pacific
                Health Systems. All employees are responsible for protecting
                proprietary and confidential information from release or misuse
                both during employment and after termination. All staff members
                are informed of Pacific Health Systems policy regarding
                confidentiality and privacy at the time of orientation and on an
                on-going basis. All employees must sign a statement
                acknowledging receipt of the confidentiality policy. Clients and
                contracting agencies are also informed of Pacific Health Systems
                policies regarding confidentiality and disclosure of client and
                employee information.
              </p>

              <p>
                HIPAA, the Health Insurance Portability, and Accountability Act
                of 1996, imposes standards for maintaining the privacy of
                individual identifiable information that we work with, transmit,
                or maintain, regardless of the form. The section of the law
                governing these standards is commonly known as The Privacy Rule.
                All employees may not disclose an individual's Protected Health
                Information (PHI) outside the guidelines set forth in the law.
              </p>

              <p>
                Maintaining confidentiality is a serious responsibility of
                Pacific Health, for without clients and employees, who trust us
                with their sensitive information.
              </p>

              <p className="mt-8">
                I{" "}
                <input
                  className={`w-64 px-2 text-center ${errors.name ? "border-red-500" : ""}`}
                  value={formData.name}
                  onChange={(e) => {
                    handleChange("name", e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  style={borderStyle("name")}
                  readOnly={isReadOnly}
                />{" "}
                <span className="text-red-500 font-bold">*</span> has read and
                fully understand the policy and procedures set forth for
                Confidentiality and HIPAA protecting an individual's private
                records at Pacific Health Systems, Inc.
              </p>
            </div>

            {/* Signatures */}
            <div className="flex items-center gap-2 mb-8">
              <span className="font-bold">Name:</span>
              <input
                type="text"
                name="name"
                className={`flex-1 border-b outline-none px-2 ${errors.name ? "border-red-500 bg-red-50" : "border-black"}`}
                value={formData.name}
                onChange={(e) => {
                  handleChange("name", e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: null }));
                }}
                style={borderStyle("name")}
                readOnly={isReadOnly}
              />
            </div>
            <div className="mt-12 flex justify-between items-end mb-6 gap-4">
              <div className="flex-1">
                <input
                  name="signature"
                  className={`w-full border-b outline-none mb-1 px-2 ${errors.signature ? "border-red-500 bg-red-50" : "border-black"}`}
                  value={formData.signature}
                  onChange={(e) => {
                    handleChange("signature", e.target.value);
                    if (errors.signature)
                      setErrors((prev) => ({ ...prev, signature: null }));
                  }}
                  style={borderStyle("signature")}
                  readOnly={isReadOnly}
                />
                <div className="text-center font-bold text-[8px] md:text-[10px]">
                  Client/ Representative Signature{" "}
                  <span className="text-red-500">*</span>
                </div>
              </div>
              <div className="w-[150px]">
                <input
                  type="date"
                  name="date"
                  className={`w-full border-b outline-none mb-1 px-2 text-center ${errors.date ? "border-red-500" : "border-black"}`}
                  value={formData.date}
                  onChange={(e) => {
                    handleChange("date", e.target.value);
                    if (errors.date)
                      setErrors((prev) => ({ ...prev, date: null }));
                  }}
                  style={borderStyle("date")}
                  readOnly={isReadOnly}
                />
                <div className="text-center font-bold text-[8px] md:text-[10px]">
                  Date <span className="text-red-500">*</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
              1 | Page
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-12 pb-8">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 btn-premium text-white font-sans font-bold tracking-wide transform transition-transform"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 btn-premium-red text-white font-sans font-bold tracking-wide transform transition-transform"
                  onClick={() => {
                    window.location.href = "/my-application";
                  }}
                >
                  Exit Application
                </button>
              </div>
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
    </div>
  );
};

export default Hipaaprivacy;

