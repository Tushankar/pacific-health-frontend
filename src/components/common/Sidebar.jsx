import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  UserPlus,
  Upload,
  PenTool,
  ClipboardList,
  LayoutDashboard,
  FileStack,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Briefcase,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
  CircleDot,
  Circle,
  Lock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyEnrollment } from "../../api/enrollment.api";
import { toast } from "sonner";

// Custom hamburger menu icon component
const HamburgerIcon = ({ isCollapsed }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-200"
  >
    <rect
      x="2"
      y="4"
      width={isCollapsed ? "16" : "10"}
      height="2"
      rx="1"
      fill="currentColor"
      className="transition-all duration-200"
    />
    <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
    <rect
      x="2"
      y="14"
      width={isCollapsed ? "16" : "10"}
      height="2"
      rx="1"
      fill="currentColor"
      className="transition-all duration-200"
    />
  </svg>
);

const Sidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isDesktopCollapsed,
  setIsDesktopCollapsed,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeFormId = searchParams.get("formId");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMyWorkflowsExpanded, setIsMyWorkflowsExpanded] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [formStatuses, setFormStatuses] = useState({});
  const [selectedProgram, setSelectedProgram] = useState(() => {
    return localStorage.getItem("selectedProgram") || "NOW-COMP";
  });

  // Fetch enrollment data
  const { data: enrollmentData } = useQuery({
    queryKey: ["myEnrollment"],
    queryFn: getMyEnrollment,
  });

  const activeEnrollment = enrollmentData?.enrollment;

  // Sync program selection
  useEffect(() => {
    if (activeEnrollment) {
      setSelectedProgram(activeEnrollment.program);
    }
  }, [activeEnrollment]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    const currentPath = location.pathname;

    // Exact match
    if (currentPath === path) return true;

    // For admin dashboard, also consider admin form view routes as active
    if (
      path === "/admin/dashboard" &&
      currentPath.includes("/admin/application")
    ) {
      return true;
    }

    return false;
  };

  const getMenuItemClass = (path, index, isExternallyActive = false) => {
    const isActive = isExternallyActive || isActiveRoute(path);
    const isHovered = hoveredItem === index;

    if (isActive) {
      return `group bg-white w-full flex justify-start items-center p-4 md:p-4.5 cursor-pointer transition-all duration-300 relative shadow-[0_4px_24px_rgba(255,255,255,0.1)] z-10 ${isDesktopCollapsed ? "md:justify-center md:px-3" : ""
        }`;
    }

    if (isHovered) {
      return `group w-full flex justify-start items-center p-4 md:p-4.5 cursor-pointer transition-all duration-300 relative bg-white/5 backdrop-blur-sm ${isDesktopCollapsed ? "md:justify-center md:px-3" : ""
        }`;
    }

    return `group w-full flex justify-start items-center p-4 md:p-4.5 cursor-pointer transition-all duration-300 bg-transparent ${isDesktopCollapsed ? "md:justify-center md:px-3" : ""
      }`;
  };

  const getIconColorClass = (path, index, isExternallyActive = false) => {
    const isActive = isExternallyActive || isActiveRoute(path);

    return isActive ? "text-[#1F3A93]" : "text-white group-hover:text-white";
  };

  const getTextColorClass = (path, index, isExternallyActive = false) => {
    const isActive = isExternallyActive || isActiveRoute(path);

    if (isActive) {
      return "text-[#1F3A93]";
    }
    return "text-white group-hover:text-white";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const menuItems = isAdmin
    ? [
      {
        name: "Submission Queue",
        path: "/admin/dashboard",
        icon: ClipboardList,
      },
      {
        name: "Program Overview",
        path: "/admin/programs",
        icon: LayoutDashboard,
      },
      { name: "After Hire", path: "/admin/after-hire", icon: Briefcase },
      { name: "Communication", path: "/communication", icon: MessageSquare },
      { name: "Profile", path: "/profile", icon: User },
    ]
    : [
      { name: "History", path: "/my-applications", icon: ClipboardList },
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      {
        name: "Active Application",
        path: "/my-application",
        icon: FileStack,
        hasDropdown: true,
      },
      { name: "Communication", path: "/communication", icon: MessageSquare },
      { name: "Profile", path: "/profile", icon: User },
    ];

  // Forms data for My Workflows dropdown
  const formsData = useMemo(() => {
    // If we have backend data, use it
    if (activeEnrollment && activeEnrollment.forms) {
      const chaptersMap = {};
      activeEnrollment.forms.forEach((f) => {
        if (!chaptersMap[f.chapter]) {
          chaptersMap[f.chapter] = { chapter: f.chapter, forms: [] };
        }
        // Show all forms in sidebar regardless of status
        chaptersMap[f.chapter].forms.push({
          id: f.formId,
          name: f.name,
          type: f.type,
          status: f.status,
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

    // Fallback static data (same as before)
    if (selectedProgram === "NOW-COMP") {
      return [
        {
          chapter: "Chapter I- Admission Packet-Nursing",
          forms: [
            {
              id: 1,
              name: "Client Information Form",
              type: "Data Entry",
              desc: "Basic client information",
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
        // ... abbreviated ...
      ];
    }
    return [];
  }, [selectedProgram, activeEnrollment]);

  // Auto-expand chapter containing active form
  useEffect(() => {
    // Only auto-expand if we are on the active application route
    if (location.pathname !== "/my-application") return;

    if (activeFormId && formsData.length > 0) {
      const chapterIndex = formsData.findIndex((ch) =>
        ch.forms.some((f) => f.id === parseInt(activeFormId)),
      );

      if (chapterIndex !== -1) {
        setIsMyWorkflowsExpanded(true);
        setExpandedChapters((prev) => ({
          ...prev,
          [chapterIndex]: true,
        }));
      }
    }
  }, [activeFormId, formsData, location.pathname]);

  const renderCompletionIndicator = (form) => {
    const status = form.status;
    const baseClasses = "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 shadow-sm border border-transparent";

    if (status === "completed" || status === "approved") {
      return (
        <div className={`${baseClasses} bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]`}>
          <CheckCircle2 size={12} strokeWidth={3} className="text-emerald-400" />
        </div>
      );
    } else if (status === "rejected") {
      return (
        <div className={`${baseClasses} bg-rose-500/20 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]`}>
          <XCircle size={12} strokeWidth={3} className="text-rose-400" />
        </div>
      );
    } else if (status === "draft") {
      return (
        <div className={`${baseClasses} bg-amber-400/20 border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.3)]`}>
          <CircleDot size={12} strokeWidth={2.5} className="text-amber-400" />
        </div>
      );
    } else if (status === "in-progress") {
      return (
        <div className={`${baseClasses} bg-blue-400/20 border-blue-400/40 shadow-[0_0_12px_rgba(96,165,250,0.3)]`}>
          <CircleDot size={12} strokeWidth={2.5} className="text-blue-400 opacity-80" />
        </div>
      );
    } else {
      return (
        <div className={`${baseClasses} bg-white/5 border border-white/10`}>
          <Circle size={12} strokeWidth={2} className="text-white/30" />
        </div>
      );
    }
  };

  const getFormTypeIcon = (type) => {
    switch (type) {
      case "Data Entry":
        return <UserPlus size={14} strokeWidth={2.5} className="opacity-90 leading-none" />;
      case "Fillable":
        return <PenTool size={14} strokeWidth={2.5} className="opacity-90 leading-none" />;
      case "Signable":
        return <FileText size={14} strokeWidth={2.5} className="opacity-90 leading-none" />;
      case "Upload":
        return <Upload size={14} strokeWidth={2.5} className="opacity-90 leading-none" />;
      case "Track":
        return <ClipboardList size={14} strokeWidth={2.5} className="opacity-90 leading-none" />;
      default:
        return <FileText size={14} strokeWidth={2.5} className="opacity-80 leading-none" />;
    }
  };

  const getFormTypeColor = (type) => {
    switch (type) {
      case "Data Entry":
        return "text-blue-300 bg-blue-500/20 border border-blue-400/30 shadow-[0_0_8px_rgba(59,130,246,0.15)]";
      case "Fillable":
        return "text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]";
      case "Signable":
        return "text-purple-300 bg-purple-500/20 border border-purple-400/30 shadow-[0_0_8px_rgba(168,85,247,0.15)]";
      case "Upload":
        return "text-orange-300 bg-orange-500/20 border border-orange-400/30 shadow-[0_0_8px_rgba(249,115,22,0.15)]";
      case "Track":
        return "text-indigo-300 bg-indigo-500/20 border border-indigo-400/30 shadow-[0_0_8px_rgba(99,102,241,0.15)]";
      default:
        return "text-white/80 bg-white/10 border border-white/20";
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isDesktopCollapsed ? "80px" : "288px",
          x: isMobileMenuOpen ? 0 : (window.innerWidth < 768 ? "-100%" : 0),
        }}
        transition={{ ease: "easeInOut", duration: 0.4 }}
        className={`fixed md:static inset-y-0 left-0 h-full flex flex-col bg-white z-[100] transform shadow-2xl md:shadow-none`}
      >
        <div
          className={`flex ${isDesktopCollapsed ? "justify-center" : "justify-between"
            } items-center py-4 px-3 border-b border-[#BDC3C7] shadow-md relative h-[87px]`}
        >
          <AnimatePresence mode="wait">
            {!isDesktopCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-12 h-12"
              >
                <img
                  src="/pacific_logo.png"
                  alt="logo"
                  className="object-contain w-full h-full rounded"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className={`hidden md:flex p-2 rounded hover:bg-gray-100 text-gray-700 ${isDesktopCollapsed ? "" : "mr-2"}`}
          >
            <HamburgerIcon isCollapsed={isDesktopCollapsed} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileMenu}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors absolute right-4 top-1/2 -translate-y-1/2"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col justify-between bg-gradient-to-b from-[#1F3A93] to-[#122258] flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="flex flex-col justify-center items-center w-full gap-0 py-4">
            {menuItems.map((item, index) => {
              const isMyWorkflows = item.path === "/my-application"; // Explicit check for specific path functionality
              const isActiveApp = item.name === "Active Application";

              // Only consider formId if we are actually on the /my-application route
              const isCurrentPathActiveApp = location.pathname === "/my-application";
              const isActiveAppActive =
                isActiveApp && (isActiveRoute(item.path) || (activeFormId && isCurrentPathActiveApp));

              const isExpanded = isActiveApp && isMyWorkflowsExpanded;

              return (
                <li key={index} className="w-full">
                  {/* Main Menu Item */}
                  <div
                    className={
                      isActiveApp
                        ? getMenuItemClass(
                          item.path,
                          index,
                          isActiveAppActive,
                        )
                        : getMenuItemClass(item.path, index)
                    }
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {isActiveApp ? (
                      <button
                        onClick={() => {
                          setIsMyWorkflowsExpanded(!isMyWorkflowsExpanded);
                          if (!isMyWorkflowsExpanded) {
                            navigate(item.path);
                          }
                        }}
                        className={`flex justify-start items-center gap-5 w-full ${isDesktopCollapsed ? "md:justify-center" : ""
                          }`}
                      >
                        <span
                          className={getIconColorClass(
                            item.path,
                            index,
                            isActiveAppActive,
                          )}
                        >
                          <item.icon className="w-6 h-6" />
                        </span>
                        <motion.h4
                          initial={false}
                          animate={{
                            opacity: isDesktopCollapsed ? 0 : 1,
                            width: isDesktopCollapsed ? 0 : "auto",
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className={`text-sm md:text-base ${getTextColorClass(
                            item.path,
                            index,
                            isActiveAppActive,
                          )} font-semibold whitespace-nowrap tracking-wide`}
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {item.name}
                        </motion.h4>
                        <AnimatePresence>
                          {!isDesktopCollapsed && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="ml-auto"
                            >
                              <ChevronDown
                                size={16}
                                className={`${isActiveAppActive || isActiveRoute(item.path)
                                  ? "text-[#1F3A93]"
                                  : "text-white"
                                  } transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                  }`}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex justify-start items-center gap-5 w-full ${isDesktopCollapsed ? "md:justify-center" : ""
                          }`}
                        onClick={closeMobileMenu}
                      >
                        <span className={getIconColorClass(item.path, index)}>
                          <item.icon className="w-6 h-6" />
                        </span>
                        <motion.h4
                          initial={false}
                          animate={{
                            opacity: isDesktopCollapsed ? 0 : 1,
                            width: isDesktopCollapsed ? 0 : "auto",
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className={`text-sm md:text-base ${getTextColorClass(
                            item.path,
                            index,
                          )} font-semibold whitespace-nowrap tracking-wide`}
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {item.name}
                        </motion.h4>
                      </Link>
                    )}
                    {(isActiveRoute(item.path) ||
                      (isActiveApp && isActiveAppActive)) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#1F3A93] rounded-r-full" />
                      )}
                  </div>

                  {/* Active Application Dropdown */}
                  <AnimatePresence>
                    {isActiveApp && isExpanded && !isDesktopCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="bg-transparent ml-4 overflow-hidden"
                      >
                        {formsData.map((chapter, chapterIndex) => {
                          const isChapterExpanded =
                            expandedChapters[chapterIndex];
                          const completedCount = chapter.forms.filter(
                            (form) => ["completed", "approved", "rejected"].includes(form.status),
                          ).length;
                          const totalCount = chapter.forms.length;

                          return (
                            <div key={chapterIndex} className="mb-1">
                              {/* Chapter Header */}
                              <button
                                onClick={() => {
                                  if (chapter.isLocked) {
                                    toast.info(
                                      "Locked: This section will unlock after you complete submitting all forms properly and receive admin approval.",
                                    );
                                    return;
                                  }
                                  setExpandedChapters((prev) => ({
                                    ...prev,
                                    [chapterIndex]: !prev[chapterIndex],
                                  }));
                                }}
                                className="w-full text-left px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-xl flex items-center gap-3 text-sm group hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                              >
                                <ChevronRight
                                  size={16}
                                  className={`transition-transform duration-300 flex-shrink-0 text-white/50 group-hover:text-white/90 ${isChapterExpanded ? "rotate-90 text-white/90" : ""
                                    } ${chapter.isLocked ? "opacity-30" : ""}`}
                                />
                                <span
                                  className={`flex-1 truncate font-medium tracking-wide transition-all duration-300 ${chapter.isLocked ? "text-white/40" : "group-hover:translate-x-0.5"}`}
                                >
                                  {chapter.chapter}
                                </span>
                                {chapter.isLocked ? (
                                  <div className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center gap-1 shadow-[0_0_8px_rgba(245,158,11,0.15)] flex-shrink-0 overflow-hidden">
                                    <Lock size={10} className="text-amber-500/80" />
                                    <span className="text-[9px] font-black text-amber-500/90 uppercase tracking-widest pl-[1px]">
                                      Locked
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-[11px] font-bold">
                                    <span className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
                                      {completedCount}
                                    </span>
                                    <span className="text-white/40">/</span>
                                    <span className="text-white/60">
                                      {totalCount}
                                    </span>
                                  </div>
                                )}
                              </button>

                              {/* Forms under this chapter */}
                              <AnimatePresence>
                                {isChapterExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="ml-[22px] border-l border-white/10 pl-3 space-y-1.5 py-1.5 overflow-hidden"
                                  >
                                    {chapter.forms.map((form) => {
                                      const isActiveForm =
                                        activeFormId === String(form.id) && location.pathname === "/my-application";
                                      return (
                                        <button
                                          key={form.id}
                                          onClick={() => {
                                            if (chapter.isLocked) {
                                              toast.info(
                                                "Locked: This form will unlock after you complete submitting all forms properly and receive admin approval.",
                                              );
                                              return;
                                            }
                                            navigate(
                                              `${item.path}?formId=${form.id}`,
                                            );
                                            closeMobileMenu();
                                          }}
                                          className={`w-full text-left p-2.5 rounded-xl transition-all duration-300 flex items-start gap-3 relative group ${isActiveForm
                                            ? "bg-white/15 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10"
                                            : chapter.isLocked
                                              ? "text-white/30 cursor-not-allowed border border-transparent"
                                              : "text-white/60 hover:text-white hover:bg-white/10 hover:translate-x-1 border border-transparent hover:border-white/5"
                                            }`}
                                          disabled={chapter.isLocked}
                                        >
                                          {isActiveForm && (
                                            <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                                          )}
                                          <div
                                            className={`flex items-center gap-3 flex-1 min-w-0 ${chapter.isLocked ? "opacity-40 grayscale" : ""}`}
                                          >
                                            {renderCompletionIndicator(form)}
                                            <div
                                              className={`p-[5px] rounded-lg ${getFormTypeColor(form.type)} flex-shrink-0 flex items-center justify-center`}
                                            >
                                              {getFormTypeIcon(form.type)}
                                            </div>
                                            <div className="flex-1 min-w-0 mt-0.5">
                                              <p className={`text-[13px] font-semibold tracking-wide truncate ${isActiveForm ? "text-white" : "group-hover:text-white transition-colors"}`}>
                                                {form.name}
                                              </p>
                                              <p
                                                className={`truncate text-[9.5px] uppercase font-bold tracking-widest mt-0.5 ${isActiveForm ? "text-white/60" : "text-white/40 group-hover:text-white/60 transition-colors"}`}
                                              >
                                                {form.desc}
                                              </p>
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Logout Button */}
          <div className="flex flex-col gap-2 py-4">
            <button
              onClick={handleLogout}
              className={`group flex justify-start items-center gap-5 px-3 py-2.5 md:px-4 md:py-3 w-full transition-colors duration-200 ${isDesktopCollapsed ? "md:justify-center md:px-3" : ""
                }`}
              onMouseEnter={() => setHoveredItem("logout")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex justify-start items-center gap-5 px-4 py-2.5 rounded-xl w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(225,29,72,0.05)] hover:shadow-[0_0_20px_rgba(225,29,72,0.15)] overflow-hidden">
                <LogOut className="w-5 h-5 text-rose-400 group-hover:text-rose-300 transition-colors flex-shrink-0" />
                <motion.h4
                  initial={false}
                  animate={{
                    opacity: isDesktopCollapsed ? 0 : 1,
                    width: isDesktopCollapsed ? 0 : "auto",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`text-sm md:text-base text-rose-400 group-hover:text-rose-300 transition-colors font-semibold whitespace-nowrap tracking-wide min-w-0`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Log out
                </motion.h4>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
