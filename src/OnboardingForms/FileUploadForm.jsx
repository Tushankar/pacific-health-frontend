import React, { useState, useCallback, useEffect } from "react";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { uploadFormFile } from "../api/enrollment.api";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";

const FileUploadForm = ({
  enrollmentId,
  formId,
  savedData,
  onComplete,
  progressCurrent = 0,
  progressTotal = 1,
  isReadOnly = false,
  onNext,
}) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // savedData contains the file info from the backend if already uploaded
  const existingFile = savedData && savedData.path ? savedData : null;

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Basic validation
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Please upload PDF, PNG, JPG, or DOCX.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (isReadOnly) return;
    if (!file && !existingFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (!file && existingFile) {
      // Already has a file, just move to next
      if (onComplete) onComplete(existingFile);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadFormFile(enrollmentId, formId, file);
      if (response.success) {
        toast.success("File uploaded successfully!");
        if (onComplete) {
          onComplete(response.data);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload file. Please try again.");
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="flex w-full items-start bg-slate-50 min-h-screen font-serif">
      {/* Sidebar Progress */}
      <div className="sticky top-0 self-start hidden md:flex flex-col items-center py-8 shrink-0 bg-white/50 backdrop-blur-sm z-10 h-screen border-r border-slate-200">
        <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />
      </div>

      <div className="flex-1 flex flex-col items-center py-8 px-4">
        {/* Paper Container */}
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex flex-col items-center text-center">
            <img src={logo} alt="Pacific Health Systems" className="h-16 mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-slate-800">Document Submission</h1>
            <p className="text-slate-500 mt-1 italic">Pacific Health Systems Onboarding</p>
          </div>

          <div className="p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Upload size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Upload Document</h2>
                <p className="text-slate-500 text-sm">Please provide the required file for this section</p>
              </div>
            </div>

            {/* Existing File View */}
            {existingFile && !file && (
              <div className="mb-8 p-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-800">Document Uploaded</p>
                    <p className="text-sm text-emerald-600 truncate max-w-[300px]">
                      {existingFile.originalName}
                    </p>
                  </div>
                </div>
                <a 
                  href={`http://localhost:5996/${existingFile.path}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-all shadow-sm"
                >
                  View File
                </a>
              </div>
            )}

            {/* Upload Area */}
            {!file ? (
              <div 
                className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group bg-slate-50/50"
                onClick={() => document.getElementById("file-upload").click()}
              >
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  onChange={onFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md border border-slate-100">
                  <Upload className="text-slate-400 group-hover:text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Click to upload or drag & drop</h3>
                <p className="text-slate-500 font-medium">
                  PDF, JPG, PNG or DOCX (Max 5MB)
                </p>
              </div>
            ) : (
              <div className="border border-blue-100 bg-blue-50/30 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-100 rounded-2xl text-blue-600 shadow-sm">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 truncate max-w-[350px]">{file.name}</h4>
                      <p className="text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isUploading && (
                    <button 
                      onClick={removeFile}
                      className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center gap-3 mb-8">
                  <Loader2 className={`text-blue-600 ${isUploading ? 'animate-spin' : 'hidden'}`} size={20} />
                  <p className="text-sm text-blue-800 font-medium">
                    {isUploading ? "Uploading to secure server..." : "Ready to submit document"}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <AlertCircle size={24} className="text-slate-400 mt-0.5" />
              <div className="text-sm text-slate-500 leading-relaxed font-medium">
                <p className="font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">Important Instructions:</p>
                Please ensure the document is clear and all details are legible. 
                Once uploaded, it will be reviewed by our admissions team. 
                You can replace the document at any time before final submission.
              </div>
            </div>
          </div>

          {/* Footer with Navigation Button */}
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-4">
              <button
                type="button"
                className="px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => window.history.back()}
              >
                Back
              </button>
              <button
                type="button"
                className="px-8 py-3 btn-premium-red text-white font-sans font-bold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  if (window.confirm("Are you sure you want to exit the application process? Any unsaved changes may be lost.")) {
                    window.location.href = "/my-application";
                  }
                }}
              >
                Exit Application
              </button>
            </div>
            <SaveNextButton 
              onClick={handleUpload}
              isSubmitting={isUploading}
              isReadOnly={isReadOnly}
              onNext={onNext}
              label={existingFile && !file ? "Next Form" : "Upload & Continue"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadForm;
