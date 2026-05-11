import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  Briefcase,
  Target,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

// FormInput component
const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  placeholder = "",
  required = false,
  disabled = false,
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500"
      required={required}
      disabled={disabled}
    />
  </div>
);

FormInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

// FormTextarea component
const FormTextarea = ({
  label,
  value,
  onChange,
  className = "",
  placeholder = "",
  required = false,
  rows = 4,
  disabled = false,
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500"
      required={required}
      disabled={disabled}
    />
  </div>
);

FormTextarea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
};

const ProfessionalExperience = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    hasMilitaryService: "",
    militaryService: {
      branch: "",
      from: "",
      to: "",
      rankAtDischarge: "",
      typeOfDischarge: "",
      otherThanHonorable: "",
      mayContactSupervisor: "",
      reasonForLeaving: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => {
        const hasMil = savedData.hasMilitaryService === true
          ? "YES"
          : savedData.hasMilitaryService === false
          ? "NO"
          : savedData.hasMilitaryService || "";

        return {
          ...prev,
          hasMilitaryService: hasMil,
          militaryService: {
            branch: savedData.militaryService?.branch || "",
            from: savedData.militaryService?.from ? savedData.militaryService.from.split("T")[0] : "",
            to: savedData.militaryService?.to ? savedData.militaryService.to.split("T")[0] : "",
            rankAtDischarge: savedData.militaryService?.rankAtDischarge || "",
            typeOfDischarge: savedData.militaryService?.typeOfDischarge || "",
            otherThanHonorable: savedData.militaryService?.otherThanHonorable || "",
            mayContactSupervisor: savedData.militaryService?.mayContactSupervisor || "",
            reasonForLeaving: savedData.militaryService?.reasonForLeaving || "",
          },
        };
      });
    }
  }, [savedData]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      // Normalize hasMilitaryService back to boolean or string for consistency
      const normalizedData = {
        ...formData,
        hasMilitaryService: formData.hasMilitaryService === "YES" ? true : formData.hasMilitaryService === "NO" ? false : "",
      };
      onFormChange(normalizedData);
    }
  }, [formData]);

  const handleInputChange = (field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMilitaryServiceChange = (field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      militaryService: {
        ...prev.militaryService,
        [field]: value,
      },
    }));
  };

  const getMissingFields = () => {
    const missing = [];
    if (!formData.hasMilitaryService) {
      missing.push("Military Service Selection");
    }
    if (formData.hasMilitaryService === "YES") {
      if (!formData.militaryService.branch?.trim()) missing.push("Branch");
      if (!formData.militaryService.from?.trim()) missing.push("Service From Date");
      if (!formData.militaryService.to?.trim()) missing.push("Service To Date");
      if (!formData.militaryService.rankAtDischarge?.trim()) missing.push("Rank at Discharge");
      if (!formData.militaryService.typeOfDischarge?.trim()) missing.push("Type of Discharge");
      if (!formData.militaryService.mayContactSupervisor) missing.push("May we contact supervisor");
      if (!formData.militaryService.reasonForLeaving?.trim()) missing.push("Reason for Leaving");
    }
    return missing;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the required fields: ${missingFields.join(", ")}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        hasMilitaryService: formData.hasMilitaryService === "YES",
        militaryService: formData.hasMilitaryService === "YES" ? formData.militaryService : {
          branch: "",
          from: "",
          to: "",
          rankAtDischarge: "",
          typeOfDischarge: "",
          otherThanHonorable: "",
          mayContactSupervisor: "",
          reasonForLeaving: "",
        },
      };

      if (onComplete) {
        await onComplete(payload);
      } else {
        toast.success("Military Service details completed!");
      }
    } catch (error) {
      console.error("Error submitting ProfessionalExperience form:", error);
      toast.error("Failed to submit Military Service details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-sans">
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
                  <Briefcase className="w-6 h-6 md:w-8 md:h-8 mb-2 sm:mb-0 sm:mr-3" />
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                      Military Service
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1">
                      Part 1: Employment Application
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields container */}
            <div className="space-y-8">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1F3A93] mb-4 pb-2 border-b-2 border-[#1F3A93]">
                  Military Service Experience
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Do you have military service experience? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="hasMilitaryService"
                        value="YES"
                        checked={formData.hasMilitaryService === "YES"}
                        onChange={(e) => handleInputChange("hasMilitaryService", e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={isReadOnly}
                        required
                      />
                      <span className="ml-2 text-gray-700 font-medium">YES</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="hasMilitaryService"
                        value="NO"
                        checked={formData.hasMilitaryService === "NO"}
                        onChange={(e) => handleInputChange("hasMilitaryService", e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={isReadOnly}
                        required
                      />
                      <span className="ml-2 text-gray-700 font-medium">NO</span>
                    </label>
                  </div>
                </div>

                {formData.hasMilitaryService === "YES" && (
                  <div className="border border-gray-200 rounded-lg p-6 space-y-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Branch"
                        value={formData.militaryService.branch}
                        onChange={(val) => handleMilitaryServiceChange("branch", val)}
                        placeholder="e.g., Army, Navy, Air Force, Marines, Coast Guard"
                        required
                        disabled={isReadOnly}
                      />
                      <FormInput
                        label="From"
                        value={formData.militaryService.from}
                        onChange={(val) => handleMilitaryServiceChange("from", val)}
                        type="date"
                        required
                        disabled={isReadOnly}
                      />
                      <FormInput
                        label="To"
                        value={formData.militaryService.to}
                        onChange={(val) => handleMilitaryServiceChange("to", val)}
                        type="date"
                        required
                        disabled={isReadOnly}
                      />
                      <FormInput
                        label="Rank at Discharge"
                        value={formData.militaryService.rankAtDischarge}
                        onChange={(val) => handleMilitaryServiceChange("rankAtDischarge", val)}
                        placeholder="e.g., Sergeant"
                        required
                        disabled={isReadOnly}
                      />
                      <FormInput
                        label="Type of Discharge"
                        value={formData.militaryService.typeOfDischarge}
                        onChange={(val) => handleMilitaryServiceChange("typeOfDischarge", val)}
                        placeholder="e.g., Honorable"
                        required
                        disabled={isReadOnly}
                      />
                      <FormTextarea
                        label="If other than honorable, explain"
                        value={formData.militaryService.otherThanHonorable}
                        onChange={(val) => handleMilitaryServiceChange("otherThanHonorable", val)}
                        placeholder="Please provide details..."
                        rows={3}
                        disabled={isReadOnly}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          May we contact your previous supervisor for a reference? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="mayContactSupervisor"
                              value="YES"
                              checked={formData.militaryService.mayContactSupervisor === "YES"}
                              onChange={(e) => handleMilitaryServiceChange("mayContactSupervisor", e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              disabled={isReadOnly}
                              required
                            />
                            <span className="ml-2 text-gray-700 font-medium">YES</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="mayContactSupervisor"
                              value="NO"
                              checked={formData.militaryService.mayContactSupervisor === "NO"}
                              onChange={(e) => handleMilitaryServiceChange("mayContactSupervisor", e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              disabled={isReadOnly}
                              required
                            />
                            <span className="ml-2 text-gray-700 font-medium">NO</span>
                          </label>
                        </div>
                      </div>

                      <FormTextarea
                        label="Reason for Leaving"
                        value={formData.militaryService.reasonForLeaving}
                        onChange={(val) => handleMilitaryServiceChange("reasonForLeaving", val)}
                        placeholder="Explain your reason for leaving..."
                        rows={3}
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>
                )}
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

ProfessionalExperience.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default ProfessionalExperience;
