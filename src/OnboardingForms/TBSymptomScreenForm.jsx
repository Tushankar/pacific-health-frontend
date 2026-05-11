import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Download,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { uploadFormFile } from "../api/enrollment.api";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";

const TBSymptomScreenForm = ({
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
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Load existing files from savedData
  useEffect(() => {
    if (savedData && savedData.files && Array.isArray(savedData.files)) {
      setFiles(savedData.files);
    } else if (savedData && savedData.path) {
      // Handle single file legacy format
      setFiles([savedData]);
    }
  }, [savedData]);

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Basic validation
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Please upload PDF, PNG, or JPG.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max size is 10MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadFormFile(enrollmentId, formId, selectedFile);
      if (response.success) {
        toast.success("File uploaded successfully!");
        const newFile = response.data;
        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        
        // Notify parent of the change
        if (onComplete) {
          await onComplete({ files: updatedFiles });
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload file. Please try again.",
      );
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveFile = async (index) => {
    if (isReadOnly) return;
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onComplete) {
      await onComplete({ files: updatedFiles });
    }
    toast.success("File removed.");
  };

  const handleSaveNext = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one document.");
      return;
    }
    if (onNext) onNext();
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-gray-50 min-h-screen text-black font-sans p-0">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center py-8 w-full px-4">
        
        {/* PARENT CONTAINER - MATCHING SCREENSHOT */}
        <div className="w-full max-w-[850px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden p-6 sm:p-12 mb-8 mx-auto">
          
          {/* Status Banner */}
          {files.length > 0 && (
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

          {/* Title and Subtitle - MATCHING SCREENSHOT */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              TB Symptom Screen Document Upload
            </h1>
            <p className="text-base text-gray-600">
              Provide TB test result by uploading your TB Symptom Screen document
            </p>
          </div>

          {/* Instructions Section - MATCHING SCREENSHOT */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-8 mb-10">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Instructions</h3>
                </div>
                <ol className="space-y-4 text-sm sm:text-base text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                    <span>Prepare your signed TB Symptom Screen document</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                    <span>Click "Choose File" to select and upload your document</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                    <span>Once uploaded, you can view or remove the document if needed</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                    <span>Click Save & Next to complete this step</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Upload Section - MATCHING SCREENSHOT */}
          <div className="space-y-8">
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Step 1: Upload Document</h2>
              <p className="text-sm text-gray-500 mb-6">
                Select and upload your signed TB Symptom Screen document. Supported formats: PDF, JPG, PNG (Max 10MB)
              </p>

              {/* Uploaded Documents List */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-bold text-gray-700">Uploaded Documents ({files.length})</h3>
                {files.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
                    <p className="text-gray-400 font-medium">No documents uploaded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-200 transition-all group">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                            <FileText size={24} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate max-w-[200px] sm:max-w-[400px]">
                              {f.originalName || f.name || "Document"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {f.size ? (f.size / 1024 / 1024).toFixed(2) + " MB" : ""} Uploaded on {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://pacific.kyptronix.us/${f.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 px-3 text-xs font-bold transition-all shadow-sm"
                          >
                            <Download size={14} /> Download
                          </a>
                          <button
                            onClick={() => handleRemoveFile(i)}
                            disabled={isReadOnly}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 px-3 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Input Area */}
              {!isReadOnly && (
                <div 
                  className="relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer bg-gray-50/50 group"
                  onClick={() => document.getElementById("tb-file-input").click()}
                >
                  <input
                    id="tb-file-input"
                    type="file"
                    className="hidden"
                    onChange={onFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md border border-gray-100">
                    <Upload className="text-blue-600" size={28} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-700 mb-1">Click to upload document</h4>
                  <p className="text-sm text-gray-500">Supported: PDF, JPG, PNG up to 10MB</p>
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 rounded-2xl flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                      <p className="text-sm font-bold text-blue-800">Uploading...</p>
                    </div>
                  )}
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
                isSubmitting={isUploading}
                onClick={handleSaveNext}
                onNext={onNext}
                isReadOnly={isReadOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TBSymptomScreenForm.propTypes = {
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

export default TBSymptomScreenForm;
