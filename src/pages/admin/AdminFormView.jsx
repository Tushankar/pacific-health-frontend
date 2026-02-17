import React, { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Info,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import * as OnboardingForms from "../../OnboardingForms";
import { getEnrollmentDetail, reviewForm } from "../../api/enrollment.api";

const AdminFormView = () => {
  const { id, formId } = useParams();
  const queryClient = useQueryClient();
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    note: "",
  });

  const { data: enrollmentData, isLoading } = useQuery({
    queryKey: ["adminEnrollmentDetail", id],
    queryFn: () => getEnrollmentDetail(id),
    enabled: !!id,
  });

  const enrollment = enrollmentData?.enrollment;

  const formData = useMemo(() => {
    if (!enrollment?.forms) return null;
    return enrollment.forms.find((f) => f.formId === parseInt(formId));
  }, [enrollment, formId]);

  // Review Form Mutation
  const reviewFormMutation = useMutation({
    mutationFn: ({ formId, status, adminNote }) =>
      reviewForm(id, formId, { status, adminNote }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["adminEnrollmentDetail", id]);
      setReviewModal({ isOpen: false, note: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to review form.");
    },
  });

  const handleFormReview = (status) => {
    reviewFormMutation.mutate({
      formId: parseInt(formId),
      status,
      adminNote: reviewModal.note,
    });
  };

  // Disable all form inputs in admin view
  useEffect(() => {
    const disableAllInputs = () => {
      const inputs = document.querySelectorAll(
        ".admin-form-view input, .admin-form-view textarea, .admin-form-view select",
      );
      inputs.forEach((input) => {
        input.disabled = true;
      });
    };

    if (formData?.data) {
      // Initial disable
      disableAllInputs();

      // Retry after delays in case form renders asynchronously
      setTimeout(disableAllInputs, 100);
      setTimeout(disableAllInputs, 500);
    }
  }, [formData?.data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!enrollment || !formData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        <p>Form data not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border-b border-slate-200">
      {/* Global style to hide progress bar in admin view */}
      <style>{`
        /* Hide all progress bars in admin view - global scope */
        [data-readonly="true"] [class*="ProgressBar"],
        [data-readonly="true"] .progress,
        [data-readonly="true"] .progress-bar {
          display: none !important;
        }
      `}</style>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 border-b border-blue-700 p-4 md:p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-white" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block mb-1">
                Form Data Viewer
              </span>
              <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
              <p className="text-blue-200 text-sm mt-1">
                Applicant: {enrollment.user?.fullName} | ID: {enrollment._id}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <StatusBadge status={formData.status} />
            <div className="h-8 w-px bg-blue-800 mx-2 hidden md:block" />
            <button
              onClick={() =>
                setReviewModal({
                  isOpen: true,
                  note: formData.adminNote || "",
                })
              }
              className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg"
            >
              <ShieldCheck size={16} />
              Review & Grade
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 bg-white admin-form-view" data-readonly="true">
        <style>{`
          /* Target ProgressBar by its specific classes */
          .sticky.self-start.w-24.border-r,
          .py-8.sticky.top-0.self-start,
          .md\\:flex.shrink-0.w-24 {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Universal progress bar hiding - all variations */
          * {
            --progress-display: none !important;
          }
          
          [class*="ProgressBar"],
          [class*="ProgressBar"] * {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .admin-form-view [class*="ProgressBar"],
          .admin-form-view [class*="progress"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
          }
          
          /* Aggressively hide all progress bars */
          [class*="Progress"],
          [class*="progress"],
          .admin-form-view > div:first-child,
          .admin-form-view [class*="ProgressBar"],
          .admin-form-view > [class*="ProgressBar"],
          div[class*="ProgressBar"],
          div[class*="progress"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
          }
          
          /* Hide SaveNextButton component */
          [class*="SaveNextButton"],
          .admin-form-view [class*="SaveNextButton"] {
            display: none !important;
          }
          
          /* Hide action buttons container - the flex div with Back, Exit, Save buttons */
          .admin-form-view form > div.flex.justify-between.items-center,
          .admin-form-view .flex.justify-between.items-center.mt-8,
          .admin-form-view .flex.justify-between.items-center.pt-4 {
            display: none !important;
          }
          
          /* Hide any remaining visible button containers in forms */
          form .flex.justify-between.items-center.mt-8,
          form .flex.justify-between.items-center.pt-4,
          form .flex.justify-between.gap-4 {
            display: none !important;
          }
          
          /* Disable all input fields in admin view */
          .admin-form-view input,
          .admin-form-view textarea,
          .admin-form-view select {
            pointer-events: none !important;
            cursor: not-allowed !important;
          }
          
          /* Style text inputs to look disabled */
          .admin-form-view input[type="text"],
          .admin-form-view input[type="email"],
          .admin-form-view input[type="password"],
          .admin-form-view input[type="number"],
          .admin-form-view input[type="date"],
          .admin-form-view textarea,
          .admin-form-view select {
            background-color: #f5f5f5 !important;
            opacity: 0.7 !important;
            color: #999 !important;
          }
          
          /* Checkboxes and radios - keep fully visible */
          .admin-form-view input[type="radio"],
          .admin-form-view input[type="checkbox"] {
            pointer-events: none !important;
            cursor: not-allowed !important;
            opacity: 1 !important;
            accent-color: inherit !important;
          }
          
          /* Disable labels associated with checkboxes/radios */
          .admin-form-view label {
            pointer-events: none !important;
            cursor: not-allowed !important;
            opacity: 0.8 !important;
          }
          
          /* Disable all form-related divs and containers */
          .admin-form-view [role="checkbox"],
          .admin-form-view [role="radio"] {
            pointer-events: none !important;
            cursor: not-allowed !important;
          }
          
          /* Make sure buttons that look like they can be clicked are disabled */
          .admin-form-view button:not(.back-btn) {
            pointer-events: none !important;
            opacity: 0.5 !important;
            cursor: not-allowed !important;
          }
        `}</style>
        {formData.data ? (
          <FormRenderer
            formId={formData.formId}
            formName={formData.name}
            data={formData.data}
            program={enrollment.program}
            isAdminView={true}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Info size={48} className="mb-4 opacity-50" />
            <p>No data submitted for this form.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-poppins text-poppins">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 bg-slate-900 text-white relative">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block mb-2">
                Action Required
              </span>
              <h3 className="text-xl font-bold mb-1">Review & Grade Form</h3>
              <p className="text-white/70 text-sm">{formData.name}</p>
              <button
                onClick={() => setReviewModal({ isOpen: false, note: "" })}
                className="absolute top-6 right-6 text-white/50 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-8">
              <label className="text-xs font-black text-blue-900 uppercase tracking-widest mb-3 block">
                Internal Review Notes
              </label>
              <textarea
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-sm mb-8 text-slate-900"
                placeholder="Enter feedback for the applicant..."
                value={reviewModal.note}
                onChange={(e) =>
                  setReviewModal((prev) => ({ ...prev, note: e.target.value }))
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleFormReview("Rejected")}
                  disabled={reviewFormMutation.isPending}
                  className="flex items-center justify-center gap-2 py-4 rounded-3xl border-2 border-rose-100 text-rose-600 font-bold hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={18} /> Deny Form
                </button>
                <button
                  onClick={() => handleFormReview("Approved")}
                  disabled={reviewFormMutation.isPending}
                  className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={18} /> Approve Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Read-only Form Renderer
function FormRenderer({ formId, formName, data, program, isAdminView }) {
  const formComponents = {
    // Chapter I - Admission Packet (NOW-COMP)
    "Client Information Form": OnboardingForms.ClientInfoForm,
    "Service Agreement Form": OnboardingForms.ServiceAgreementForm,
    "Service Agreement": OnboardingForms.ServiceAgreementForm,
    "Service Agreement Addendum": OnboardingForms.ServiceAgreementAddendum,
    "Service Care Plan": OnboardingForms.ClientServicePlan,
    "Initial Comprehensive Assessment":
      OnboardingForms.ComprehensiveNursingAssessment,
    "Risk Mitigation Plan": OnboardingForms.RiskMitigationPlan,
    "Self-Preservation": OnboardingForms.SafetyRiskSelfPreservationAssessment,
    "Medication List": OnboardingForms.PatientMedicationRecord,
    "Abnormal Involuntary Movement Scale (AIMS)":
      OnboardingForms.AbnormalInvoluntaryMovementScale,

    // Chapter II - Others Forms
    "Client Rights and Responsibilities":
      OnboardingForms.ClientRightsResponsibilities,
    "CODE OF ETHICS POLICY": OnboardingForms.CodeOfEthicsPolicy,
    "AUTHORIZATION FOR RELEASE OF INFORMATION – STANDARD REQUEST":
      OnboardingForms.AuthorizationForReleaseOfInformation,
    "Vehicle/ Funds Policy":
      OnboardingForms.ClientVehicleTransportationFundsPolicy,
    "My Human Rights": OnboardingForms.MyHumanRights,
    "Freedom of Choice": OnboardingForms.FreedomOfChoice,
    "Advance Directives": OnboardingForms.AdvanceDirectives,
    "HIPAA/ Confidentiality": OnboardingForms.Hipaaprivacy,
    "Grievance and Complaints for Individuals":
      OnboardingForms.GrievanceComplaints,
    "Abuse & Neglect": OnboardingForms.AbuseNeglect,

    // Chapter III - Tracking
    "ISP/ Training Sign-off": null,
    "HRST/ Training Sign-off": null,
    "Behavior Support Plan (BSP)-(Optional)": null,
    "BSP Tracking/Progress Notes (Optional)": null,
    "Health Care Plan/ Protocols/ Training Sign-Off": null,
    "Medication Admin. Record (MAR) Training Sign-Off (Optional)": null,

    // Chapter IV - Documentation
    "Visitor Log": OnboardingForms.VisitLogChart,
    "Rights Training/ Monthly Review": null,
    "Doctor's Appointment Log": null,

    // Chapter VI - Continuity of Medical Treatment
    "Supervisory Visit Documentation": OnboardingForms.HomeSupervisoryVisit,
    "Annuals (Physical, TB, Dental, Vision)": null,

    // Chapter I (OTHER Programs)
    "Comprehensive Initial Nursing Assessment":
      OnboardingForms.ComprehensiveNursingAssessment,

    // Chapter II (OTHER Programs)
    "Home Supervisory Visit": OnboardingForms.HomeSupervisoryVisit,
    "INCIDENT REPORTING FORM": OnboardingForms.IncidentReportingForm,
    "Client Complaint Form": OnboardingForms.ClientComplaintForm,

    // Upload-only forms
    "Doctor's Orders": OnboardingForms.FileUploadForm,
  };

  const Component = formComponents[formName];

  if (!Component) {
    if (
      program &&
      (formName.includes("Upload") ||
        formName.includes("Orders") ||
        formName.includes("Annuals") ||
        formName.includes("BSP") ||
        formName.includes("Directives") ||
        formName.includes("Freedom"))
    ) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <FileText size={48} className="mb-4 opacity-50" />
          <p className="text-center">
            This is a document upload form.
            <br />
            Please check the specific file link if available.
          </p>
          {data?.fileUrl && (
            <a
              href={`http://localhost:5000${data.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm font-bold"
            >
              <ExternalLink size={16} /> View Uploaded Document
            </a>
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <Info size={48} className="mb-4 opacity-50" />
        <p>Form visualization not available for this type.</p>
      </div>
    );
  }

  return (
    <Component
      savedData={data}
      selectedProgram={program}
      onComplete={() => {}}
      onFormChange={() => {}}
      progressCurrent={1}
      progressTotal={1}
      isAdminView={isAdminView}
    />
  );
}

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold",
    submitted: "bg-amber-50 text-amber-600 border-amber-100 font-bold",
    pending: "bg-amber-50 text-amber-600 border-amber-100 font-bold",
    reviewing: "bg-blue-50 text-blue-700 border-blue-100 font-bold",
    rejected: "bg-rose-50 text-rose-700 border-rose-100 font-bold",
    completed: "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold",
    "in-progress": "bg-slate-50 text-slate-600 border-slate-200",
    "not-started": "bg-slate-50 text-slate-400 border-slate-100",
  };

  return (
    <span
      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${styles[status] || styles["not-started"]}`}
    >
      {status || "NOT STARTED"}
    </span>
  );
}

export default AdminFormView;
