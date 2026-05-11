import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const ServiceAgreementAddendum = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  // State management for form data
  const [formData, setFormData] = useState([
    { change: "", reason: "", date: "", acknowledgement: "" },
    { change: "", reason: "", date: "", acknowledgement: "" },
    { change: "", reason: "", date: "", acknowledgement: "" },
    { change: "", reason: "", date: "", acknowledgement: "" },
  ]);

  // Additional state for new fields introduced by the instruction
  const [clientName, setClientName] = useState("");
  const [serviceAgreementDate, setServiceAgreementDate] = useState("");
  const [representativeSignature, setRepresentativeSignature] = useState("");
  const [representativeDate, setRepresentativeDate] = useState("");
  const [witnessSignature, setWitnessSignature] = useState("");
  const [witnessDate, setWitnessDate] = useState("");

  // Handle input changes for the addendum rows
  const handleChange = (index, field, value) => {
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
    // At least the first row must be filled
    const firstRow = formData[0];
    const isFirstRowFilled =
      firstRow.change.trim() !== "" &&
      firstRow.reason.trim() !== "" &&
      firstRow.date.trim() !== "" &&
      firstRow.acknowledgement.trim() !== "";

    if (!isFirstRowFilled) {
      if (!firstRow.change.trim()) newErrors["change-0"] = true;
      if (!firstRow.reason.trim()) newErrors["reason-0"] = true;
      if (!firstRow.date.trim()) newErrors["date-0"] = true;
      if (!firstRow.acknowledgement.trim())
        newErrors["acknowledgement-0"] = true;
    }

    if (!clientName.trim()) newErrors.clientName = true;
    if (!serviceAgreementDate.trim()) newErrors.serviceAgreementDate = true;
    if (!representativeSignature.trim())
      newErrors.representativeSignature = true;
    if (!representativeDate.trim()) newErrors.representativeDate = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIndividualChange = (e) => {
    const { name, value } = e.target;
    if (name === "clientName") setClientName(value);
    if (name === "serviceAgreementDate") setServiceAgreementDate(value);
    if (name === "representativeSignature") setRepresentativeSignature(value);
    if (name === "representativeDate") setRepresentativeDate(value);
    if (name === "witnessSignature") setWitnessSignature(value);
    if (name === "witnessDate") setWitnessDate(value);

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const getStyle = (fieldName) => {
    return errors[fieldName]
      ? { borderBottom: "2px solid #ef4444", backgroundColor: "#fef2f2" }
      : {};
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

  // Handle form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please complete at least one addendum entry.");
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
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
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
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 w-full flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <form
          onSubmit={handleSubmit}
          className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug shadow-lg rounded-t-lg"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8 w-full">
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-12 md:h-20 object-contain mb-4"
            />

            <h2 className="text-sm md:text-xl font-bold text-black mb-4 text-center">
              Addendum to Service Agreement
            </h2>
            <p className="italic font-semibold text-[9px] md:text-sm text-center">
              This form should be completed when there are revisions to the
              original service agreement.
            </p>
          </div>

          {/* New fields for Client Name and Service Agreement Date */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex flex-col flex-1 w-full md:w-auto">
              <label
                htmlFor="clientName"
                className="text-xs font-semibold mb-1"
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                className={`w-full border-b border-black outline-none px-1 ${errors.clientName ? "border-red-500 bg-red-50" : ""}`}
                value={clientName}
                onChange={handleIndividualChange}
                onKeyDown={handleEnter}
                style={getStyle("clientName")}
              />
            </div>
            <div className="flex flex-col w-full md:w-48">
              <label
                htmlFor="serviceAgreementDate"
                className="text-xs font-semibold mb-1"
              >
                Service Agreement Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="serviceAgreementDate"
                name="serviceAgreementDate"
                className={`w-full border-b border-black outline-none px-1 ${errors.serviceAgreementDate ? "border-red-500 bg-red-50" : ""}`}
                value={serviceAgreementDate}
                onChange={handleIndividualChange}
                onKeyDown={handleEnter}
                style={getStyle("serviceAgreementDate")}
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full border border-black mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-black font-bold text-[8px] md:text-sm leading-tight">
              <div className="border-r border-black p-1 h-full flex items-center justify-center text-center break-words min-w-0">
                <span>
                  Specific Change to be Made <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="border-r border-black p-1 h-full flex items-center justify-center text-center break-words min-w-0">
                <span>
                  Reason for Change/Type of Service <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="border-r border-black p-1 h-full flex items-center justify-center text-center break-words min-w-0">
                <span>
                  Date Change to Begin <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="p-1 h-full flex items-center justify-center text-center break-words min-w-0">
                <span>
                  Client Acknowledgement <span className="text-red-500">*</span>
                </span>
              </div>
            </div>

            {/* Table Rows (4 large rows as per image) */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="grid grid-cols-4 border-b border-black last:border-b-0 min-h-[50px] md:min-h-[100px]"
              >
                <div
                  className={`border-r border-black p-1 min-w-0 ${errors[`change-${index}`] ? "bg-red-50" : ""}`}
                >
                  <textarea
                    className={`w-full h-full bg-transparent outline-none resize-none min-w-0 text-[10px] md:text-sm ${errors[`change-${index}`] ? "border-red-500" : ""}`}
                    value={formData[index].change}
                    onChange={(e) => {
                      handleChange(index, "change", e.target.value);
                      if (errors[`change-${index}`])
                        setErrors((prev) => ({
                          ...prev,
                          [`change-${index}`]: null,
                        }));
                    }}
                    style={
                      errors[`change-${index}`]
                        ? { border: "1px solid #ef4444" }
                        : {}
                    }
                  />
                </div>
                <div
                  className={`border-r border-black p-1 min-w-0 ${errors[`reason-${index}`] ? "bg-red-50" : ""}`}
                >
                  <textarea
                    className={`w-full h-full bg-transparent outline-none resize-none min-w-0 text-[10px] md:text-sm ${errors[`reason-${index}`] ? "border-red-500" : ""}`}
                    value={formData[index].reason}
                    onChange={(e) => {
                      handleChange(index, "reason", e.target.value);
                      if (errors[`reason-${index}`])
                        setErrors((prev) => ({
                          ...prev,
                          [`reason-${index}`]: null,
                        }));
                    }}
                    style={
                      errors[`reason-${index}`]
                        ? { border: "1px solid #ef4444" }
                        : {}
                    }
                  />
                </div>
                <div
                  className={`border-r border-black p-1 min-w-0 ${errors[`date-${index}`] ? "bg-red-50" : ""}`}
                >
                  <input
                    type="date"
                    className={`w-full bg-transparent outline-none min-w-0 text-[8px] md:text-sm ${errors[`date-${index}`] ? "border-red-500" : ""}`}
                    value={formData[index].date}
                    onChange={(e) => {
                      handleChange(index, "date", e.target.value);
                      if (errors[`date-${index}`])
                        setErrors((prev) => ({
                          ...prev,
                          [`date-${index}`]: null,
                        }));
                    }}
                    style={
                      errors[`date-${index}`]
                        ? { border: "1px solid #ef4444" }
                        : {}
                    }
                  />
                </div>
                <div
                  className={`p-1 min-w-0 ${errors[`acknowledgement-${index}`] ? "bg-red-50" : ""}`}
                >
                  <textarea
                    className={`w-full h-full bg-transparent outline-none resize-none min-w-0 text-[10px] md:text-sm ${errors[`acknowledgement-${index}`] ? "border-red-500" : ""}`}
                    value={formData[index].acknowledgement}
                    onChange={(e) => {
                      handleChange(index, "acknowledgement", e.target.value);
                      if (errors[`acknowledgement-${index}`])
                        setErrors((prev) => ({
                          ...prev,
                          [`acknowledgement-${index}`]: null,
                        }));
                    }}
                    style={
                      errors[`acknowledgement-${index}`]
                        ? { border: "1px solid #ef4444" }
                        : {}
                    }
                    placeholder="Sign/Initial"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Signature Section */}
          <div className="flex flex-col gap-6 mt-12 w-full">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="flex flex-col flex-1 w-full">
                <input
                  type="text"
                  name="representativeSignature"
                  className={`w-full border-b border-black outline-none px-1 ${errors.representativeSignature ? "border-red-500 bg-red-50" : ""}`}
                  value={representativeSignature}
                  onChange={handleIndividualChange}
                  onKeyDown={handleEnter}
                  style={getStyle("representativeSignature")}
                />
                <span className="text-xs font-semibold">
                  Signature of Representative{" "}
                  <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="flex flex-col w-full md:w-32">
                <input
                  type="date"
                  name="representativeDate"
                  className={`w-full border-b border-black outline-none px-1 ${errors.representativeDate ? "border-red-500 bg-red-50" : ""}`}
                  value={representativeDate}
                  onChange={handleIndividualChange}
                  onKeyDown={handleEnter}
                  style={getStyle("representativeDate")}
                />
                <span className="text-xs font-semibold">
                  Date <span className="text-red-500">*</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mt-4">
              <div className="flex flex-col flex-1 w-full">
                <input
                  type="text"
                  name="witnessSignature"
                  className="w-full border-b border-black outline-none px-1"
                  value={witnessSignature}
                  onChange={handleIndividualChange}
                  onKeyDown={handleEnter}
                />
                <span className="text-xs font-semibold">
                  Signature of Witness
                </span>
              </div>
              <div className="flex flex-col w-full md:w-32">
                <input
                  type="date"
                  name="witnessDate"
                  className="w-full border-b border-black outline-none px-1"
                  value={witnessDate}
                  onChange={handleIndividualChange}
                  onKeyDown={handleEnter}
                />
                <span className="text-xs font-semibold">Date</span>
              </div>
            </div>
          </div>

          <div className="text-center border-t border-gray-300 pt-2 mt-8 text-[8px] md:text-[10px] text-gray-500">
            — Page 1 —
          </div>

          {/* Action Buttons */}
          <div className="w-full px-2 md:px-8 pb-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-8">
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
  );
};

export default ServiceAgreementAddendum;

