import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
  Save,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import * as OnboardingForms from "../../OnboardingForms";
import {
  getEnrollmentDetail,
  reviewEnrollment,
  reviewForm,
} from "../../api/enrollment.api";

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Auto-scroll logic for returning from form view
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    if (scrollTo) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-blue-400", "ring-offset-2");
          setTimeout(() => el.classList.remove("ring-2", "ring-blue-400", "ring-offset-2"), 2500);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Handle smart back navigation
  const handleBack = () => {
    const params = new URLSearchParams(location.search);
    const from = params.get("from");
    const scrollTo = params.get("scrollTo");

    if (from === "admin-dashboard" && scrollTo) {
      navigate(`/admin/dashboard?scrollTo=${scrollTo}`);
    } else {
      navigate("/admin/dashboard");
    }
  };

  const { data: enrollmentData, isLoading } = useQuery({
    queryKey: ["adminEnrollmentDetail", id],
    queryFn: () => getEnrollmentDetail(id),
    enabled: !!id,
  });

  const enrollment = enrollmentData?.enrollment;

  // Fetch all enrollments for this user to calculate submission number
  const { data: userEnrollmentsData } = useQuery({
    queryKey: ["adminUserEnrollments", enrollment?.user?._id],
    queryFn: () => getAllEnrollments({}), // We might need a better API or filter client-side if API supports it
    enabled: !!enrollment?.user?._id
  });

  const submissionLabel = useMemo(() => {
    if (!enrollment || !userEnrollmentsData?.enrollments) return enrollment?._id;

    const userApps = userEnrollmentsData.enrollments.filter(app =>
      app.user?._id === enrollment.user._id && app.program === enrollment.program
    );

    userApps.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const index = userApps.findIndex(app => app._id === enrollment._id);
    if (index === -1) return enrollment._id;

    const n = index + 1;
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    const ordinal = n + (s[(v - 20) % 10] || s[v] || s[0]);

    let programName = "Other Program";
    if (enrollment.program === "NOW-COMP") {
      programName = "NOW-COMP Program";
    } else if (enrollment.program === "HRMS-ONBOARDING") {
      programName = "HRMS Onboarding";
    }

    return `${ordinal} ${programName} Submission`;
  }, [enrollment, userEnrollmentsData]);

  // Review Enrollment Mutation
  const reviewEnrollmentMutation = useMutation({
    mutationFn: (data) => reviewEnrollment(id, data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["adminEnrollmentDetail", id]);
      setFinalModal({ isOpen: false, status: "", note: "" });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update enrollment status.",
      );
    },
  });

  // Review Form Mutation
  const reviewFormMutation = useMutation({
    mutationFn: ({ formId, status, adminNote }) =>
      reviewForm(id, formId, { status, adminNote }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["adminEnrollmentDetail", id]);
      setReviewModal({ isOpen: false, form: null, note: "", chapter: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to review form.");
    },
  });

  // Form Definitions (Synced with Sidebar.jsx)
  const getFormsByProgram = (program) => {
    if (!program) return [];
    if (program === "NOW & COMP WAIVERS" || program === "NOW-COMP") {
      return [
        {
          chapter: "Chapter I- Admission Packet-Nursing",
          forms: [
            { id: 1, name: "Client Information Form", type: "Data Entry" },
            { id: 2, name: "Service Agreement Form", type: "Fillable" },
            { id: 3, name: "Service Agreement Addendum", type: "Fillable" },
            { id: 4, name: "Service Care Plan", type: "Fillable" },
            {
              id: 5,
              name: "Initial Comprehensive Assessment",
              type: "Fillable",
            },
            { id: 6, name: "Risk Mitigation Plan", type: "Fillable" },
            { id: 7, name: "Self-Preservation", type: "Fillable" },
            { id: 8, name: "Medication List", type: "Fillable" },
            { id: 9, name: "Doctor's Orders", type: "Upload" },
            {
              id: 10,
              name: "Abnormal Involuntary Movement Scale (AIMS)",
              type: "Fillable",
            },
          ],
        },
        {
          chapter: "Chapter II- Admission Packet-Others",
          forms: [
            {
              id: 11,
              name: "Client Rights and Responsibilities",
              type: "Signable",
            },
            { id: 12, name: "CODE OF ETHICS POLICY", type: "Signable" },
            {
              id: 13,
              name: "AUTHORIZATION FOR RELEASE OF INFORMATION – STANDARD REQUEST",
              type: "Fillable",
            },
            { id: 14, name: "Vehicle/ Funds Policy", type: "Signable" },
            { id: 15, name: "My Human Rights", type: "Fillable" },
            { id: 16, name: "Freedom of Choice", type: "Upload" },
            { id: 17, name: "Advance Directives", type: "Upload" },
            { id: 18, name: "HIPAA/ Confidentiality", type: "Signable" },
            {
              id: 19,
              name: "Grievance and Complaints for Individuals",
              type: "Fillable",
            },
            { id: 20, name: "Abuse & Neglect", type: "Fillable" },
          ],
        },
        {
          chapter: "Chapter III- Tracking",
          forms: [
            { id: 21, name: "ISP/ Training Sign-off", type: "Fillable" },
            { id: 22, name: "HRST/ Training Sign-off", type: "Fillable" },
            {
              id: 23,
              name: "Behavior Support Plan (BSP)-(Optional)",
              type: "Upload",
            },
            {
              id: 24,
              name: "BSP Tracking/Progress Notes (Optional)",
              type: "Fillable",
            },
            {
              id: 25,
              name: "Health Care Plan/ Protocols/ Training Sign-Off",
              type: "Fillable",
            },
            {
              id: 26,
              name: "Medication Admin. Record (MAR) Training Sign-Off (Optional)",
              type: "Fillable",
            },
          ],
        },
        {
          chapter: "Chapter IV- Documentation",
          forms: [
            { id: 27, name: "Visitor Log", type: "Fillable" },
            {
              id: 28,
              name: "Rights Training/ Monthly Review",
              type: "Fillable",
            },
            { id: 29, name: "Doctor's Appointment Log", type: "Fillable" },
          ],
        },
        {
          chapter: "Chapter VI- Continuity of Medical Treatment",
          forms: [
            {
              id: 30,
              name: "Supervisory Visit Documentation",
              type: "Fillable",
            },
            {
              id: 31,
              name: "Annuals (Physical, TB, Dental, Vision)",
              type: "Upload",
            },
          ],
        },
      ];
    } else if (program === "HRMS-ONBOARDING") {
      return [
        {
          chapter: "Part 1: Employment Application",
          forms: [
            { id: 101, name: "Applicant Information", type: "Data Entry" },
            { id: 102, name: "Education", type: "Data Entry" },
            { id: 103, name: "References", type: "Data Entry" },
            { id: 104, name: "Previous Employment", type: "Data Entry" },
            { id: 105, name: "Military Service", type: "Data Entry" },
            { id: 106, name: "Disclaimer and Signature", type: "Signable" },
          ],
        },
        {
          chapter: "Part 2: Documents to Submit",
          forms: [
            { id: 107, name: "Job Description", type: "Signable" },
            { id: 108, name: "Code of Ethics Form", type: "Signable" },
            { id: 109, name: "Service Delivery Form", type: "Signable" },
            { id: 110, name: "Non-Compete Agreement", type: "Signable" },
            { id: 111, name: "Emergency Contact Form", type: "Data Entry" },
            { id: 112, name: "Professional Certificate(s)", type: "Fillable" },
            { id: 113, name: "CPR/First Aid Certificate", type: "Fillable" },
            { id: 114, name: "Government ID", type: "Fillable" },
            { id: 115, name: "Background Check Form", type: "Signable" },
            { id: 116, name: "Staff Misconduct Form", type: "Signable" },
            { id: 117, name: "TB or X-Ray Form", type: "Fillable" },
            { id: 118, name: "Employment Type Selection", type: "Data Entry" },
            { id: 119, name: "W-4 Tax Form", type: "Fillable" },
            { id: 120, name: "W-9 Tax Form", type: "Fillable" },
            { id: 121, name: "Direct Deposit Form", type: "Fillable" },
            { id: 122, name: "Orientation PowerPoint Presentation", type: "Fillable" },
            { id: 123, name: "Orientation Checklist", type: "Fillable" },
          ],
        },
      ];
    } else {
      return [
        {
          chapter: "Chapter I- Admission Packet",
          forms: [
            { id: 1, name: "Client Information Form", type: "Data Entry" },
            { id: 2, name: "Service Agreement Form", type: "Fillable" },
            { id: 3, name: "Service Agreement Addendum", type: "Fillable" },
            { id: 4, name: "Service Care Plan", type: "Fillable" },
            { id: 5, name: "Medication List", type: "Fillable" },
            {
              id: 6,
              name: "Comprehensive Initial Nursing Assessment",
              type: "Fillable",
            },
            {
              id: 7,
              name: "Client Rights and Responsibilities",
              type: "Signable",
            },
            { id: 8, name: "CODE OF ETHICS POLICY", type: "Signable" },
          ],
        },
        {
          chapter: "Chapter II- Service Documentation",
          forms: [
            { id: 9, name: "Home Supervisory Visit", type: "Fillable" },
            { id: 10, name: "INCIDENT REPORTING FORM", type: "Fillable" },
            { id: 11, name: "Client Complaint Form", type: "Fillable" },
          ],
        },
      ];
    }
  };

  const chapters = useMemo(() => {
    const allChapters = getFormsByProgram(enrollment?.program);

    // If approved, show all chapters
    if (enrollment?.status === "approved") {
      return allChapters;
    }

    // Filter out post-onboarding chapters (III, IV, VI, etc.) for the application view
    return allChapters.filter(
      (ch) =>
        !ch.chapter.includes("Chapter III") &&
        !ch.chapter.includes("Chapter IV") &&
        !ch.chapter.includes("Chapter VI") &&
        !ch.chapter.includes("Service Documentation"), // For Other programs if needed
    );
  }, [enrollment?.program, enrollment?.status]);

  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    form: null,
    note: "",
    chapter: "",
  });
  const [finalModal, setFinalModal] = useState({
    isOpen: false,
    status: "",
    note: "",
  });

  // Check if all forms are reviewed (either approved or rejected)
  const allFormsReviewed = useMemo(() => {
    if (!enrollment?.forms) return false;
    const maxPhase1Id =
      enrollment.program === "NOW-COMP"
        ? 20
        : enrollment.program === "HRMS-ONBOARDING"
          ? 150
          : 8;
    const relevantForms = enrollment.forms.filter(
      (f) => f.formId <= maxPhase1Id,
    );
    return relevantForms.every(
      (f) => f.status === "approved" || f.status === "rejected",
    );
  }, [enrollment?.forms, enrollment?.program]);

  // Check if all forms are approved
  const allFormsApproved = useMemo(() => {
    if (!enrollment?.forms) return false;
    const maxPhase1Id =
      enrollment.program === "NOW-COMP"
        ? 20
        : enrollment.program === "HRMS-ONBOARDING"
          ? 150
          : 8;
    const relevantForms = enrollment.forms.filter(
      (f) => f.formId <= maxPhase1Id,
    );
    return relevantForms.every((f) => f.status === "approved");
  }, [enrollment?.forms, enrollment?.program]);

  const handleFormReview = (formId, newStatus, note = "") => {
    reviewFormMutation.mutate({
      formId,
      status: newStatus.toLowerCase(),
      adminNote: note,
    });
  };

  const finalizeApplication = (status, note = "") => {
    // Backend check will also enforce this or we rely on frontend check
    reviewEnrollmentMutation.mutate({
      status: status.toLowerCase(),
      adminNote: note,
    });
  };

  if (isLoading || !enrollment) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const applicant = {
    id: submissionLabel,
    name: enrollment.user?.fullName || "Unknown",
    program: enrollment.program,
    submittedDate: enrollment.submittedAt
      ? new Date(enrollment.submittedAt).toLocaleDateString()
      : "Not Submitted",
    status: enrollment.status,
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 pt-8 font-poppins text-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center gap-2 text-blue-900 hover:text-indigo-600 font-bold transition-all group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Applicant Queue
        </button>

        {/* header Banner */}
        <div className="bg-white p-4 md:p-8 border border-slate-200 shadow-sm mb-10 relative overflow-hidden rounded-[2rem]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-60"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
                {applicant.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-3xl font-extrabold text-[#172554] tracking-tight">
                    {applicant.name}
                  </h2>
                  <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-blue-600 bg-clip-text text-transparent border border-blue-200 px-3 py-1 rounded-full bg-blue-50">
                    {submissionLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold italic">
                    <Calendar size={16} className="text-slate-400" />
                    Program:{" "}
                    <span className="text-slate-900 not-italic">
                      {applicant.program}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Clock size={16} className="text-amber-500" />
                    Submitted:{" "}
                    <span className="text-slate-900">
                      {new Date(enrollment.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 bg-slate-50 p-3 md:p-4 rounded-[2rem] border border-slate-100 w-full md:w-auto">
              <div className="pr-4 border-r border-slate-200 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Queue Status
                </p>
                <StatusBadge status={enrollment.status} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (enrollment.status === "approved" || enrollment.status === "rejected") {
                      toast.info(`Application is already ${enrollment.status}.`);
                      return;
                    }
                    if (!allFormsApproved) {
                      toast.error("Process Blocked: All individual forms must be Approved before finalizing the packet.");
                      return;
                    }
                    setFinalModal({
                      isOpen: true,
                      status: "Approved",
                      note: "",
                    });
                  }
                  }
                  className={`p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group ${allFormsApproved && enrollment.status !== "approved" && enrollment.status !== "rejected"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-pointer hover:bg-slate-200"
                    }`}
                  title={
                    enrollment.status === "approved" || enrollment.status === "rejected"
                      ? `Application already ${enrollment.status}`
                      : allFormsApproved
                        ? "Approve Full Packet"
                        : "Review Required: Approve all forms first"
                  }
                >
                  <CheckCircle size={22} className={allFormsApproved && enrollment.status !== "approved" && enrollment.status !== "rejected" ? "animate-pulse" : ""} />
                  <span className="font-bold text-sm hidden sm:block">Approve</span>
                </button>
                <button
                  onClick={() => {
                    if (enrollment.status === "approved" || enrollment.status === "rejected") {
                      toast.info(`Application is already ${enrollment.status}.`);
                      return;
                    }
                    if (!allFormsReviewed) {
                      toast.error("Process Blocked: Every form must be Reviewed (Approved or Rejected) before a final decision.");
                      return;
                    }
                    setFinalModal({
                      isOpen: true,
                      status: "Rejected",
                      note: "",
                    });
                  }
                  }
                  className={`p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group ${allFormsReviewed && enrollment.status !== "approved" && enrollment.status !== "rejected"
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-pointer hover:bg-slate-200"
                    }`}
                  title={
                    enrollment.status === "approved" || enrollment.status === "rejected"
                      ? `Application already ${enrollment.status}`
                      : allFormsReviewed
                        ? "Reject Full Packet"
                        : "Review Required: Grade all forms first"
                  }
                >
                  <XCircle size={22} />
                  <span className="font-bold text-sm hidden sm:block">Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List Grouped by Chapters */}
        <div className="space-y-12 font-poppins">
          {chapters.map((chapter, chapterIdx) => (
            <div key={chapterIdx}>
              <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest ml-1 mb-6 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                {chapter.chapter}
              </h3>

              <div className="space-y-4">
                {chapter.forms.map((formDef) => {
                  const form = enrollment.forms.find(
                    (f) => f.formId === formDef.id,
                  );
                  const status = form?.status || "not-started";
                  const adminNote = form?.adminNote || "";

                  return (
                    <div
                      key={formDef.id}
                      id={`form-row-${formDef.id}`}
                      className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200 hover:border-blue-400 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-sm"
                    >
                      <div className="flex items-start gap-5">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                          <FileText
                            size={20}
                            className="text-slate-400 group-hover:text-blue-600"
                          />
                        </div>
                        <div className="text-poppins">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-900">
                              {formDef.name}
                            </h4>
                          </div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-tight flex items-center gap-1.5">
                            Type: {formDef.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {adminNote && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                            <MessageSquare
                              size={14}
                              className="text-amber-500"
                            />
                            <span className="text-[11px] text-amber-900 font-bold italic line-clamp-1 max-w-[200px]">
                              {adminNote}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <StatusBadge status={status} />
                          <div className="h-8 w-px bg-slate-100 hidden md:block" />
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/application/${enrollment._id}/form/${form.formId}?from=admin-application-detail&scrollTo=form-row-${formDef.id}`,
                                )
                              }
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 hover:shadow-md"
                              title="View Full Form Details"
                            >
                              <ExternalLink size={16} />
                              View Form
                            </button>
                            <button
                              onClick={() =>
                                setReviewModal({
                                  isOpen: true,
                                  form: { ...form, ...formDef }, // Merge definition with data
                                  note: adminNote,
                                  chapter: chapter.chapter,
                                })
                              }
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 hover:shadow-xl"
                            >
                              Review & Grade
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Review Modal Overlay */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-poppins text-poppins">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-blue-950 p-8 text-white relative">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block mb-2">
                {reviewModal.chapter}
              </span>
              <h3 className="text-xl font-bold mb-1">Review Documentation</h3>
              <p className="text-blue-100 text-sm opacity-80">
                {reviewModal.form.name}
              </p>
              <button
                onClick={() =>
                  setReviewModal({
                    isOpen: false,
                    form: null,
                    note: "",
                    chapter: "",
                  })
                }
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
                  onClick={() =>
                    handleFormReview(
                      reviewModal.form.id,
                      "Rejected",
                      reviewModal.note,
                    )
                  }
                  className="flex items-center justify-center gap-2 py-4 rounded-3xl border-2 border-rose-100 text-rose-600 font-bold hover:bg-rose-50 transition-all"
                >
                  <XCircle size={18} /> Deny Form
                </button>
                <button
                  onClick={() =>
                    handleFormReview(
                      reviewModal.form.id,
                      "Approved",
                      reviewModal.note,
                    )
                  }
                  className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50"
                >
                  <CheckCircle size={18} /> Approve Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Decision Modal */}
      {finalModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-poppins text-poppins">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`p-8 text-white relative ${finalModal.status === "Approved" ? "bg-emerald-700" : "bg-rose-950"}`}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block mb-2">
                Final Action Required
              </span>
              <h3 className="text-xl font-bold mb-1">
                {finalModal.status === "Approved"
                  ? "Approve Application"
                  : "Deny Application"}
              </h3>
              <p className="text-white/70 text-sm">
                {applicant.name} | {applicant.id}
              </p>
              <button
                onClick={() =>
                  setFinalModal({ isOpen: false, status: "", note: "" })
                }
                className="absolute top-6 right-6 text-white/50 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="mb-6 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div
                  className={`p-2 rounded-xl ${finalModal.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                >
                  <ShieldCheck size={18} />
                </div>
                <p className="text-xs font-bold text-slate-600 leading-tight">
                  {finalModal.status === "Approved"
                    ? "This will mark the entire packet as verified and notify the client."
                    : "This will rejection the submission. Please provide reasons below."}
                </p>
              </div>

              <label className="text-xs font-black text-blue-900 uppercase tracking-widest mb-3 block">
                Final Decision Note
              </label>
              <textarea
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-sm mb-8 text-slate-900"
                placeholder="Enter final comments for the audit log..."
                value={finalModal.note}
                onChange={(e) =>
                  setFinalModal((prev) => ({ ...prev, note: e.target.value }))
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setFinalModal({ isOpen: false, status: "", note: "" })
                  }
                  className="py-4 rounded-3xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    finalizeApplication(finalModal.status, finalModal.note)
                  }
                  className={`py-4 rounded-3xl text-white font-bold transition-all shadow-lg ${finalModal.status === "Approved" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-50" : "bg-rose-600 hover:bg-rose-700 shadow-rose-50"}`}
                >
                  Confirm Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Data Modal */}
    </div>
  );
};
// Read-only Form Renderer
function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold",
    submitted: "bg-amber-50 text-amber-600 border-amber-100 font-bold",
    pending: "bg-amber-50 text-amber-600 border-amber-100 font-bold", // Same as submitted for now if used
    reviewing: "bg-blue-50 text-blue-700 border-blue-100 font-bold",
    rejected: "bg-rose-50 text-rose-700 border-rose-100 font-bold",
    completed: "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold",
    "in-progress": "bg-slate-50 text-slate-600 border-slate-200",
    "not-started": "bg-slate-50 text-slate-400 border-slate-100",
  };

  return (
    <span
      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default AdminApplicationDetail;
