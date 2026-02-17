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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
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
                <h3 className="text-xl font-bold text-slate-800">Account Details</h3>
                <p className="text-slate-500 text-sm">Update your personal information and bio</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all font-semibold border border-indigo-100"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleProfileSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-md shadow-indigo-100 disabled:opacity-50"
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
                <label className="text-sm font-semibold text-slate-600 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm text-slate-800"
                    />
                  ) : (
                    <div className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-xl text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {profileData.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-slate-400" size={18} />
                  </div>
                  <div className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-xl text-slate-500 font-medium">
                    {profileData.email}
                    <span className="text-xs text-slate-400 ml-2">(cannot be changed)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm text-slate-800"
                    />
                  ) : (
                    <div className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-xl text-slate-700 font-medium">
                      {profileData.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Location</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm text-slate-800"
                    />
                  ) : (
                    <div className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-xl text-slate-700 font-medium">
                      {profileData.address || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Professional Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm resize-none text-slate-800"
                    rows={4}
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-slate-50/50 border border-transparent rounded-xl text-slate-700 leading-relaxed italic">
                    "{profileData.bio || "No bio set yet."}"
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
              <h3 className="text-xl font-bold text-slate-800">Notifications</h3>
              <p className="text-slate-500 text-sm">Manage how you receive updates</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${settings.notifications ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {settings.notifications ? <Bell size={24} /> : <BellOff size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Push Notifications</h4>
                    <p className="text-xs text-slate-500">Receive desktop and mobile alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-110">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Notification Summary</h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
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
              <h3 className="text-xl font-bold text-slate-800">Privacy & Security</h3>
              <p className="text-slate-500 text-sm">Control your data and account security</p>
            </div>

            <div className="space-y-6">
              <div
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="p-5 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Change Password</h4>
                    <p className="text-xs text-slate-500">Update your account security regularly</p>
                  </div>
                </div>
                <ChevronRight className={`text-slate-400 group-hover:text-indigo-600 transition-all ${showChangePassword ? "rotate-90" : ""}`} />
              </div>

              {/* Change Password Form */}
              {showChangePassword && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold disabled:opacity-50 shadow-md"
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
                      className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="p-5 border-2 border-slate-200 rounded-2xl flex items-center justify-between transition-colors group"
                style={{ borderStyle: twoFactorOn ? 'solid' : 'dashed', borderColor: twoFactorOn ? '#6366f1' : undefined }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${twoFactorOn ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500">
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
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-['Inter',_sans-serif]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your profile, preferences, and security settings in one place.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 to-blue-500" />
              <div className="relative flex flex-col items-center pt-20">
                <div className="relative group">
                  <div className="w-28 h-28 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-4 overflow-hidden">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || "User")}&background=6366f1&color=fff&bold=true&size=128`} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-slate-100 text-indigo-600 hover:text-indigo-700 hover:scale-110 transition-all z-10">
                    <Edit2 size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mt-1">{profileData.name}</h2>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{profileData.email}</p>
              </div>

              <nav className="mt-8 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsEditing(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl font-bold transition-all text-sm text-left ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    <tab.icon size={20} className={activeTab === tab.id ? "text-indigo-600" : "text-slate-400"} />
                    {tab.label}
                    {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
