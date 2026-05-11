import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, CheckCircle, FileText, Send, RotateCcw, UserPlus, Phone, MapPin, Info } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const EmergencyContactForm = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    staffName: "",
    title: "",
    employeeName1: "",
    contactAddress1: "",
    phoneNumber1: "",
    employeeName2: "",
    contactAddress2: "",
    phoneNumber2: "",
    employeeName3: "",
    contactAddress3: "",
    phoneNumber3: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({
        ...prev,
        ...savedData,
      }));
    }
  }, [savedData]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]);

  const formatPhone = (value) => {
    const withoutPrefix = value.replace(/^\+1\s*/, "");
    const cleaned = withoutPrefix.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);

    if (limited.length === 0) return "";
    if (limited.length <= 3) return `+1 (${limited}`;
    if (limited.length <= 6) return `+1 (${limited.slice(0, 3)}) ${limited.slice(3)}`;
    return `+1 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  };

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    const formattedValue = name.includes("phoneNumber") ? formatPhone(value) : value;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    const newErrors = {};
    if (!formData.staffName?.trim()) newErrors.staffName = true;
    if (!formData.title?.trim()) newErrors.title = true;
    if (!formData.employeeName1?.trim()) newErrors.employeeName1 = true;
    if (!formData.contactAddress1?.trim()) newErrors.contactAddress1 = true;
    if (!formData.phoneNumber1?.trim()) newErrors.phoneNumber1 = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(formData);
      } else {
        toast.success("Emergency Contact information saved successfully!");
      }
    } catch (error) {
      console.error("Error saving emergency contact:", error);
      toast.error("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-sans">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8 w-full">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          
          {/* Header - MATCHING HRMS exactly */}
          <div className="bg-[#1F3A93] text-white p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UserPlus className="w-8 h-8 mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                  Emergency Contact Information
                </h1>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Instructions Section - MATCHING HRMS exactly */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-2">Complete Your Emergency Contact Information</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Enter your staff name and title</li>
                    <li>Provide information for up to 3 emergency contacts</li>
                    <li>Ensure all contact details are accurate and complete</li>
                    <li>Click Save & Next to proceed</li>
                  </ol>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Staff Information Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Staff Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Staff Name *</label>
                    <input
                      type="text"
                      name="staffName"
                      value={formData.staffName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white transition-all ${
                        errors.staffName ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Title/Position *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter your job title"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white transition-all ${
                        errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact 1 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Emergency Contact 1 *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <input
                      type="text"
                      name="employeeName1"
                      value={formData.employeeName1}
                      onChange={handleChange}
                      placeholder="Full name"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white transition-all ${
                        errors.employeeName1 ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="contactAddress1"
                      value={formData.contactAddress1}
                      onChange={handleChange}
                      placeholder="Street address"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white transition-all ${
                        errors.contactAddress1 ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber1"
                      value={formData.phoneNumber1}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white transition-all ${
                        errors.phoneNumber1 ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact 2 */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Emergency Contact 2 (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <input
                      type="text"
                      name="employeeName2"
                      value={formData.employeeName2}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white transition-all"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="contactAddress2"
                      value={formData.contactAddress2}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white transition-all"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber2"
                      value={formData.phoneNumber2}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white transition-all"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Emergency Contact 3 (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <input
                      type="text"
                      name="employeeName3"
                      value={formData.employeeName3}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white transition-all"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="contactAddress3"
                      value={formData.contactAddress3}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white transition-all"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber3"
                      value={formData.phoneNumber3}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white transition-all"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Important Notice - MATCHING HRMS exactly */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-2">Important Notice</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>All fields marked with * are required</li>
                  <li>At least one emergency contact is required</li>
                  <li>Ensure contact details are current and accurate</li>
                  <li>This information will be used in case of emergency</li>
                </ul>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

EmergencyContactForm.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default EmergencyContactForm;
