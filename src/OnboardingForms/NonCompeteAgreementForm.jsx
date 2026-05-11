import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, CheckCircle, FileText, Send, RotateCcw, Info } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const NonCompeteAgreementForm = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    day: "",
    month: "",
    year: "20__",
    employeeName: "",
    employeeAddress: "",
    employeePosition: "",
    employeeSignature: "",
    employeeSignatureDate: "",
    companyRepSignature: "",
    companyRepName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({
        ...prev,
        day: savedData.day || "",
        month: savedData.month || "",
        year: savedData.year || "20__",
        employeeName: savedData.employeeName || "",
        employeeAddress: savedData.employeeAddress || "",
        employeePosition: savedData.employeePosition || "",
        employeeSignature: savedData.employeeSignature || savedData.signature || "",
        employeeSignatureDate: savedData.employeeSignatureDate || savedData.signatureDate || savedData.date
          ? (savedData.employeeSignatureDate || savedData.signatureDate || savedData.date).split("T")[0]
          : "",
        companyRepSignature: savedData.companyRepSignature || "",
        companyRepName: savedData.companyRepName || "",
      }));
    }
  }, [savedData]);

  // Set default date to today
  useEffect(() => {
    if (!formData.employeeSignatureDate) {
      const today = new Date().toISOString().split("T")[0];
      setFormData(prev => ({ ...prev, employeeSignatureDate: today }));
    }
  }, [formData.employeeSignatureDate]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]);

  const handleChange = (field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    const newErrors = {};
    if (!formData.day?.trim()) newErrors.day = true;
    if (!formData.month?.trim()) newErrors.month = true;
    if (!formData.employeeName?.trim()) newErrors.employeeName = true;
    if (!formData.employeeAddress?.trim()) newErrors.employeeAddress = true;
    if (!formData.employeePosition?.trim()) newErrors.employeePosition = true;
    if (!formData.employeeSignature?.trim()) newErrors.signature = true;
    if (!formData.employeeSignatureDate) newErrors.date = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields and provide your signature.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(formData);
      } else {
        toast.success("Non-Compete Agreement signed successfully!");
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
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&family=Dancing+Script:wght@400;700&family=Pacifico&display=swap"
        rel="stylesheet"
      />

      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8 w-full">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-xl border border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">
              Non-Compete Agreement
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Review and sign the Non-Compete Agreement digitally
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
                      <span>Review the Non-Compete Agreement form below</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                      <span>Fill in the required fields (date, employee name, address, position)</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                      <span>Sign digitally using the signature input in the agreement template</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                      <span>Click Save & Next to confirm</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="max-w-4xl mx-auto bg-white p-4 sm:p-12 font-serif text-[11px] sm:text-[13px] leading-relaxed border border-gray-200 rounded-lg shadow-sm">
                
                <h1 className="text-center text-sm sm:text-base font-bold mb-8 border-b border-gray-400 pb-4 uppercase">
                  NON-COMPETE AGREEMENT
                </h1>

                <div className="space-y-4 text-gray-900">
                  <div className="flex flex-wrap items-baseline gap-1">
                    <span>This Non-Compete (the "Agreement") is made as of this</span>
                    <input
                      type="text"
                      value={formData.day}
                      onChange={(e) => handleChange("day", e.target.value)}
                      className={`border-b border-black w-8 text-center focus:outline-none bg-transparent ${
                        errors.day ? "border-red-500" : ""
                      }`}
                      disabled={isReadOnly}
                    />
                    <span>day of</span>
                    <input
                      type="text"
                      value={formData.month}
                      onChange={(e) => handleChange("month", e.target.value)}
                      className={`border-b border-black w-24 text-center focus:outline-none bg-transparent ${
                        errors.month ? "border-red-500" : ""
                      }`}
                      disabled={isReadOnly}
                    />
                    <span>,</span>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      className="border-b border-black w-16 text-center focus:outline-none bg-transparent"
                      disabled={isReadOnly}
                    />
                    <span>(the "Effective Date")</span>
                  </div>

                  <p>
                    by and between Pacific Health Systems LLC ("Company"), located at 303 Corporate Center Dr., Suite 325, Stockbridge, GA 30281, and
                  </p>

                  <div className="flex flex-wrap items-baseline gap-1">
                    <input
                      type="text"
                      value={formData.employeeName}
                      onChange={(e) => handleChange("employeeName", e.target.value)}
                      placeholder="Employee Name"
                      className={`border-b border-black w-full sm:w-64 focus:outline-none bg-transparent ${
                        errors.employeeName ? "border-red-500" : ""
                      }`}
                      disabled={isReadOnly}
                    />
                    <span>("Employee"), residing at</span>
                  </div>

                  <div className="w-full">
                    <input
                      type="text"
                      value={formData.employeeAddress}
                      onChange={(e) => handleChange("employeeAddress", e.target.value)}
                      placeholder="Employee Address"
                      className={`border-b border-black w-full focus:outline-none bg-transparent ${
                        errors.employeeAddress ? "border-red-500" : ""
                      }`}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="flex flex-wrap items-baseline gap-1">
                    <span>Employee will be serving as</span>
                    <input
                      type="text"
                      value={formData.employeePosition}
                      onChange={(e) => handleChange("employeePosition", e.target.value)}
                      placeholder="Position"
                      className={`border-b border-black w-full sm:w-48 focus:outline-none bg-transparent ${
                        errors.employeePosition ? "border-red-500" : ""
                      }`}
                      disabled={isReadOnly}
                    />
                    <span>.</span>
                  </div>

                  <p>
                    Employee may have access to or may generate or otherwise come into contact with proprietary and/or confidential information of the Company or the Company's clients. The Company wishes to enter into a non-compete agreement in the event Employee terminates his or her employment. In consideration of the promises and mutual covenants herein, the parties agree as follows:
                  </p>

                  <h3 className="font-bold text-blue-700">1. Employee Covenants.</h3>
                  <p>
                    In consideration of offer of employment or continued employment with the Company, Employee covenants that during their employment with the Company and for a period of two (2) years or the longest period of time allowed by state law, whichever is shorter, after said employment is ended for any reason, including but not limited to the termination of their employment due to inadequate performance or resignation:
                  </p>
                  <ul className="list-none pl-8 space-y-2">
                    <li className="flex gap-4">
                      <span>a.</span>
                      <p>Employee shall not induce, directly or indirectly, any other employees of the Company to terminate their employment.</p>
                    </li>
                    <li className="flex gap-4">
                      <span>b.</span>
                      <p>Employee shall not solicit the business of any client of the Company.</p>
                    </li>
                    <li className="flex gap-4">
                      <span>c.</span>
                      <p>Employee shall not offer same or similar services to a client that they previously served during employment.</p>
                    </li>
                    <li className="flex gap-4">
                      <span>d.</span>
                      <p>Employee shall not induce, directly or indirectly, any client of the Company to transfer services to another agency.</p>
                    </li>
                  </ul>

                  <h3 className="font-bold text-blue-700 pt-2">2. Confidentiality Agreement.</h3>
                  <p>
                    Employee shall not, without written consent, share or use any information relating to the Company that has not been previously publicly released including but not limited to patient charts, trade secrets, proprietary and confidential information, research, designs, financial data, customer and employee records, and marketing plans.
                  </p>

                  <h3 className="font-bold text-blue-700 pt-2">3. Injunctive Relief.</h3>
                  <p>
                    Employee acknowledges that disclosure of any confidential information or breach of any of the noncompetitive covenants will cause irreparable harm to the Company. Injunctive relief is agreed to be an appropriate remedy.
                  </p>

                  <div className="text-xs text-gray-600 border-t border-gray-300 pt-2 mt-8">
                    1 | Page
                  </div>

                  <div className="pt-12 space-y-4">
                    <h3 className="font-bold text-blue-700">4. Binding Effect.</h3>
                    <p>This Agreement is binding upon the parties and their legal representatives, successors, and permitted assigns.</p>
                    
                    <h3 className="font-bold text-blue-700 pt-2">5. Severability.</h3>
                    <p>If any provision is deemed invalid, the remainder shall still be enforceable.</p>

                    <h3 className="font-bold text-blue-700 pt-2">6. Governing Law.</h3>
                    <p>This Agreement shall be governed by the laws of the State of Georgia.</p>

                    <h3 className="font-bold text-blue-700 pt-2">7. Dispute Resolution.</h3>
                    <p>Disputes shall be brought only in Georgia courts. All parties waive the right to trial by jury to the maximum extent permitted by law.</p>

                    <h3 className="font-bold text-blue-700 pt-2">8. Headings.</h3>
                    <p>Section headings are for convenience only and do not affect interpretation.</p>

                    <h3 className="font-bold text-blue-700 pt-2">9. Entire Agreement.</h3>
                    <p>This document contains the full agreement and supersedes prior oral or written agreements.</p>

                    <h3 className="font-bold text-blue-700 pt-2">10. Amendment.</h3>
                    <p>This Agreement can only be amended in writing signed by both parties.</p>

                    <h3 className="font-bold text-blue-700 pt-2">11. Notices.</h3>
                    <p>All notices must be in writing and delivered to the parties' last known addresses.</p>

                    <h3 className="font-bold text-blue-700 pt-2">12. Waiver.</h3>
                    <p>Waiver of any provision must be in writing and does not waive any other rights.</p>

                    <p className="pt-8 pb-12 font-medium">IN WITNESS WHEREOF, this Agreement has been executed as of the date first above written.</p>

                    {/* Signature Section - MATCHING HRMS EXACTLY */}
                    <div className="space-y-8 sm:space-y-12 pb-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                        {/* Company Rep Signature */}
                        <div>
                          <div className="border-b border-black mb-2 h-10 sm:h-14 flex items-end pb-1 overflow-hidden">
                            {formData.companyRepSignature ? (
                              <p
                                className="text-2xl"
                                style={{
                                  fontFamily: "'Great Vibes', cursive",
                                  fontSize: "28px",
                                  fontWeight: "400",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {formData.companyRepSignature}
                              </p>
                            ) : (
                              <span className="text-gray-400 italic text-xs">Awaiting HR Signature</span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-bold">
                            Company Representative Signature
                          </p>
                        </div>
                        
                        {/* Company Rep Name */}
                        <div>
                          <div className="border-b border-black mb-2 h-10 sm:h-14 flex items-end pb-1">
                            <span className="text-sm font-medium">{formData.companyRepName || "Pending Review"}</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-bold">
                            Company Representative Name and Title
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pt-4">
                        {/* Employee Signature */}
                        <div>
                          <div className="border-b border-black mb-2 h-10 sm:h-14 flex items-end pb-1 relative">
                            <input
                              type="text"
                              value={formData.employeeSignature}
                              onChange={(e) => handleChange("employeeSignature", e.target.value)}
                              placeholder="Type your signature"
                              className={`w-full border-none focus:ring-0 bg-transparent text-3xl p-0 outline-none ${
                                errors.signature ? "bg-red-50" : ""
                              }`}
                              style={{
                                fontFamily: "'Great Vibes', cursive",
                                fontSize: "32px",
                                fontWeight: "400",
                                letterSpacing: "0.5px",
                              }}
                              disabled={isReadOnly}
                            />
                            {errors.signature && (
                              <span className="absolute bottom-1 right-0 text-red-500 font-bold text-lg">!</span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-xs uppercase tracking-wider font-bold">
                            Employee Signature *
                          </p>
                          <p className="text-[9px] text-gray-400 mt-1 italic italic">Your signature will appear in cursive script</p>
                        </div>
                        
                        {/* Employee Date */}
                        <div>
                          <div className="border-b border-black mb-2 h-10 sm:h-14 flex items-end pb-1">
                            <input
                              type="date"
                              value={formData.employeeSignatureDate}
                              onChange={(e) => handleChange("employeeSignatureDate", e.target.value)}
                              className="w-full border-none focus:ring-0 bg-transparent text-sm p-0 outline-none cursor-pointer"
                              disabled={isReadOnly}
                            />
                          </div>
                          <p className="text-[10px] sm:text-xs uppercase tracking-wider font-bold">
                            Date Signed *
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 border-t border-gray-300 pt-2 mt-8">
                    2 | Page
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

NonCompeteAgreementForm.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default NonCompeteAgreementForm;
