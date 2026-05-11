import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  FileText,
  Target,
  Send,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const StaffMisconductForm = ({
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
  const [formData, setFormData] = useState({
    staffTitle: "",
    companyName: "Pacific Health Systems LLC",
    employeeNameParagraph: "",
    employeeName: "",
    employmentPosition: "",
    signatureLine: "",
    dateField1: new Date().toISOString().split("T")[0],
    exhibitName: "",
    printName: "",
    signatureField: "",
    dateField2: new Date().toISOString().split("T")[0],
    notaryDay: "",
    notaryMonth: "",
    notaryYear: "",
    notarySignature: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      setFormData((prev) => ({ ...prev, ...savedData }));
    } else {
      // Pre-fill from Applicant Information if available
      const appInfoForm = activeEnrollment?.forms?.find(f => f.name === "Applicant Information" || f.formId === 101);
      if (appInfoForm?.data) {
        const d = appInfoForm.data;
        const fullName = `${d.firstName || ""} ${d.lastName || ""}`.trim();
        setFormData(prev => ({
          ...prev,
          employeeName: fullName,
          employeeNameParagraph: fullName,
          printName: fullName,
        }));
      }
    }
  }, [savedData, activeEnrollment]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (onFormChange) onFormChange(updated);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!formData.signatureLine || !formData.signatureField) {
      toast.error("Please provide both signatures required on the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(formData);
      }
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-gray-50 min-h-screen text-black font-sans p-0">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center py-8 w-full px-4">
        
        {/* PARENT CONTAINER - MATCHING HRMS SCREENSHOT */}
        <div className="w-full max-w-[850px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden p-6 sm:p-12 mb-8 mx-auto">
          
          {/* Status Banner - MATCHING HRMS SCREENSHOT */}
          {(formData.signatureLine || formData.signatureField) && (
            <div className="mb-8 p-4 rounded-lg border bg-green-50 border-green-200">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-base font-semibold text-green-800">
                    ✅ Progress Updated - Form Completed Successfully
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    You cannot make any changes to the form until HR provides their feedback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Staff Misconduct Statement
            </h1>
            <p className="text-base text-gray-600">
              Sign the form and provide the date to acknowledge your understanding
            </p>
          </div>

          {/* Instructions Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-8 mb-10">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📋</span>
                  <h3 className="text-lg font-bold text-gray-800">Instructions</h3>
                </div>
                <ol className="space-y-4 text-sm sm:text-base text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                    <span>Fill out the Staff Misconduct Statement form below</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                    <span>Carefully read and complete all required fields</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                    <span>Sign digitally using the signature pads in the form template</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                    <span>Click Save & Next to confirm</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* THE ACTUAL FORM DOCUMENT - SQUARE BORDER 1px BLACK */}
          <div
            className="w-full max-w-[700px] bg-white p-12 mx-auto"
            style={{
              fontFamily: "Times New Roman, serif",
              lineHeight: "1.6",
              fontSize: "12px",
              border: "1px solid #333",
            }}
          >
            <link
              href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
              rel="stylesheet"
            />

            {/* Document Header */}
            <div className="mb-4 text-left">
              <h1 className="tracking-wider uppercase" style={{ fontSize: "13px" }}>
                STAFF MISCONDUCT ABUSE STATEMENT FORM
              </h1>
            </div>

            {/* Staff Title */}
            <div className="mb-6 flex items-center" style={{ fontSize: "12px" }}>
              <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>STAFF TITLE: </span>
              <span className="border-b border-black ml-1 inline-block" style={{ width: "300px", minHeight: "20px" }}>
                <input
                  type="text"
                  value={formData.staffTitle}
                  onChange={(e) => handleChange("staffTitle", e.target.value)}
                  readOnly={isReadOnly}
                  className="border-0 bg-transparent w-full px-1 focus:outline-none"
                  style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                />
              </span>
            </div>

            {/* Body Text */}
            <div className="space-y-4 text-justify mt-10" style={{ fontSize: "12px" }}>
              <p>
                I understand and acknowledge that I must comply with <u>Pacific Health Systems LLC</u>, Code of Conduct and
                Abuse or Misconduct program.
              </p>

              <p>
                All laws, regulations, policies & procedure as well as any
                other applicable state or local ordinances as it pertains
                to the responsibilities of my position.
              </p>

              <p>
                I understand that my failure to report any concerns
                regarding possible violations of these laws, regulations,
                and Policies may result in disciplinary action, up to and
                including termination.
              </p>

              <div className="flex items-baseline flex-wrap">
                <span className="mr-1">I</span>
                <span className="inline-block border-b border-black align-middle" style={{ minWidth: "220px", minHeight: "20px" }}>
                  <input
                    type="text"
                    value={formData.employeeNameParagraph}
                    onChange={(e) => handleChange("employeeNameParagraph", e.target.value)}
                    readOnly={isReadOnly}
                    className="border-0 bg-transparent w-full px-1 focus:outline-none"
                    style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                  />
                </span>
                <span className="ml-1">as an employee of <u>Pacific Health Systems LLC</u>, I</span>
              </div>
              <p>
                hereby state that, I have never shown any misconduct nor
                have a history of abuse and neglect of others.
              </p>

              <p style={{ whiteSpace: "nowrap", marginBottom: "12px" }}>
                I acknowledge that I have received and read the Misconduct
                or abuse statement form and that I clearly understand it.
              </p>
            </div>

            {/* Employee Information Fields */}
            <div className="space-y-4 mt-4" style={{ fontSize: "12px" }}>
              <div className="flex items-baseline gap-2">
                <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>Name of Employee (print):</span>
                <span className="border-b border-black inline-block" style={{ width: "200px", minHeight: "20px" }}>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => handleChange("employeeName", e.target.value)}
                    readOnly={isReadOnly}
                    className="border-0 bg-transparent w-full px-1 focus:outline-none"
                    style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                  />
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>Employment Position:</span>
                <span className="border-b border-black inline-block" style={{ width: "200px", minHeight: "20px" }}>
                  <input
                    type="text"
                    value={formData.employmentPosition}
                    onChange={(e) => handleChange("employmentPosition", e.target.value)}
                    readOnly={isReadOnly}
                    className="border-0 bg-transparent w-full px-1 focus:outline-none"
                    style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                  />
                </span>
              </div>

              {/* Signature and Date Row 1 */}
              <div className="flex items-baseline gap-8">
                <div className="flex items-baseline gap-1 flex-1">
                  <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>Signature:</span>
                  <span className="flex-1 border-b border-black inline-block" style={{ minHeight: "20px" }}>
                    <input
                      type="text"
                      value={formData.signatureLine}
                      onChange={(e) => handleChange("signatureLine", e.target.value)}
                      readOnly={isReadOnly}
                      className="border-0 bg-transparent w-full px-1 focus:outline-none"
                      style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: "20px",
                        letterSpacing: "0.5px",
                        lineHeight: "20px"
                      }}
                    />
                  </span>
                </div>
                <div className="flex items-baseline gap-1 flex-1">
                  <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>Date:</span>
                  <span className="flex-1 border-b border-black inline-block" style={{ minHeight: "20px" }}>
                    <input
                      type="date"
                      value={formData.dateField1}
                      onChange={(e) => handleChange("dateField1", e.target.value)}
                      readOnly={isReadOnly}
                      className="border-0 bg-transparent w-full px-1 focus:outline-none"
                      style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Affidavit Section */}
            <div className="mt-8" style={{ fontSize: "12px", textAlign: "justify" }}>
              <p className="mt-5 font-bold">Who having been first duly sworn depose and say</p>
              
              <div className="flex items-baseline gap-1 mt-2">
                <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>that</span>
                <span className="border-b border-black inline-block" style={{ minWidth: "350px", minHeight: "20px" }}>
                  <input
                    type="text"
                    value={formData.exhibitName}
                    onChange={(e) => handleChange("exhibitName", e.target.value)}
                    readOnly={isReadOnly}
                    className="border-0 bg-transparent w-full px-1 focus:outline-none"
                    style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                  />
                </span>
                <span className="ml-1 whitespace-nowrap" style={{ lineHeight: "20px" }}>has never been shown to have exhibited</span>
              </div>
              <p className="mt-[2px]">
                any violent or abusive behavior or intentional or grossly
                negligent misconduct.
              </p>
              <p>
                Also have never been accused or convicted to have been
                abused, neglected, sexually assaulted, exploited, or
                deprived any person or to have subjected any person to
                serious injury as a result of intentional or grossly
                negligent misconduct as evidence by an oral or written
                statement to this effect obtained at the time of
                application.
              </p>
            </div>

            {/* Witness Section */}
            <div className="space-y-4 mt-2" style={{ fontSize: "12px" }}>
              <div className="flex items-baseline gap-4 mt-4">
                <div className="flex items-baseline gap-1" style={{ flex: "1.5" }}>
                  <span className="whitespace-nowrap font-bold" style={{ lineHeight: "20px" }}>Print Name:</span>
                  <span className="flex-1 border-b border-black inline-block" style={{ minHeight: "20px" }}>
                    <input
                      type="text"
                      value={formData.printName}
                      onChange={(e) => handleChange("printName", e.target.value)}
                      readOnly={isReadOnly}
                      className="border-0 bg-transparent w-full px-1 focus:outline-none"
                      style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                    />
                  </span>
                </div>
                <div className="flex items-baseline gap-1" style={{ flex: "1.2" }}>
                  <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>Signature:</span>
                  <span className="flex-1 border-b border-black inline-block" style={{ minHeight: "20px" }}>
                    <input
                      type="text"
                      value={formData.signatureField}
                      onChange={(e) => handleChange("signatureField", e.target.value)}
                      readOnly={isReadOnly}
                      className="border-0 bg-transparent w-full px-1 focus:outline-none"
                      style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: "20px",
                        letterSpacing: "0.5px",
                        lineHeight: "20px"
                      }}
                    />
                  </span>
                </div>
                <div className="flex items-baseline gap-1" style={{ flex: "0.8" }}>
                  <span className="whitespace-nowrap" style={{ lineHeight: "20px" }}>Date:</span>
                  <span className="flex-1 border-b border-black inline-block" style={{ minHeight: "20px" }}>
                    <input
                      type="date"
                      value={formData.dateField2}
                      onChange={(e) => handleChange("dateField2", e.target.value)}
                      readOnly={isReadOnly}
                      className="border-0 bg-transparent w-full px-1 focus:outline-none"
                      style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Notary Affidavit Section */}
            <div className="space-y-2 mt-8" style={{ fontSize: "12px" }}>
              <p className="italic font-bold mt-10">Notary Affidavit</p>
              <p className="text-xs sm:text-sm">State of: Georgia</p>

              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="whitespace-nowrap">Sworn and subscribed before me this</span>
                <span className="border-b border-black inline-block text-center" style={{ width: "40px", minHeight: "20px" }}>
                  <input
                    type="text"
                    value={formData.notaryDay}
                    onChange={(e) => handleChange("notaryDay", e.target.value)}
                    readOnly={isReadOnly}
                    className="border-0 bg-transparent w-full text-center focus:outline-none"
                    style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                  />
                </span>
                <span className="whitespace-nowrap">day of</span>
                <span className="border-b border-black inline-block" style={{ width: "70px", minHeight: "20px" }}>
                  <input
                    type="text"
                    value={formData.notaryMonth}
                    onChange={(e) => handleChange("notaryMonth", e.target.value)}
                    readOnly={isReadOnly}
                    className="border-0 bg-transparent w-full px-1 focus:outline-none"
                    style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                  />
                </span>
                <span className="whitespace-nowrap">Year</span>
                <span className="border-b border-black inline-block text-center" style={{ width: "50px", minHeight: "20px" }}>
                  <input
                    type="text"
                    value={formData.notaryYear}
                    onChange={(e) => handleChange("notaryYear", e.target.value)}
                    readOnly={isReadOnly}
                    className="border-0 bg-transparent w-full text-center focus:outline-none"
                    style={{ fontSize: "12px", fontFamily: "Times New Roman, serif", lineHeight: "20px" }}
                  />
                </span>
              </div>

              <div className="mt-6">
                <p className="mb-3 italic font-bold">Notary Seal</p>
                <div className="flex items-baseline gap-1" style={{ maxWidth: "50%" }}>
                  <span className="border-b border-black w-full inline-block min-h-[30px]"></span>
                </div>
                <p className="mt-1 text-[10px] font-bold">NOTARY PUBLIC SIGNATURE</p>
              </div>
            </div>
          </div>
          {/* Action Buttons - Standardized UI */}
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

StaffMisconductForm.propTypes = {
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

export default StaffMisconductForm;
