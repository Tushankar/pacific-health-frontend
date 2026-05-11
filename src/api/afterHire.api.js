import axiosInstance from "./axiosInstance";

/**
 * Fetch After Hire Onboarding Configuration (video & Q&As)
 */
export const getAfterHireConfig = async () => {
  const response = await axiosInstance.get("/after-hire");
  return response.data;
};

/**
 * Update After Hire Onboarding Configuration (Admin only)
 * @param {Object} data - Contains { videoUrl, questions }
 */
export const updateAfterHireConfig = async (data) => {
  const response = await axiosInstance.put("/after-hire", data);
  return response.data;
};
