import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  FileText, 
  ArrowLeft, 
  Target, 
  Eye, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  X, 
  AlertCircle,
  RotateCcw,
  Send,
  CheckCircle
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import axiosInstance from "../api/axiosInstance";

// Set up PDF.js worker using unpkg CDN (bulletproof in Vite)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const getDocumentUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const apiBase = import.meta.env.VITE_API_URL || "https://api.carecompapp.com/api";
  const serverBase = apiBase.replace("/api", "");
  return `${serverBase}/${filePath}`;
};

const OrientationPresentation = ({
  enrollmentId,
  formId,
  savedData,
  onComplete,
  progressCurrent,
  progressTotal,
  isReadOnly,
  onNext,
  onFormChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [document, setDocument] = useState(null);
  
  // PDF Viewer states
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [showFullscreenPdf, setShowFullscreenPdf] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    if (savedData) {
      setViewed(savedData.viewed || false);
      // In the new architecture, the document might be part of the savedData or progress data
      setDocument(savedData.document || null);
    }
  }, [savedData]);

  // Handle case where document might need to be fetched separately if not in savedData
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axiosInstance.get("/enrollment/onboarding/orientation-presentation/document");
        if (response.data.success && response.data.data) {
          setDocument(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching orientation document:", error);
      }
    };

    if (!document && !isReadOnly) {
      fetchDocument();
    }
  }, [document, isReadOnly]);

  const handleViewDocument = async () => {
    if (document && document.filePath) {
      setViewed(true);
      setShowFullscreenPdf(true);
      setPageNumber(1);
      setPdfError(null);

      // Save viewed state as draft in the background so it's persisted immediately without redirection!
      if (!isReadOnly && enrollmentId && formId) {
        try {
          await axiosInstance.put(`/enrollment/${enrollmentId}/form/${formId}/draft`, { 
            draftData: { viewed: true } 
          });
          if (onFormChange) {
            onFormChange({ viewed: true });
          }
        } catch (error) {
          console.error("Auto-saving view draft error:", error);
        }
      }
    } else {
      toast.error("No document available to view");
    }
  };

  const handleDownloadDocument = () => {
    if (document && document.filePath) {
      const fileUrl = getDocumentUrl(document.filePath);
      window.open(fileUrl, "_blank");
      toast.success("Opening presentation in new window...");
    }
  };

  const handleSaveAndNext = async () => {
    if (isReadOnly) {
        if (onNext) onNext();
        return;
    }
    
    if (!viewed) {
      toast.error("Please view the orientation presentation before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete({ viewed, status: "submitted" });
      }
    } catch (error) {
      console.error("Error saving orientation status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPdfLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onPdfError = (error) => {
    console.error("Error loading PDF:", error);
    setPdfError(error.message || "Failed to load PDF");
    toast.error("Failed to load presentation");
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-gray-50 min-h-screen text-black font-sans p-0">
      <ProgressBar
        currentStep={progressCurrent}
        totalSteps={progressTotal || 1}
      />
      <div className="flex-1 flex flex-col items-center py-8 w-full px-4 overflow-x-auto">
        <div className="w-full max-w-[950px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden p-3 sm:p-6 md:p-10 mb-8 mx-auto text-black">
          <div className="max-w-4xl mx-auto bg-white p-6">
            <div className="bg-[#1F3A93] text-white p-6 rounded-xl mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    ORIENTATION PRESENTATION
                  </h1>
                  <p className="text-blue-100/80 mt-1 text-sm sm:text-base">
                    Exhibit 6a - Training PowerPoint
                  </p>
                </div>
              </div>
            </div>

            {!document ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-600 text-xl font-medium">
                  No orientation presentation available yet.
                </p>
                <p className="text-gray-400 mt-2">
                  Please contact HR if you need assistance.
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                        Available Document
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 break-all mb-1">
                        {document.fileName}
                      </p>
                      <p className="text-gray-500">
                        Uploaded:{" "}
                        {new Date(document.createdAt).toLocaleDateString()}
                      </p>

                      {viewed && (
                        <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full mt-6 font-semibold animate-in zoom-in duration-300">
                          <CheckCircle className="w-5 h-5" />
                          <span>Viewed</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                      <button
                        onClick={handleViewDocument}
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
                      >
                        <Eye className="w-5 h-5" />
                        View Presentation
                      </button>
                      <button
                        onClick={handleDownloadDocument}
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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


      {/* PDF Fullscreen Viewer Modal */}
      {showFullscreenPdf && document && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-gray-900/95 backdrop-blur text-white p-4 flex items-center justify-between flex-shrink-0 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base">{document.fileName}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Page {pageNumber} of {numPages || "..."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullscreenPdf(false)}
                className="p-3 hover:bg-white/10 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/95 backdrop-blur text-white p-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap flex-shrink-0 border-b border-white/10">
              <div className="flex items-center gap-2 bg-gray-900 rounded-xl p-1">
                 <button
                    onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="p-2 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors"
                 >
                    <ArrowLeft className="w-5 h-5" />
                 </button>
                 <div className="px-2 sm:px-4 flex items-center gap-2">
                    <input
                        type="number"
                        min="1"
                        max={numPages}
                        value={pageNumber}
                        onChange={(e) => setPageNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), numPages || 1))}
                        className="w-10 sm:w-12 bg-transparent text-center font-bold focus:outline-none"
                    />
                    <span className="text-gray-500 text-sm">/ {numPages || "..."}</span>
                 </div>
                 <button
                    onClick={() => setPageNumber(p => Math.min(p + 1, numPages || 1))}
                    disabled={pageNumber >= (numPages || 1)}
                    className="p-2 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors rotate-180"
                 >
                    <ArrowLeft className="w-5 h-5" />
                 </button>
              </div>

              <div className="hidden sm:block h-8 w-px bg-white/10"></div>

              <div className="flex items-center gap-2 bg-gray-900 rounded-xl p-1">
                <button
                    onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}
                    disabled={scale <= 0.5}
                    className="p-2 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors"
                >
                    <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold w-10 sm:w-12 text-center">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={() => setScale(s => Math.min(s + 0.2, 3))}
                    disabled={scale >= 3}
                    className="p-2 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              <div className="hidden sm:block h-8 w-px bg-white/10"></div>

              <button
                onClick={handleDownloadDocument}
                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto bg-gray-950 flex items-start justify-center p-4 sm:p-8 scrollbar-hide">
              {pdfError ? (
                <div className="text-center py-20 max-w-md mx-auto">
                  <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <p className="text-white text-xl font-bold mb-2">Failed to load PDF</p>
                  <p className="text-gray-400 mb-8">{pdfError}</p>
                  <button
                    onClick={() => { setPdfError(null); setPageNumber(1); }}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="bg-white shadow-2xl rounded-sm overflow-hidden">
                  <Document
                    file={getDocumentUrl(document.filePath)}
                    onLoadSuccess={onPdfLoadSuccess}
                    onError={onPdfError}
                    loading={
                      <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <RotateCcw className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="text-gray-400 font-medium">Rendering pages...</p>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-2xl"
                    />
                  </Document>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

OrientationPresentation.propTypes = {
  enrollmentId: PropTypes.string,
  formId: PropTypes.number,
  savedData: PropTypes.object,
  onComplete: PropTypes.func,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
  onFormChange: PropTypes.func,
};

export default OrientationPresentation;
