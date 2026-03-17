import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";

const ClientComplaintForm = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    contactNumber: "",
    address: "",
    complaintTakenBy: "",
    complaintNames: "",
    personsInvolved1: "",
    personsInvolved2: "",
    dateReceived: "",
    complaintNumber: "",
    productDescription: "",
    complaintText: "",
    productFault: "",
    correctiveAction: "",
    resolvedYesNo: "",
    transferredTo: "",
    investigationDetails: "",
    resolutionDetails: "",
    takerSignature: "",
    clientSignature: "",
    signatureDate: "",
  });

  const handleChange = (e) => {
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
    <div className="flex flex-col-reverse lg:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-sm md:text-lg font-bold text-center underline font-serif">
              Client Complaint Form
            </h1>
          </div>

          {/* Client Info Section */}
          <div className="space-y-2 mb-6 text-[9px] md:text-sm">
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Name (Client):
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Contact Number:
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">Address:</span>
              <div className="flex-grow border-b border-black">
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Complaint Taken By:
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="complaintTakenBy"
                  value={formData.complaintTakenBy}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Complaint Name(s):
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="complaintNames"
                  value={formData.complaintNames}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Persons Involved */}
          <div className="mb-6 text-[9px] md:text-sm">
            <div className="font-bold mb-2">
              All Persons Involved in Complaint:
            </div>
            <div className="w-full border-b border-black h-8 mb-2">
              <input
                name="personsInvolved1"
                value={formData.personsInvolved1}
                onChange={handleChange}
                onKeyDown={handleEnter}
                type="text"
                className="w-full h-full bg-transparent outline-none min-w-0"
              />
            </div>
            <div className="w-full border-b border-black h-8">
              <input
                name="personsInvolved2"
                value={formData.personsInvolved2}
                onChange={handleChange}
                onKeyDown={handleEnter}
                type="text"
                className="w-full h-full bg-transparent outline-none min-w-0"
              />
            </div>
          </div>

          {/* Complaint Details Section */}
          <div className="space-y-2 mb-6 text-[9px] md:text-sm">
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Date Complaint Received:
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="dateReceived"
                  value={formData.dateReceived}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="date"
                  className="w-full bg-transparent outline-none min-w-0 text-[9px] md:text-sm"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Complaint Number:
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="complaintNumber"
                  value={formData.complaintNumber}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Product/Service Description:
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Complaint Description */}
          <div className="mb-6 text-[9px] md:text-sm">
            <div className="flex items-end w-full">
              <span className="font-bold mr-2 whitespace-nowrap">
                Complaint:
              </span>
              <input
                name="complaintText"
                value={formData.complaintText}
                onChange={handleChange}
                onKeyDown={handleEnter}
                type="text"
                className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
              />
            </div>
          </div>

          {/* Product Fault Description */}
          <div className="mb-6 text-[9px] md:text-sm">
            <div className="flex items-end w-full">
              <span className="font-bold mr-2 whitespace-nowrap">
                Description of Product Fault (if any):
              </span>
              <input
                name="productFault"
                value={formData.productFault}
                onChange={handleChange}
                onKeyDown={handleEnter}
                type="text"
                className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
              />
            </div>
          </div>

          {/* Corrective Action */}
          <div className="mb-6 text-[9px] md:text-sm">
            <div className="flex items-end w-full">
              <span className="font-bold mr-2 whitespace-nowrap">
                Corrective Action:
              </span>
              <input
                name="correctiveAction"
                value={formData.correctiveAction}
                onChange={handleChange}
                onKeyDown={handleEnter}
                type="text"
                className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
              />
            </div>
          </div>

          {/* Resolution Questions */}
          <div className="space-y-2 mb-6 text-[9px] md:text-sm">
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Has the problem been resolved? (Yes / No):
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="resolvedYesNo"
                  value={formData.resolvedYesNo}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                If no, to whom was the problem transferred?
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="transferredTo"
                  value={formData.transferredTo}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>

            <div className="w-full pt-2">
              <span className="font-bold block mb-1">
                How was the complaint investigated?
              </span>
              <div className="w-full mb-2">
                <input
                  name="investigationDetails"
                  value={formData.investigationDetails}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none border-b border-black min-w-0"
                />
              </div>
            </div>

            <div className="w-full pt-2">
              <span className="font-bold block mb-1">
                How was the complaint resolved?
              </span>
              <div className="w-full mb-2">
                <input
                  name="resolutionDetails"
                  value={formData.resolutionDetails}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none border-b border-black min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="space-y-4 mt-8 text-[9px] md:text-sm">
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Signature of Person Taking Complaint
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="takerSignature"
                  value={formData.takerSignature}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Client Signature
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="clientSignature"
                  value={formData.clientSignature}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <span className="font-bold whitespace-nowrap mr-2">
                Date (Client Signature)
              </span>
              <div className="flex-grow border-b border-black">
                <input
                  name="signatureDate"
                  value={formData.signatureDate}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  type="date"
                  className="w-full bg-transparent outline-none min-w-0 text-[9px] md:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
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
              onClick={handleSubmit}
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientComplaintForm;

