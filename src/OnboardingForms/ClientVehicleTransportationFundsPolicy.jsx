import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const ClientVehicleTransportationFundsPolicy = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    clientRepSignature: "",
    clientRepDate: "",
    admissionRepSignature: "",
    admissionRepDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    if (!formData.clientRepSignature?.trim())
      newErrors.clientRepSignature = true;
    if (!formData.clientRepDate?.trim()) newErrors.clientRepDate = true;
    if (!formData.admissionRepSignature?.trim())
      newErrors.admissionRepSignature = true;
    if (!formData.admissionRepDate?.trim()) newErrors.admissionRepDate = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in all signature and date fields.");
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

  const getStyle = (field) => ({
    outline: "none",
    background: errors[field] ? "#fee2e2" : "transparent",
    borderBottom: errors[field] ? "2px solid #ef4444" : "1px solid black",
    transition: "all 0.2s",
  });

  const RequiredStar = () => (
    <span className="text-red-500 ml-1 font-bold">*</span>
  );

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={logo}
                alt="Pacific Health Systems Logo"
                className="h-12 md:h-16 object-contain mb-2"
              />
              <h2 className="text-center font-bold uppercase text-sm md:text-lg mt-2">
                Client Vehicle, Transportation & Funds Policy
              </h2>
            </div>

            {/* Policy Overview */}
            <div className="space-y-4 text-justify">
              <h3 className="font-bold underline mb-1">Policy Overview</h3>
              <p className="text-justify">
                Pacific Health Systems LLC is committed to ensuring the safety,
                dignity, and protection of all clients while minimizing risk and
                maintaining regulatory compliance. This policy establishes clear
                rules regarding transportation and the handling of client funds.
              </p>
            </div>

            {/* Client Vehicle & Transportation Policy */}
            <div className="mt-4">
              <h3 className="font-bold underline mb-1">
                Client Vehicle & Transportation Policy
              </h3>
              <p className="text-justify mb-2">
                Pacific Health Systems LLC strictly prohibits any employee,
                contractor, or affiliated personnel from operating, using, or
                driving any vehicle owned, leased, or provided by a client under
                any circumstances.
              </p>
              <p className="mb-1">This includes:</p>
              <ul className="list-disc pl-8 mb-2">
                <li>Standard vehicles</li>
                <li>Specialized or adaptive vehicles</li>
                <li>Medically modified vehicles</li>
              </ul>
              <p className="mb-1">
                Staff are{" "}
                <span className="font-bold">
                  not permitted to drive clients or operate client-owned
                  vehicles for any reason
                </span>
                , regardless of:
              </p>
              <ul className="list-disc pl-8 mb-2">
                <li>The purpose of the trip</li>
                <li>The client’s physical or medical condition</li>
                <li>The service being provided</li>
              </ul>
              <p className="font-bold">
                This rule applies to all programs, staff roles, and service
                settings.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-bold underline mb-1">
                Approved Transportation Methods
              </h3>
              <p className="text-justify mb-2">
                When transportation is required as part of a client’s authorized
                services, Pacific Health Systems LLC will arrange transportation
                through approved third-party providers such as:
              </p>
              <ul className="list-disc pl-8 mb-2">
                <li>Non-Emergency Medical Transportation (NEMT)</li>
                <li>Licensed medical transportation vendors</li>
                <li>Public transportation (when appropriate)</li>
                <li>
                  Program-approved rideshare services (e.g., Uber Health, Lyft
                  Healthcare)
                </li>
              </ul>
              <p className="text-justify">
                Staff shall not personally transport clients or operate any
                vehicle for client transportation purposes.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-bold underline mb-1">Prohibited Conduct</h3>
              <p className="mb-1">
                Under no circumstances shall staff or contractors:
              </p>
              <ul className="list-disc pl-8 mb-2">
                <li>Drive a client in any vehicle</li>
                <li>Operate a client-owned vehicle</li>
                <li>Arrange unauthorized transportation</li>
                <li>
                  Accept requests from clients or families for personal
                  transport
                </li>
              </ul>
              <p className="text-justify">
                Violations may result in disciplinary action, up to and
                including termination and personal liability.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-bold underline mb-1">Client Funds Policy</h3>
              <p className="text-justify mb-2">
                Pacific Health Systems LLC does{" "}
                <span className="font-bold">
                  not manage, handle, or use client funds
                </span>{" "}
                under any circumstances.
              </p>
              <p className="mb-1">
                Employees and contractors are strictly prohibited from:
              </p>
              <ul className="list-disc pl-8 mb-2">
                <li>Holding client money</li>
                <li>
                  Making purchases on behalf of clients using client funds
                </li>
                <li>Managing financial transactions for clients</li>
              </ul>
              <p className="text-justify">
                All financial matters remain the sole responsibility of the
                client or their legal representative.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-bold underline mb-1">
                Client Acknowledgment
              </h3>
              <p className="text-justify mb-1">
                I acknowledge that I have received, read, and understand the
                Pacific Health Systems LLC Client Vehicle, Transportation &
                Funds Policy.
              </p>
              <p className="text-justify">
                I agree to abide by this policy and understand that staff are
                not permitted to drive me, use my vehicle, or manage my personal
                funds.
              </p>
            </div>

            {/* Signatures */}
            <div className="flex flex-col md:flex-row justify-between mt-12 gap-8 mb-6">
              <div className="flex gap-4 w-full md:w-[48%]">
                <div className="flex-grow">
                  <input
                    type="text"
                    name="clientRepSignature"
                    value={formData.clientRepSignature}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.clientRepSignature)
                        setErrors((prev) => ({
                          ...prev,
                          clientRepSignature: null,
                        }));
                    }}
                    style={getStyle("clientRepSignature")}
                    className={`w-full ${errors.clientRepSignature ? "border-red-500" : ""}`}
                  />
                  <div className="text-xs font-bold italic mt-1">
                    Client Representative Signature <RequiredStar />
                  </div>
                </div>
                <div className="w-24">
                  <input
                    type="date"
                    name="clientRepDate"
                    value={formData.clientRepDate}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.clientRepDate)
                        setErrors((prev) => ({ ...prev, clientRepDate: null }));
                    }}
                    style={getStyle("clientRepDate")}
                    className={`w-full ${errors.clientRepDate ? "border-red-500" : ""}`}
                  />
                  <div className="text-xs font-bold italic mt-1">
                    Date <RequiredStar />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-[48%]">
                <div className="flex-grow">
                  <input
                    type="text"
                    name="admissionRepSignature"
                    value={formData.admissionRepSignature}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.admissionRepSignature)
                        setErrors((prev) => ({
                          ...prev,
                          admissionRepSignature: null,
                        }));
                    }}
                    style={getStyle("admissionRepSignature")}
                    className={`w-full ${errors.admissionRepSignature ? "border-red-500" : ""}`}
                  />
                  <div className="text-xs font-bold italic mt-1">
                    Admission Representative Signature <RequiredStar />
                  </div>
                </div>
                <div className="w-24">
                  <input
                    type="date"
                    name="admissionRepDate"
                    value={formData.admissionRepDate}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.admissionRepDate)
                        setErrors((prev) => ({
                          ...prev,
                          admissionRepDate: null,
                        }));
                    }}
                    style={getStyle("admissionRepDate")}
                    className={`w-full ${errors.admissionRepDate ? "border-red-500" : ""}`}
                  />
                  <div className="text-xs font-bold italic mt-1">
                    Date <RequiredStar />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-gray-300 pt-2 mt-8 text-[8px] md:text-[10px] text-gray-500">
              — Page 1 —
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

export default ClientVehicleTransportationFundsPolicy;

