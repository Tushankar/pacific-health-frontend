import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword, toggle2FA } from "../../api/user.api";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Bell,
  BellOff,
  Shield,
  Lock,
  ChevronRight,
  Loader2,
} from "lucide-react";

const Profile = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Profile Data State (local editable copy)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Settings State (local only for now)
  const [settings, setSettings] = useState({
    notifications: true,
  });

  // Fetch profile from API
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });

  // Sync fetched data into local state
  useEffect(() => {
    if (profileResponse?.user) {
      const u = profileResponse.user;
      setProfileData({
        name: u.fullName || "",
        email: u.email || "",
        phone: u.phoneNumber || "",
        address: u.address || "",
        bio: u.bio || "",
      });
    }
  }, [profileResponse]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      // Also update localStorage so Navbar greeting updates
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password changed!");
      setShowChangePassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to change password.");
    },
  });

  // 2FA state (derived from profile)
  const twoFactorOn = profileResponse?.user?.twoFactorEnabled || false;

  // Toggle 2FA mutation
  const toggle2FAMutation = useMutation({
    mutationFn: toggle2FA,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to toggle 2FA.");
    },
  });

  const handleProfileSave = () => {
    updateMutation.mutate({
      fullName: profileData.name,
      phoneNumber: profileData.phone,
      address: profileData.address,
      bio: profileData.bio,
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return toast.error("New passwords do not match.");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters.");
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to server data
    if (profileResponse?.user) {
      const u = profileResponse.user;
      setProfileData({
        name: u.fullName || "",
        email: u.email || "",
        phone: u.phoneNumber || "",
        address: u.address || "",
        bio: u.bio || "",
      });
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const tabs = [
    { id: "account", label: "Account Information", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Account Details</h3>
                <p className="text-slate-500 text-sm mt-0.5">Update your personal information and bio</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-semibold border border-blue-100/50 shadow-sm"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleProfileSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-50"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-semibold"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-slate-800 font-medium"
                    />
                  ) : (
                    <div className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100/50 rounded-xl text-slate-700 font-semibold whitespace-nowrap overflow-hidden text-ellipsis shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      {profileData.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="text-slate-400" size={18} />
                  </div>
                  <div className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100/50 rounded-xl text-slate-500 font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    {profileData.email}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Locked</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-slate-800 font-medium"
                    />
                  ) : (
                    <div className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100/50 rounded-xl text-slate-700 font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      {profileData.phone || <span className="text-slate-400 italic font-normal">Not provided</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">Location</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-slate-800 font-medium"
                    />
                  ) : (
                    <div className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100/50 rounded-xl text-slate-700 font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      {profileData.address || <span className="text-slate-400 italic font-normal">Not provided</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">Professional Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none text-slate-800 font-medium"
                    rows={4}
                  />
                ) : (
                  <div className="w-full px-4 py-4 bg-slate-50 border border-slate-100/50 rounded-xl text-slate-700 leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium">
                    {profileData.bio ? (
                      `"${profileData.bio}"`
                    ) : (
                      <span className="text-slate-400 italic font-normal">No bio set yet.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Notifications</h3>
              <p className="text-slate-500 text-sm mt-0.5">Manage how you receive updates</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors duration-300 shadow-sm border ${settings.notifications ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {settings.notifications ? <Bell size={24} /> : <BellOff size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 tracking-tight">Push Notifications</h4>
                    <p className="text-xs text-slate-500 font-medium">Receive desktop and mobile alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-110">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 -translate-y-8 translate-x-10 rounded-full blur-2xl pointer-events-none" />
                <h4 className="font-bold text-blue-900 mb-2 relative z-10">Notification Summary</h4>
                <p className="text-sm text-blue-800/80 leading-relaxed font-medium relative z-10">
                  When notifications are enabled, you will receive real-time updates regarding your applications, messages from administrators, and important platform announcements.
                </p>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Privacy & Security</h3>
              <p className="text-slate-500 text-sm mt-0.5">Control your data and account security</p>
            </div>

            <div className="space-y-6">
              <div
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="p-5 border border-slate-200 bg-white rounded-2xl flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 shadow-sm rounded-xl text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 tracking-tight">Change Password</h4>
                    <p className="text-xs text-slate-500 font-medium">Update your account security regularly</p>
                  </div>
                </div>
                <ChevronRight className={`text-slate-400 group-hover:text-blue-600 transition-all ${showChangePassword ? "rotate-90" : ""}`} />
              </div>

              {/* Change Password Form */}
              {showChangePassword && (
                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 shadow-sm font-medium"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 shadow-sm font-medium"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-wide text-slate-500 uppercase ml-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 shadow-sm font-medium"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                    >
                      {changePasswordMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Lock size={16} />
                      )}
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                      }}
                      className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className={`p-5 rounded-2xl flex items-center justify-between transition-colors shadow-sm group border ${twoFactorOn ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-slate-200 hover:border-blue-200'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors shadow-sm border ${twoFactorOn ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100'}`}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 tracking-tight">Two-Factor Authentication</h4>
                    <p className={`text-xs font-medium ${twoFactorOn ? 'text-emerald-600/80' : 'text-slate-500'}`}>
                      {twoFactorOn ? 'OTP required on every login' : 'Add an extra layer of security'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-110">
                  <input
                    type="checkbox"
                    checked={twoFactorOn}
                    onChange={() => toggle2FAMutation.mutate()}
                    disabled={toggle2FAMutation.isPending}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-87px)] bg-[#F4F7F9] p-4 md:p-8 font-inter">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 pl-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1.5 font-medium">Manage your profile, preferences, and security settings in one place.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-800" />
              <div className="relative flex flex-col items-center pt-16">
                <div className="relative group">
                  <div className="w-[104px] h-[104px] bg-white rounded-full p-1 shadow-lg flex items-center justify-center mb-4 overflow-hidden ring-4 ring-white">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || "User")}&background=2563eb&color=fff&bold=true&size=128`}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <button className="absolute bottom-4 right-0 p-2 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-slate-100 text-blue-600 hover:text-blue-700 hover:scale-105 transition-all z-10">
                    <Edit2 size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <h2 className="text-[22px] font-black text-slate-800 mt-1 tracking-tight">{profileData.name}</h2>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{profileData.email}</p>
              </div>

              <div className="h-px bg-slate-100 my-8 w-full" />

              <nav className="space-y-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsEditing(false);
                    }}
                    className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 text-sm text-left group border ${activeTab === tab.id
                      ? "bg-blue-50/80 text-blue-600 border-blue-100 shadow-sm"
                      : "bg-transparent text-slate-500 border-transparent hover:bg-white hover:border-slate-100 hover:text-slate-700 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                      }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600 border border-slate-100"}`}>
                      <tab.icon size={18} strokeWidth={2.5} />
                    </div>
                    <span className="flex-1 tracking-wide">{tab.label}</span>
                    {activeTab === tab.id && <ChevronRight size={16} className="text-blue-600" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
