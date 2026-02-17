import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  logoutUser,
} from "../api/auth.api";

/**
 * Hook: Register a new user
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

/**
 * Hook: Verify email OTP
 */
export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

/**
 * Hook: Resend verification OTP
 */
export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
  });
};

/**
 * Hook: Login user
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

/**
 * Hook: Send forgot password OTP
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

/**
 * Hook: Reset password with OTP
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

/**
 * Hook: Get current logged-in user (query)
 */
export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook: Logout user
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
    },
  });
};
