import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Info,
  LayoutGrid,
  PenTool,
  Upload,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Hash,
  ClipboardList,
  Briefcase,
  ExternalLink,
  Search,
  Filter,
  FolderOpen,
  GraduationCap,
  PlayCircle,
  FileQuestion,
  Video,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getMyEnrollments } from "../../api/enrollment.api";
import { getAfterHireConfig } from "../../api/afterHire.api";

import { ShineBorder } from "../../components/ui/ShineBorder";
import { AnimatedGradient } from "../../components/ui/AnimatedGradient";
import { motion } from "framer-motion";

const formatYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtu\.be\/embed\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const MyApplicationsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAppId, setSelectedAppId] = useState(null);

  // Auto-scroll to the form row when returning from a form view
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    const appId = params.get("appId");
    if (appId) {
      setSelectedAppId(appId);
    }
    if (scrollTo) {
      // Small delay to let the DOM render the selected application detail view
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-indigo-400", "ring-offset-2");
          setTimeout(
            () =>
              el.classList.remove("ring-2", "ring-indigo-400", "ring-offset-2"),
            2500,
          );
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Fetch enrollment history
  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: getMyEnrollments,
  });

  // Calculate submission counts
  const submissionCounts = useMemo(() => {
    if (!enrollmentsData?.enrollments) return {};

    // Group by program
    const programEnrollments = {};
    enrollmentsData.enrollments.forEach((app) => {
      const program = app.program;
      if (!programEnrollments[program]) {
        programEnrollments[program] = [];
      }
      programEnrollments[program].push(app);
    });

    // Sort by Date ASC and assign numbers
    const lookup = {};
    Object.keys(programEnrollments).forEach((program) => {
      programEnrollments[program].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      programEnrollments[program].forEach((app, index) => {
        lookup[app._id] = index + 1;
      });
    });

    return lookup;
  }, [enrollmentsData]);

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const applications = useMemo(() => {
    if (!enrollmentsData?.enrollments) return [];

    return enrollmentsData.enrollments.map((app) => {
      // Determine styles based on status
      let styles = {
        bg: "bg-slate-600",
        bgSoft: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        hoverBorder: "hover:border-slate-400",
        cardGradient: "bg-gradient-to-br from-white via-white to-slate-50",
      };

      if (app.status === "approved") {
        styles = {
          bg: "bg-emerald-600",
          bgSoft: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          hoverBorder: "hover:border-emerald-400",
          cardGradient: "bg-gradient-to-br from-white via-white to-emerald-50",
        };
      } else if (app.status === "rejected") {
        styles = {
          bg: "bg-rose-600",
          bgSoft: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          hoverBorder: "hover:border-rose-400",
          cardGradient: "bg-gradient-to-br from-white via-white to-rose-50",
        };
      } else if (app.status === "submitted") {
        styles = {
          bg: "bg-amber-600",
          bgSoft: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          hoverBorder: "hover:border-amber-400",
          cardGradient: "bg-gradient-to-br from-white via-white to-amber-50",
        };
      } else if (app.status === "pending") {
        styles = {
          bg: "bg-indigo-600",
          bgSoft: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
          hoverBorder: "hover:border-indigo-400",
          cardGradient: "bg-gradient-to-br from-white via-white to-indigo-50",
        };
      }

      const count = submissionCounts[app._id] || 1;
      const ordinal = getOrdinal(count);
      const label = `${ordinal} ${app.program === "NOW-COMP" ? "NOW-COMP Program" : app.program === "HRMS-ONBOARDING" ? "HRMS Onboarding" : "Other Program"} Submission`;

      return {
        id: app._id,
        programType: app.program,
        title:
          app.program === "NOW-COMP"
            ? "NOW & COMP Waiver Admission"
            : app.program === "HRMS-ONBOARDING"
              ? "HRMS Employee Onboarding"
              : "Other Programs",
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        submittedDate: app.submittedAt
          ? new Date(app.submittedAt).toLocaleDateString()
          : "Not Submitted",
        approvedDate: app.reviewedAt
          ? new Date(app.reviewedAt).toLocaleDateString()
          : "-",
        adminNotes: app.adminNote || "No specific feedback provided.",
        forms: app.forms, // Pass forms for detail view
        icon: app.program === "NOW-COMP" ? ClipboardList : Briefcase,
        submissionLabel: label,
        styles,
      };
    });
  }, [enrollmentsData, submissionCounts]);

  const selectedApplication = useMemo(
    () => applications.find((app) => app.id === selectedAppId),
    [selectedAppId, applications],
  );

  // Fetch After Hire Config if viewing an approved HRMS-ONBOARDING application
  const { data: afterHireData } = useQuery({
    queryKey: ["afterHireConfig"],
    queryFn: getAfterHireConfig,
    enabled: selectedApplication?.programType === "HRMS-ONBOARDING" && selectedApplication?.status === "Approved",
  });

  // Calculate specific counts
  const stats = useMemo(() => {
    return {
      total: applications.length,
      approved: applications.filter((a) => a.status === "Approved").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
      pending: applications.filter((a) =>
        ["Pending", "Submitted"].includes(a.status),
      ).length,
      nowComp: applications.filter((a) => a.programType === "NOW-COMP").length,
      hrms: applications.filter((a) => a.programType === "HRMS-ONBOARDING").length,
      other: applications.filter((a) => a.programType === "OTHER").length,
    };
  }, [applications]);

  // Forms Data based on the Selected Application's Program Type
  const formsData = useMemo(() => {
    if (!selectedApplication || !selectedApplication.forms) return [];

    // Group forms by chapter
    const chaptersMap = {};
    selectedApplication.forms.forEach((f) => {
      if (!chaptersMap[f.chapter]) {
        chaptersMap[f.chapter] = { chapter: f.chapter, forms: [] };
      }
      chaptersMap[f.chapter].forms.push({
        id: f.formId,
        name: f.name,
        type: f.type,
        desc: f.type + " document",
        status: f.status.charAt(0).toUpperCase() + f.status.slice(1),
        adminNote: f.adminNote,
      });
    });

    return Object.values(chaptersMap);
  }, [selectedApplication]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-poppins text-slate-900 pb-20 pt-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* DASHBOARD STATS SECTION */}
        {!selectedAppId && (
          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-2 gap-[1px] bg-slate-200 rounded-[32px] overflow-hidden border border-slate-200 shadow-sm mb-10 h-auto md:min-h-[500px]">
            {/* Total Applications - Span 2 */}
            <div className="md:col-span-2 bg-white">
              <BentoCard
                title="Total Submitted"
                value={stats.total}
                subtitle="All active applications"
                colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
                delay={0.1}
              />
            </div>

            {/* Approved - Span 1 */}
            <div className="bg-white">
              <BentoCard
                title="Approved"
                value={stats.approved}
                subtitle="Successfully verified"
                colors={["#10b981", "#34d399", "#a7f3d0"]}
                delay={0.2}
              />
            </div>

            {/* Rejected - Span 1 */}
            <div className="bg-white">
              <BentoCard
                title="Rejected"
                value={stats.rejected}
                subtitle="Action required"
                colors={["#F43F5E", "#FB7185", "#FECDD3"]}
                delay={0.3}
              />
            </div>

            {/* NOW-COMP - Span 1 */}
            <div className="bg-white">
              <BentoCard
                title="NOW & COMP"
                value={stats.nowComp}
                subtitle="Waiver admissions"
                colors={["#F59E0B", "#FBBF24", "#FDE68A"]}
                delay={0.4}
              />
            </div>

            {/* HRMS Onboarding - Span 1 */}
            <div className="bg-white">
              <BentoCard
                title="HRMS Onboarding"
                value={stats.hrms}
                subtitle="Staff & Personnel onboarding"
                colors={["#4F46E5", "#6366F1", "#A5B4FC"]}
                delay={0.45}
              />
            </div>

            {/* Other - Span 1 */}
            <div className="bg-white">
              <BentoCard
                title="Other Programs"
                value={stats.other}
                subtitle="Nursing & Community Support"
                colors={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
                delay={0.5}
              />
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1
              className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] via-[#7e22ce] to-[#1e40af] bg-[length:200%_auto] animate-shine"
              style={{ "--duration": "4s" }}
            >
              Application History
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Manage and review your submitted program documentation.
            </p>
          </div>
          {!selectedAppId && (
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="relative w-full md:w-auto group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-full md:w-64"
                />
              </div>
              <div className="flex w-full md:w-auto gap-2">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Filter size={16} /> Filter
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all">
                  New Application
                </button>
              </div>
            </div>
          )}
        </div>

        {!selectedAppId ? (
          /* REFINED CARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <ShineBorder
                key={app.id}
                borderRadius={24}
                borderWidth={1}
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                className="group relative cursor-pointer !bg-white !p-0 !min-h-0 !w-auto !min-w-0 shadow-lg hover:shadow-xl transition-all"
              >
                <div
                  onClick={() => setSelectedAppId(app.id)}
                  className="p-8 w-full h-full relative"
                >
                  {/* GRID LINES REMOVED */}

                  <div className="relative z-10">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-2 bg-indigo-50 rounded-xl">
                        <img
                          src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png"
                          alt="Pacific Health Systems"
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-blue-600 bg-clip-text text-transparent mb-2 block w-fit">
                        {app.submissionLabel}
                      </span>
                      <h3
                        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#172554] bg-[length:200%_auto] animate-shine group-hover:from-indigo-600 group-hover:via-indigo-400 group-hover:to-indigo-600 transition-colors font-sans"
                        style={{ "--duration": "4s" }}
                      >
                        {app.title}
                      </h3>

                      <div className="mt-4 flex items-center gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <Calendar size={12} className="text-slate-400" />
                          {app.submittedDate}
                        </div>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-slate-50 p-4 border-l-2 border-slate-200 group-hover:border-indigo-400 transition-all font-mono text-xs">
                      <div className="flex items-center gap-2 mb-2 text-slate-400">
                        <MessageSquare size={10} />
                        <span className="uppercase tracking-wide">
                          Feedback
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        "{app.adminNotes}"
                      </p>
                    </div>
                  </div>
                </div>
              </ShineBorder>
            ))}
          </div>
        ) : (
          /* ENHANCED DETAILED VIEW */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <button
              onClick={() => setSelectedAppId(null)}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Return to dashboard
            </button>

            {/* Application Overview Banner */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-60"></div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-5">
                  <div
                    className={`p-4 rounded-2xl ${selectedApplication?.styles.bgSoft} ${selectedApplication?.styles.text}`}
                  >
                    {selectedApplication && (
                      <selectedApplication.icon size={32} />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2
                        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#172554] bg-[length:200%_auto] animate-shine tracking-tight"
                        style={{ "--duration": "4s" }}
                      >
                        {selectedApplication?.title}
                      </h2>
                      <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-blue-600 bg-clip-text text-transparent border border-blue-200 px-3 py-1 rounded-full bg-blue-50">
                        {selectedApplication?.submissionLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Calendar size={16} className="text-slate-400" />
                        Submitted:{" "}
                        <span className="text-slate-700">
                          {selectedApplication?.submittedDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        Verified:{" "}
                        <span className="text-slate-700">
                          {selectedApplication?.approvedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="pr-4 border-r border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <StatusBadge status={selectedApplication?.status} />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100">
                    <ExternalLink size={14} /> Export PDF
                  </button>
                </div>
              </div>
            </div>

            {selectedApplication?.programType === "HRMS-ONBOARDING" &&
              selectedApplication?.status === "Approved" && (
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-[32px] p-6 md:p-10 border border-indigo-900 shadow-xl mb-10 relative overflow-hidden">
                  {/* Decorative background gradients */}
                  <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl -mr-60 -mt-60 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-indigo-600/10 rounded-full blur-2xl -ml-40 -mb-40 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/20 shadow-md">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">PART 3 - AFTER HIRE</span>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5 bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">Employee Onboarding & Training</h2>
                      </div>
                    </div>
                    
                    <p className="text-indigo-200 text-sm md:text-base font-medium max-w-4xl mb-8 leading-relaxed">
                      Congratulations on completing your onboarding documentation! Below are your post-hire training resources. Please watch the presentation video and review the frequently asked questions to help you get started successfully at Pacific Health Systems.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Video Player */}
                      <div className="space-y-4 w-full">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <PlayCircle className="text-indigo-400" />
                          <span>Presentation & Orientation Video</span>
                        </h3>
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-indigo-900/50 shadow-inner bg-black">
                          {afterHireData?.config?.videoUrl ? (
                            <iframe
                              className="w-full h-full"
                              src={formatYoutubeEmbedUrl(afterHireData.config.videoUrl)}
                              title="Onboarding Presentation Video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-medium">
                              <Video size={40} className="mb-2 text-slate-400 animate-pulse" />
                              <span>Loading presentation video...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* FAQs / Questions & Answers */}
                      <div className="space-y-4 w-full">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <FileQuestion className="text-indigo-400" />
                          <span>Essential Questions & Answers</span>
                        </h3>
                        
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                          {afterHireData?.config?.questions && afterHireData.config.questions.length > 0 ? (
                            afterHireData.config.questions.map((q, idx) => (
                              <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
                                <h4 className="text-sm font-bold text-white mb-2 flex items-start gap-2">
                                  <span className="text-indigo-400 font-black">Q.</span>
                                  <span>{q.question}</span>
                                </h4>
                                <p className="text-xs text-indigo-200/90 leading-relaxed font-medium pl-6">
                                  {q.answer}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-500 italic p-4 text-center bg-white/5 border border-white/10 rounded-2xl">
                              No questions configured.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Forms Section */}
            <div className="grid grid-cols-1 gap-12">
              {formsData.map((chapter, idx) => (
                <section key={idx} className="relative">
                  <div className="sticky top-[80px] z-20 bg-[#F1F5F9]/80 backdrop-blur-md py-4 mb-6 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-white text-xs font-bold">
                        0{idx + 1}
                      </span>
                      <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
                        {chapter.chapter}
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {chapter.forms.length} Documents
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {chapter.forms.map((form) => (
                      <div
                        key={form.id}
                        id={`form-row-${form.id}`}
                        className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="flex-1 flex items-start gap-4">
                          <div className="mt-1 p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                            <FileText
                              size={18}
                              className="text-slate-400 group-hover:text-indigo-500"
                            />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[15px] font-bold text-slate-800">
                                {form.name}
                              </span>
                              <TypeBadge type={form.type} />
                            </div>
                            <p className="text-xs font-medium text-slate-500">
                              {form.desc}
                            </p>
                          </div>
                        </div>

                        {/* Status & Notes Column */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
                          {form.adminNote && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
                              <Info size={14} className="text-amber-500" />
                              <span className="text-[11px] text-amber-700 font-bold italic">
                                {form.adminNote}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-6">
                            <div className="hidden sm:block">
                              <StatusBadge status={form.status} />
                            </div>
                            <button
                              onClick={() =>
                                navigate(
                                  `/my-application-view?enrollmentId=${selectedAppId}&formId=${form.id}&from=my-applications&scrollTo=form-row-${form.id}&appId=${selectedAppId}`,
                                )
                              }
                              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-indigo-600 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              Open <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TypeBadge = ({ type }) => {
  const styles = {
    "Data Entry": "bg-emerald-50 text-emerald-600 border-emerald-100",
    Fillable: "bg-blue-50 text-blue-600 border-blue-100",
    Signable: "bg-purple-50 text-purple-600 border-purple-100",
    Upload: "bg-rose-50 text-rose-600 border-rose-100",
    Track: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const icons = {
    "Data Entry": <LayoutGrid size={10} />,
    Fillable: <FileText size={10} />,
    Signable: <PenTool size={10} />,
    Upload: <Upload size={10} />,
    Track: <Clock size={10} />,
  };

  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
        styles[type] || styles["Track"]
      }`}
    >
      {icons[type]} {type}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Submitted: "bg-amber-50 text-amber-700 border-amber-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
    "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Pending: "bg-slate-50 text-slate-500 border-slate-200",
    Reviewing: "bg-amber-50 text-amber-700 border-amber-200",
    Locked: "bg-rose-50 text-rose-300 line-through decoration-rose-300",
  };

  return (
    <span
      className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${
        styles[status] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
};

const BentoCard = ({ title, value, subtitle, colors, delay }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative overflow-hidden h-full w-full bg-white group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 p-5 md:p-8 flex flex-col h-full justify-between"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h3
          className="text-sm md:text-base font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] via-[#7e22ce] to-[#1e40af] bg-[length:200%_auto] animate-shine"
          style={{ "--duration": "4s" }}
          variants={item}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
          variants={item}
        >
          {value}
        </motion.p>

        {subtitle && (
          <motion.p
            className="text-xs sm:text-sm text-slate-400 font-normal mt-2"
            variants={item}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MyApplicationsList;
