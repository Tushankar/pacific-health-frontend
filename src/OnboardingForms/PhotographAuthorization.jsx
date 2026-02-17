import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const PhotographAuthorization = ({ onComplete, savedData, progressCurrent = 0, progressTotal = 1, onFormChange, isReadOnly = false, onNext }) => {
  const [formData, setFormData] = useState({
    name: "",
    agree: false,
    disagree: false,
    clientPrintName: "",
    clientPrintDate: "",
    clientSignature: "",
    clientSignatureDate: "",
    representative: "",
    representativeDate: "",
  });

  const handleChange = (field, value) => {
    if (isReadOnly) return;
    // Handle checkbox logic - only one can be checked
    if (field === "agree" && value) {
      setFormData({ ...formData, agree: true, disagree: false });
    } else if (field === "disagree" && value) {
      setFormData({ ...formData, agree: false, disagree: true });
    } else {
      setFormData({ ...formData, [field]: value });
    }
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
    if (!formData.name?.trim()) newErrors.name = true;
    if (!formData.agree && !formData.disagree) newErrors.consent = true;
    if (!formData.clientPrintName?.trim()) newErrors.clientPrintName = true;
    if (!formData.clientPrintDate?.trim()) newErrors.clientPrintDate = true;
    if (!formData.clientSignature?.trim()) newErrors.clientSignature = true;
    if (!formData.clientSignatureDate?.trim()) newErrors.clientSignatureDate = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in all required fields and select a consent option.");
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

  const borderStyle = (field) => ({
    outline: "none",
    background: errors[field] ? "#fee2e2" : "transparent",
    borderBottom: errors[field] ? "2px solid #ef4444" : "1px solid black",
    transition: "all 0.2s"
  });

  const RequiredStar = () => <span className="text-red-500 ml-1 font-bold">*</span>;

  return (
    <div className="w-full flex justify-center bg-white min-h-screen mt-4 mb-8 text-black font-sans">
      {/* Paper Container */}
      <form
        onSubmit={handleSubmit}
        className="w-[98%] md:w-[85%] lg:w-[90%] p-2 md:p-12 text-[9px] md:text-base leading-snug"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-20 object-contain"
            />
          </div>
          <div className="text-center font-bold uppercase text-lg">
            PHOTOGRAPH AUTHORIZATION
          </div>
        </div>

        {/* Body Text */}
        <div className="space-y-6 text-justify mb-8">
          <p>
            I,{" "}
            <input
              className={`w-64 px-2 ${errors.name ? "border-red-500" : ""}`}
              value={formData.name}
              onChange={(e) => {
                handleChange("name", e.target.value);
                if(errors.name) setErrors(prev => ({...prev, name: null}));
              }}
              style={borderStyle("name")}
              readOnly={isReadOnly}
            />
            <RequiredStar /> , I hereby grant Pacific Health Systems, LLC permission to use my
            likeness in a photograph, video, or other digital media ("photo") in
            their publications, including web-based publications, without
            payment or other consideration.
          </p>
          <p>
            I understand and agree that all photos will become the property of
            Pacific Health Systems, LLC and can be duplicated if requested.
          </p>
          <p>
            I hereby irrevocably authorize Pacific Health Systems, LLC to edit,
            alter, copy, exhibit, publish, or distribute these photos for any
            lawful purpose. In addition, I waive any right to inspect or approve
            the finished product wherein my likeness appears. Additionally, I
            waive any right to royalties or other compensation arising or
            related to the use of the photo.
          </p>
          <p>
            I hereby hold harmless, release, and forever discharge Pacific
            Health Systems, LLC from all claims, demands, and causes of action
            which I, my heirs, representatives, executors, administrators, or
            any other persons acting on my behalf or on behalf of my estate have
            or may have by reason of this authorization.
          </p>
          <p className="font-bold uppercase">
            I HAVE READ AND UNDERSTAND THE ABOVE PHOTO RELEASE. I AFFIRM THAT I
            HAVE OBTAINED THE REQUIRED CONSENT AS EVIDENCED BELOW.
          </p>
        </div>

        {/* Agreement Checkboxes */}
        <div className={`flex justify-center gap-24 mb-16 font-bold p-4 rounded-lg transition-all ${errors.consent ? "bg-red-50 border-2 border-red-500 border-dashed" : ""}`}>
          <label className="flex items-center gap-2 uppercase cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={formData.agree}
              onChange={(e) => {
                handleChange("agree", e.target.checked);
                if(errors.consent) setErrors(prev => ({...prev, consent: null}));
              }}
              disabled={isReadOnly}
            />{" "}
            Agree
          </label>
          <label className="flex items-center gap-2 uppercase cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={formData.disagree}
              onChange={(e) => {
                handleChange("disagree", e.target.checked);
                if(errors.consent) setErrors(prev => ({...prev, consent: null}));
              }}
              disabled={isReadOnly}
            />{" "}
            Disagree
          </label>
          <RequiredStar />
        </div>

        {/* Signatures */}
        <div className="space-y-12 mt-8 mb-6">
          {/* Row 1 */}
          <div className="flex justify-between items-end gap-16">
            <div className="flex-1">
              <input
                name="clientPrintName"
                className={`w-full border-b outline-none mb-1 ${errors.clientPrintName ? "border-red-500" : "border-black"}`}
                value={formData.clientPrintName}
                onChange={(e) => {
                  handleChange("clientPrintName", e.target.value);
                  if(errors.clientPrintName) setErrors(prev => ({...prev, clientPrintName: null}));
                }}
                style={borderStyle("clientPrintName")}
                readOnly={isReadOnly}
              />
              <div className="text-[13px] font-serif">
                Client/ Responsible Party (Print Name) <RequiredStar />
              </div>
            </div>
            <div className="flex items-end gap-4 w-[200px]">
              <span className="font-serif text-[13px] mb-1">Date <RequiredStar /></span>
              <input
                name="clientPrintDate"
                type="date"
                className={`flex-1 border-b outline-none mb-1 ${errors.clientPrintDate ? "border-red-500" : "border-black"}`}
                value={formData.clientPrintDate}
                onChange={(e) => {
                  handleChange("clientPrintDate", e.target.value);
                  if(errors.clientPrintDate) setErrors(prev => ({...prev, clientPrintDate: null}));
                }}
                style={borderStyle("clientPrintDate")}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex justify-between items-end gap-16">
            <div className="flex-1">
              <input
                name="clientSignature"
                className={`w-full border-b outline-none mb-1 ${errors.clientSignature ? "border-red-500" : "border-black"}`}
                value={formData.clientSignature}
                onChange={(e) => {
                  handleChange("clientSignature", e.target.value);
                  if(errors.clientSignature) setErrors(prev => ({...prev, clientSignature: null}));
                }}
                style={borderStyle("clientSignature")}
                readOnly={isReadOnly}
              />
              <div className="text-[13px] font-serif">
                Client/ Responsible Party (signature) <RequiredStar />
              </div>
            </div>
            <div className="flex items-end gap-4 w-[200px]">
              <span className="font-serif text-[13px] mb-1">Date <RequiredStar /></span>
              <input
                name="clientSignatureDate"
                type="date"
                className={`flex-1 border-b outline-none mb-1 ${errors.clientSignatureDate ? "border-red-500" : "border-black"}`}
                value={formData.clientSignatureDate}
                onChange={(e) => {
                  handleChange("clientSignatureDate", e.target.value);
                  if(errors.clientSignatureDate) setErrors(prev => ({...prev, clientSignatureDate: null}));
                }}
                style={borderStyle("clientSignatureDate")}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex justify-between items-end gap-16">
            <div className="flex-1">
              <input
                type="text"
                name="representative"
                className={`w-full border-b outline-none mb-1 border-black`}
                value={formData.representative}
                onChange={(e) => {
                  handleChange("representative", e.target.value);
                }}
                readOnly={isReadOnly}
              />
              <div className="text-[13px] font-serif">
                RN/ Care Wind Place Representative
              </div>
            </div>
            <div className="flex items-end gap-4 w-[200px]">
              <span className="font-serif text-[13px] mb-1">Date</span>
              <input
                name="representativeDate"
                type="date"
                className="flex-1 border-b border-black outline-none mb-1"
                value={formData.representativeDate}
                onChange={(e) =>
                  handleChange("representativeDate", e.target.value)
                }
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
            <SaveNextButton 
              isSubmitting={isSubmitting} 
              type="submit" 
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
        </div>
      </form>
    </div>
  );
};

export default PhotographAuthorization;
