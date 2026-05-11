import { useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveDraftData } from "../api/enrollment.api";
import { toast } from "sonner";

/**
 * useDraftSave — Auto-saves form drafts on navigation/unmount
 *
 * @param {Object} options
 * @param {string} options.enrollmentId - Active enrollment _id
 * @param {number} options.formId - Current form ID
 * @param {string} options.formName - Display name for toast messages
 * @param {Object} options.draftData - Existing draft from backend (to load on mount)
 * @param {Function} options.onDraftLoaded - Called with draftData when a previous draft is loaded
 * @param {Function} options.getFormData - Returns the current form data snapshot (called on save)
 */
const useDraftSave = ({
  enrollmentId,
  formId,
  formName = "this form",
  draftData,
  onDraftLoaded,
  getFormData,
}) => {
  const isDirtyRef = useRef(false);
  const isSubmittedRef = useRef(false);
  const queryClient = useQueryClient();
  const getFormDataRef = useRef(getFormData);

  // Keep getFormData ref updated
  useEffect(() => {
    getFormDataRef.current = getFormData;
  }, [getFormData]);

  // Draft save mutation
  const draftMutation = useMutation({
    mutationFn: (data) => saveDraftData(enrollmentId, formId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
      if (enrollmentId) {
        queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] });
      }
    },
  });

  // Load existing draft on mount
  useEffect(() => {
    if (draftData && onDraftLoaded) {
      onDraftLoaded(draftData);
      toast.info("📋 Previous draft loaded", {
        description: `Your unsaved progress for "${formName}" has been restored.`,
        duration: 3000,
      });
    }
  }, []); // Only on mount

  // Mark form as dirty (user has typed something)
  const markDirty = useCallback(() => {
    isDirtyRef.current = true;
  }, []);

  // Mark form as submitted (skip draft save)
  const markSubmitted = useCallback(() => {
    isSubmittedRef.current = true;
    isDirtyRef.current = false;
  }, []);

  // Save draft function
  const saveDraft = useCallback(async () => {
    if (!isDirtyRef.current || isSubmittedRef.current) return;
    if (!enrollmentId || !formId) return;

    try {
      const currentData = getFormDataRef.current?.();
      if (!currentData) return;

      await draftMutation.mutateAsync(currentData);
      toast.success("💾 Draft saved", {
        description: `Your progress on "${formName}" has been saved.`,
        duration: 3000,
      });
      isDirtyRef.current = false;
    } catch (err) {
      console.error("Draft save failed:", err);
    }
  }, [enrollmentId, formId, formName]);

  // Auto-save on unmount (navigation away)
  useEffect(() => {
    return () => {
      if (
        isDirtyRef.current &&
        !isSubmittedRef.current &&
        enrollmentId &&
        formId
      ) {
        const currentData = getFormDataRef.current?.();
        if (currentData) {
          // Fire-and-forget since component is unmounting
          saveDraftData(enrollmentId, formId, currentData)
            .then(() => {
              queryClient.invalidateQueries({ queryKey: ["myEnrollment"] });
              queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] });
            })
            .catch((err) => {
              console.error("Draft auto-save failed:", err);
            });
          toast.success("💾 Draft saved", {
            description: `Your progress on "${formName}" has been saved.`,
            duration: 3000,
          });
        }
      }
    };
  }, [enrollmentId, formId, formName]);

  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        isDirtyRef.current &&
        !isSubmittedRef.current &&
        enrollmentId &&
        formId
      ) {
        const currentData = getFormDataRef.current?.();
        if (currentData) {
          // Use sendBeacon for reliable save on page close
          const url = `${import.meta.env.VITE_API_URL || "https://pacific.kyptronix.us/api"}/enrollment/${enrollmentId}/form/${formId}/draft`;
          const token = localStorage.getItem("token");
          const blob = new Blob([JSON.stringify({ draftData: currentData })], {
            type: "application/json",
          });

          if (navigator.sendBeacon) {
            // sendBeacon doesn't support custom headers, use fetch with keepalive
            fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ draftData: currentData }),
              keepalive: true,
            }).catch(() => {});
          }
        }
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enrollmentId, formId]);

  return {
    markDirty,
    markSubmitted,
    saveDraft,
    isDirty: isDirtyRef.current,
  };
};

export default useDraftSave;
