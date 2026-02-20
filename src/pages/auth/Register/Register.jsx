import React, { useState, useRef, useEffect, useCallback } from "react";
import { RightSection } from "../../../components/common/UI/AuthPage/RightSection";
import { OtpVerifyModal } from "../../../components/common/UI/OtpVerifyModal/OtpVerifyModal";
import { Link, useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useRegister, useVerifyOtp } from "../../../hooks/useAuth";

const RECAPTCHA_SITE_KEY = "6LeMxG4sAAAAAAT_1N_PcBCvKi_ceHbhHFWpupzM";

const formatPhone = (value) => {
  const withoutPrefix = value.replace(/^\+1\s*/, "");
  const cleaned = withoutPrefix.replace(/\D/g, "");
  const limited = cleaned.slice(0, 10);
  if (limited.length === 0) return "";
  if (limited.length <= 3) return `+1 (${limited}`;
  if (limited.length <= 6)
    return `+1 (${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `+1 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
};

export const Register = () => {
  const [registerInfo, setRegisterInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const captchaContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load reCAPTCHA script and render widget
  useEffect(() => {
    // Load the script if not already loaded
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const renderCaptcha = () => {
      if (
        captchaContainerRef.current &&
        window.grecaptcha &&
        window.grecaptcha.render &&
        !recaptchaRef.current
      ) {
        try {
          recaptchaRef.current = window.grecaptcha.render(
            captchaContainerRef.current,
            {
              sitekey: RECAPTCHA_SITE_KEY,
              callback: (token) => setCaptchaToken(token),
              "expired-callback": () => setCaptchaToken(null),
            },
          );
        } catch (e) {
          // Widget already rendered
        }
      }
    };

    // If grecaptcha is already loaded, render immediately
    if (window.grecaptcha && window.grecaptcha.render) {
      renderCaptcha();
    } else {
      // Set up the global callback for when the script loads
      window.onRecaptchaLoad = renderCaptcha;
    }

    return () => {
      delete window.onRecaptchaLoad;
    };
  }, []);

  // React Query mutations
  const registerMutation = useRegister();
  const verifyOtpMutation = useVerifyOtp();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = name === "phoneNumber" ? formatPhone(value) : value;
    setRegisterInfo((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const resetCaptcha = useCallback(() => {
    if (window.grecaptcha && recaptchaRef.current !== null) {
      window.grecaptcha.reset(recaptchaRef.current);
      setCaptchaToken(null);
    }
  }, []);

  const createNewAccount = async () => {
    if (!EmailValidator.validate(registerInfo.email)) {
      return toast.error("Please enter a valid email address");
    }
    if (registerInfo.password !== registerInfo.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (registerInfo.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (!captchaToken) {
      return toast.error("Please complete the reCAPTCHA verification");
    }

    registerMutation.mutate(
      {
        fullName: registerInfo.fullName,
        email: registerInfo.email,
        phoneNumber: registerInfo.phoneNumber,
        password: registerInfo.password,
        recaptchaToken: captchaToken,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Verification code sent!");
          setShowOtpInput(true);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
              "Registration failed. Please try again.",
          );
          // Reset reCAPTCHA on error
          resetCaptcha();
        },
      },
    );
  };

  return (
    <div className="h-screen flex font-['Poppins',sans-serif] bg-[#0F172A] bg-[radial-gradient(circle_at_top_right,_#1E293B_0%,_#0F172A_50%,_#1E1B4B_100%)] overflow-hidden">
      {/* Split Layout Container */}
      <div className="flex w-full h-full flex-col lg:flex-row">
        {/* Left Section (Visual/Branding) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <RightSection />
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1 lg:w-1/2 flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-16 bg-gray-50 overflow-y-auto custom-scrollbar">
          <div className="max-w-md w-full mx-auto">
            {/* Logo Section */}
            <div className="flex justify-center mb-8">
              <img
                src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png"
                alt="Pacific Systems inc. Logo"
                className="h-16"
              />
            </div>

            {/* Header */}
            <header className="mb-8 font-poppins text-center">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#34495E] tracking-tight mb-3">
                Create an account
              </h1>
              <p className="text-[#505050] leading-relaxed text-sm lg:text-base">
                Join{" "}
                <span className="text-[#34495E] font-bold">
                  Pacific Systems inc.
                </span>{" "}
                and unlock your professional portal for patient management and
                clinical analytics.
              </p>
            </header>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <h3 className="text-[#505050] font-bold text-lg mb-2">
                Enter details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#505050] font-semibold text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={registerInfo.fullName}
                    onChange={handleOnChange}
                    className="border border-[#95A5A6] placeholder:text-[#95A5A6] text-sm font-normal rounded-lg outline-none py-2.5 px-4 text-[#34495E] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#505050] font-semibold text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerInfo.email}
                    onChange={handleOnChange}
                    className="border border-[#95A5A6] placeholder:text-[#95A5A6] text-sm font-normal rounded-lg outline-none py-2.5 px-4 text-[#34495E] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#505050] font-semibold text-sm">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={registerInfo.phoneNumber}
                  onChange={handleOnChange}
                  className="border border-[#95A5A6] placeholder:text-[#95A5A6] text-sm font-normal rounded-lg outline-none py-2.5 px-4 text-[#34495E] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#505050] font-semibold text-sm">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={registerInfo.password}
                      onChange={handleOnChange}
                      className="w-full border border-[#95A5A6] placeholder:text-[#95A5A6] text-sm font-normal rounded-lg outline-none py-2.5 px-4 pr-11 text-[#34495E] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#505050] font-semibold text-sm">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={registerInfo.confirmPassword}
                      onChange={handleOnChange}
                      className="w-full border border-[#95A5A6] placeholder:text-[#95A5A6] text-sm font-normal rounded-lg outline-none py-2.5 px-4 pr-11 text-[#34495E] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <div ref={captchaContainerRef}></div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={createNewAccount}
                  disabled={
                    registerMutation.isPending ||
                    !registerInfo.fullName ||
                    !registerInfo.email ||
                    !registerInfo.phoneNumber ||
                    !registerInfo.password ||
                    !registerInfo.confirmPassword ||
                    !captchaToken
                  }
                  className="w-full bg-[#34495E] text-white py-3.5 rounded-full font-bold text-base hover:bg-white hover:text-[#34495E] border border-[#34495E] transition-all duration-300 shadow-lg shadow-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {registerMutation.isPending ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg
                        className="animate-spin h-5 w-5 text-current"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create an account"
                  )}
                </button>

                <p className="text-center mt-5 text-gray-600 text-sm md:text-base">
                  Already have an account?{" "}
                  <Link
                    className="text-[#3498db] hover:text-[#2980b9] font-bold transition-colors ml-1"
                    to="/auth/login"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <OtpVerifyModal
        isOpen={showOtpInput}
        onClose={() => setShowOtpInput(false)}
        email={registerInfo.email}
        otp={otp}
        setOtp={setOtp}
        isLoading={verifyOtpMutation.isPending}
        onVerify={() => {
          verifyOtpMutation.mutate(
            { email: registerInfo.email, otp },
            {
              onSuccess: (data) => {
                toast.success(
                  data.message || "Registration successful! Welcome aboard!",
                );
                navigate("/dashboard");
              },
              onError: (error) => {
                toast.error(
                  error.response?.data?.message || "OTP verification failed.",
                );
              },
            },
          );
        }}
      />
    </div>
  );
};
