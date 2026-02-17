import React, { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyNotifications } from "../../api/notifications.api";

const Navbar = ({ toggleMobileMenu, toggleNotifications }) => {
  const [greeting, setGreeting] = useState("Good Morning");
  const [userName, setUserName] = useState("User");

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  // Get user name from localStorage (simplified)
  const getUserName = () => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData.fullName || userData.name || userData.email || "User";
      }
      return "User";
    } catch (error) {
      console.error("Error getting user name:", error);
      return "User";
    }
  };

  useEffect(() => {
    // Set initial greeting and user name
    setGreeting(getTimeBasedGreeting());
    setUserName(getUserName());

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="py-2 md:py-3 lg:py-[15.4px] sticky top-0 z-20 px-3 md:px-4 lg:px-6 flex justify-between items-center border-b border-[#BDC3C7] bg-white">
      <div className="flex-1 md:flex-none min-w-0">
        <h3 className="text-sm md:text-xl lg:text-[1.5vw] font-[600] font-poppins text-[#000000] truncate">
          {greeting}, {userName}
        </h3>
        <p className="text-[10px] md:text-sm lg:text-[1vw] font-[400] font-poppins text-[#4D4D4D] hidden sm:block">
          Here is your daily preview
        </p>
      </div>
      <div className="flex justify-center items-center gap-2 md:gap-3 lg:gap-5">
        <div className="hidden sm:flex justify-center items-center h-8 w-auto md:h-10 lg:h-14 flex-shrink-0">
          <img
            src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png"
            alt="Pacific Health Systems Logo"
            className="h-full object-contain"
            onError={(e) => {
              console.log("Logo image failed to load");
              e.target.style.display = "none";
            }}
          />
        </div>
        {/* Notification Bell */}
        <button
          onClick={toggleNotifications}
          className="relative p-2 md:p-2.5 lg:p-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl transition-all group shadow-sm"
        >
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#64748b] group-hover:text-blue-600 transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] md:text-xs font-bold text-white ring-2 ring-white animate-in zoom-in duration-300">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden bg-[#1F3A93] h-8 w-8 md:h-10 md:w-10 rounded-lg flex justify-center items-center hover:bg-[#153073] transition-colors flex-shrink-0"
          onClick={toggleMobileMenu}
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
