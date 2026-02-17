import React, { useState, createContext, useContext } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import NotificationSidebar from "../NotificationSidebar";

// Create context
export const MobileMenuContext = createContext();

// Custom hook
export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenu must be used within Layout");
  }
  return context;
};

export const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <MobileMenuContext.Provider value={{ toggleMobileMenu, isMobileMenuOpen }}>
      <div className="h-screen w-full flex justify-center items-center overflow-hidden relative">
        {/* Desktop Sidebar - Dynamic width based on collapsed state */}
        <div
          className={`hidden md:block ${isDesktopCollapsed ? "w-20" : "w-72"} h-full flex-shrink-0 transition-all duration-300 ease-in-out relative`}
        >
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isDesktopCollapsed={isDesktopCollapsed}
            setIsDesktopCollapsed={setIsDesktopCollapsed}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isDesktopCollapsed={false}
            setIsDesktopCollapsed={() => {}}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar 
            toggleMobileMenu={toggleMobileMenu} 
            toggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)} 
          />

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F7F9FC]">
            {children}
          </div>
        </div>

        {/* Notification Sidebar */}
        <NotificationSidebar 
          isOpen={isNotificationsOpen} 
          onClose={() => setIsNotificationsOpen(false)} 
        />
      </div>
    </MobileMenuContext.Provider>
  );
};
