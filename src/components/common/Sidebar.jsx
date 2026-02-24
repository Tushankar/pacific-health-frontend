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
      return `group bg-white w-full flex justify-start items-center p-4 md:p-4.5 cursor-pointer transition-all duration-200 relative ${
        isDesktopCollapsed ? "md:justify-center md:px-3" : ""
      }`;
    }

    if (isHovered) {
      return `group bg-white/10 w-full flex justify-start items-center p-4 md:p-4.5 cursor-pointer transition-all duration-200 relative ${
        isDesktopCollapsed ? "md:justify-center md:px-3" : ""
      }`;
    }

    return `group w-full flex justify-start items-center p-4 md:p-4.5 cursor-pointer transition-all duration-200 ${
      isDesktopCollapsed ? "md:justify-center md:px-3" : ""
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

    if (status === "completed" || status === "approved") {
      return (
        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    } else if (status === "rejected") {
      return (
        <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    } else if (status === "draft") {
      return (
        <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm shadow-yellow-400/50">
          <svg
            className="w-2 h-2 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      );
    } else if (status === "in-progress") {
      return (
        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
        </div>
      );
    } else {
      return (
        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
        </div>
      );
    }
  };

  const getFormTypeIcon = (type) => {
    switch (type) {
      case "Data Entry":
        return <UserPlus size={16} className="text-blue-600" />;
      case "Fillable":
        return <PenTool size={16} className="text-emerald-600" />;
      case "Signable":
        return <FileText size={16} className="text-purple-600" />;
      case "Upload":
        return <Upload size={16} className="text-orange-600" />;
      case "Track":
        return <ClipboardList size={16} className="text-indigo-600" />;
      default:
        return <FileText size={16} className="text-slate-600" />;
    }
  };

  const getFormTypeColor = (type) => {
    switch (type) {
      case "Data Entry":
        return "text-blue-600 bg-blue-100";
      case "Fillable":
        return "text-emerald-600 bg-emerald-100";
      case "Signable":
        return "text-purple-600 bg-purple-100";
      case "Upload":
        return "text-orange-600 bg-orange-100";
      case "Track":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-slate-600 bg-slate-100";
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
          x: isMobileMenuOpen ? 0 : window.innerWidth < 768 ? "-100%" : 0,
        }}
        transition={{ ease: "easeInOut", duration: 0.4 }}
        className={`fixed md:static inset-y-0 left-0 h-full flex flex-col bg-white z-[100] transform shadow-2xl md:shadow-none`}
      >
        <div
          className={`flex ${
            isDesktopCollapsed ? "justify-center" : "justify-between"
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
              const isCurrentPathActiveApp =
                location.pathname === "/my-application";
              const isActiveAppActive =
                isActiveApp &&
                (isActiveRoute(item.path) ||
                  (activeFormId && isCurrentPathActiveApp));

              const isExpanded = isActiveApp && isMyWorkflowsExpanded;

              return (
                <li key={index} className="w-full">
                  {/* Main Menu Item */}
                  <div
                    className={
                      isActiveApp
                        ? getMenuItemClass(item.path, index, isActiveAppActive)
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
                        className={`flex justify-start items-center gap-5 w-full ${
                          isDesktopCollapsed ? "md:justify-center" : ""
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
                                className={`${
                                  isActiveAppActive || isActiveRoute(item.path)
                                    ? "text-[#1F3A93]"
                                    : "text-white"
                                } transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex justify-start items-center gap-5 w-full ${
                          isDesktopCollapsed ? "md:justify-center" : ""
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
                          const completedCount = chapter.forms.filter((form) =>
                            ["completed", "approved", "rejected"].includes(
                              form.status,
                            ),
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
                                className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                              >
                                <ChevronRight
                                  size={14}
                                  className={`transition-transform duration-200 flex-shrink-0 ${
                                    isChapterExpanded ? "rotate-90" : ""
                                  } ${chapter.isLocked ? "opacity-50" : ""}`}
                                />
                                <span
                                  className={`flex-1 truncate font-medium ${chapter.isLocked ? "text-white/40" : ""}`}
                                >
                                  {chapter.chapter}
                                </span>
                                {chapter.isLocked ? (
                                  <div className="p-1 px-2 rounded-md bg-white/5 border border-white/10 flex items-center gap-1.5 overflow-hidden">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">
                                      Locked
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-xs">
                                    <span className="text-emerald-400 font-bold">
                                      {completedCount}
                                    </span>
                                    <span className="text-white/60">/</span>
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
                                    transition={{
                                      duration: 0.2,
                                      ease: "easeInOut",
                                    }}
                                    className="ml-6 space-y-1 py-1 overflow-hidden"
                                  >
                                    {chapter.forms.map((form) => {
                                      const isActiveForm =
                                        activeFormId === String(form.id) &&
                                        location.pathname === "/my-application";
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
                                          className={`w-full text-left p-2 rounded transition-colors flex items-start gap-2 text-xs relative ${
                                            isActiveForm
                                              ? "bg-white/20 text-white"
                                              : chapter.isLocked
                                                ? "text-white/30 cursor-not-allowed"
                                                : "text-white/70 hover:text-white hover:bg-white/10"
                                          }`}
                                          disabled={chapter.isLocked}
                                        >
                                          {isActiveForm && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r" />
                                          )}
                                          <div
                                            className={`flex items-center gap-2 flex-1 min-w-0 ${chapter.isLocked ? "opacity-40 grayscale" : ""}`}
                                          >
                                            {renderCompletionIndicator(form)}
                                            <div
                                              className={`p-1 rounded ${getFormTypeColor(form.type).split(" ")[1]} flex-shrink-0`}
                                            >
                                              {getFormTypeIcon(form.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="font-medium truncate">
                                                {form.name}
                                              </p>
                                              <p
                                                className={`truncate text-xs ${isActiveForm ? "text-white/70" : "text-white/50"}`}
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
              className={`group flex justify-start items-center gap-5 px-3 py-2.5 md:px-4 md:py-3 w-full transition-colors duration-200 ${
                isDesktopCollapsed ? "md:justify-center md:px-3" : ""
              }`}
              onMouseEnter={() => setHoveredItem("logout")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex justify-start items-center gap-5 px-3 py-2 rounded-lg w-full bg-[#DD3F3F] hover:bg-red-500">
                <LogOut className="w-6 h-6 text-white" />
                <motion.h4
                  initial={false}
                  animate={{
                    opacity: isDesktopCollapsed ? 0 : 1,
                    width: isDesktopCollapsed ? 0 : "auto",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`text-sm md:text-base text-white font-semibold whitespace-nowrap tracking-wide`}
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
