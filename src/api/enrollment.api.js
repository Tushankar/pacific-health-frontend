import axiosInstance from "./axiosInstance";

/**
 * Get current user's enrollment
 */
export const getMyEnrollment = async () => {
  const response = await axiosInstance.get("/enrollment/my");
  return response.data;
};

/**
 * Get all enrollments for current user
 */
export const getMyEnrollments = async () => {
  const response = await axiosInstance.get("/enrollment/my/all");
  return response.data;
};

/**
 * Get specific enrollment by ID for current user
 */
export const getEnrollmentById = async (enrollmentId) => {
  const response = await axiosInstance.get(`/enrollment/my/${enrollmentId}`);
  return response.data;
};

/**
 * Start a new enrollment (select program)
 */
export const createEnrollment = async (program) => {
  const response = await axiosInstance.post("/enrollment", { program });
  return response.data;
};

/**
 * Delete/Reset current active pending enrollment
 */
export const deleteMyActiveEnrollment = async () => {
  const response = await axiosInstance.delete("/enrollment/my/active");
  return response.data;
};

/**
 * Update form status within an enrollment
 */
export const updateFormStatus = async (enrollmentId, formId, status, formData = null) => {
  const body = { status };
  if (formData) body.formData = formData;
  const response = await axiosInstance.put(`/enrollment/${enrollmentId}/form/${formId}`, body);
  return response.data;
};

/**
 * Submit enrollment for review
 */
export const submitEnrollment = async (enrollmentId) => {
  const response = await axiosInstance.put(`/enrollment/${enrollmentId}/submit`);
  return response.data;
};

/**
 * Save draft data for a form (auto-save on navigation)
 */
export const saveDraftData = async (enrollmentId, formId, draftData) => {
  const response = await axiosInstance.put(`/enrollment/${enrollmentId}/form/${formId}/draft`, { draftData });
  return response.data;
};

/**
 * Upload a file for a form
 */
export const uploadFormFile = async (enrollmentId, formId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await axiosInstance.post(`/enrollment/${enrollmentId}/form/${formId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Admin endpoints
export const getAllEnrollments = async (params) => {
  const response = await axiosInstance.get("/enrollment/admin/all", { params });
  return response.data;
};

export const getEnrollmentDetail = async (enrollmentId) => {
  const response = await axiosInstance.get(`/enrollment/admin/${enrollmentId}`);
  return response.data;
};

export const reviewEnrollment = async (enrollmentId, data) => {
  const response = await axiosInstance.put(`/enrollment/admin/${enrollmentId}/review`, data);
  return response.data;
};

export const reviewForm = async (enrollmentId, formId, data) => {
  const response = await axiosInstance.put(`/enrollment/admin/${enrollmentId}/form/${formId}/review`, data);
  return response.data;
};
