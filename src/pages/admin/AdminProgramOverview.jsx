import React, { useMemo } from "react";
import {
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    Briefcase,
    ShieldCheck,
    Search,
    Filter,
    ChevronRight,
    MessageSquare,
    FolderOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedGradient } from "../../components/ui/AnimatedGradient";
import { ShineBorder } from "../../components/ui/ShineBorder";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllEnrollments } from "../../api/enrollment.api";

const AdminProgramOverview = () => {
    const navigate = useNavigate();

    const { data: enrollmentData, isLoading } = useQuery({
        queryKey: ["adminEnrollments"],
        queryFn: () => getAllEnrollments({}),
    });

    const allApplications = useMemo(() => {
        if (!enrollmentData?.enrollments) return [];
        return enrollmentData.enrollments;
    }, [enrollmentData]);

    // Calculate submission numbers for each user
    const submissionCounts = useMemo(() => {
        if (!allApplications.length) return {};

        // Group by user and then by program
        const userProgramEnrollments = {};
        allApplications.forEach(app => {
            if (!app.user?._id) return;
            const userId = app.user._id;
            const program = app.program;

            if (!userProgramEnrollments[userId]) {
                userProgramEnrollments[userId] = {};
            }
            if (!userProgramEnrollments[userId][program]) {
                userProgramEnrollments[userId][program] = [];
            }
            userProgramEnrollments[userId][program].push(app);
        });

        // Sort by Date ASC and assign numbers
        const lookup = {};
        Object.values(userProgramEnrollments).forEach(programs => {
            Object.keys(programs).forEach(program => {
                programs[program].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                programs[program].forEach((app, index) => {
                    lookup[app._id] = index + 1;
                });
            });
        });

        return lookup;
    }, [allApplications]);

    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // Calculate stats based on all applications
    const stats = useMemo(() => {
        return {
            total: allApplications.length,
            approved: allApplications.filter(a => a.status === "approved").length,
            rejected: allApplications.filter(a => a.status === "rejected").length,
            nowComp: allApplications.filter(a => a.program === "NOW-COMP").length,
            other: allApplications.filter(a => a.program === "OTHER").length
        };
    }, [allApplications]);

    const nowCompApplications = allApplications.filter(app => app.program === "NOW-COMP" && app.status === "approved");
    const otherApplications = allApplications.filter(app => app.program === "OTHER" && app.status === "approved");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-poppins text-slate-900 pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-8">

                {/* BENTO DASHBOARD SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-2 gap-[1px] bg-slate-200 rounded-[32px] overflow-hidden border border-slate-200 shadow-sm mb-16 h-auto md:min-h-[450px]">
                    <div className="md:col-span-2 bg-white">
                        <BentoCard
                            title="System Capacity"
                            value={stats.total}
                            subtitle="Aggregate performance across all care portals"
                            colors={["#1e40af", "#3b82f6", "#93c5fd"]}
                            delay={0.1}
                        />
                    </div>
                    <div className="bg-white">
                        <BentoCard
                            title="Vetting Rate"
                            value={`${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`}
                            subtitle="Success ratio for packet completion"
                            colors={["#059669", "#10b981", "#6ee7b7"]}
                            delay={0.2}
                        />
                    </div>
                    <div className="bg-white">
                        <BentoCard
                            title="NOW & COMP"
                            value={stats.nowComp}
                            subtitle="Active waiver requests"
                            colors={["#f59e0b", "#fbbf24", "#fcd34d"]}
                            delay={0.3}
                        />
                    </div>
                    <div className="md:col-span-2 bg-white">
                        <BentoCard
                            title="Other Programs"
                            value={stats.other}
                            subtitle="Medicaid & Specialized Nursing"
                            colors={["#7c3aed", "#8b5cf6", "#c4b5fd"]}
                            delay={0.4}
                        />
                    </div>
                </div>

                {/* PROGRAM SECTIONS */}
                <div className="space-y-12">
                    {/* NOW & COMP SECTION */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-amber-500 rounded-xl shadow-md shadow-amber-200">
                                <ShieldCheck size={18} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-blue-950 tracking-tight">NOW &amp; COMP Waiver Applicants</h2>
                                <p className="text-slate-400 font-medium text-xs mt-0.5">Intellectual and developmental disability waivers</p>
                            </div>
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">
                                {nowCompApplications.length} Applicants
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {nowCompApplications.map((app) => (
                                <ApplicantCard
                                    key={app._id}
                                    app={app}
                                    navigate={navigate}
                                    submissionCount={submissionCounts[app._id]}
                                    getOrdinal={getOrdinal}
                                />
                            ))}
                            {nowCompApplications.length === 0 && <EmptyState />}
                        </div>
                    </section>

                    {/* OTHER PROGRAMS SECTION */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 shadow-sm">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-blue-950 tracking-tight">Other Care Programs</h2>
                                <p className="text-slate-500 font-medium text-sm">Other Programs, skilled nursing, and community support programs.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherApplications.map((app) => (
                                <ApplicantCard
                                    key={app._id}
                                    app={app}
                                    navigate={navigate}
                                    submissionCount={submissionCounts[app._id]}
                                    getOrdinal={getOrdinal}
                                />
                            ))}
                            {otherApplications.length === 0 && <EmptyState />}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};


const ApplicantCard = ({ app, navigate, submissionCount, getOrdinal }) => (
    <ShineBorder
        borderRadius={24}
        borderWidth={1}
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        className="group relative cursor-pointer !bg-white !p-0 !min-h-0 !w-auto !min-w-0 shadow-xl transition-all"
    >
        <div
            onClick={() => navigate(`/admin/application/${app._id}`)}
            className="p-8 w-full h-full relative"
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6 gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm transition-colors">
                            {app.user?.fullName?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-slate-900 leading-tight whitespace-nowrap">{app.user?.fullName || "Unknown User"}</p>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-blue-600 bg-clip-text text-transparent whitespace-normal border-l border-slate-200 pl-2 leading-tight">
                                    {getOrdinal(submissionCount)} {app.program === "NOW-COMP" ? "NOW-COMP Program" : app.program === "HRMS-ONBOARDING" ? "HRMS Onboarding" : "Other Program"} Submission
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={app.status} />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-indigo-600 font-sans transition-colors">
                        {app.program === "NOW-COMP" ? "NOW & COMP Waiver" : app.program === "HRMS-ONBOARDING" ? "HRMS Onboarding" : "Other Programs"}
                    </h3>
                    <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        <Clock size={12} />
                        Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                </div>

                {app.adminNote && (
                    <div className="bg-slate-50 p-4 rounded-2xl border-l-2 border-indigo-400 transition-all font-mono text-[11px]">
                        <div className="flex items-center gap-2 mb-2 text-slate-400">
                            <MessageSquare size={10} />
                            <span className="uppercase tracking-wide">Last Reviewer Note</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed italic line-clamp-2">
                            "{app.adminNote}"
                        </p>
                    </div>
                )}

                <div className="mt-8 flex items-center justify-between text-xs font-bold text-indigo-600 transition-all">
                    <span>Finalizing Packet...</span>
                    <ChevronRight size={16} />
                </div>
            </div>
        </div>
    </ShineBorder>
);

const EmptyState = () => (
    <div className="col-span-full bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-300">
        <FolderOpen size={48} className="text-slate-200 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800">Queue Empty</h3>
        <p className="text-slate-500">No active applications currently in this category.</p>
    </div>
);

const BentoCard = ({ title, value, subtitle, colors, delay }) => {
    return (
        <motion.div
            className="relative overflow-hidden h-full w-full bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay }}
        >
            <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <h3 className="text-base font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] via-[#7e22ce] to-[#1e40af] bg-[length:200%_auto] animate-shine" style={{ "--duration": "4s" }}>
                    {title}
                </h3>
                <p className="text-5xl font-bold text-slate-900 tracking-tight">
                    {value}
                </p>
                <p className="text-sm text-slate-400 font-medium mt-2">
                    {subtitle}
                </p>
            </div>
        </motion.div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pending: "bg-amber-50 text-amber-600 border-amber-200",
        reviewing: "bg-blue-50 text-blue-700 border-blue-200",
        rejected: "bg-rose-50 text-rose-700 border-rose-200",
        submitted: "bg-purple-50 text-purple-700 border-purple-200",
    };

    return (
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${styles[status?.toLowerCase()] || "bg-slate-50 border-slate-200"}`}>
            {status}
        </span>
    );
};

export default AdminProgramOverview;
