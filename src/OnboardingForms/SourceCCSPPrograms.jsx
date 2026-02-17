import React, { useState, useEffect, useRef } from "react";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const SourceCCSPPrograms = ({ 
  onComplete, 
  savedData, 
  progressCurrent = 0, 
  progressTotal = 1, 
  onFormChange,
  isReadOnly = false,
  onNext
}) => {
  const [formData, setFormData] = useState({
    clientInformationForm: "",
    serviceAgreement: "",
    serviceAgreementAddendum: "",
    serviceCarePlan: "",
    medicationList: "",
    comprehensiveAssessment: "",
    rightsSignature: "",
    codeOfEthicsSignature: "",
    supervisoryVisits: "",
    incidenceReportForm: "",
    clientComplaintForm: "",
  });

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = Array.from(
        document.querySelectorAll("input, select, textarea"),
      );
      const index = inputs.indexOf(e.target);
      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
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
    // Marking forms 1 (Client Info) and 7, 8 (Signatures) as required in this log
    if (!formData.clientInformationForm?.trim()) newErrors.clientInformationForm = true;
    if (!formData.rightsSignature?.trim()) newErrors.rightsSignature = true;
    if (!formData.codeOfEthicsSignature?.trim()) newErrors.codeOfEthicsSignature = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in the required form log entries.");
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
    <div className="w-full flex justify-center bg-white min-h-screen mt-4 mb-8 text-black font-sans">
      {/* Paper Container */}
      <form onSubmit={handleSubmit} className="w-[98%] md:w-[85%] lg:w-[90%] p-2 md:p-12 text-[9px] md:text-base leading-snug">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-8 text-center uppercase">
          SOURCE/CCSP PROGRAMS
        </h1>

        <div className="border-2 border-black">
          <table className="w-full border-collapse text-[9px] md:text-sm leading-snug">
            <thead>
              {/* Chapter I Header */}
              <tr className="bg-[#660099] text-[#FFFF00]">
                <th
                  colSpan="2"
                  className="border border-black p-2 text-left bg-[#660099] font-bold"
                >
                  Chapter I- Admission Packet
                </th>
                <th className="border border-black p-2 bg-[#660099]"></th>
              </tr>
              {/* Column Headers */}
              <tr className="bg-gray-400">
                <th className="border border-black p-2 font-bold w-[35%] text-center">
                  Form Name
                </th>
                <th className="border border-black p-2 font-bold w-[15%] text-center">
                  Number
                </th>
                <th className="border border-black p-2 font-bold w-[50%] text-left pl-4"></th>
              </tr>
            </thead>
            <tbody>
              {/* Chapter I Rows */}
              <tr>
                <td className="border border-black p-2 text-center text-red-600">
                  Client Information Form <RequiredStar />
                </td>
                <td className="border border-black p-2 text-center">1</td>
                <td className="border border-black p-2 text-left">
                  <input
                    name="clientInformationForm"
                    value={formData.clientInformationForm}
                    onChange={(e) => {
                      handleChange(e);
                      if(errors.clientInformationForm) setErrors(prev => ({...prev, clientInformationForm: null}));
                    }}
                    onKeyDown={handleEnter}
                    type="text"
                    style={getStyle("clientInformationForm")}
                    className={`w-full bg-transparent text-[9px] md:text-sm ${errors.clientInformationForm ? "border-red-500" : ""}`}
                    placeholder="Enter data"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Service Agreement
                </td>
                <td className="border border-black p-2 text-center">2</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="serviceAgreement"
                    value={formData.serviceAgreement}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Service Agreement Addendum
                </td>
                <td className="border border-black p-2 text-center">3</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="serviceAgreementAddendum"
                    value={formData.serviceAgreementAddendum}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Service Care Plan
                </td>
                <td className="border border-black p-2 text-center">4</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="serviceCarePlan"
                    value={formData.serviceCarePlan}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Medication List
                </td>
                <td className="border border-black p-2 text-center">5</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="medicationList"
                    value={formData.medicationList}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Comprehensive Assessment
                </td>
                <td className="border border-black p-2 text-center">6</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="comprehensiveAssessment"
                    value={formData.comprehensiveAssessment}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center text-red-600">
                  Client's Rights and Responsibilities <RequiredStar />
                </td>
                <td className="border border-black p-2 text-center">7</td>
                <td className="border border-black p-2 text-left">
                  <input
                    name="rightsSignature"
                    value={formData.rightsSignature}
                    onChange={(e) => {
                      handleChange(e);
                      if(errors.rightsSignature) setErrors(prev => ({...prev, rightsSignature: null}));
                    }}
                    onKeyDown={handleEnter}
                    type="text"
                    style={getStyle("rightsSignature")}
                    className={`w-full bg-transparent text-[9px] md:text-sm ${errors.rightsSignature ? "border-red-500" : ""}`}
                    placeholder="Signature"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center text-red-600">
                  Code of Ethics <RequiredStar />
                </td>
                <td className="border border-black p-2 text-center">8</td>
                <td className="border border-black p-2 text-left">
                  <input
                    name="codeOfEthicsSignature"
                    value={formData.codeOfEthicsSignature}
                    onChange={(e) => {
                      handleChange(e);
                      if(errors.codeOfEthicsSignature) setErrors(prev => ({...prev, codeOfEthicsSignature: null}));
                    }}
                    onKeyDown={handleEnter}
                    type="text"
                    style={getStyle("codeOfEthicsSignature")}
                    className={`w-full bg-transparent text-[9px] md:text-sm ${errors.codeOfEthicsSignature ? "border-red-500" : ""}`}
                    placeholder="Signature"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>

              {/* Chapter II Header */}
              <tr>
                <th
                  colSpan="2"
                  className="border border-black p-2 text-left bg-[#AA66CC] text-[#FFFF00] font-bold"
                >
                  Chapter II- Service Documentation
                </th>
                <th className="border border-black p-2 text-center text-red-600 font-bold bg-white">
                  These forms are after onboarding
                </th>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Supervisory Visits
                </td>
                <td className="border border-black p-2 text-center">9</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="supervisoryVisits"
                    value={formData.supervisoryVisits}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Incidence Report Form
                </td>
                <td className="border border-black p-2 text-center">10</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="incidenceReportForm"
                    value={formData.incidenceReportForm}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">
                  Client Complaint Form
                </td>
                <td className="border border-black p-2 text-center">11</td>
                <td className="border border-black p-2 text-center">
                  <input
                    name="clientComplaintForm"
                    value={formData.clientComplaintForm}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    type="text"
                    className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
                    placeholder="Fillable form"
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center p-4">
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

export default SourceCCSPPrograms;
