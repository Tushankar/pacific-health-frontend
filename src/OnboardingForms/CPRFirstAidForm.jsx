import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  FileText,
  Upload,
  File,
  CheckCircle,
  RotateCcw,
  AlertCircle,
  X,
  Eye,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";
import { uploadFormFile } from "../api/enrollment.api";

const CPRFirstAidForm = ({
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
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // savedData contains the file info if already uploaded
  const existingFile = savedData && savedData.path ? savedData : null;

  const handleFileChange = (e) => {
    if (isReadOnly) return;
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Please upload PDF, PNG, or JPG.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max size is 10MB.");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!file && !existingFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (!file && existingFile) {
      if (onComplete) onComplete(existingFile);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadFormFile(enrollmentId, formId, file);
      if (response.success) {
        toast.success("CPR/First Aid certificate uploaded successfully!");
        if (onComplete) {
          onComplete(response.data);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload file.");
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    if (isReadOnly) return;
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-sans">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8 w-full">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          
          {/* Status Banner - PURPLE THEME MATCHING HRMS */}
          <div className={`p-4 border-b ${existingFile ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center justify-center gap-3">
              {existingFile ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <FileText className="w-6 h-6 text-red-600" />
              )}
              <div>
                {existingFile ? (
                  <>
                    <p className="text-base font-semibold text-green-800">✅ Progress Updated - Certificate Uploaded Successfully</p>
                    <p className="text-sm text-green-600 mt-1">Review your certificate below or replace it if needed.</p>
                  </>
                ) : (
                  <p className="text-base font-semibold text-red-800">⚠️ Not filled yet - Upload your certificate(s) to complete your progress</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Title Section - MATCHING HRMS */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">CPR/First Aid Certificate</h1>
              <p className="text-gray-600 font-medium">Upload your CPR/First Aid certificate (Optional)</p>
            </div>

            {/* Instructions Section - PURPLE THEME MATCHING HRMS */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-purple-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Instructions</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                      <span>Ensure you have a valid CPR/First Aid certificate</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                      <span>Scan the certificate as a PDF or high-quality image</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                      <span>Upload the file using the upload area below</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                      <span>Click "Save & Next" to proceed to the next form</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Upload Section - MATCHING HRMS */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload CPR/First Aid Certificate(s)</h2>
              <p className="text-sm text-gray-600 mb-6 italic">Supported formats: PDF, JPG, PNG (Max 10MB)</p>

              {existingFile && !file ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📄 Uploaded Documents (1)</h3>
                    <div className="bg-white border border-purple-300 rounded-lg p-4 mb-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <File className="w-6 h-6 text-purple-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-purple-800 truncate">{existingFile.originalName || "cpr_certificate.pdf"}</h3>
                            <p className="text-xs text-gray-500">Document ready for review</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                             href={`https://pacific.kyptronix.us/${existingFile.path}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View
                          </a>
                          <button 
                            onClick={() => !isReadOnly && setFile(null)} 
                            disabled={isReadOnly}
                            className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Replace
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-10 text-center transition-all cursor-pointer ${
                      isReadOnly ? "opacity-50 border-gray-200" : "border-gray-300 bg-white hover:border-purple-500 hover:bg-purple-50"
                    }`}
                    onClick={() => !isReadOnly && fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isReadOnly}
                    />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-purple-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">PDF, JPG, PNG (MAX. 10MB)</p>
                  </div>

                  {file && (
                    <div className="mt-4 p-4 bg-purple-100/50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                  isSubmitting={isUploading}
                  type="submit"
                  isReadOnly={isReadOnly}
                  onClick={handleUpload}
                  onNext={onNext}
                  label={file ? "Upload & Continue" : existingFile ? "Next Form" : "Upload Document"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CPRFirstAidForm.propTypes = {
  enrollmentId: PropTypes.string,
  formId: PropTypes.number,
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default CPRFirstAidForm;
