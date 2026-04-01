import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Shield, 
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Activity,
  Power,
  RotateCcw,
  FileCheck2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, toggleUserStatus } from "../../api/user.api";
import { toast } from "sonner";
import AddUserModal from "../../components/admin/AddUserModal";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Debounced search effect
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, limit, debouncedSearch, roleFilter, statusFilter],
    queryFn: () => getAllUsers({ 
      page, 
      limit, 
      search: debouncedSearch, 
      role: roleFilter, 
      status: statusFilter 
    }),
    keepPreviousData: true
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      toast.success(data.message || "Status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status.");
    },
  });

  const handleToggleStatus = (userId) => {
    toggleStatusMutation.mutate(userId);
  };

  const users = data?.users || [];
  const totalPages = data?.pages || 1;
  const totalUsers = data?.count || 0;
  const adminCount = users.filter(u => u.role === 'admin').length;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="text-rose-500" size={48} />
        <p className="text-slate-500 font-medium font-poppins">Failed to load user database.</p>
        <button 
          onClick={() => queryClient.invalidateQueries(["users"])}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
        >
          <RotateCcw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-poppins text-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">User Management</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and monitor all platform members.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 group"
          >
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
            Add New Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-800 transition-transform group-hover:scale-110">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest mb-0.5">Total Members</p>
              <h4 className="text-2xl font-bold text-blue-900">{totalUsers}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-800 transition-transform group-hover:scale-110">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest mb-0.5">Administrators</p>
              <h4 className="text-2xl font-bold text-blue-900">{adminCount}</h4>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="w-full md:w-40 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="all">Every Role</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="relative flex-1 md:flex-none">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full md:w-40 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="all">Any Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-4 pl-8 border-b border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-800 bg-clip-text text-transparent">
                      Identity
                    </span>
                  </th>
                  <th className="p-4 border-b border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-800 bg-clip-text text-transparent">
                      Role
                    </span>
                  </th>
                  <th className="p-4 border-b border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-800 bg-clip-text text-transparent">
                      Submissions
                    </span>
                  </th>
                  <th className="p-4 border-b border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-800 bg-clip-text text-transparent">
                      Account Control
                    </span>
                  </th>
                  <th className="p-4 pr-8 border-b border-slate-100 text-right">
                    <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-800 bg-clip-text text-transparent">
                      Details
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="p-8 border-b border-slate-50">
                        <div className="h-8 bg-slate-100 rounded-xl" />
                      </td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className={`hover:bg-slate-50/10 transition-colors group ${user.isActive === false ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                      <td className="p-4 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                              {user.profilePicture ? (
                                <img src={`https://pacific.kyptronix.us${user.profilePicture}`} alt="" className="w-full h-full object-cover" />
                              ) : (
                                user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                              )}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${user.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          </div>
                          <div>
                            <p className={`font-bold leading-tight ${user.isActive !== false ? 'text-slate-900' : 'text-slate-500'}`}>{user.fullName}</p>
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              <Mail size={10} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${
                          user.role === 'admin' 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          <Shield size={12} className={user.role === 'admin' ? "text-indigo-500" : "text-emerald-500"} />
                          {user.role}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            user.submittedEnrollmentsCount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                          }`}>
                            <FileCheck2 size={16} />
                          </div>
                          <span className={`text-sm font-bold ${
                            user.submittedEnrollmentsCount > 0 ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {user.submittedEnrollmentsCount || 0} {user.submittedEnrollmentsCount === 1 ? 'Program' : 'Programs'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleStatus(user._id)}
                          disabled={toggleStatusMutation.isLoading}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                            user.isActive !== false 
                              ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 group-hover:shadow-sm' 
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Power size={12} />
                          {user.isActive !== false ? "ACTIVE" : "DISABLED"}
                        </button>
                      </td>
                      <td className="p-4 pr-8 text-right">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                          user.enrollmentStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          user.enrollmentStatus === 'submitted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          user.enrollmentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          user.enrollmentStatus === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {user.enrollmentStatus || "NO ENROLLMENT"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                          <Users size={32} />
                        </div>
                        <div>
                          <p className="text-slate-800 font-bold">No Records Found</p>
                          <p className="text-slate-400 text-sm">We couldn't find any users matching your filters.</p>
                        </div>
                        <button 
                          onClick={() => { setSearchQuery(""); setRoleFilter("all"); setStatusFilter("all"); }}
                          className="mt-2 text-indigo-600 font-bold text-sm hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        {totalPages > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-900 font-bold">{(page - 1) * limit + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(page * limit, totalUsers)}</span> of <span className="text-slate-900 font-bold">{totalUsers}</span> members
            </p>
            
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
                    if (Math.abs(p - page) === 3) return <span key={p} className="px-2 text-slate-300 font-bold">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        page === p 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => queryClient.invalidateQueries(["users"])}
      />
    </div>
  );
};

export default UserManagement;
