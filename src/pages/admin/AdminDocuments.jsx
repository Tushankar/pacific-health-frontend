import React, { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  ExternalLink,
  Plus,
  Shield,
  Info,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "sonner";

// Document definitions we support managing
const DOCUMENT_KEYS = [
  {
    key: "orientation_presentation",
    label: "Orientation Presentation (Exhibit 6a)",
    description: "The primary slideshow or PDF reviewed by all applicants during onboarding.",
    accept: ".pdf",
  },
  {
    key: "employee_handbook",
    label: "Employee Handbook & Guidelines",
    description: "Company policies and standards document for review/acknowledgement.",
    accept: ".pdf,.doc,.docx",
  },
  {
    key: "code_of_conduct",
    label: "Professional Code of Conduct",
    description: "Ethics and behavioral standards document.",
    accept: ".pdf",
  },
];

const getFileUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5996/api";
  const serverBase = apiBase.replace("/api", "");
  return `${serverBase}/${filePath}`;
};

const AdminDocuments = () => {
  const queryClient = useQueryClient();
  const [selectedKey, setSelectedKey] = useState("orientation_presentation");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch admin documents
  const { data: documentsData, isLoading } = useQuery({
    queryKey: ["adminDocuments"],
    queryFn: async () => {
      const response = await axiosInstance.get("/enrollment/admin/documents");
      return response.data?.data || [];
    },
  });

  // Mutation for uploading documents
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        "/enrollment/admin/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Document successfully uploaded!");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["adminDocuments"] });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload document."
      );
    },
  });

  const activeDocDef = DOCUMENT_KEYS.find((d) => d.key === selectedKey);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedExtensions = activeDocDef.accept.split(",");
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file format. Please upload ${activeDocDef.accept}`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File is too large. Max limit is 25MB.");
      return;
    }

    setSelectedFile(file);
    toast.success(`File "${file.name}" selected!`);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select or drop a file to upload first.");
      return;
    }

    const formData = new FormData();
    formData.append("key", selectedKey);
    formData.append("file", selectedFile);

    uploadMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-8 lg:p-10 font-sans text-slate-800 antialiased">
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-[#1F3A93] to-[#122258] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                <Shield className="w-8 h-8 text-indigo-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Document Center</h1>
                <p className="text-blue-100/80 mt-1.5 text-sm sm:text-base max-w-xl">
                  Manage static templates, onboarding slideshows, and employee orientation presentations distributed to applicants.
                </p>
              </div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200 self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Synchronized Live to User Forms
            </div>
          </div>
        </div>

        {/* Informative notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 items-start">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed font-medium">
            <strong>Orientation Presentation:</strong> Uploading a new PDF file with the <strong>"orientation_presentation"</strong> key will transparently and instantly update the slide deck inside <strong>Form 122: Orientation Presentation</strong> across all active client portals in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Upload Form */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm h-fit">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Upload New Template
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              {/* Document Key Selector */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Target Document Type / Form Key
                </label>
                <select
                  value={selectedKey}
                  onChange={(e) => {
                    setSelectedKey(e.target.value);
                    setSelectedFile(null);
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
                >
                  {DOCUMENT_KEYS.map((doc) => (
                    <option key={doc.key} value={doc.key}>
                      {doc.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  {activeDocDef.description}
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Select File ({activeDocDef.accept})
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("admin-file-picker").click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    dragActive
                      ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                      : selectedFile
                      ? "border-emerald-300 bg-emerald-50/10 hover:border-emerald-400"
                      : "border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                >
                  <input
                    id="admin-file-picker"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={activeDocDef.accept}
                  />

                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm border ${
                    selectedFile 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-white text-indigo-600 border-slate-100"
                  }`}>
                    {uploadMutation.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    ) : selectedFile ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>

                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm max-w-[280px] truncate mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to Upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">
                        Drag & drop your file here, or <span className="text-indigo-600">browse</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Only files ending in {activeDocDef.accept} (Max size: 25MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploadMutation.isPending || !selectedFile}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing Document...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Publish & Update Document</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Document Inventory */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Active System Templates
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Loading templates...</p>
              </div>
            ) : !documentsData || documentsData.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No templates uploaded yet</p>
                <p className="text-slate-400 text-xs mt-1">Use the left panel to upload your first onboarding slideshow.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documentsData.map((doc) => {
                  const label = DOCUMENT_KEYS.find((k) => k.key === doc.key)?.label || doc.key;
                  return (
                    <div
                      key={doc._id}
                      className="p-5 border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50/80 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 group-hover:scale-105 transition-transform flex-shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                              {doc.key}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm mt-1 sm:text-base max-w-[280px] sm:max-w-[350px] truncate">
                            {doc.fileName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {label}
                          </p>
                          {doc.uploadedBy && (
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                              <User className="w-3 h-3" />
                              By: {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                        <a
                          href={getFileUrl(doc.filePath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-all border border-indigo-100 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </a>
                        <a
                          href={getFileUrl(doc.filePath)}
                          download={doc.fileName}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all border border-slate-200 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocuments;
