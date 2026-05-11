import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const WorkExperience = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [hasWorkedBefore, setHasWorkedBefore] = useState(null); // null, true, or false
  const [workExperiences, setWorkExperiences] = useState([
    {
      company: "",
      phone: "",
      address: "",
      supervisor: "",
      jobTitle: "",
      startingSalaryType: "hourly",
      startingSalaryAmount: "",
      endingSalaryType: "hourly",
      endingSalaryAmount: "",
      responsibilities: "",
      from: "",
      to: "",
      reasonForLeaving: "",
      contactSupervisor: null,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      // Determine hasWorkedBefore
      if (savedData.hasPreviousWorkExperience !== undefined) {
        setHasWorkedBefore(savedData.hasPreviousWorkExperience);
      } else if (savedData.workExperiences?.length > 0) {
        setHasWorkedBefore(true);
      }

      if (savedData.workExperiences?.length > 0) {
        setWorkExperiences(
          savedData.workExperiences.map((exp) => ({
            company: exp.company || "",
            phone: exp.phone || "",
            address: exp.address || "",
            supervisor: exp.supervisor || "",
            jobTitle: exp.jobTitle || "",
            startingSalaryType: exp.startingSalaryType || "hourly",
            startingSalaryAmount: exp.startingSalaryAmount || "",
            endingSalaryType: exp.endingSalaryType || "hourly",
            endingSalaryAmount: exp.endingSalaryAmount || "",
            responsibilities: exp.responsibilities || "",
            from: exp.from ? exp.from.split("T")[0] : "",
            to: exp.to ? exp.to.split("T")[0] : "",
            reasonForLeaving: exp.reasonForLeaving || "",
            contactSupervisor: exp.contactSupervisor,
          }))
        );
      }
    }
  }, [savedData]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        hasPreviousWorkExperience: hasWorkedBefore,
        workExperiences: hasWorkedBefore ? workExperiences : [],
      });
    }
  }, [hasWorkedBefore, workExperiences]);

  const formatPhone = (value) => {
    const withoutPrefix = value.replace(/^\+1\s*/, "");
    const cleaned = withoutPrefix.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);

    if (limited.length === 0) {
      return "";
    } else if (limited.length <= 3) {
      return `+1 (${limited}`;
    } else if (limited.length <= 6) {
      return `+1 (${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return `+1 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const updateWorkExperience = (index, field, value) => {
    if (isReadOnly) return;
    setWorkExperiences((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addWorkExperience = () => {
    if (isReadOnly) return;
    setWorkExperiences((prev) => [
      ...prev,
      {
        company: "",
        phone: "",
        address: "",
        supervisor: "",
        jobTitle: "",
        startingSalaryType: "hourly",
        startingSalaryAmount: "",
        endingSalaryType: "hourly",
        endingSalaryAmount: "",
        responsibilities: "",
        from: "",
        to: "",
        reasonForLeaving: "",
        contactSupervisor: null,
      },
    ]);
  };

  const removeWorkExperience = (index) => {
    if (isReadOnly) return;
    if (workExperiences.length > 1) {
      setWorkExperiences((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const getMissingFields = () => {
    const missing = [];
    if (hasWorkedBefore === null) {
      missing.push("Previous work experience selection");
    } else if (hasWorkedBefore === true) {
      workExperiences.forEach((exp, index) => {
        const label = exp.company?.trim() || `Experience ${index + 1}`;
        if (!exp.company?.trim()) {
          missing.push(`Company for Experience ${index + 1}`);
        }
        if (!exp.jobTitle?.trim()) {
          missing.push(`Job Title for ${label}`);
        }
        if (!exp.responsibilities?.trim()) {
          missing.push(`Responsibilities for ${label}`);
        }
        if (!exp.from) {
          missing.push(`From Date for ${label}`);
        }
        if (!exp.to) {
          missing.push(`To Date for ${label}`);
        }
      });
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
      if (onComplete) {
        await onComplete({
          hasPreviousWorkExperience: hasWorkedBefore,
          workExperiences: hasWorkedBefore ? workExperiences : [],
        });
      } else {
        toast.success("Previous employment saved!");
      }
    } catch (error) {
      console.error("Error submitting work experience form:", error);
      toast.error("Failed to submit work experience.");
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
                      Previous Employment
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1">
                      Part 1: Employment Application
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Initial Question */}
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-base md:text-lg font-bold text-gray-800 mb-4">
                Do you have any previous work experience? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasWorkedBefore"
                    value="yes"
                    checked={hasWorkedBefore === true}
                    onChange={() => setHasWorkedBefore(true)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isReadOnly}
                    required
                  />
                  <span className="ml-3 text-base font-semibold text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasWorkedBefore"
                    value="no"
                    checked={hasWorkedBefore === false}
                    onChange={() => {
                      setHasWorkedBefore(false);
                      setWorkExperiences([
                        {
                          company: "",
                          phone: "",
                          address: "",
                          supervisor: "",
                          jobTitle: "",
                          startingSalaryType: "hourly",
                          startingSalaryAmount: "",
                          endingSalaryType: "hourly",
                          endingSalaryAmount: "",
                          responsibilities: "",
                          from: "",
                          to: "",
                          reasonForLeaving: "",
                          contactSupervisor: null,
                        },
                      ]);
                    }}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isReadOnly}
                    required
                  />
                  <span className="ml-3 text-base font-semibold text-gray-700">No</span>
                </label>
              </div>
            </div>

            {hasWorkedBefore === false && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-base font-semibold text-green-800">
                  ✓ No previous work experience recorded. You can proceed to the next section.
                </p>
              </div>
            )}

            {/* List employment entries */}
            {hasWorkedBefore === true && (
              <div className="space-y-8">
                {workExperiences.map((experience, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-lg bg-slate-50/50">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-150">
                      <h3 className="text-base md:text-lg font-bold text-gray-700">
                        Previous Employment {index + 1}
                      </h3>
                      {workExperiences.length > 1 && !isReadOnly && (
                        <button
                          type="button"
                          onClick={() => removeWorkExperience(index)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          ✕ Remove Entry
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={experience.company || ""}
                          onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                          placeholder="Company or Employer Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={experience.phone || ""}
                          onChange={(e) => updateWorkExperience(index, "phone", formatPhone(e.target.value))}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={experience.address || ""}
                          onChange={(e) => updateWorkExperience(index, "address", e.target.value)}
                          placeholder="City, State or Full Address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Supervisor
                        </label>
                        <input
                          type="text"
                          value={experience.supervisor || ""}
                          onChange={(e) => updateWorkExperience(index, "supervisor", e.target.value)}
                          placeholder="Supervisor Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={experience.jobTitle || ""}
                          onChange={(e) => updateWorkExperience(index, "jobTitle", e.target.value)}
                          placeholder="e.g. Registered Nurse, Office Manager"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Starting Salary
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={experience.startingSalaryType || "hourly"}
                            onChange={(e) => updateWorkExperience(index, "startingSalaryType", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            disabled={isReadOnly}
                          >
                            <option value="hourly">Hourly</option>
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                          <input
                            type="text"
                            value={experience.startingSalaryAmount || ""}
                            onChange={(e) => updateWorkExperience(index, "startingSalaryAmount", e.target.value)}
                            placeholder="Amount (e.g. 25)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Ending Salary
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={experience.endingSalaryType || "hourly"}
                            onChange={(e) => updateWorkExperience(index, "endingSalaryType", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            disabled={isReadOnly}
                          >
                            <option value="hourly">Hourly</option>
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                          <input
                            type="text"
                            value={experience.endingSalaryAmount || ""}
                            onChange={(e) => updateWorkExperience(index, "endingSalaryAmount", e.target.value)}
                            placeholder="Amount (e.g. 28)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Responsibilities <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={experience.responsibilities || ""}
                          onChange={(e) => updateWorkExperience(index, "responsibilities", e.target.value)}
                          placeholder="Describe your roles and responsibilities in this job..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          From <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={experience.from || ""}
                          onChange={(e) => updateWorkExperience(index, "from", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          To <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={experience.to || ""}
                          onChange={(e) => updateWorkExperience(index, "to", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Reason for Leaving
                        </label>
                        <input
                          type="text"
                          value={experience.reasonForLeaving || ""}
                          onChange={(e) => updateWorkExperience(index, "reasonForLeaving", e.target.value)}
                          placeholder="e.g. Career advancement, Relocation"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          May we contact your previous supervisor for a reference?
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`contactSupervisor_${index}`}
                              value="yes"
                              checked={experience.contactSupervisor === true}
                              onChange={() => updateWorkExperience(index, "contactSupervisor", true)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              disabled={isReadOnly}
                            />
                            <span className="ml-2 text-sm font-semibold text-gray-700">YES</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`contactSupervisor_${index}`}
                              value="no"
                              checked={experience.contactSupervisor === false}
                              onChange={() => updateWorkExperience(index, "contactSupervisor", false)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              disabled={isReadOnly}
                            />
                            <span className="ml-2 text-sm font-semibold text-gray-700">NO</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={addWorkExperience}
                    className="w-full px-4 py-3 bg-green-50 border-2 border-green-300 border-dashed text-green-700 rounded-lg hover:bg-green-100 transition-colors font-bold flex items-center justify-center gap-2"
                  >
                    <span>+ Add Previous Employment</span>
                  </button>
                )}
              </div>
            )}

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

WorkExperience.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default WorkExperience;
