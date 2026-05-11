import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  GraduationCap,
  Target,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const Education = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [educations, setEducations] = useState([
    {
      type: "High School",
      institutionName: "",
      address: "",
      from: "",
      to: "",
      didGraduate: "",
      diploma: "",
    },
    {
      type: "College",
      institutionName: "",
      address: "",
      from: "",
      to: "",
      didGraduate: "",
      degree: "",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      let history = [];
      if (Array.isArray(savedData)) {
        history = savedData;
      } else if (savedData.educations && Array.isArray(savedData.educations)) {
        history = savedData.educations;
      } else if (savedData.educationHistory && Array.isArray(savedData.educationHistory)) {
        history = savedData.educationHistory;
      }

      if (history.length > 0) {
        setEducations(
          history.map((edu) => ({
            type: edu.type || "",
            institutionName: edu.institutionName || "",
            address: edu.address || "",
            from: edu.from ? edu.from.split("T")[0] : "",
            to: edu.to ? edu.to.split("T")[0] : "",
            didGraduate: edu.didGraduate || "",
            degree: edu.degree || "",
            diploma: edu.diploma || "",
          }))
        );
      }
    }
  }, [savedData]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange({ educations });
    }
  }, [educations]);

  const updateEducation = (index, field, value) => {
    if (isReadOnly) return;
    setEducations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addEducation = () => {
    if (isReadOnly) return;
    setEducations((prev) => [
      ...prev,
      {
        type: "",
        institutionName: "",
        address: "",
        from: "",
        to: "",
        didGraduate: "",
        degree: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    if (isReadOnly) return;
    setEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const getMissingFields = () => {
    const missing = [];
    educations.forEach((edu, index) => {
      const entryLabel = edu.type || `Entry ${index + 1}`;
      if (!edu.institutionName?.trim()) {
        missing.push(`Institution Name for ${entryLabel}`);
      }
      if (!edu.address?.trim()) {
        missing.push(`Address for ${entryLabel}`);
      }
      if (!edu.didGraduate) {
        missing.push(`Did you graduate? status for ${entryLabel}`);
      }
      if (edu.didGraduate === "YES") {
        if (edu.type === "High School" && !edu.diploma?.trim()) {
          missing.push(`Diploma for ${entryLabel}`);
        } else if (edu.type !== "High School" && !edu.degree?.trim()) {
          missing.push(`Degree/Certificate for ${entryLabel}`);
        }
      }
      if (index > 1 && !edu.type?.trim()) {
        missing.push(`Institution Type for entry ${index + 1}`);
      }
    });
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
        await onComplete({ educations });
      } else {
        toast.success("Education form submitted!");
      }
    } catch (error) {
      console.error("Error submitting education form:", error);
      toast.error("Failed to submit education details.");
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
                  <GraduationCap className="w-6 h-6 md:w-8 md:h-8 mb-2 sm:mb-0 sm:mr-3" />
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                      Education
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1">
                      Part 1: Employment Application
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forms section */}
            <div className="space-y-8">
              {educations.map((education, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg relative bg-slate-50/50">
                  {index > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                      title="Remove education entry"
                      disabled={isReadOnly}
                    >
                      ✕
                    </button>
                  )}

                  <h3 className="text-lg font-bold text-gray-700 mb-4">
                    {education.type || `Education Entry ${index + 1}`}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {index > 1 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Institution Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={education.type || ""}
                          onChange={(e) => updateEducation(index, "type", e.target.value)}
                          placeholder="e.g., University, Trade School, Online Course"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                          required
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {index === 0
                          ? "High School Name"
                          : index === 1
                          ? "College/University Name"
                          : "Institution Name"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={education.institutionName || ""}
                        onChange={(e) => updateEducation(index, "institutionName", e.target.value)}
                        placeholder={
                          index === 0
                            ? "e.g., Lincoln High School"
                            : index === 1
                            ? "e.g., Harvard University"
                            : "e.g., Institution Name"
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={education.address || ""}
                        onChange={(e) => updateEducation(index, "address", e.target.value)}
                        placeholder="City, State or Full Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        value={education.from || ""}
                        onChange={(e) => updateEducation(index, "from", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        value={education.to || ""}
                        onChange={(e) => updateEducation(index, "to", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Did you graduate? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`graduate_${index}`}
                            value="YES"
                            checked={education.didGraduate === "YES"}
                            onChange={(e) => updateEducation(index, "didGraduate", e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            disabled={isReadOnly}
                            required
                          />
                          <span className="ml-2 text-gray-700 font-medium">YES</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`graduate_${index}`}
                            value="NO"
                            checked={education.didGraduate === "NO"}
                            onChange={(e) => {
                              updateEducation(index, "didGraduate", e.target.value);
                              updateEducation(index, "diploma", "");
                              updateEducation(index, "degree", "");
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            disabled={isReadOnly}
                            required
                          />
                          <span className="ml-2 text-gray-700 font-medium">NO</span>
                        </label>
                      </div>
                    </div>

                    {education.didGraduate === "YES" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          {education.type === "High School"
                            ? "Diploma"
                            : "Degree/Certificate"}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={education.type === "High School" ? education.diploma || "" : education.degree || ""}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              education.type === "High School" ? "diploma" : "degree",
                              e.target.value
                            )
                          }
                          placeholder={
                            education.type === "High School"
                              ? "e.g., High School Diploma"
                              : "e.g., Bachelor of Science, Certificate"
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                          disabled={isReadOnly}
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Education Button */}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={addEducation}
                  className="mb-8 w-full px-4 py-3 bg-green-50 border-2 border-green-300 border-dashed text-green-700 rounded-lg hover:bg-green-100 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <span>+ Add Education Entry</span>
                </button>
              )}
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

Education.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default Education;
