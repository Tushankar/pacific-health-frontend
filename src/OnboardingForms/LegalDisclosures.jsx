import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Shield,
  ArrowLeft,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const LegalDisclosures = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    applicantSignature: "",
    signatureDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      setFormData({
        applicantSignature: savedData.applicantSignature || "",
        signatureDate: savedData.signatureDate
          ? savedData.signatureDate.split("T")[0]
          : "",
      });
    }
  }, [savedData]);

  // Set today's date if empty and form loaded
  useEffect(() => {
    if (!formData.signatureDate) {
      const today = new Date().toISOString().slice(0, 10);
      setFormData((prev) => ({ ...prev, signatureDate: today }));
    }
  }, [formData.signatureDate]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

  const handleInputChange = (field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!formData.applicantSignature || !formData.applicantSignature.trim()) {
      toast.error("Please provide your digital signature.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(formData);
      } else {
        toast.success("Disclaimer and signature submitted!");
      }
    } catch (error) {
      console.error("Error submitting legal disclosures:", error);
      toast.error("Failed to submit legal disclosures.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-sans">
      {/* Google cursive font loading */}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&family=Dancing+Script:wght@400;700&family=Pacifico&display=swap"
        rel="stylesheet"
      />

      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white leading-snug shadow-lg rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Logo Header */}
            <div className="flex flex-col items-center mb-6">
              <img src={logo} alt="Pacific Health Systems" className="h-12 md:h-16 object-contain mb-2" />
            </div>

            {/* Blue Banner Header */}
            <div className="bg-[#1F3A93] text-white p-4 md:p-6 rounded-lg mb-8">
              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 mb-2 sm:mb-0 sm:mr-3" />
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                      Disclaimer and Signature
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1">
                      Part 1: Employment Application
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certification Statement */}
            <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-white font-bold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold text-amber-800 mb-2">Important Certification</h4>
                  <p className="text-sm text-amber-700 font-medium">
                    I certify that my answers are true and complete to the best of my knowledge. If this application leads to employment, I understand that false or misleading information in my application or interview may result in my release.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">Applicant Signature</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="applicantSignature" className="block text-sm font-semibold text-gray-700 mb-1">
                    Type Your Signature <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="applicantSignature"
                    type="text"
                    value={formData.applicantSignature || ""}
                    onChange={(e) => handleInputChange("applicantSignature", e.target.value)}
                    placeholder="Type your full name as signature"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                    disabled={isReadOnly}
                    required
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      fontSize: "28px",
                      fontWeight: "400",
                      letterSpacing: "0.5px",
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your signature will appear in a Great Vibes cursive font style
                  </p>
                </div>

                <div>
                  <label htmlFor="signatureDate" className="block text-sm font-semibold text-gray-700 mb-1">
                    Date Signed <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="signatureDate"
                    type="date"
                    value={formData.signatureDate || ""}
                    onChange={(e) => handleInputChange("signatureDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                    disabled={isReadOnly}
                    required
                  />
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
                  onNext={onNext}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

LegalDisclosures.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default LegalDisclosures;
