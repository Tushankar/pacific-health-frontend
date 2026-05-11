import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, CheckCircle, FileText, Send, RotateCcw, Info } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const ServiceDeliveryForm = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [policyInitials, setPolicyInitials] = useState({
    policy1: "",
    policy2: "",
    policy3: "",
    policy4: "",
    policy5: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const policies = [
    {
      id: "policy1",
      text: "PHS employees must report on duty according to their work schedules. Employees must notify the office if they are unable to report to work at least 2 hours before the start of the shift. If it's an emergency, a written doctor's excuse will be needed to make this an excused absence.",
    },
    {
      id: "policy2",
      text: "PHS employees must report all incidents, accidents, or injuries involving themselves or clients to the office within 24 hours of the occurrence. Failure to report may result in disciplinary action.",
    },
    {
      id: "policy3",
      text: "PHS employees must not perform any tasks that are not authorized in the client's care plan. Doing things not listed on the care plan or assignment sheet without permission is strictly prohibited.",
    },
    {
      id: "policy4",
      text: "PHS employees must maintain client confidentiality at all times in accordance with HIPAA regulations. Employees must not breach clients' and or primary care giver's privacy and confidentiality of information.",
    },
    {
      id: "policy5",
      text: "PHS employees must wear their identification badge at all times while on duty and adhere to the dress code of appropriate scrubs for PHS.",
    },
  ];

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      setEmployeeSignature(savedData.employeeSignature || savedData.signature || "");
      setSignatureDate(savedData.employeeSignatureDate || savedData.signatureDate || savedData.date
        ? (savedData.employeeSignatureDate || savedData.signatureDate || savedData.date).split("T")[0]
        : ""
      );
      if (savedData.policyInitials) {
        setPolicyInitials(savedData.policyInitials);
      }
    }
  }, [savedData]);

  // Set default date to today
  useEffect(() => {
    if (!signatureDate) {
      const today = new Date().toISOString().split("T")[0];
      setSignatureDate(today);
    }
  }, [signatureDate]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        employeeSignature,
        employeeSignatureDate: signatureDate,
        policyInitials,
      });
    }
  }, [employeeSignature, signatureDate, policyInitials, onFormChange]);

  const handleInitialChange = (policyId, value) => {
    if (isReadOnly) return;
    setPolicyInitials((prev) => ({
      ...prev,
      [policyId]: value,
    }));
    if (errors[policyId]) {
      setErrors((prev) => ({ ...prev, [policyId]: null }));
    }
  };

  const handleSignatureChange = (value) => {
    if (isReadOnly) return;
    setEmployeeSignature(value);
    if (errors.signature) {
      setErrors((prev) => ({ ...prev, signature: null }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    const newErrors = {};
    if (!employeeSignature || !employeeSignature.trim()) {
      newErrors.signature = "Digital signature is required.";
    }
    if (!signatureDate) {
      newErrors.date = "Date is required.";
    }

    policies.forEach((policy) => {
      if (!policyInitials[policy.id] || !policyInitials[policy.id].trim()) {
        newErrors[policy.id] = "Initials required";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please initial all policies and provide your signature before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete({
          employeeSignature,
          employeeSignatureDate: signatureDate,
          policyInitials,
        });
      } else {
        toast.success("Service Delivery Policy signed successfully!");
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      toast.error("Failed to save signature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&family=Dancing+Script:wght@400;700&family=Pacifico&display=swap"
        rel="stylesheet"
      />

      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8 w-full">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-xl border border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Service Delivery Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Review the Service Delivery Policy document
            </p>
          </div>

          <div className="space-y-6">
            {/* Instructions Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    📋 Instructions
                  </h3>
                  <ol className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700 list-none pl-0">
                    <li className="flex gap-2 sm:gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                      <span>Carefully review the Service Delivery Policy below</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                      <span>Initial each policy statement and sign below</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="max-w-3xl w-full px-3 sm:px-6 md:px-12 py-4 sm:py-8 bg-white shadow-sm border border-gray-100 rounded-lg">
                
                {/* Header with Logo */}
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <img
                    src={logo}
                    alt="Pacific Health Systems Logo"
                    className="h-16 sm:h-20"
                  />
                </div>

                {/* Title */}
                <h1 className="text-center text-sm sm:text-base font-bold mb-4 sm:mb-6 underline uppercase">
                  Service Delivery Policies
                </h1>

                {/* Intro Text */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-gray-800 mb-6 italic">
                  At the Pacific Health Systems orientation forum, employees were told of the significances of rendering quality service to our clients. Please initial the following statements and sign below:
                </p>

                {/* Policy Statements */}
                <div className="space-y-6">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex flex-col sm:flex-row items-start gap-3 border-b border-gray-50 pb-4">
                      <div className="flex flex-col items-center">
                        <input
                          type="text"
                          value={policyInitials[policy.id] || ""}
                          onChange={(e) => handleInitialChange(policy.id, e.target.value)}
                          placeholder="Initials"
                          className={`w-16 text-center text-xs sm:text-sm bg-transparent outline-none italic border-b-2 font-bold py-1 ${
                            errors[policy.id] ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                          disabled={isReadOnly}
                          maxLength={3}
                        />
                        {errors[policy.id] && (
                          <span className="text-[10px] text-red-500 mt-0.5">{errors[policy.id]}</span>
                        )}
                      </div>
                      <div className="text-xs sm:text-[13px] leading-relaxed text-gray-800 pt-1">
                        {policy.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Signature Section */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-6">
                    Employee Acknowledgment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                        Employee Digital Signature *
                      </label>
                      <input
                        type="text"
                        value={employeeSignature}
                        onChange={(e) => handleSignatureChange(e.target.value)}
                        placeholder="Type your full name"
                        className={`w-full border-b-2 pb-2 bg-transparent focus:outline-none focus:ring-0 px-0 transition-all font-medium ${
                          errors.signature ? "border-red-500" : "border-gray-900"
                        }`}
                        disabled={isReadOnly}
                        required
                        style={{
                          fontFamily: "'Great Vibes', cursive",
                          fontSize: "32px",
                          fontWeight: "400",
                        }}
                      />
                      {errors.signature && (
                        <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.signature}</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-2 italic flex items-center gap-1">
                        <Info size={10} /> Signature will appear in cursive script
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                        Date Signed *
                      </label>
                      <input
                        type="date"
                        value={signatureDate}
                        onChange={(e) => !isReadOnly && setSignatureDate(e.target.value)}
                        disabled={isReadOnly}
                        required
                        className="w-full border-b-2 pb-2 bg-transparent focus:outline-none focus:ring-0 px-0 text-sm font-medium border-gray-900"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.date}</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-12 pt-8 border-t border-gray-100">
            <button
              type="button"
              className="px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide rounded-none transform transition-transform shadow-md w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="w-full sm:w-auto flex justify-center">
              <button
                type="button"
                className="px-8 py-3 btn-premium-red text-white font-sans font-bold tracking-wide rounded-none transform transition-transform shadow-md w-full sm:w-auto"
                onClick={() => {
                  window.location.href = "/my-application";
                }}
              >
                Exit Application
              </button>
            </div>

            <div className="w-full sm:w-auto">
              <SaveNextButton
                isSubmitting={isSubmitting}
                type="submit"
                isReadOnly={isReadOnly}
                onClick={handleSubmit}
                onNext={onNext}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

ServiceDeliveryForm.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default ServiceDeliveryForm;
