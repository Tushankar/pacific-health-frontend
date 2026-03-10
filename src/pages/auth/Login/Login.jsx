import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OtpVerifyModal } from "../../../components/common/UI/OtpVerifyModal/OtpVerifyModal";
import { ForgotPasswordModal } from "../../../components/common/UI/ForgotPasswordModal/ForgotPasswordModal";
import { Toaster } from "../../../components/ui/sonner";
import * as EmailValidator from "email-validator";
import { toast } from "sonner";
import { useLogin, useForgotPassword, useResetPassword, useVerifyOtp } from "../../../hooks/useAuth";
import { verifyLoginOtp } from "../../../api/auth.api";
import { useMutation } from "@tanstack/react-query";

export const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 2FA state
  const [show2FAOtp, setShow2FAOtp] = useState(false);
  const [twoFAOtp, setTwoFAOtp] = useState("");

  // React Query mutations
  const loginMutation = useLogin();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  const verifyOtpMutation = useVerifyOtp();

  // 2FA verify mutation
  const verify2FAMutation = useMutation({
    mutationFn: verifyLoginOtp,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      toast.success(data.message || "Login successful!");
      setShow2FAOtp(false);
      const user = data.user;
      if (user && user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    },
  });

  const carouselItems = [
    {
      url: "https://images.pexels.com/photos/8439694/pexels-photo-8439694.jpeg",
      title: "Precision Healthcare Ecosystem",
      description:
        "Managing clinical analytics and patient care with intuitive, secure, and intelligent tools.",
    },
    {
      url: "https://images.pexels.com/photos/7876154/pexels-photo-7876154.jpeg",
      title: "Advanced Clinical Analytics",
      description:
        "Gain deeper insights into patient data and clinical performance with our real-time analytics suite.",
    },
    {
      url: "https://images.pexels.com/photos/7734586/pexels-photo-7734586.jpeg",
      title: "Seamless Patient Coordination",
      description:
        "Enhance communication between healthcare providers and patients for better care outcomes.",
    },
    {
      url: "https://images.pexels.com/photos/8441863/pexels-photo-8441863.jpeg",
      title: "Integrated Administrative Tools",
      description:
        "Reduce administrative burden with automated scheduling, billing, and document management.",
    },
    {
      url: "https://images.pexels.com/photos/8441820/pexels-photo-8441820.jpeg",
      title: "Secure Data Management",
      description:
        "Industry-leading security protocols to ensure patient confidentiality and data integrity.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const LoginUser = async () => {
    if (!EmailValidator.validate(loginInfo.email)) {
      return toast.error("Please enter a valid email address!");
    }

    loginMutation.mutate(
      { email: loginInfo.email, password: loginInfo.password },
      {
        onSuccess: (data) => {
          // Check if 2FA is required
          if (data.requires2FA) {
            toast.info(data.message || "Please enter the OTP sent to your email.");
            setTwoFAOtp("");
            setShow2FAOtp(true);
            return;
          }
          toast.success(data.message || "Welcome to Pacific Systems inc.!");
          const user = data.user;
          if (user && user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        },
        onError: (error) => {
          const errData = error.response?.data;
          if (errData?.requiresVerification) {
            toast.info(errData.message);
            setShowOtpInput(true);
          } else {
            toast.error(errData?.message || "Login failed. Please try again.");
          }
        },
      }
    );
  };

  return (
    <div className="h-screen flex font-['Poppins',sans-serif] bg-[#0F172A] bg-[radial-gradient(circle_at_top_right,_#1E293B_0%,_#0F172A_50%,_#1E1B4B_100%)] overflow-hidden">
      {/* Left Carousel Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
              index === currentImageIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
          >
            <img
              src={item.url}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
        ))}

        {/* Glassmorphism Content Card */}
        <div className="absolute bottom-10 left-10 right-10 z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 lg:p-10 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-transparent opacity-60"></div>

          <div className="relative z-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {carouselItems[currentImageIndex].title}
            </h2>
            <p className="text-blue-50/90 text-base lg:text-lg leading-relaxed mb-6 max-w-xl">
              {carouselItems[currentImageIndex].description}
            </p>

            {/* Pagination Indicators */}
            <div className="flex items-center space-x-3">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 transition-all duration-500 rounded-full ${
                    index === currentImageIndex
                      ? "w-12 bg-blue-400"
                      : "w-2 bg-blue-100/30 hover:bg-blue-100/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 overflow-y-auto lg:overflow-visible">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <img
              src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png"
              alt="Pacific Systems inc. Logo"
              className="h-16"
            />
          </div> 

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#34495E] mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Log in to manage your healthcare ecosystem.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              LoginUser();
            }}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#505050] mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={loginInfo.email}
                onChange={handleOnChange}
                className="w-full px-4 py-3 border border-[#95A5A6] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-200 bg-white text-[#34495E] placeholder:text-[#95A5A6] text-sm font-normal"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#505050] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={loginInfo.password}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 border border-[#95A5A6] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-200 bg-white text-[#34495E] pr-12 placeholder:text-[#95A5A6] text-sm font-normal"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending || !loginInfo.email || !loginInfo.password}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-bold"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                "Login to Pacific Systems inc."
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-bold text-blue-600 hover:text-blue-500 transition duration-200 ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <OtpVerifyModal
        isOpen={showOtpInput}
        onClose={() => setShowOtpInput(false)}
        email={loginInfo.email}
        otp={otp}
        setOtp={setOtp}
        isLoading={verifyOtpMutation.isPending}
        onVerify={() => {
          verifyOtpMutation.mutate(
            { email: loginInfo.email, otp },
            {
              onSuccess: (data) => {
                toast.success(data.message || "Verification successful!");
                setShowOtpInput(false);
                navigate("/dashboard");
              },
              onError: (error) => {
                toast.error(error.response?.data?.message || "OTP verification failed.");
              },
            }
          );
        }}
      />
      <ForgotPasswordModal
        isOpen={forgotMode}
        onClose={() => setForgotMode(false)}
        email={loginInfo.email}
        forgotOtp={forgotOtp}
        setForgotOtp={setForgotOtp}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        isSending={forgotPasswordMutation.isPending}
        isVerifying={resetPasswordMutation.isPending}
        onSendOtp={() => {
          forgotPasswordMutation.mutate(
            { email: loginInfo.email },
            {
              onSuccess: (data) => {
                toast.success(data.message || "OTP sent to your email!");
              },
              onError: (error) => {
                toast.error(error.response?.data?.message || "Failed to send OTP.");
              },
            }
          );
        }}
        onVerifyOtp={() => {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
          if (!passwordRegex.test(newPassword)) {
            return toast.error("New password must be at least 8 characters long and include an uppercase letter, a number, and a special character.");
          }
          resetPasswordMutation.mutate(
            { email: loginInfo.email, otp: forgotOtp, newPassword },
            {
              onSuccess: (data) => {
                toast.success(data.message || "Password reset successful!");
                setForgotMode(false);
                setForgotOtp("");
                setNewPassword("");
              },
              onError: (error) => {
                toast.error(error.response?.data?.message || "Password reset failed.");
              },
            }
          );
        }}
      />
      {/* 2FA OTP Modal */}
      <OtpVerifyModal
        isOpen={show2FAOtp}
        onClose={() => setShow2FAOtp(false)}
        email={loginInfo.email}
        otp={twoFAOtp}
        setOtp={setTwoFAOtp}
        isLoading={verify2FAMutation.isPending}
        onVerify={() => {
          verify2FAMutation.mutate({ email: loginInfo.email, otp: twoFAOtp });
        }}
      />
      <Toaster />
    </div>
  );
};
