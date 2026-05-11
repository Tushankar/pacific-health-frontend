import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  FileText,
  AlertTriangle,
  ChevronDown,
  UserPlus,
  Search,
  Upload,
  PenTool,
  LayoutGrid,
  ArrowLeft,
  Info,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyEnrollment,
  createEnrollment,
  updateFormStatus,
  submitEnrollment,
  deleteMyActiveEnrollment,
} from "../../api/enrollment.api";
import { toast } from "sonner";

const ClientManagementHub = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAction, setSelectedAction] = useState(null); // Changed initial state to null
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Added showConfirmModal state
  const [selectedProgram, setSelectedProgram] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch current enrollment
  const { data: enrollmentData, isLoading: isLoadingEnrollment } = useQuery({
    queryKey: ["myEnrollment"],
    queryFn: getMyEnrollment,
  });

  const backendEnrollment = enrollmentData?.enrollment;
  const activeEnrollment = backendEnrollment;

  const isWorkflowActionComplete = Boolean(activeEnrollment || selectedAction);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      toast.success("Enrollment protocol initialized!");
      queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to start enrollment.",
      );
    },
  });

  const updateFormMutation = useMutation({
    mutationFn: ({ enrollmentId, formId, status }) =>
      updateFormStatus(enrollmentId, formId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
    },
  });

  const submitMutation = useMutation({
    mutationFn: submitEnrollment,
    onSuccess: () => {
      toast.success("Application submitted for review!");
      queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
    },
  });

  const resetActiveEnrollmentMutation = useMutation({
    mutationFn: deleteMyActiveEnrollment,
    onSuccess: () => {
      toast.success("Onboarding workflow has been reset!");
      setSelectedProgram("");
      setSelectedAction("");
      queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reset active enrollment."
      );
    },
  });

  // Effect to sync local program selection with active enrollment
  React.useEffect(() => {
    if (activeEnrollment) {
      setSelectedProgram(activeEnrollment.program);
      setSelectedAction("new-onboarding");
    }
  }, [activeEnrollment?.program]);

  const programOptions = [
    {
      value: "NOW-COMP",
      label: "NOW & COMP WAIVERS",
      description:
        "Initialize Admission Packet Chapters I-VI for in-home & community-based support.",
      color: "border-emerald-500",
    },
    {
      value: "OTHER",
      label: "OTHER PROGRAMS",
      description:
        "Establish care protocols for nursing, personal care (CCSP, GAPP, SOURCE) and companionship.",
      color: "border-indigo-500",
    },
    {
      value: "HRMS-ONBOARDING",
      label: "HRMS: Employee Onboarding",
      description:
        "Initialize staff onboarding, credentialing, tax documents, and staff protocols.",
      color: "border-amber-500",
    },
  ];

  // --- FORM LOGIC ENGINE ---
  const formsData = useMemo(() => {
    // If we have backend data, use it to populate the chapters
    if (activeEnrollment && activeEnrollment.forms) {
      const chaptersMap = {};
      activeEnrollment.forms.forEach((f) => {
        if (!chaptersMap[f.chapter]) {
          chaptersMap[f.chapter] = { chapter: f.chapter, forms: [] };
        }
        chaptersMap[f.chapter].forms.push({
          id: f.formId,
          name: f.name,
          type: f.type,
          status: f.status,
          adminNote: f.adminNote,
          desc: `${f.type} document`,
        });
      });
      const allChapters = Object.values(chaptersMap);

      // Locking logic:
      // NOW-COMP: Lock chapters 3 and 4 until approved
      // OTHER: Lock chapter 2 until approved
      return allChapters.map((ch, index) => {
        const status = activeEnrollment.status;
        let isLocked = false;
        if (selectedProgram === "NOW-COMP") {
          if (index >= 2 && status !== "approved") isLocked = true;
        } else if (selectedProgram === "OTHER") {
          if (index >= 1 && status !== "approved") isLocked = true;
        }
        return { ...ch, isLocked };
      });
    }

    // Fallback/Draft mode (before enrollment is created)
    if (selectedProgram === "NOW-COMP") {
      return [
        {
          chapter: "Chapter I- Admission Packet-Nursing",
          forms: [
            {
              id: 1,
              name: "Client Information Form",
              type: "Data Entry",
              desc: "Patient demography and background",
            },
            {
              id: 2,
              name: "Service Agreement Form",
              type: "Fillable",
              desc: "Service agreement form",
            },
            {
              id: 3,
              name: "Service Agreement Addendum",
              type: "Fillable",
              desc: "Addendum to service agreement",
            },
            {
              id: 4,
              name: "Service Care Plan",
              type: "Fillable",
              desc: "Care plan details",
            },
            {
              id: 5,
              name: "Initial Comprehensive Assessment",
              type: "Fillable",
              desc: "Initial assessment",
            },
            {
              id: 6,
              name: "Risk Mitigation Plan",
              type: "Fillable",
              desc: "Risk mitigation details",
            },
            {
              id: 7,
              name: "Self-Preservation",
              type: "Fillable",
              desc: "Self-preservation assessment",
            },
            {
              id: 8,
              name: "Medication List",
              type: "Fillable",
              desc: "List of medications",
            },
            {
              id: 9,
              name: "Doctor's Orders",
              type: "Upload",
              desc: "Upload doctor's orders",
            },
            {
              id: 10,
              name: "Abnormal Involuntary Movement Scale (AIMS)",
              type: "Fillable",
              desc: "AIMS assessment",
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
              desc: "View & E-Sign",
            },
            {
              id: 12,
              name: "CODE OF ETHICS POLICY",
              type: "Signable",
              desc: "View & E-Sign",
            },
            {
              id: 13,
              name: "AUTHORIZATION FOR RELEASE OF INFORMATION – STANDARD REQUEST",
              type: "Fillable",
              desc: "Authorization for release",
            },
            {
              id: 14,
              name: "Vehicle/ Funds Policy",
              type: "Signable",
              desc: "View & acknowledge",
            },
            {
              id: 15,
              name: "My Human Rights",
              type: "Fillable",
              desc: "Human rights form",
            },
            {
              id: 16,
              name: "Freedom of Choice",
              type: "Upload",
              desc: "Upload freedom of choice form",
            },
            {
              id: 17,
              name: "Advance Directives",
              type: "Upload",
              desc: "Upload advance directives",
            },
            {
              id: 18,
              name: "HIPAA/ Confidentiality",
              type: "Signable",
              desc: "View & acknowledge",
            },
            {
              id: 19,
              name: "Grievance and Complaints for Individuals",
              type: "Fillable",
              desc: "Grievance form",
            },
            {
              id: 20,
              name: "Abuse & Neglect",
              type: "Fillable",
              desc: "Abuse and neglect form",
            },
          ],
        },
        {
          chapter: "Chapter III- Tracking",
          forms: [
            {
              id: 21,
              name: "ISP/ Training Sign-off",
              type: "Fillable",
              desc: "ISP training sign-off",
            },
            {
              id: 22,
              name: "HRST/ Training Sign-off",
              type: "Fillable",
              desc: "HRST training sign-off",
            },
            {
              id: 23,
              name: "Behavior Support Plan (BSP)-(Optional)",
              type: "Upload",
              desc: "Optional BSP",
            },
            {
              id: 24,
              name: "BSP Tracking/Progress Notes (Optional)",
              type: "Fillable",
              desc: "Optional BSP tracking",
            },
            {
              id: 25,
              name: "Health Care Plan/ Protocols/ Training Sign-Off",
              type: "Fillable",
              desc: "Health care plan sign-off",
            },
            {
              id: 26,
              name: "Medication Admin. Record (MAR) Training Sign-Off (Optional)",
              type: "Fillable",
              desc: "Optional MAR training",
            },
          ],
        },
        {
          chapter: "Chapter IV- Documentation & Medical Treatment",
          forms: [
            {
              id: 27,
              name: "Visitor Log",
              type: "Fillable",
              desc: "Log of visitors",
            },
            {
              id: 28,
              name: "Rights Training/ Monthly Review",
              type: "Fillable",
              desc: "Monthly rights review",
            },
            {
              id: 29,
              name: "Doctor's Appointment Log",
              type: "Fillable",
              desc: "Appointment log",
            },
            {
              id: 30,
              name: "Supervisory Visit Documentation",
              type: "Fillable",
              desc: "Supervisory visit docs",
            },
            {
              id: 31,
              name: "Annuals (Physical, TB, Dental, Vision)",
              type: "Upload",
              desc: "Upload annual checkups",
            },
          ],
        },
      ];
    }

    if (selectedProgram === "OTHER") {
      return [
        {
          chapter: "Chapter I- Admission Packet",
          forms: [
            {
              id: 1,
              name: "Client Information Form",
              type: "Data Entry",
              desc: "Basic client information",
            },
            {
              id: 2,
              name: "Service Agreement",
              type: "Fillable",
              desc: "Service agreement form",
            },
            {
              id: 3,
              name: "Service Agreement Addendum",
              type: "Fillable",
              desc: "Addendum to service agreement",
            },
            {
              id: 4,
              name: "Service Care Plan",
              type: "Fillable",
              desc: "Care plan details",
            },
            {
              id: 5,
              name: "Medication List",
              type: "Fillable",
              desc: "List of medications",
            },
            {
              id: 6,
              name: "Comprehensive Initial Nursing Assessment",
              type: "Fillable",
              desc: "Comprehensive evaluation",
            },
            {
              id: 7,
              name: "Client Rights and Responsibilities",
              type: "Signable",
              desc: "View & E-Sign",
            },
            {
              id: 8,
              name: "CODE OF ETHICS POLICY",
              type: "Signable",
              desc: "View & E-Sign",
            },
          ],
        },
        {
          chapter: "Chapter II- Service Documentation",
          forms: [
            {
              id: 9,
              name: "Home Supervisory Visit",
              type: "Fillable",
              desc: "Supervisory visit records",
            },
            {
              id: 10,
              name: "INCIDENT REPORTING FORM",
              type: "Fillable",
              desc: "Incident reporting",
            },
            {
              id: 11,
              name: "Client Complaint Form",
              type: "Fillable",
              desc: "Client complaint documentation",
            },
          ],
        },
      ];
    }
    return [];
  }, [selectedProgram, activeEnrollment]); // Added activeEnrollment to dependency array

  // --- RENDER CONFIRMATION MODAL ---
  const renderConfirmModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500 border border-slate-200">
          <div className="relative h-32 bg-indigo-600 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-800"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <ShieldCheck size={48} className="text-white relative z-10" />
          </div>

          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Confirm Selection
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              You are about to enroll in the{" "}
              <span className="font-bold text-indigo-600">
                {selectedProgram}
              </span>{" "}
              program.
              <br />
              <br />
              <span className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 inline-block font-bold">
                Important: Once confirmed, you cannot change your program until
                you complete all forms and receive admin approval.
              </span>
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  createMutation.mutate(selectedProgram);
                  setShowConfirmModal(false);
                }}
                disabled={createMutation.isPending}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {createMutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <CheckCircle size={20} />
                )}
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (activeEnrollment) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-poppins text-slate-900 antialiased">
        <main className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
          {selectedProgram === "HRMS-ONBOARDING" && (
            <div className="mb-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-40"></div>
              <div className="relative z-10">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">HRMS Onboarding Dashboard</h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
                  You are currently navigating the database-backed HRMS Employee Onboarding workflow. Your progress, drafts, and uploaded documents are stored securely in MongoDB.
                </p>
              </div>
              <button
                disabled={resetActiveEnrollmentMutation.isPending}
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset your onboarding progress? This will delete all saved form data in the database.")) {
                    resetActiveEnrollmentMutation.mutate();
                  }
                }}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs transition-all self-start sm:self-auto shadow-sm active:scale-95 flex items-center gap-2"
              >
                {resetActiveEnrollmentMutation.isPending && <Loader2 className="animate-spin" size={14} />}
                Reset Onboarding / Change Program
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
            {/* LEFT CONTENT: CHAPTERS */}
            <div className="col-span-12 lg:col-span-9 space-y-12">
              {formsData.map((chapter, idx) => (
                <section
                  key={idx}
                  onClick={() => {
                    if (chapter.isLocked) {
                      toast.info(
                        "Locked: This section will unlock after you complete submitting all forms properly and receive admin approval.",
                      );
                    }
                  }}
                  className={`animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer ${chapter.isLocked ? "opacity-50 grayscale" : ""}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 tracking-tight">
                      {chapter.chapter}
                    </h2>
                    <div className="h-px flex-1 bg-slate-200 hidden sm:block" />
                    {chapter.isLocked ? (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5 ring-4 ring-amber-500/10">
                        <Clock size={12} className="animate-pulse" />
                        Locked: Phase 2
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-black bg-white border border-slate-200 px-3 py-1 rounded-full uppercase">
                        {chapter.forms.length} Documents
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 relative">
                    {chapter.isLocked && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl border-2 border-dashed border-slate-200/50">
                        <div className="bg-white p-6 rounded-full shadow-2xl shadow-indigo-200/50 mb-4 border border-slate-100">
                          <ShieldCheck size={40} className="text-indigo-400" />
                        </div>
                        <p className="font-bold text-slate-800 text-lg">
                          Coming in Phase 2
                        </p>
                        <p className="text-slate-500 text-sm max-w-xs text-center px-4">
                          These documents will be available once your initial
                          packet is approved by our admin team.
                        </p>
                      </div>
                    )}
                    {chapter.forms
                      .filter((f) =>
                        f.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .map((form) => (
                        <div
                          key={form.id}
                          className={`bg-white rounded-xl md:rounded-2xl border p-4 md:p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex flex-col justify-between ${
                            form.status === "completed"
                              ? "border-indigo-200 bg-indigo-50/10"
                              : form.status === "approved"
                                ? "border-emerald-200 bg-emerald-50/10"
                                : form.status === "rejected"
                                  ? "border-rose-200 bg-rose-50/10"
                                  : "border-slate-200 hover:border-indigo-400"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <TypeBadge type={form.type} />
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-blue-900">
                                  #{form.id}
                                </span>
                                {form.status && (
                                  <span
                                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md mt-1 ${
                                      form.status === "completed"
                                        ? "bg-indigo-100 text-indigo-600"
                                        : form.status === "approved"
                                          ? "bg-emerald-100 text-emerald-600"
                                          : form.status === "rejected"
                                            ? "bg-rose-100 text-rose-600"
                                            : form.status === "in-progress"
                                              ? "bg-amber-100 text-amber-600"
                                              : "bg-slate-100 text-slate-400"
                                    }`}
                                  >
                                    {form.status.replace("-", " ")}
                                  </span>
                                )}
                              </div>
                            </div>
                            <h3 className="text-sm md:text-base font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                              {form.name}
                            </h3>

                            {/* Admin Note Display inside Card */}
                            {(form.status === "rejected" ||
                              (form.status === "approved" && form.adminNote)) &&
                              form.adminNote && (
                                <div
                                  className={`mt-2 p-2 rounded-lg text-[10px] leading-snug border ${
                                    form.status === "rejected"
                                      ? "bg-rose-50 border-rose-100 text-rose-700"
                                      : "bg-emerald-50 border-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-1 mb-1 font-bold">
                                    <MessageSquare size={10} />
                                    <span>
                                      {form.status === "rejected"
                                        ? "Feedback:"
                                        : "Note:"}
                                    </span>
                                  </div>
                                  "{form.adminNote}"
                                </div>
                              )}
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/my-application?formId=${form.id}`)
                            }
                            className={`w-full relative overflow-hidden flex items-center justify-between p-3 rounded font-bold shadow-md hover:shadow-lg transition-all mt-4 group/btn ${
                              form.status === "completed"
                                ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-200 text-white"
                                : form.status === "approved"
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200 text-white"
                                  : form.status === "rejected"
                                    ? "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-200 text-white"
                                    : "bg-white text-violet-600 border border-slate-200 hover:bg-violet-50 hover:text-violet-700 shadow-sm"
                            }`}
                          >
                            {/* Shimmer Effect */}
                            {form.status !== "in-progress" && form.status && (
                              <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                            )}

                            <span className="text-xs px-1 relative z-20">
                              {form.status === "completed" ||
                              form.status === "approved"
                                ? "Review Document"
                                : form.status === "rejected"
                                  ? "Fix Issues"
                                  : form.status === "in-progress"
                                    ? "Continue Workflow"
                                    : "Open Workflow"}
                            </span>
                            <ChevronRight size={16} className="relative z-20" />
                          </button>
                        </div>
                      ))}
                  </div>
                </section>
              ))}
            </div>

            {/* RIGHT SIDEBAR: AUDIT & STATUS */}
            <div className="col-span-12 lg:col-span-3">
              <div className="lg:sticky lg:top-32 space-y-4 md:space-y-6">
                {activeEnrollment && (
                  <div className="bg-slate-900 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all duration-1000" />
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 relative z-10">
                      Packet Completion
                    </h3>
                    {(() => {
                      // Calculate Phase 1 progress to match MyApplication logic
                      let totalForms = 0;
                      let completedForms = 0;

                      if (activeEnrollment) {
                        const maxPhase1Id =
                          selectedProgram === "NOW-COMP" ? 20 : (selectedProgram === "HRMS-ONBOARDING" ? 123 : 8);
                        const phase1Forms = activeEnrollment.forms.filter(
                          (f) => f.formId <= maxPhase1Id,
                        );
                        totalForms = phase1Forms.length;
                        completedForms = phase1Forms.filter((f) =>
                          ["completed", "approved", "rejected"].includes(
                            f.status,
                          ),
                        ).length;
                      }

                      const percentage =
                        activeEnrollment.status === "approved"
                          ? 100
                          : totalForms > 0
                            ? Math.round((completedForms / totalForms) * 100)
                            : 0;

                      return (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-4 md:mb-6 relative z-10">
                            <span className="text-4xl sm:text-4xl md:text-5xl font-bold italic">
                              {percentage}%
                            </span>
                            <span className="text-indigo-300 text-xs sm:text-xs md:text-sm font-bold sm:mb-1">
                              {selectedProgram === "HRMS-ONBOARDING"
                                ? "Onboarding Completion"
                                : "Phase 1 Completion"}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4 sm:mb-6 md:mb-8">
                            <div
                              className="h-full bg-white rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          {activeEnrollment.status === "submitted" ||
                          (activeEnrollment.status === "pending" &&
                            activeEnrollment.submittedAt) ? (
                            <div className="w-full py-3 sm:py-4 bg-amber-500/20 border border-amber-500/30 rounded-xl sm:rounded-2xl flex flex-col items-center gap-2 text-amber-200">
                              <Clock size={20} className="sm:w-6 sm:h-6" />
                              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center px-2">
                                Awaiting Admin Review
                              </span>
                            </div>
                          ) : activeEnrollment.status === "rejected" ? (
                            <button
                              onClick={() =>
                                submitMutation.mutate(activeEnrollment._id)
                              }
                              disabled={
                                submitMutation.isPending || percentage < 100
                              }
                              className="w-full bg-rose-600 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg hover:bg-rose-500 transition-all flex items-center justify-center gap-2"
                            >
                              {submitMutation.isPending ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : (
                                <AlertTriangle size={18} />
                              )}
                              Resubmit Application
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                submitMutation.mutate(activeEnrollment._id)
                              }
                              disabled={
                                submitMutation.isPending ||
                                percentage < 100 ||
                                activeEnrollment.status === "approved"
                              }
                              className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                                percentage === 100
                                  ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              {submitMutation.isPending ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : (
                                <ClipboardList size={18} />
                              )}
                              {activeEnrollment.status === "approved"
                                ? "Application Approved"
                                : "Submit Full Packet"}{" "}
                              <ChevronRight size={16} />
                            </button>
                          )}

                          {percentage < 100 &&
                            !activeEnrollment.submittedAt && (
                              <p className="text-[10px] text-slate-400 mt-4 text-center">
                                Please complete all{" "}
                                {totalForms - completedForms} remaining
                                documents to enable submission.
                              </p>
                            )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {activeEnrollment?.status === "rejected" &&
                  activeEnrollment?.adminNote && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3 text-rose-600">
                        <XCircle
                          size={16}
                          className="sm:w-[18px] sm:h-[18px]"
                        />
                        <h4 className="text-xs sm:text-sm font-bold">
                          Admin Feedback
                        </h4>
                      </div>
                      <p className="text-[11px] sm:text-xs text-rose-800 leading-relaxed italic border-l-2 border-rose-300 pl-2 sm:pl-3">
                        "{activeEnrollment.adminNote}"
                      </p>
                    </div>
                  )}

                <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] sm:text-xs font-black text-blue-900 uppercase tracking-widest mb-3 sm:mb-4 md:mb-6 border-b border-slate-50 pb-2 sm:pb-3 md:pb-4">
                    Onboarding Legend
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        type: "Data Entry",
                        color: "bg-emerald-500",
                        icon: LayoutGrid,
                      },
                      {
                        type: "Fillable",
                        color: "bg-indigo-500",
                        icon: FileText,
                      },
                      {
                        type: "Signable",
                        color: "bg-amber-500",
                        icon: PenTool,
                      },
                      { type: "Upload", color: "bg-rose-500", icon: Upload },
                    ].map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center gap-3 sm:gap-4 group"
                      >
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${item.color}/10 flex items-center justify-center text-slate-600 flex-shrink-0`}
                        >
                          <item.icon
                            size={14}
                            className={`sm:w-4 sm:h-4 ${item.color.replace("bg-", "text-")}`}
                          />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                          {item.type} Method
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl bg-amber-50 border border-amber-100">
                  <div className="flex gap-2 sm:gap-2 md:gap-3 mb-2 items-start">
                    <AlertTriangle
                      className="text-amber-600 flex-shrink-0 mt-0.5"
                      size={16}
                    />
                    <p className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      System Guidance
                    </p>
                  </div>
                  <p className="text-[11px] sm:text-[12px] text-amber-700 leading-relaxed font-medium">
                    Documents in <strong>Chapter III</strong> for COMP and{" "}
                    <strong>Chapter II</strong> for NOW are unlocked
                    automatically after the Initial Admission Packet is
                    validated by Admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        {renderConfirmModal()}
      </div>
    );
  }

  // Fallback for selection screen
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start pt-8 md:pt-16 p-4 md:p-6 font-sans antialiased text-slate-900">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        <div>
          <div className="mb-6">
            <img
              src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png"
              alt="Pacific Health Systems Logo"
              className="h-20 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Client Management <br />
            <span className="text-blue-900">Protocol Hub</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            Select a program to initialize the specific admission
            packet, onboarding, or regulatory documentation workflow.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-slate-200">
          {activeEnrollment && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <Clock className="text-amber-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Enrollment Active
                </p>
                <p className="text-xs text-amber-600">
                  Your selection is locked until admin review.
                </p>
              </div>
            </div>
          )}

          <label className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-4 block">
            1. Workflow Action
          </label>
          <div className="flex gap-3 mb-8">
            {["new-onboarding"].map((a) => (
              <button
                key={a}
                onClick={() => !activeEnrollment && setSelectedAction(a)}
                className={`flex-1 flex flex-col items-center py-4 px-2 rounded-xl border-2 transition-all ${selectedAction === a ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 text-slate-400 hover:border-slate-200"} ${activeEnrollment ? "cursor-not-allowed opacity-80" : ""}`}
              >
                <span className="text-sm font-bold uppercase tracking-wide">
                  Intake: New Client
                </span>
                <span className="text-[10px] opacity-70 mt-1 font-medium hidden md:block text-center">
                  Enroll individuals joining the care network
                </span>
              </button>
            ))}
          </div>

          <label
            className={`text-xs font-bold uppercase tracking-widest mb-4 block ${
              isWorkflowActionComplete ? "text-blue-900" : "text-slate-400"
            }`}
          >
            2. Program Selection
          </label>
          <div className="space-y-3 mb-8">
            {programOptions.map((p) => (
              <button
                key={p.value}
                type="button"
                disabled={!isWorkflowActionComplete || !!activeEnrollment}
                onClick={() => {
                  if (isWorkflowActionComplete && !activeEnrollment) {
                    setSelectedProgram(p.value);
                    localStorage.setItem("selectedProgram", p.value);
                  }
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${
                  !isWorkflowActionComplete
                    ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-80"
                    : selectedProgram === p.value
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-100 hover:border-slate-200"
                } ${activeEnrollment ? "cursor-not-allowed opacity-80" : ""}`}
              >
                <div>
                  <p
                    className={`font-bold ${
                      !isWorkflowActionComplete
                        ? "text-slate-400"
                        : selectedProgram === p.value
                          ? "text-indigo-900"
                          : "text-slate-700"
                    }`}
                  >
                    {p.label}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      !isWorkflowActionComplete
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {p.description}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className={
                    !isWorkflowActionComplete
                      ? "text-slate-300"
                      : selectedProgram === p.value
                        ? "text-indigo-600"
                        : "text-slate-300"
                  }
                />
              </button>
            ))}
          </div>

          {!activeEnrollment && selectedProgram && selectedAction && (
            <button
              onClick={() => setShowConfirmModal(true)} // Changed to open modal
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <ClipboardList size={20} />
              {selectedProgram === "HRMS-ONBOARDING" ? "Start Onboarding Protocol" : "Start Intake Protocol"}
            </button>
          )}

          {activeEnrollment && (
            <button
              onClick={() => setSelectedAction("new-onboarding")}
              className="w-full py-4 bg-slate-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              <LayoutGrid size={20} />
              Access Active Workflow
            </button>
          )}
        </div>
      </div>
      {renderConfirmModal()}
    </div>
  );
};

const TypeBadge = ({ type }) => {
  const styles = {
    "Data Entry": "bg-emerald-50 text-emerald-600 border-emerald-100",
    Fillable: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Signable: "bg-amber-50 text-amber-600 border-amber-100",
    Upload: "bg-rose-50 text-rose-600 border-rose-100",
    Track: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const icons = {
    "Data Entry": <LayoutGrid size={12} />,
    Fillable: <FileText size={12} />,
    Signable: <PenTool size={12} />,
    Upload: <Upload size={12} />,
    Track: <Clock size={12} />,
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wide ${styles[type]}`}
    >
      {icons[type]} {type}
    </div>
  );
};

// Add shimmer animation styles
const ShimmerStyles = () => (
  <style>{`
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  `}</style>
);

export default function DashboardWithStyles() {
  return (
    <>
      <ShimmerStyles />
      <ClientManagementHub />
    </>
  );
}
