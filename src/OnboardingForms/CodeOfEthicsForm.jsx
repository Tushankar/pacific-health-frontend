import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, CheckCircle, FileText, Send, RotateCcw } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const CodeOfEthicsForm = ({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      setEmployeeSignature(savedData.employeeSignature || savedData.signature || "");
      setSignatureDate(savedData.signatureDate || savedData.date
        ? (savedData.signatureDate || savedData.date).split("T")[0]
        : ""
      );
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
        signature: employeeSignature,
        date: signatureDate,
      });
    }
  }, [employeeSignature, signatureDate, onFormChange]);

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

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please provide your signature and date before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete({
          signature: employeeSignature,
          date: signatureDate,
        });
      } else {
        toast.success("Code of Ethics signed successfully!");
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
      {/* Add cursive signature fonts */}
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
              Code of Ethics
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Review the Code of Ethics document
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
                      <span>Carefully review the Code of Ethics below</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                      <span>Click Save & Next to proceed</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="max-w-4xl w-full px-3 sm:px-6 md:px-12 py-4 sm:py-8 bg-white shadow-sm border border-gray-100 rounded-lg">
                
                {/* Header with Logo */}
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <img
                    src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png"
                    alt="Pacific Health Systems Logo"
                    className="h-16 sm:h-20"
                  />
                </div>

                {/* Title */}
                <h1 className="text-center text-sm sm:text-base font-bold mb-3 sm:mb-4 underline uppercase">
                  CODE OF ETHICS
                </h1>

                {/* Ethics List */}
                <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-gray-800">
                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">1.</span>
                    <p>PHS employees will not use the client's car for personal reasons.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">2.</span>
                    <p>Employees will not consume the client's food or beverages, nor will they eat inside the client's home without permission.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">3.</span>
                    <p>Employees will not use the client's telephone for personal calls.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">4.</span>
                    <p>Employees will not discuss political, religious beliefs, or personal problems with the client.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">5.</span>
                    <p>Employees will not accept gifts or financial gratuities (tips) from the client or client's representative.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">6.</span>
                    <p>Employees will not loan money or other items to the client and/or client representative.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">7.</span>
                    <p>Employees will not sell gifts, food, or other items to or for the client.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">8.</span>
                    <p>Employees will not purchase any items for the client unless directed in the client care plan.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">9.</span>
                    <p>Employees will not bring other visitors to client's home (children, friends, relatives, etc...).</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">10.</span>
                    <p>Employees will not smoke in or around the client's home with or without permission.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">11.</span>
                    <p>Employees will not report to duty under the influence of alcohol or drugs.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">12.</span>
                    <p>Employees will not sleep in the client's house unless ordered in service care plan.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">13.</span>
                    <p>Employees will not remain in the client's home after services have been rendered and completed.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">14.</span>
                    <p>Employees will not falsify client's records/timesheets.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">15.</span>
                    <p>Employees must report any unusual changes or events with client during work hours.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">16.</span>
                    <p>Employees must not breach clients' and or primary care giver's privacy and confidentiality of information and records against HIPAA regulations.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">17.</span>
                    <p>Employees must not assume control of the financial or personal affairs, or both, of the client or his/her estate, including power of attorney or guardianship.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">18.</span>
                    <p>Employees must not be committing any act of abuse, neglect or exploitation.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">19.</span>
                    <p>Employees will wear, have badge visible and adhere to the dress code of appropriate scrubs for PHS.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">20.</span>
                    <p>Employees will attend all mandatory quarterly meetings.</p>
                  </div>

                  <div className="flex">
                    <span className="mr-3 shrink-0 font-bold">21.</span>
                    <p>Employees will notify the office if they are unable to report to work for their assigned schedule, at least 2 hours before the start of the shift. If it's an emergency (A written doctor's excuse will be needed to make this an excused absence). Employees will provide at least a 2 weeks notice to request and schedule time off.</p>
                  </div>
                </div>

                {/* Agreement Text */}
                <div className="mt-6 sm:mt-8 text-xs sm:text-[13px] leading-relaxed text-gray-800 font-medium border-t border-gray-100 pt-6">
                  <p>
                    By signing my name below, I agree and promise that while in
                    the employment of Pacific Health Systems, I will abide by
                    the Code of Ethics established for Pacific Health Systems. I
                    understand that failure to abide by the code of ethics will
                    result in disciplinary action and may result in termination
                    of my employment with PHS.
                  </p>
                </div>

                {/* Signature Section */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">
                    Employee Signature
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Type Your Signature *
                      </label>
                      <input
                        type="text"
                        value={employeeSignature}
                        onChange={(e) => handleSignatureChange(e.target.value)}
                        placeholder="Type your full name as signature"
                        className="w-full border-b border-gray-950 pb-1 bg-transparent focus:outline-none focus:ring-0 px-0 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                        disabled={isReadOnly}
                        required
                        style={{
                          fontFamily: "'Great Vibes', cursive",
                          fontSize: "28px",
                          fontWeight: "400",
                          letterSpacing: "0.5px",
                        }}
                      />
                      {errors.signature && (
                        <p className="text-red-500 text-xs mt-1">{errors.signature}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Date Signed *
                      </label>
                      <input
                        type="date"
                        value={signatureDate}
                        onChange={(e) => !isReadOnly && setSignatureDate(e.target.value)}
                        disabled={isReadOnly}
                        required
                        className="w-full border-b border-gray-950 pb-1 bg-transparent focus:outline-none focus:ring-0 px-0 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1">{errors.date}</p>
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

CodeOfEthicsForm.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default CodeOfEthicsForm;
