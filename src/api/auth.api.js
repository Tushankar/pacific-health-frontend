import axiosInstance from "./axiosInstance";

/**
 * Register a new user
 */
export const registerUser = async (data) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

/**
 * Verify email OTP after registration
 */
export const verifyOtp = async (data) => {
  const response = await axiosInstance.post("/auth/verify-otp", data);
  return response.data;
};

/**
 * Resend verification OTP
 */
export const resendOtp = async (data) => {
  const response = await axiosInstance.post("/auth/resend-otp", data);
  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

/**
 * Send forgot password OTP
 */
export const forgotPassword = async (data) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (data) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

/**
 * Get current logged-in user
 */
export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

/**
 * Verify 2FA OTP during login
 */
export const verifyLoginOtp = async (data) => {
  const response = await axiosInstance.post("/auth/verify-login-otp", data);
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
