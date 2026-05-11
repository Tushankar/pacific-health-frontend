import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Users,
  ArrowLeft,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const References = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [references, setReferences] = useState([
    { fullName: "", relationship: "", company: "", phone: "", address: "" },
    { fullName: "", relationship: "", company: "", phone: "", address: "" },
    { fullName: "", relationship: "", company: "", phone: "", address: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      let loadedRefs = [];
      if (Array.isArray(savedData)) {
        loadedRefs = savedData;
      } else if (savedData.references && Array.isArray(savedData.references)) {
        loadedRefs = savedData.references;
      }

      if (loadedRefs.length > 0) {
        const mappedRefs = loadedRefs.map((ref) => ({
          fullName: ref.fullName || "",
          relationship: ref.relationship || "",
          company: ref.company || "",
          phone: ref.phone || "",
          address: ref.address || "",
        }));
        // Guarantee at least 3 items
        while (mappedRefs.length < 3) {
          mappedRefs.push({ fullName: "", relationship: "", company: "", phone: "", address: "" });
        }
        setReferences(mappedRefs);
      }
    }
  }, [savedData]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange({ references });
    }
  }, [references]);

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

  const updateReference = (index, field, value) => {
    if (isReadOnly) return;
    setReferences((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addReference = () => {
    if (isReadOnly) return;
    setReferences((prev) => [
      ...prev,
      { fullName: "", relationship: "", company: "", phone: "", address: "" },
    ]);
  };

  const removeReference = (index) => {
    if (isReadOnly) return;
    if (index >= 3) {
      setReferences((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const getMissingFields = () => {
    const missing = [];
    references.forEach((ref, index) => {
      const label = ref.fullName?.trim() || `Reference ${index + 1}`;
      if (!ref.fullName?.trim()) {
        missing.push(`Full Name for Reference ${index + 1}`);
      }
      if (!ref.relationship?.trim()) {
        missing.push(`Relationship for ${label}`);
      }
      if (!ref.company?.trim()) {
        missing.push(`Company for ${label}`);
      }
      if (!ref.phone?.trim()) {
        missing.push(`Phone number for ${label}`);
      }
      if (!ref.address?.trim()) {
        missing.push(`Address for ${label}`);
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
        await onComplete({ references });
      } else {
        toast.success("References form submitted!");
      }
    } catch (error) {
      console.error("Error submitting references form:", error);
      toast.error("Failed to submit references.");
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
                  <Users className="w-6 h-6 md:w-8 md:h-8 mb-2 sm:mb-0 sm:mr-3" />
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                      Professional References
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1">
                      Part 1: Employment Application
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8 text-sm md:text-base leading-relaxed">
              Please list three professional references.
            </p>

            {/* List entries */}
            <div className="space-y-8">
              {references.map((reference, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-150">
                    <h3 className="text-base md:text-lg font-bold text-gray-700">
                      Reference {index + 1}
                    </h3>
                    {index >= 3 && !isReadOnly && (
                      <button
                        type="button"
                        onClick={() => removeReference(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        ✕ Remove Reference
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={reference.fullName || ""}
                        onChange={(e) => updateReference(index, "fullName", e.target.value)}
                        placeholder="First and Last Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={reference.relationship || ""}
                        onChange={(e) => updateReference(index, "relationship", e.target.value)}
                        placeholder="e.g. Manager, Supervisor, Colleague"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={reference.company || ""}
                        onChange={(e) => updateReference(index, "company", e.target.value)}
                        placeholder="Organization or Company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={reference.phone || ""}
                        onChange={(e) => updateReference(index, "phone", formatPhone(e.target.value))}
                        placeholder="+1 (555) 123-4567"
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
                        value={reference.address || ""}
                        onChange={(e) => updateReference(index, "address", e.target.value)}
                        placeholder="City, State or Full Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                        disabled={isReadOnly}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {!isReadOnly && (
                <button
                  type="button"
                  onClick={addReference}
                  className="w-full px-4 py-3 bg-green-50 border-2 border-green-300 border-dashed text-green-700 rounded-lg hover:bg-green-100 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <span>+ Add Reference</span>
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

References.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default References;
