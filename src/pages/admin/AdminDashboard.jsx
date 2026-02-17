import React, { useState, useMemo } from "react";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter,
  BarChart3,
  ArrowUpRight,
  ClipboardCheck,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShineBorder } from "../../components/ui/ShineBorder";

  import { useQuery } from "@tanstack/react-query";
  import { getAllEnrollments } from "../../api/enrollment.api";

  const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: enrollmentData, isLoading } = useQuery({
    queryKey: ["adminEnrollments"],
    queryFn: () => getAllEnrollments({}),
  });

  const applicants = (enrollmentData?.enrollments || []).filter(app => 
    ["submitted", "approved", "rejected"].includes(app.status)
  );

  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => ["submitted", "pending"].includes(a.status)).length,
    approved: applicants.filter(a => a.status === "approved").length,
    rejected: applicants.filter(a => a.status === "rejected").length
  };

  const getPercentage = (count) => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  // Calculate submission numbers for each user
  const submissionCounts = useMemo(() => {
    if (!enrollmentData?.enrollments) return {};
    
    // Group by user and then by program
    const userProgramEnrollments = {};
    enrollmentData.enrollments.forEach(app => {
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
  }, [enrollmentData]);

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };


  const queueApplicants = applicants.filter(app => !["approved", "rejected"].includes(app.status));

  const filteredApplicants = queueApplicants.filter(a => 
    a.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">Administrative Console</h1>
            <p className="text-slate-500 font-medium mt-1 text-sm lg:text-base">Track and manage client admission packets across all clinical programs.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-poppins">
          <StatCard title="Total Applications" value={stats.total} icon={FileText} color="blue" />
          <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="amber" percentage={getPercentage(stats.pending)} />
          <StatCard title="Total Approved" value={stats.approved} icon={CheckCircle} color="emerald" percentage={getPercentage(stats.approved)} />
          <StatCard title="Total Rejected" value={stats.rejected} icon={XCircle} color="rose" percentage={getPercentage(stats.rejected)} />
        </div>

        {/* Applicants Table/Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-poppins text-poppins">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheck size={20} className="text-blue-600" />
              Submission Queue
            </h3>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{filteredApplicants.length} Applicants</span>
          </div>
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 pl-8 text-[11px] font-black text-blue-900 uppercase tracking-widest">Applicant</th>
                  <th className="p-4 text-[11px] font-black text-blue-900 uppercase tracking-widest text-poppins">Clinical Program</th>
                  <th className="p-4 text-[11px] font-black text-blue-900 uppercase tracking-widest text-poppins">Progress</th>
                  <th className="p-4 text-[11px] font-black text-blue-900 uppercase tracking-widest text-poppins">Status</th>
                  <th className="p-4 text-[11px] font-black text-blue-900 uppercase tracking-widest text-poppins">Last Activity</th>
                  <th className="p-4 pr-8 text-[11px] font-black text-blue-900 uppercase tracking-widest text-poppins">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-poppins text-poppins">
                {filteredApplicants.map((app) => {
                  // Calculate progress for each applicant
                  const maxPhase1Id = app.program === "NOW-COMP" ? 20 : 8;
                  // If approved, show 100%, otherwise calculate based on phase 1
                  let progress = 0;
                  if (app.status === 'approved') {
                    progress = 100;
                  } else {
                     const phase1Forms = app.forms ? app.forms.filter(f => f.formId <= maxPhase1Id) : [];
                     const completed = phase1Forms.filter(f => f.status === 'completed').length;
                     progress = phase1Forms.length > 0 ? Math.round((completed / phase1Forms.length) * 100) : 0;
                  }

                  return (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {app.user?.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 leading-tight">{app.user?.fullName || "Unknown User"}</p>
                            {submissionCounts[app._id] > 1 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-900 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                {getOrdinal(submissionCounts[app._id])} Submission
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-blue-600 bg-clip-text text-transparent">
                            {getOrdinal(submissionCounts[app._id])} {app.program === "NOW-COMP" ? "NOW-COMP Program" : "Other Program"} Submission
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold text-slate-600">{app.program}</span>
                    </td>
                    <td className="p-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">{progress}% Verified</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full show-shine" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={app.status || "Unknown"} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 pr-8">
                        <button 
                          onClick={() => navigate(`/admin/application/${app._id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm group-hover:shadow-md"
                        >
                          Review Entry <ChevronRight size={14} />
                        </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 p-4">
              {filteredApplicants.map((app) => {
                 const maxPhase1Id = app.program === "NOW-COMP" ? 20 : 8;
                 let progress = 0;
                 if (app.status === 'approved') {
                   progress = 100;
                 } else {
                    const phase1Forms = app.forms ? app.forms.filter(f => f.formId <= maxPhase1Id) : [];
                    const completed = phase1Forms.filter(f => f.status === 'completed').length;
                    progress = phase1Forms.length > 0 ? Math.round((completed / phase1Forms.length) * 100) : 0;
                 }

                 return (
                  <div key={app._id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {app.user?.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{app.user?.fullName || "Unknown User"}</p>
                            <p className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-blue-600 bg-clip-text text-transparent">
                              {app.program}
                            </p>
                          </div>
                      </div>
                      <StatusBadge status={app.status || "Unknown"} />
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">{progress}% Verified</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full show-shine" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                       <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </div>
                        <button 
                          onClick={() => navigate(`/admin/application/${app._id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50"
                        >
                          Review <ChevronRight size={12} />
                        </button>
                    </div>
                  </div>
                 )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, percentage }) => {
  const colors = {
    blue: "text-blue-950",
    emerald: "text-blue-950",
    amber: "text-blue-950",
    rose: "text-blue-950"
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group flex items-center gap-4 transition-all hover:shadow-md">
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform rotate-12">
            <Icon size={80} />
        </div>
      <div className={`p-3 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-center gap-2">
          <h4 className="text-3xl font-bold text-blue-950">{value}</h4>
          {percentage !== undefined && (
            <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">
               <ArrowUpRight size={12} /> {percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
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

  const normalizedStatus = status.toLowerCase();
  
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${styles[normalizedStatus] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;
