import React, { useState, useMemo } from "react";
import {
    Search,
    CheckCircle,
    Video,
    FileQuestion,
    ClipboardList,
    Upload,
    Plus,
    Trash2,
    ChevronRight,
    ArrowLeft,
    GraduationCap,
    PlayCircle,
    FileText,
    User,
    ShieldCheck,
    Calendar,
    Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShineBorder } from "../../components/ui/ShineBorder";

const AdminAfterHire = () => {
    const navigate = useNavigate();
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    // Mock Programs Data
    const programs = [
        {
            id: "NOW-COMP",
            title: "NOW & COMP WAIVERS",
            description: "Intellectual and Developmental Disability Waivers",
            color: "blue",
            activeCount: 124
        },
        {
            id: "OTHER",
            title: "Other Programs",
            description: "Medicaid & Specialized Nursing Services",
            color: "indigo",
            activeCount: 86
        }
    ];

    // Handle Back Navigation
    const handleBack = () => {
        if (selectedApplicant) {
            setSelectedApplicant(null);
        } else if (selectedProgram) {
            setSelectedProgram(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-poppins pb-20">
            <div className="max-w-7xl mx-auto px-8 py-10">

                {/* Header */}
                <div className="mb-10 flex items-center gap-4">
                    {(selectedProgram || selectedApplicant) && (
                        <button
                            onClick={handleBack}
                            className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-black text-blue-950 tracking-tight">
                            {selectedApplicant
                                ? `Onboarding: ${selectedApplicant.name}`
                                : selectedProgram
                                    ? `${selectedProgram.title} - Approved Applicants`
                                    : "After Hire Management"}
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            {selectedApplicant
                                ? "Configure access, forms, and training resources for this new hire."
                                : selectedProgram
                                    ? "Select an approved applicant to begin the onboarding setup."
                                    : "Select a program to manage new hires and onboarding resources."}
                        </p>
                    </div>
                </div>

                {/* Content Flow */}
                <AnimatePresence mode="wait">
                    {!selectedProgram ? (
                        <ProgramSelector key="selector" programs={programs} onSelect={setSelectedProgram} />
                    ) : !selectedApplicant ? (
                        <ApplicantTable key="table" program={selectedProgram} onSelect={setSelectedApplicant} />
                    ) : (
                        <OnboardingManager key="manager" applicant={selectedApplicant} program={selectedProgram} />
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

// --- View 1: Program Selector ---
const ProgramSelector = ({ programs, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {programs.map((program) => (
                <ShineBorder
                    key={program.id}
                    borderRadius={24}
                    borderWidth={1}
                    color={program.color === 'blue' ? ["#3b82f6", "#60a5fa", "#93c5fd"] : ["#6366f1", "#818cf8", "#a5b4fc"]}
                    className="group cursor-pointer !bg-white hover:!bg-white/80 !w-auto !min-h-0 !p-0 shadow-sm hover:shadow-xl transition-all relative"
                >
                    <div
                        onClick={() => onSelect(program)}
                        className="p-8 w-full h-full relative z-10"
                    >
                        <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${program.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            <GraduationCap size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                            {program.title}
                        </h3>
                        <p className="text-slate-500 mb-6 font-medium">
                            {program.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                {program.activeCount} Active Employees
                            </span>
                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                </ShineBorder>
            ))}
        </motion.div>
    );
};

// --- View 2: Approved Applicants Table ---
const ApplicantTable = ({ program, onSelect }) => {
    // Mock Data for specific program
    const applicants = program.id === "NOW-COMP" ? [
        { id: "APP-2024-001", name: "John Doe", email: "john@example.com", approvedDate: "Jan 20, 2024", status: "Approved" },
        { id: "APP-2024-005", name: "Michael Brown", email: "michael@example.com", approvedDate: "Jan 12, 2024", status: "Approved" },
        { id: "APP-2024-012", name: "Sarah Jenkins", email: "sarah.j@example.com", approvedDate: "Jan 28, 2024", status: "Approved" },
    ] : [
        { id: "APP-2024-088", name: "Emily White", email: "emily@example.com", approvedDate: "Feb 01, 2024", status: "Approved" },
    ];

    if (applicants.length === 0) {
        return (
            <div className="bg-white/50 backdrop-blur-xl rounded-[32px] p-16 text-center border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <User size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Approved Applicants</h3>
                <p className="text-slate-500 mt-2">There are no applicants currently waiting for onboarding in this program.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 border border-white/20 shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

            <div className="relative z-10 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100/80">
                            <th className="p-5 pl-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Applicant</th>
                            <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                            <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Approved Date</th>
                            <th className="p-5 pr-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                        {applicants.map((app) => (
                            <tr key={app.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                <td className="p-5 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-100 transition-transform group-hover:scale-105 ${program.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'}`}>
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">{app.name}</p>
                                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-100/50 px-2 py-0.5 rounded-md inline-block mt-1">{app.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white/50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                                        <Mail size={14} className="text-slate-400" /> {app.email}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 backdrop-blur-sm">
                                        <CheckCircle size={14} /> {app.approvedDate}
                                    </span>
                                </td>
                                <td className="p-5 pr-6 text-right">
                                    <button
                                        onClick={() => onSelect(app)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200/50 transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Manage Onboarding <ChevronRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

// --- View 3: Onboarding Manager ---
const OnboardingManager = ({ applicant, program }) => {
    const [activeTab, setActiveTab] = useState("forms");

    // Reuse Forms Data Structure (Simplified for this view)
    const formsData = useMemo(() => {
        if (program.id === "NOW-COMP") {
            return [
                {
                    chapter: "Training & Clinical Protocols",
                    forms: [
                        "ISP/ Training Sign-off",
                        "HRST/ Training Sign-off",
                        "Behavior Support Plan (BSP)-(Optional)",
                        "BSP Tracking/Progress Notes (Optional)",
                        "Health Care Plan/ Protocols/ Training Sign-Off",
                        "Medication Admin. Record (MAR)Training Sign-Off"
                    ]
                },
                {
                    chapter: "Chapter IV- Documentation & Medical Treatment",
                    forms: [
                        "Visitor Log",
                        "Rights Training/ Monthly Review",
                        "Doctor's Appointment Log",
                        "Supervisory Visit Documentation",
                        "Annuals (Physical, TB, Dental, Vision)"
                    ]
                }
            ];
        } else {
            return [
                { chapter: "Chapter I- General Admission", forms: ["Client Info", "Consent Forms"] },
                { chapter: "Chapter II- Service Management", forms: ["Progress Notes", "Discharge Summary"] }
            ];
        }
    }, [program.id]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
            {/* Sidebar Navigation */}
            <div className="col-span-1 space-y-2">
                <NavButton
                    active={activeTab === "forms"}
                    onClick={() => setActiveTab("forms")}
                    icon={ClipboardList}
                    label="Assigned Forms"
                    count={formsData.reduce((acc, ch) => acc + ch.forms.length, 0)}
                />
                <NavButton
                    active={activeTab === "videos"}
                    onClick={() => setActiveTab("videos")}
                    icon={Video}
                    label="Training Videos"
                    count={3}
                />
                <NavButton
                    active={activeTab === "access"}
                    onClick={() => setActiveTab("access")}
                    icon={ShieldCheck}
                    label="Finalize"
                    count={0}
                />
            </div>

            {/* Content Area */}
            <div className="col-span-1 lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px] relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    {/* User Profile Header */}
                    <div className="p-8 border-b border-slate-100/80 flex items-center gap-6 relative z-10 bg-white/40">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-lg shadow-slate-100 flex items-center justify-center text-slate-700 border border-slate-100">
                            <User size={36} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{applicant.name}</h2>
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">
                                    <Mail size={12} className="text-blue-500" /> {applicant.email}
                                </span>
                                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">
                                    <Calendar size={12} className="text-indigo-500" /> Approved: {applicant.approvedDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 relative z-10">
                        {activeTab === "forms" && <FormsConfig formsData={formsData} />}
                        {activeTab === "videos" && <VideoConfig programId={program.id} />}
                        {activeTab === "access" && <CandidateActions />}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Sub-components for Onboarding Manager
const FormsConfig = ({ formsData }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Onboarding Forms Checklist</h3>
            <button className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">Select All</button>
        </div>

        <div className="space-y-6">
            {formsData.map((chapter, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={14} className="text-blue-500" /> {chapter.chapter}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chapter.forms.map((form, fIdx) => (
                            <label key={fIdx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                                <span className="text-sm font-bold text-slate-700">{form}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const VideoConfig = ({ programId }) => {
    const videos = [
        { title: "Safety Protocol 2024", duration: "12:00" },
        { title: "Company Culture", duration: "05:30" },
        { title: "Timesheet Tutorial", duration: "08:15" },
    ];
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-slate-800">Assigned Training Modules</h3>
            <div className="grid grid-cols-1 gap-4">
                {videos.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <PlayCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{v.title}</h4>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{programId} • {v.duration}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CandidateActions = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-lg font-bold text-slate-800">Finalize Onboarding</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Communication-Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Mail size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Welcome Packet</h4>
                <p className="text-xs text-slate-500 mb-6 font-medium">Send login credentials and introductory materials.</p>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-blue-100">
                    Send Welcome Email
                </button>
            </div>

            {/* Schedule-Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <Calendar size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Orientation</h4>
                <p className="text-xs text-slate-500 mb-6 font-medium">Schedule the initial onboarding meeting.</p>
                <button className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors">
                    Schedule Meeting
                </button>
            </div>

            {/* Account-Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all md:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Portal Access</h4>
                            <p className="text-xs text-slate-500 font-medium">Manage user's ability to login and view forms.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Active</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const NavButton = ({ active, onClick, icon: Icon, label, count }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${active
            ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} className={active ? "text-blue-400" : "text-slate-400"} />
            <span className="font-bold text-sm tracking-wide">{label}</span>
        </div>
        {count > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {count}
            </span>
        )}
    </button>
);

export default AdminAfterHire;
