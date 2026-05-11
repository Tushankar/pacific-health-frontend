import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, UserPlus, FileText, CheckCircle, RotateCcw, Target } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const EmploymentTypeForm = ({
  enrollmentId,
  formId,
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
  activeEnrollment,
}) => {
  const [employmentType, setEmploymentType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (savedData && savedData.employmentType) {
      setEmploymentType(savedData.employmentType);
    }
  }, [savedData]);

  const handleInputChange = (value) => {
    if (isReadOnly) return;
    setEmploymentType(value);
    if (onFormChange) onFormChange({ employmentType: value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!employmentType) {
      toast.error("Please select an employment type.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete({ employmentType });
      }
    } catch (error) {
      console.error("Error saving employment type:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate progress stats similar to HRMS
  const progressStats = useMemo(() => {
    if (!activeEnrollment?.forms) return { completed: 0, total: 21, percent: 0 };
    const total = activeEnrollment.forms.length;
    const completed = activeEnrollment.forms.filter(f => f.status === "approved" || f.status === "completed").length;
    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100)
    };
  }, [activeEnrollment]);

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-gray-50 min-h-screen text-black font-sans p-0">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center py-8 w-full px-4">
        
        {/* PARENT CONTAINER */}
        <div className="w-full max-w-[850px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden p-6 sm:p-12 mb-8 mx-auto">
          
          {/* Header */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Employment Type Selection
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Please select your preferred employment type
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Progress: {progressStats.percent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressStats.percent}%` }}
              ></div>
            </div>
          </div>

          {/* Status Banner */}
          <div
            className={`mb-6 p-4 rounded-lg border ${
              employmentType
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {employmentType ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <FileText className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div>
                {employmentType ? (
                  <>
                    <p className="text-base font-semibold text-green-800">
                      ✅ Employment Type Selected - {employmentType}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      You cannot make any changes to the form until HR provides their feedback.
                    </p>
                  </>
                ) : (
                  <p className="text-base font-semibold text-red-800">
                    ⚠️ Not filled yet - Select your employment type to update your progress
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select Employment Type
              </h2>
              <p className="text-gray-600 mb-6">
                Choose the type of employment you are seeking. This will determine which tax forms you need to complete.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="w2"
                    name="employmentType"
                    value="W-2"
                    checked={employmentType === "W-2"}
                    onChange={(e) => handleInputChange(e.target.value)}
                    disabled={isReadOnly}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="w2"
                    className="ml-3 text-sm font-medium text-gray-900"
                  >
                    W-2 Employee - Traditional employee with payroll taxes withheld
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="1099"
                    name="employmentType"
                    value="1099"
                    checked={employmentType === "1099"}
                    onChange={(e) => handleInputChange(e.target.value)}
                    disabled={isReadOnly}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="1099"
                    className="ml-3 text-sm font-medium text-gray-900"
                  >
                    1099 Contractor - Independent contractor responsible for own taxes
                  </label>
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
    </div>
  );
};

EmploymentTypeForm.propTypes = {
  enrollmentId: PropTypes.string,
  formId: PropTypes.number,
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
  activeEnrollment: PropTypes.object,
};

export default EmploymentTypeForm;
