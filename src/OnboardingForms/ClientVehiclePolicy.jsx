import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const ClientVehiclePolicy = ({ onComplete, savedData, progressCurrent = 0, progressTotal = 1, onFormChange, isReadOnly = false, onNext }) => {
  const [formData, setFormData] = useState({
    clientSignature: "",
    clientDate: "",
    representativeSignature: "",
    representativeDate: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientSignature?.trim()) newErrors.clientSignature = true;
    if (!formData.clientDate?.trim()) newErrors.clientDate = true;
    if (!formData.representativeSignature?.trim()) newErrors.representativeSignature = true;
    if (!formData.representativeDate?.trim()) newErrors.representativeDate = true;

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
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    transition: "all 0.2s"
  });

  const RequiredStar = () => <span className="text-red-500 ml-1 font-bold">*</span>;

  return (
    <div className="w-full bg-white text-black font-serif flex justify-center mt-4 mb-8">
      <form
        onSubmit={handleSubmit}
        className="w-[98%] md:w-[85%] lg:w-[60%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Pacific Health Systems"
            className="h-12 md:h-16 object-contain mb-2"
          />
          <h2 className="text-center font-bold uppercase text-sm md:text-lg">
            Client Vehicle, Transportation & Funds Policy
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold underline mb-1">Policy Overview</h3>
            <p className="text-justify">
              Pacific Health Systems LLC is committed to ensuring the safety,
              dignity, and protection of all clients while minimizing risk and
              maintaining regulatory compliance. This policy establishes clear
              rules regarding transportation and the handling of client funds.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline mb-1">
              Client Vehicle & Transportation Policy
            </h3>
            <p className="text-justify mb-2">
              Pacific Health Systems LLC strictly prohibits any employee,
              contractor, or affiliated personnel from operating, using, or
              driving any vehicle owned, leased, or provided by a client under
              any circumstances.
            </p>
            <p>This includes:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Standard vehicles</li>
              <li>Specialized or adaptive vehicles</li>
              <li>Medically modified vehicles</li>
            </ul>
            <p className="mb-2">
              Staff are not permitted to drive clients or operate client-owned
              vehicles for any reason, regardless of:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>The purpose of the trip</li>
              <li>The client's physical or medical condition</li>
              <li>The service being provided</li>
            </ul>
            <p className="font-bold">
              This rule applies to all programs, staff roles, and service
              settings.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline mb-1">
              Approved Transportation Methods
            </h3>
            <p className="text-justify mb-2">
              When transportation is required as part of a client's authorized
              services, Pacific Health Systems LLC will arrange transportation
              through approved third-party providers such as:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Non-Emergency Medical Transportation (NEMT)</li>
              <li>Licensed medical transportation vendors</li>
              <li>Public transportation (where appropriate)</li>
              <li>
                Program-approved rideshare services (e.g., Uber Health, Lyft
                Healthcare)
              </li>
            </ul>
            <p className="font-bold">
              Staff shall not personally transport clients or operate any
              vehicle for client transportation purposes.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline mb-1">Prohibited Conduct</h3>
            <p className="mb-2">
              Under no circumstances shall staff or contractors:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Drive a client in any vehicle</li>
              <li>Operate a client-owned vehicle</li>
              <li>Arrange unauthorized transportation</li>
              <li>
                Accept requests from clients or families for personal transport
              </li>
            </ul>
            <p>
              Violations may result in disciplinary action, up to and including
              termination and personal liability.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline mb-1">Client Funds Policy</h3>
            <p className="mb-2">
              Pacific Health Systems LLC does not manage, handle, or use client
              funds under any circumstances.
            </p>
            <p className="mb-1">
              Employees and contractors are strictly prohibited from:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Holding client money</li>
              <li>Making purchases on behalf of clients using client funds</li>
              <li>Managing financial transactions for clients</li>
            </ul>
            <p className="font-bold">
              All financial matters remain the sole responsibility of the client
              or their legal representative.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline mb-2">Client Acknowledgment</h3>
            <p className="mb-4 text-justify">
              I acknowledge that I have received, read, and understand the
              Pacific Health System LLC Client Vehicle, Transportation & Funds
              Policy. I agree to abide by this policy and understand that staff
              are not permitted to drive me, use my vehicle, or manage my
              personal funds.
            </p>
          </div>

          {/* Signatures */}
          <div className="flex flex-col md:flex-row justify-between mt-12 gap-8 mb-6">
            <div className="flex gap-4 w-full md:w-[48%]">
              <div className="flex-grow">
                <input
                  className={`w-full border-b outline-none ${errors.clientSignature ? "border-red-500" : "border-black"}`}
                  value={formData.clientSignature}
                  onChange={(e) => {
                    handleChange("clientSignature", e.target.value);
                    if(errors.clientSignature) setErrors(prev => ({...prev, clientSignature: null}));
                  }}
                  style={getStyle("clientSignature")}
                />
                <div className="text-xs font-bold italic mt-1">
                  Client Representative Signature <RequiredStar />
                </div>
              </div>
              <div className="w-24">
                <input
                  type="date"
                  className={`w-full border-b outline-none ${errors.clientDate ? "border-red-500" : "border-black"}`}
                  value={formData.clientDate}
                  onChange={(e) => {
                    handleChange("clientDate", e.target.value);
                    if(errors.clientDate) setErrors(prev => ({...prev, clientDate: null}));
                  }}
                  style={getStyle("clientDate")}
                />
                <div className="text-xs font-bold italic mt-1">Date <RequiredStar /></div>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-[48%]">
              <div className="flex-grow">
                <input
                  className={`w-full border-b outline-none ${errors.representativeSignature ? "border-red-500" : "border-black"}`}
                  value={formData.representativeSignature}
                  onChange={(e) => {
                    handleChange("representativeSignature", e.target.value);
                    if(errors.representativeSignature) setErrors(prev => ({...prev, representativeSignature: null}));
                  }}
                  style={getStyle("representativeSignature")}
                />
                <div className="text-xs font-bold italic mt-1">
                  Admission Representative Signature <RequiredStar />
                </div>
              </div>
              <div className="w-24">
                <input
                  type="date"
                  className={`w-full border-b outline-none ${errors.representativeDate ? "border-red-500" : "border-black"}`}
                  value={formData.representativeDate}
                  onChange={(e) => {
                    handleChange("representativeDate", e.target.value);
                    if(errors.representativeDate) setErrors(prev => ({...prev, representativeDate: null}));
                  }}
                  style={getStyle("representativeDate")}
                />
                <div className="text-xs font-bold italic mt-1">Date <RequiredStar /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
            <SaveNextButton 
              isSubmitting={isSubmitting} 
              type="submit" 
              isReadOnly={isReadOnly}
              onNext={onNext}
            />
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-300 pt-2 mt-8 text-[8px] md:text-[10px] text-gray-500">
          — Page 1 —
        </div>
      </form>
    </div>
  );
};

export default ClientVehiclePolicy;
