import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  Send,
  Target
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const OrientationChecklist = ({
  enrollmentId,
  savedData,
  onComplete,
  progressCurrent,
  progressTotal,
  isReadOnly,
  onNext,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    policies: false,
    duties: false,
    emergencies: false,
    tbExposure: false,
    clientRights: false,
    complaints: false,
    documentation: false,
    handbook: false,
    applicantSignature: "",
    signatureDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (savedData) {
      setFormData(prev => ({
        ...prev,
        ...savedData,
        signatureDate: savedData.signatureDate 
          ? new Date(savedData.signatureDate).toISOString().slice(0, 10) 
          : prev.signatureDate
      }));
    }
  }, [savedData]);

  const handleCheckboxChange = (field) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    const requiredCheckboxes = [
      "policies", "duties", "emergencies", "tbExposure", 
      "clientRights", "complaints", "documentation", "handbook"
    ];
    
    const missing = requiredCheckboxes.filter(key => !formData[key]);
    
    if (missing.length > 0) {
      toast.error("Please acknowledge all statements before submitting.");
      return false;
    }

    if (!formData.applicantSignature?.trim()) {
      toast.error("Please provide your signature.");
      return false;
    }

    return true;
  };

  const handleSaveAndNext = async () => {
    if (isReadOnly) {
        if (onNext) onNext();
        return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete({ ...formData, status: "submitted" });
      }
    } catch (error) {
      console.error("Error saving orientation checklist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statements = [
    {
      key: "policies",
      text: "I have read and understand the policies and procedures regarding scope of services and the types of clients served",
      highlight: "bg-gradient-to-r from-blue-50 to-indigo-50",
    },
    {
      key: "duties",
      text: "I have read and understand my assigned duties and responsibilities",
      highlight: "bg-gradient-to-r from-amber-50 to-yellow-50",
    },
    {
      key: "emergencies",
      text: "I understand to report client emergencies, problems and/or progress to supervisory nurse",
      highlight: "bg-gradient-to-r from-sky-50 to-blue-50",
    },
    {
      key: "tbExposure",
      text: "I understand that I must report suspected exposure to TB to the agency",
      highlight: "bg-gradient-to-r from-emerald-50 to-green-50",
    },
    {
      key: "clientRights",
      text: "I have read and understand the client rights",
      highlight: "bg-gradient-to-r from-orange-50 to-amber-50",
    },
    {
      key: "complaints",
      text: "I have read procedures regarding handling of complaints, medical emergencies and other incidents",
      highlight: "bg-gradient-to-r from-purple-50 to-violet-50",
    },
    {
      key: "documentation",
      text: "I have read and understand the required daily documentation of activities as client is being served",
      highlight: "bg-gradient-to-r from-teal-50 to-emerald-50",
    },
    {
      key: "handbook",
      text: "I have received a copy of the Pacific Health Systems Employee Handbook",
      highlight: "bg-gradient-to-r from-indigo-50 to-blue-50",
    },
  ];

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-gray-50 min-h-screen text-black font-sans p-0">
      <ProgressBar
        currentStep={progressCurrent}
        totalSteps={progressTotal || 1}
      />
      <div className="flex-1 flex flex-col items-center py-8 w-full px-4 overflow-x-auto">
        <div className="w-full max-w-[950px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden p-3 sm:p-6 md:p-10 mb-8 mx-auto text-black font-sans">
          <div className="max-w-4xl mx-auto bg-white">
            {/* Header with Logo */}
            <div className="bg-gradient-to-r from-[#1F3A93] to-[#2748B4] text-white text-center py-8 px-6 rounded-2xl mb-8">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 relative shadow-lg">
                  <svg width="32" height="20" viewBox="0 0 40 24" className="text-white">
                    <path d="M2 20 L8 14 L14 18 L20 12 L26 16 L32 10 L38 14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-white">PACIFIC</span>
                    <span className="text-2xl font-bold text-red-200 tracking-tight">HEALTH</span>
                    <span className="text-2xl font-bold tracking-tight text-white">SYSTEMS</span>
                  </div>
                  <div className="text-xs text-blue-100 font-medium tracking-[0.2em] mt-1 uppercase">
                    Private Homecare Services
                  </div>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase">
                Documentation of Orientation
              </h2>
            </div>

            <div className="mb-10 bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-800 leading-relaxed font-medium">
               After attending the Pacific Health Systems Services orientation, please acknowledge the following statements and sign below:
            </div>

            <div className="space-y-4 mb-12">
              {statements.map((statement, index) => (
                <div
                  key={statement.key}
                  className={`flex items-start gap-4 p-5 rounded-2xl border border-gray-200 transition-all hover:shadow-md cursor-pointer ${formData[statement.key] ? 'ring-2 ring-blue-500 bg-white' : statement.highlight}`}
                  onClick={() => handleCheckboxChange(statement.key)}
                >
                  <div className="mt-1">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData[statement.key] ? 'bg-blue-600 border-blue-600 shadow-sm' : 'border-gray-300 bg-white'}`}>
                      {formData[statement.key] && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                     <p className={`text-base sm:text-lg font-semibold leading-snug ${formData[statement.key] ? 'text-blue-900' : 'text-gray-700'}`}>
                        {statement.text}
                     </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Section */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-inner mb-12">
              <h3 className="text-xl font-bold text-[#1F3A93] mb-8 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Electronic Signature
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
                    Full Legal Name (Signature) *
                  </label>
                  <input
                    type="text"
                    value={formData.applicantSignature}
                    onChange={(e) => handleInputChange("applicantSignature", e.target.value)}
                    placeholder="Type your full name"
                    disabled={isReadOnly}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-2xl"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    This electronic signature is legally binding.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
                    Date Signed *
                  </label>
                  <input
                    type="date"
                    value={formData.signatureDate}
                    onChange={(e) => handleInputChange("signatureDate", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-gray-700"
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
                  onClick={handleSaveAndNext}
                  onNext={onNext}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
    </div>
  );
};

OrientationChecklist.propTypes = {
  enrollmentId: PropTypes.string,
  savedData: PropTypes.object,
  onComplete: PropTypes.func,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default OrientationChecklist;
