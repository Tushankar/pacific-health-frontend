import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  XCircle,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyEnrollment, updateFormStatus, submitEnrollment, getEnrollmentById } from "../../api/enrollment.api";
import * as OnboardingForms from "../../OnboardingForms";
import { toast } from "sonner";
import useDraftSave from "../../hooks/useDraftSave";

const MyApplication = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const enrollmentId = searchParams.get("enrollmentId");
  const formId = searchParams.get("formId");

  const [selectedProgram, setSelectedProgram] = useState(() => {
    return localStorage.getItem("selectedProgram") || "NOW-COMP";
  });

  const queryClient = useQueryClient();

  // Fetch enrollment data (either specific or current active)
  const { data: enrollmentData, isLoading } = useQuery({
    queryKey: enrollmentId ? ["enrollment", enrollmentId] : ["myEnrollment"],
    queryFn: () => enrollmentId ? getEnrollmentById(enrollmentId) : getMyEnrollment(),
    enabled: !!enrollmentId || !enrollmentId, // Always enabled, logic handles it
  });

  const activeEnrollment = enrollmentData?.enrollment || enrollmentData; // Handle both response structures if different

  // Sync program selection
  useEffect(() => {
    if (activeEnrollment) {
      setSelectedProgram(activeEnrollment.program);
    }
  }, [activeEnrollment]);

  // Safeguard: If no active enrollment (and not loading), redirect to dashboard
  useEffect(() => {
    if (!isLoading && !activeEnrollment) {
      navigate("/dashboard");
    }
  }, [activeEnrollment, isLoading, navigate]);

  // Mutation for updating form status
  const statusMutation = useMutation({
    mutationFn: ({ formId, status, formData }) => {
      if (!activeEnrollment?._id) return Promise.reject("No enrollment");
      return updateFormStatus(activeEnrollment._id, formId, status, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
    },
  });

  // Mutation for submitting enrollment
  const submitMutation = useMutation({
    mutationFn: submitEnrollment,
    onSuccess: () => {
      toast.success("Application submitted for review!");
      queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
    },
  });



  // Form data for reference
  const formsData = useMemo(() => {
    // If we have backend data, use it
    if (activeEnrollment && activeEnrollment.forms) {
      const chaptersMap = {};
      activeEnrollment.forms?.forEach(f => {
        if (!chaptersMap[f.chapter]) {
          chaptersMap[f.chapter] = { chapter: f.chapter, forms: [] };
        }
        chaptersMap[f.chapter].forms.push({
          id: f.formId,
          name: f.name,
          type: f.type,
          status: f.status,
          desc: `${f.type} document`
        });
      });
      const allChapters = Object.values(chaptersMap);

      // Filtering logic:
      // NOW-COMP: Hide chapters 3 and 4 until approved
      // OTHER: Hide chapter 2 until approved
      return allChapters.filter((ch, index) => {
        const status = activeEnrollment?.status;
        if (selectedProgram === "NOW-COMP") {
          if (index >= 2 && status !== "approved") return false;
        } else if (selectedProgram === "OTHER") {
          if (index >= 1 && status !== "approved") return false;
        }
        return true;
      });
    }

    // Fallback static data
    if (selectedProgram === "NOW-COMP") {
      return [
        {
          chapter: "Chapter I- Admission Packet-Nursing",
          forms: [
            { id: 1, name: "Client Information Form", type: "Data Entry", desc: "Basic client information" },
            { id: 2, name: "Service Agreement Form", type: "Fillable", desc: "Service agreement form" },
            // ... truncated ...
          ],
        },
      ];
    }
    return [];
  }, [selectedProgram, activeEnrollment]);

  // Find the selected form
  const selectedForm = useMemo(() => {
    if (!formId) return null;
    for (const chapter of formsData) {
      const form = chapter.forms.find((f) => f.id === parseInt(formId));
      if (form) {
        return { ...form, chapter: chapter.chapter };
      }
    }
    return null;
  }, [formId, formsData]);

  const dashboardFormsData = formsData;

  // Calculate overall progress based on backend data
  // Only count forms relevant to the current program phase (unlocked forms)
  const progressStats = useMemo(() => {
    if (!activeEnrollment || !activeEnrollment.forms) {
       return { total: 0, completed: 0, percent: 0 };
    }

    const isApproved = activeEnrollment?.status === 'approved';


    // Only count unlocked/visible forms for the selected program
    // NOW-COMP: Phase 1 = forms 1-20 (Chapters I & II), Phase 2 = all (after approval)
    // OTHER: Phase 1 = forms 1-8 (Chapter I), Phase 2 = all (after approval)
    let visibleForms;
    if (isApproved) {
      // All forms are unlocked after approval
      visibleForms = activeEnrollment?.forms || [];
    } else {
      const maxPhase1Id = selectedProgram === "NOW-COMP" ? 20 : 8;
      visibleForms = (activeEnrollment?.forms || []).filter(f => f.formId <= maxPhase1Id);
    }

    const total = visibleForms.length;
    
    // Correctly count based on individual form status
    const approvedCount = visibleForms.filter(f => f.status === 'approved').length;
    const rejectedCount = visibleForms.filter(f => f.status === 'rejected').length;
    const completedStatus = visibleForms.filter(f => f.status === 'completed').length;
    
    // For progress bar: count anything that is "done" from user perspective (submitted)
    // or has received feedback.
    // PIN TO 100% IF APPROVED
    const completed = isApproved ? total : approvedCount + rejectedCount + completedStatus;
    
    // Remaining = Total - (Approved + Rejected + Completed)
    // This counts Not Started, In Progress, Draft
    const actionRequired = total - completed;
    
    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      rejected: rejectedCount,
      approved: approvedCount,
      actionRequired
    };
  }, [activeEnrollment, selectedProgram]);

  const WorkflowsDashboard = () => {
    const navigate = useNavigate();
    
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-40"></div>
           
           <div className="relative z-10 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {activeEnrollment?.status === 'submitted' ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-amber-200">
                  <Clock size={12} /> Under Review
                </span>
              ) : activeEnrollment?.status === 'approved' ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-emerald-200">
                  <CheckCircle size={12} /> Approved
                </span>
              ) : activeEnrollment?.status === 'rejected' ? (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-rose-200">
                  <XCircle size={12} /> Rejected
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">Active Enrollment</span>
              )}
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-600 text-sm font-medium">{selectedProgram} Program</span>
            </div>
            
            {(activeEnrollment?.status === 'approved' || activeEnrollment?.status === 'rejected') && activeEnrollment?.adminNote && (
              <div className={`mt-2 mb-4 p-4 rounded-2xl border flex gap-3 items-start animate-in slide-in-from-top-2 duration-500 ${activeEnrollment?.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                <MessageSquare size={18} className={activeEnrollment?.status === 'approved' ? 'text-emerald-500' : 'text-rose-500'} />
                <div className="text-sm">
                  <span className="font-bold block mb-0.5">Admissions Note:</span>
                  <p className="italic font-medium leading-relaxed">"{activeEnrollment?.adminNote}"</p>
                </div>
              </div>
            )}
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">My Workflows</h1>
            <p className="text-slate-500 max-w-3xl text-sm md:text-base">
              Complete your documentation to finalize your admission. Your progress is saved automatically as you fill out each form. All required documents must be submitted, reviewed, and approved by the admissions department.
            </p>
          </div>
          
          <div className="relative z-10 w-full p-0">
             <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex items-center gap-4 flex-shrink-0 min-w-[140px]">
                   <div className="text-5xl font-extrabold text-blue-600">{progressStats.percent}%</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Enrollment<br/>Progress</div>
                </div>

                <div className="flex-1 w-full">
                   <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 transition-all duration-1000 relative"
                        style={{ width: `${progressStats.percent}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                   </div>
                   <div className="flex justify-between w-full mt-3 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {progressStats.completed} Forms Completed
                      </span>
                      <span>{progressStats.total} Forms Total</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: "Total Forms", value: progressStats.total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Approved Forms", value: progressStats.approved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Alerts", value: progressStats.rejected, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
             { label: "Remaining", value: progressStats.actionRequired, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm border border-current/10`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                </div>
             </div>
           ))}
        </div>

        {/* Forms List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <h3 className="font-bold text-slate-800 text-lg">Program Forms & Documents</h3>
            <div className="flex items-center gap-3">
               {/* Submit Application Button */}
               <button
                 onClick={() => activeEnrollment && submitMutation.mutate(activeEnrollment._id)}
                 disabled={submitMutation.isPending || progressStats.percent < 100 || activeEnrollment?.status === 'approved' || activeEnrollment?.status === 'submitted' || !activeEnrollment}
                 className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 mr-4 ${
                   progressStats.percent === 100 && activeEnrollment?.status === 'pending'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200 shadow-lg' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                 }`}
               >
                 {submitMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <ClipboardList size={16} />}
                 {activeEnrollment?.status === 'approved' ? 'Application Approved' : activeEnrollment?.status === 'submitted' ? 'Awaiting Admin Review' : 'Submit Full Application'}
               </button>

               <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Approved
               </span>
               <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tighter ml-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div> Rejected
               </span>
               <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tighter ml-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div> In Review
               </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Feedback / Notes</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Method</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardFormsData.map((chapter) => (
                  <React.Fragment key={chapter.chapter}>
                    <tr className="bg-slate-50/70 border-y border-slate-200/50">
                      <td colSpan="5" className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-1.5 bg-gradient-to-b from-blue-600 to-blue-900 rounded-full shadow-sm"></div>
                          <span className="text-base font-black bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent uppercase tracking-tight">{chapter.chapter}</span>
                        </div>
                      </td>
                    </tr>
                    {chapter.forms.map((form) => {
                      const backendForm = activeEnrollment?.forms?.find(f => f.formId === form.id);
                      const isCompleted = backendForm?.status === "completed";
                      const isInProgress = backendForm?.status === "in-progress";
                      const isDraft = backendForm?.status === "draft";

                      // Determine status label based on backend + overall enrollment status
                      // Determine status label based on backend + overall enrollment status
                      let status = "Not Started";
                      if (backendForm?.status === "approved") status = "Approved";
                      else if (backendForm?.status === "rejected") status = "Rejected";
                      else if (isCompleted) status = "Completed";
                      else if (isDraft) status = "Draft Saved";
                      else if (isInProgress) status = "In Progress";

                      const statusColors = {
                        "Approved": "bg-emerald-50 text-emerald-700 border-emerald-100",
                        "Completed": "bg-indigo-50 text-indigo-700 border-indigo-100",
                        "Rejected": "bg-rose-50 text-rose-700 border-rose-100",
                        "Draft Saved": "bg-yellow-50 text-yellow-700 border-yellow-200",
                        "In Progress": "bg-amber-50 text-amber-700 border-amber-100",
                        "Pending": "bg-amber-50 text-amber-700 border-amber-100",
                        "Not Started": "bg-slate-50 text-slate-500 border-slate-100",
                      };
                      
                      const note = (status === 'Rejected' && backendForm?.adminNote) ? backendForm.adminNote : 
                                   (status === 'Approved' && backendForm?.adminNote) ? backendForm.adminNote :
                                   (status === 'Approved') ? "Document approved." :
                                   isCompleted ? "Document ready for review." : 
                                   isDraft ? "Draft saved. Continue where you left off." : 
                                   isInProgress ? "Form opened. Continue filling." : "Awaiting user input.";

                      return (
                        <tr key={form.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider whitespace-nowrap ${statusColors[status]}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{form.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap">#{form.id} • {chapter.chapter.split('-')[0]}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className={`text-xs p-3 rounded-xl border italic max-w-sm ${
                              status === 'Approved' 
                                ? 'bg-emerald-50/30 border-emerald-100 text-emerald-700 font-medium' 
                                : status === 'Rejected' 
                                  ? 'bg-rose-50/30 border-rose-100 text-rose-700 font-medium' 
                                  : status === 'Pending'
                                    ? 'bg-amber-50/30 border-amber-100 text-amber-900 overflow-hidden'
                                    : 'bg-slate-50/30 border-slate-100 text-slate-500'
                            }`}>
                              "{note}"
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden md:table-cell">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase whitespace-nowrap">
                              {form.type}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <button 
                               onClick={() => navigate(`?formId=${form.id}`)}
                               className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
                                 isCompleted 
                                  ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" 
                                  : isDraft ? "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-100"
                                  : isInProgress ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-100"
                                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
                               }`}
                             >
                               {status === 'Completed' || status === 'Approved' ? "View Document" : status === 'Rejected' ? "Fix Issues" : status === 'Draft Saved' ? "Continue Draft" : status === 'In Progress' ? "Continue" : "Open Form"}
                             </button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // DraftFormWrapper — wraps each form with draft auto-save logic
  const DraftFormWrapper = ({ Component, enrollmentId, formId, formName, selectedProgram, savedData, draftData, progressCurrent, progressTotal, onComplete, readOnly, nextFormId }) => {
    const formStateRef = useRef(null);
    const hasUserInteracted = useRef(false);

    const getFormData = useCallback(() => {
      return formStateRef.current;
    }, []);

    const handleDraftLoaded = useCallback((draft) => {
      formStateRef.current = draft;
    }, []);

    const { markDirty, markSubmitted } = useDraftSave({
      enrollmentId,
      formId,
      formName,
      draftData,
      onDraftLoaded: handleDraftLoaded,
      getFormData,
    });

    const handleFormChange = useCallback((data) => {
      formStateRef.current = data;
      // Only mark dirty if the user has actually typed/interacted and it's not read-only
      if (hasUserInteracted.current && !readOnly) {
        markDirty();
      }
    }, [markDirty, readOnly]);

    const handleNext = useCallback(() => {
      // If nextFormId is valid, navigate to it
      if (nextFormId) {
        const currentPath = location.pathname;
        const query = new URLSearchParams(searchParams);
        query.set("formId", nextFormId);
        navigate(`${currentPath}?${query.toString()}`);
      } else {
        // If no next form (end of flow), redirect to my-application or show success
        toast.success("All forms for this phase are completed!");
        navigate("/my-application");
      }
    }, [nextFormId, navigate, location.pathname, searchParams]);

    const handleComplete = useCallback(async (submittedFormData) => {
      if (readOnly) return; // Prevent submission in read-only mode
      markSubmitted();
      try {
        await onComplete(submittedFormData);
        // After successful save/update, navigate to next form
        handleNext();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to save form. Please try again.");
      }
    }, [onComplete, markSubmitted, readOnly, handleNext]);

    // Use draft data as savedData if available (draft takes priority for loading)
    const effectiveSavedData = draftData || savedData;

    return (
      <div 
        className={readOnly ? "readonly-lock-active min-h-full" : ""}
        onInputCapture={(e) => {
          if (!readOnly) {
            hasUserInteracted.current = true;
            markDirty();
          }
          if (readOnly) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onKeyDownCapture={(e) => {
          if (readOnly) {
            const isAction = e.target.closest('button') || e.target.closest('a') || e.target.closest('.no-lock');
            if (!isAction && (e.key === ' ' || e.key === 'Enter' || e.key.length === 1)) {
              e.preventDefault();
              e.stopPropagation();
              toast.info("This form is submitted to admin. You cannot change it unless any instruction from admin arrive.", {
                id: 'readonly-lock-toast',
                duration: 4000
              });
            }
          }
        }}
        onClickCapture={(e) => {
          if (!readOnly) {
             hasUserInteracted.current = true;
          }
          if (readOnly) {
            // Check if user clicked an interactive action button or link
            const isAction = e.target.closest('button') || e.target.closest('a') || e.target.closest('.no-lock');
            
            // If it's not an action, show the lock message and block bubbling
            if (!isAction) {
              e.preventDefault();
              e.stopPropagation();
              toast.info("This form is submitted to admin. You cannot change it unless any instruction from admin arrive.", {
                id: 'readonly-lock-toast',
                duration: 4000
              });
            }
          }
        }}
      >
        {readOnly && (
          <style>{`
            .readonly-lock-active :is(input, textarea, select, [role="checkbox"], [role="radio"], [type="checkbox"], [type="radio"]) {
              pointer-events: none !important;
              user-select: none !important;
            }
            .readonly-lock-active .SaveNextButton, 
            .readonly-lock-active button, 
            .readonly-lock-active a {
              pointer-events: auto !important;
              cursor: pointer !important;
            }
          `}</style>
        )}
        <fieldset style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>
          <Component
            enrollmentId={enrollmentId}
            formId={formId}
            selectedProgram={selectedProgram}
            savedData={effectiveSavedData}
            progressCurrent={progressCurrent}
            progressTotal={progressTotal}
            onComplete={handleComplete}
            onFormChange={handleFormChange}
            onNext={handleNext}
            isReadOnly={readOnly}
          />
        </fieldset>
      </div>
    );
  };

  // Render the appropriate form component based on formId
  const renderFormComponent = () => {
    if (!selectedForm) return null;

    // Mapping of form names to components - Complete linkage between Dashboard and Form Components
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

      // Chapter III - Tracking (optional/upload forms)
      "ISP/ Training Sign-off": null,
      "HRST/ Training Sign-off": null,
      "Behavior Support Plan (BSP)-(Optional)": null,
      "BSP Tracking/Progress Notes (Optional)": null,
      "Health Care Plan/ Protocols/ Training Sign-Off": null,
      "Medication Admin. Record (MAR) Training Sign-Off (Optional)": null,

      // Chapter IV - Documentation & Medical Treatment
      "Visitor Log": OnboardingForms.VisitLogChart,
      "Rights Training/ Monthly Review": null,
      "Doctor's Appointment Log": null,
      "Supervisory Visit Documentation": OnboardingForms.HomeSupervisoryVisit,
      "Annuals (Physical, TB, Dental, Vision)": null,

      // Chapter I (OTHER Programs)
      "Comprehensive Initial Nursing Assessment":
        OnboardingForms.ComprehensiveNursingAssessment,

      // Chapter II (OTHER Programs) - Service Documentation
      "Home Supervisory Visit": OnboardingForms.HomeSupervisoryVisit,
      "INCIDENT REPORTING FORM": OnboardingForms.IncidentReportingForm,
      "Client Complaint Form": OnboardingForms.ClientComplaintForm,

      // Upload-only forms (Doctor's Orders, etc.)
      "Doctor's Orders": OnboardingForms.FileUploadForm,
    };

    const Component = formComponents[selectedForm.name];
    if (Component) {
      // Find the backend form entry to get saved data
      const backendForm = activeEnrollment?.forms?.find(f => f.formId === parseInt(formId));
      const savedFormData = backendForm?.data || null;

      // Calculate Phase 1 progress
      let phase1Count = 0;
      let phase1Completed = 0;
      if (activeEnrollment) {
        const maxPhase1Id = selectedProgram === "NOW-COMP" ? 20 : 8;
        const phase1Forms = activeEnrollment?.forms?.filter(f => f.formId <= maxPhase1Id) || [];
        phase1Count = phase1Forms.length;
        phase1Completed = phase1Forms.filter(f => ["completed", "approved", "rejected"].includes(f.status)).length;
      }

      const isReadOnly = 
        (backendForm?.status !== 'rejected') && (
          ["completed", "approved"].includes(backendForm?.status) || 
          ["submitted", "approved"].includes(activeEnrollment?.status)
        );

      // Calculate next form ID
      let nextFormId = null;
      if (formsData) {
        // Flatten forms logic from formsData to find the current one and the next one
        const allVisibleForms = formsData.flatMap(chapter => chapter.forms);
        const currentIndex = allVisibleForms.findIndex(f => f.id === parseInt(formId));
        if (currentIndex !== -1 && currentIndex < allVisibleForms.length - 1) {
          nextFormId = allVisibleForms[currentIndex + 1].id;
        }
      }

      return (
        <DraftFormWrapper
          key={formId}
          Component={Component}
          enrollmentId={activeEnrollment?._id}
          formId={parseInt(formId)}
          formName={selectedForm.name}
          selectedProgram={selectedProgram}
          savedData={savedFormData}
          draftData={backendForm?.draftData || null}
          progressCurrent={phase1Completed}
          progressTotal={phase1Count}
          readOnly={isReadOnly}
          nextFormId={nextFormId}
          onComplete={async (submittedFormData) => {
            await statusMutation.mutateAsync({ 
              formId: parseInt(formId), 
              status: 'completed',
              formData: submittedFormData || null
            });
            toast.success("Form submitted successfully!");
          }}
        />
      );
    } else {
      // Determine form type for helpful messaging
      const isUploadForm = selectedForm.type === "Upload";
      const isOptionalForm = selectedForm.name.includes("(Optional)");

      return (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
          <FileText size={48} className="text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {isUploadForm ? "Document Upload" : "Form Management"}
          </h3>
          <p className="text-slate-600 mb-2">
            {isUploadForm
              ? `Please upload the required documentation for "${selectedForm.name}"`
              : `This form is ${isOptionalForm ? "optional and " : ""}being configured.`}
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Form ID: {selectedForm.id} | Type: {selectedForm.type}
          </p>
          <p className="text-slate-500 text-xs mt-4 font-medium">
            Description: {selectedForm.desc}
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      {!selectedForm ? (
        <WorkflowsDashboard />
      ) : (
        // Form container
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 p-6 rounded-t-3xl">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-slate-600" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {selectedForm.name}
                  </h1>
                  <p className="text-slate-600">{selectedForm.chapter}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                  {selectedForm.type}
                </span>
                <span className="text-slate-500 text-sm">
                  {selectedForm.desc}
                </span>
              </div>

              {/* Backend Feedback Badge */}
              {(() => {
                const backendForm = activeEnrollment?.forms?.find(f => f.formId === parseInt(formId));
                if (backendForm?.status === "completed") {
                  return (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl border font-bold text-xs uppercase tracking-widest bg-indigo-50 text-indigo-700 border-indigo-100">
                      <CheckCircle size={14} />
                      Completed
                    </div>
                  );
                }
                if (backendForm?.status === "approved") {
                  return (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl border font-bold text-xs uppercase tracking-widest bg-emerald-50 text-emerald-700 border-emerald-100">
                      <CheckCircle size={14} />
                      Approved
                    </div>
                  );
                }
                if (backendForm?.status === "rejected") {
                  return (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl border font-bold text-xs uppercase tracking-widest bg-rose-50 text-rose-700 border-rose-100">
                      <XCircle size={14} />
                      Rejected
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Form-Specific Feedback Banner */}
            {(() => {
              const backendForm = activeEnrollment?.forms?.find(f => f.formId === parseInt(formId));
              if (backendForm?.status === 'rejected' && backendForm?.adminNote) {
                return (
                  <div className="mx-8 mt-4 p-4 rounded-2xl border flex gap-4 items-start bg-rose-50 border-rose-100">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-rose-900 text-sm">Review Feedback</h4>
                      <p className="text-xs leading-relaxed text-rose-700 font-medium">
                        {backendForm?.adminNote}
                      </p>
                    </div>
                  </div>
                );
              }
              if (backendForm?.status === 'approved' && backendForm?.adminNote) {
                return (
                  <div className="mx-8 mt-4 p-4 rounded-2xl border flex gap-4 items-start bg-emerald-50 border-emerald-100">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-emerald-900 text-sm">Review Comments</h4>
                      <p className="text-xs leading-relaxed text-emerald-700 font-medium">
                        {backendForm?.adminNote}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Admin Feedback Banner */}
            {(activeEnrollment?.status === 'rejected' || activeEnrollment?.status === 'approved') && activeEnrollment?.adminNote && (
              <div className={`mx-8 mt-8 p-6 rounded-3xl border flex gap-4 items-start ${activeEnrollment.status === 'approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <div className={`p-3 rounded-2xl ${activeEnrollment.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${activeEnrollment.status === 'approved' ? 'text-emerald-900' : 'text-rose-900'}`}>Admissions Feedback</h4>
                  <p className={`text-sm leading-relaxed font-medium ${activeEnrollment?.status === 'approved' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {activeEnrollment?.adminNote}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Content - This is where your separate form components will be rendered */}
          <div className="p-8">{renderFormComponent()}</div>
        </div>
      )}
    </div>
  );
};

export default MyApplication;
