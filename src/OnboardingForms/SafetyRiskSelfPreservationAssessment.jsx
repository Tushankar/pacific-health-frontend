import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";

const SafetyRiskSelfPreservationAssessment = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    q1: { yes: false, no: false, type: "", lastSeizureDate: "" },
    q2: {
      bulimia: false,
      anorexia: false,
      gorging: false,
      rapidEating: false,
      choking: false,
      excessiveWater: false,
      difficultySwallowing: false,
      takesFood: false,
      other: "",
    },
    q3: { yes: false, no: false, whenWhere: "" },
    riskFactorsANE: Array(11).fill({ yes: false, explain: "" }),
    q4: { yes: false, no: false, explain: "" },
    q5: { yes: false, no: false, explain: "" },
    q6: { yes: false, no: false, explain: "" },
    q7: { yes: false, no: false, explain: "" },
    q8: {
      yes: false,
      no: false,
      incontinence: false,
      contractures: false,
      limitedMobility: false,
      other: "",
      explain: "",
    },
    q9: { yes: false, no: false },
    q10: { yes: false, no: false },
    q11: {
      trespassing: false,
      misdemeanor: false,
      felony: false,
      disturbance: false,
      other: false,
      explain: "",
    },
    q12: { yes: false, no: false },
    q13: { yes: false, no: false, explain: "" },
    q14: { yes: false, no: false, explain: "" },
    q15: { yes: false, no: false, explain: "" },
    medicalRiskFactors: {
      headaches: false,
      ulcers: false,
      arthritis: false,
      pain: false,
      allergies: "",
      hypertension: false,
      heartDisease: false,
      bleeding: false,
      medSideEffects: false,
      other: false,
    },
    doctorsVisits: "",
    q16: {
      evacuatesIndependently: false,
      needsSupport: false,
      refuses: false,
      other: "",
    },
    additionalComments: "",
    signatures: {
      homeRep: "",
      homeRepDate: "",
      guardian: "",
      guardianDate: "",
    },
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { key: "name", label: "Name" },
      { key: "date", label: "Date" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key] || String(formData[field.key]).trim() === "") {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    if (formData.q1.yes) {
      if (!formData.q1.type || formData.q1.type.trim() === "") {
        newErrors["q1.type"] = "Seizure type is required when Yes is selected";
      }
      if (
        !formData.q1.lastSeizureDate ||
        formData.q1.lastSeizureDate.trim() === ""
      ) {
        newErrors["q1.lastSeizureDate"] =
          "Date of last seizure is required when Yes is selected";
      }
    }

    if (
      !formData.signatures.homeRep ||
      formData.signatures.homeRep.trim() === ""
    ) {
      newErrors["signatures.homeRep"] =
        "Home Representative Signature is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorElement = document.getElementsByName(firstErrorKey)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
      return false;
    }
    return true;
  };

  const getStyle = (fieldName) => {
    return errors[fieldName] ? { border: "1px solid red" } : {};
  };

  const handleChange = (field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleRiskFactorANEChange = (index, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newRisks = [...prev.riskFactorsANE];
      newRisks[index] = { ...newRisks[index], [field]: value };
      return { ...prev, riskFactorsANE: newRisks };
    });
  };

  // Helper for Yes/No checkboxes to ensure mutual exclusivity
  const handleYesNoChange = (parent, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [parent]: (() => {
        const nextParent = {
          ...prev[parent],
          yes:
            field === "yes"
              ? value
              : field === "no" && value
                ? false
                : prev[parent].yes,
          no:
            field === "no"
              ? value
              : field === "yes" && value
                ? false
                : prev[parent].no,
        };

        if (parent === "q1" && !nextParent.yes) {
          nextParent.type = "";
          nextParent.lastSeizureDate = "";
        }

        return nextParent;
      })(),
    }));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      if (form) {
        const index = Array.prototype.indexOf.call(form, e.target);
        if (form.elements[index + 1]) form.elements[index + 1].focus();
      }
    }
  };

  const logData = () => {
    console.log("SafetyRiskSelfPreservationAssessment Data:", formData);
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({ ...prev, ...savedData }));
    }
  }, [savedData]);

  // Draft save: notify parent when form data changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    setIsSubmitting(true);
    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      if (onComplete) {
        await onComplete(formData);
      } else {
        console.log("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const aneRiskLabels = [
    "Above average need for personal space",
    "Has no known family",
    "Aggressive behavior toward others",
    "Aggressive behavior toward self",
    "Property destruction",
    "Unable to defend self against others",
    "Non-verbal",
    "Overly cooperative with strangers",
    "Solicitous of strangers/others",
    "Physical exposure of genitalia",
    "Other",
  ];

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
        currentStep={progressCurrent}
        totalSteps={progressTotal || 1}
      />

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col items-center mt-4 mb-8"
      >
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 text-[9px] md:text-base leading-snug bg-white shadow-lg rounded-t-lg">
          {/* Log Data Button */}
          <div className="mt-4 flex justify-end no-print">
            <button
              type="button"
              onClick={logData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Log Data
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-bold text-sm md:text-lg uppercase">Annual</h1>
            <h2 className="font-bold text-sm md:text-lg uppercase tracking-wide">
              Safety Risk/Self Preservation Assessment
            </h2>
          </div>

          <p className="leading-relaxed mb-6 text-center text-[9px] md:text-[12px]">
            The initial information gathering phase of enrollment with Pacific
            Health Systems includes assessing for safety/ risk factors, and
            other incidents or historical factors which are of special concern
            or require extra resources. The following list of factors is to be
            addressed with the person and/or person(s) who knows him/her best.
            In gathering the information, please explain all findings with
            examples, and give dates of the last occurrence.
          </p>

          {/* Name / Date */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 flex items-center gap-2">
              <span className="font-bold underline">Person:</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onKeyDown={handleEnter}
                className="flex-1 border-b border-black outline-none px-1"
                style={getStyle("name")}
                readOnly={isReadOnly}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold underline">Date:</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                onKeyDown={handleEnter}
                className="border-b border-black outline-none px-1"
                style={getStyle("date")}
                readOnly={isReadOnly}
              />
            </div>
          </div>
          {/* Main Table */}
          {/* Main Container replacing Table */}
          <div className="w-full border border-black text-[10px] md:text-sm">
            {/* 1. Seizures */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <div className="font-bold mr-2 w-full md:w-auto">
                  1. Seizures
                </div>
                <div className="flex gap-4 mb-2 md:mb-0">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q1.yes}
                      onChange={(e) =>
                        handleYesNoChange("q1", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q1.no}
                      onChange={(e) =>
                        handleYesNoChange("q1", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="flex-1 flex flex-col md:flex-row gap-2 md:ml-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="whitespace-nowrap">Type:</span>
                    <input
                      className="w-full border-b border-black outline-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.q1.type}
                      onChange={(e) =>
                        handleNestedChange("q1", "type", e.target.value)
                      }
                      style={getStyle("q1.type")}
                      disabled={isReadOnly || !formData.q1.yes}
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="whitespace-nowrap">
                      Date of last seizure:
                    </span>
                    <input
                      type="date"
                      className="w-full border-b border-black outline-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.q1.lastSeizureDate}
                      onChange={(e) =>
                        handleNestedChange(
                          "q1",
                          "lastSeizureDate",
                          e.target.value,
                        )
                      }
                      style={getStyle("q1.lastSeizureDate")}
                      disabled={isReadOnly || !formData.q1.yes}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Eating concerns */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col gap-2">
                <div className="font-bold">2. Eating concerns:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-0 md:ml-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.bulimia}
                      onChange={(e) =>
                        handleNestedChange("q2", "bulimia", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Bulimia
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.anorexia}
                      onChange={(e) =>
                        handleNestedChange("q2", "anorexia", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Anorexia
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.gorging}
                      onChange={(e) =>
                        handleNestedChange("q2", "gorging", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Gorging
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.rapidEating}
                      onChange={(e) =>
                        handleNestedChange(
                          "q2",
                          "rapidEating",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Rapid Eating
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.choking}
                      onChange={(e) =>
                        handleNestedChange("q2", "choking", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Choking
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.excessiveWater}
                      onChange={(e) =>
                        handleNestedChange(
                          "q2",
                          "excessiveWater",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Drinks excessive water
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.difficultySwallowing}
                      onChange={(e) =>
                        handleNestedChange(
                          "q2",
                          "difficultySwallowing",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Difficulty swallowing
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q2.takesFood}
                      onChange={(e) =>
                        handleNestedChange("q2", "takesFood", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Takes food from others
                  </label>
                </div>
                <div className="mt-2 ml-0 md:ml-4">
                  Other, please explain:
                  <input
                    className="w-full border-b border-black outline-none bg-transparent"
                    value={formData.q2.other}
                    onChange={(e) =>
                      handleNestedChange("q2", "other", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* 3. Abuse / Neglect */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">3.</span>
                  Previous confirmed incidents of Abuse/Neglect/Exploitation
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q3.yes}
                      onChange={(e) =>
                        handleYesNoChange("q3", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q3.no}
                      onChange={(e) =>
                        handleYesNoChange("q3", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                When and where?
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q3.whenWhere}
                  onChange={(e) =>
                    handleNestedChange("q3", "whenWhere", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* Risk factors header */}
            {/* Risk factors header */}
            <div className="border-b border-black p-2 bg-gray-100 font-bold">
              Risk factors for A/N/E
            </div>

            {aneRiskLabels.map((label, idx) => (
              <div key={idx} className="border-b border-black p-2">
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <div className="flex-1 md:w-1/2">{label}</div>
                  <div className="flex items-center gap-4 md:w-1/4">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.riskFactorsANE[idx].yes}
                        onChange={(e) =>
                          handleRiskFactorANEChange(
                            idx,
                            "yes",
                            e.target.checked,
                          )
                        }
                        disabled={isReadOnly}
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="flex-1 md:w-1/4">
                    <div className="flex items-center gap-2">
                      <span>Explain:</span>
                      <input
                        className="w-full border-b border-black outline-none bg-transparent"
                        value={formData.riskFactorsANE[idx].explain}
                        onChange={(e) =>
                          handleRiskFactorANEChange(
                            idx,
                            "explain",
                            e.target.value,
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Falls */}
          <div className="w-full border border-black border-t-0 text-[10px] md:text-sm">
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">4.</span>
                  Previous or current incident of falls?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q4.yes}
                      onChange={(e) =>
                        handleYesNoChange("q4", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q4.no}
                      onChange={(e) =>
                        handleYesNoChange("q4", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                If yes, please explain:
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q4.explain}
                  onChange={(e) =>
                    handleNestedChange("q4", "explain", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="w-full border border-black border-t-0 text-[10px] md:text-sm">
            {/* 5 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">5.</span>
                  Previous episodes of elopement, missing, or running away?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q5.yes}
                      onChange={(e) =>
                        handleYesNoChange("q5", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q5.no}
                      onChange={(e) =>
                        handleYesNoChange("q5", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                If yes, please explain:
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q5.explain}
                  onChange={(e) =>
                    handleNestedChange("q5", "explain", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* 6 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">6.</span>
                  Has impulsive, explosive, or unpredictable behavior?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q6.yes}
                      onChange={(e) =>
                        handleYesNoChange("q6", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q6.no}
                      onChange={(e) =>
                        handleYesNoChange("q6", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                If yes, please explain:
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q6.explain}
                  onChange={(e) =>
                    handleNestedChange("q6", "explain", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* 7 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">7.</span>
                  Previous episodes of setting fire, arson attempts, use of
                  matches?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q7.yes}
                      onChange={(e) =>
                        handleYesNoChange("q7", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q7.no}
                      onChange={(e) =>
                        handleYesNoChange("q7", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                If yes, please explain:
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q7.explain}
                  onChange={(e) =>
                    handleNestedChange("q7", "explain", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* 8 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">8.</span>
                  Previous incident of skin breakdown?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q8.yes}
                      onChange={(e) =>
                        handleYesNoChange("q8", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q8.no}
                      onChange={(e) =>
                        handleYesNoChange("q8", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>

              <div className="mt-2">
                <div className="font-bold mb-1">
                  Risk factors for skin breakdown:
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q8.incontinence}
                      onChange={(e) =>
                        handleNestedChange(
                          "q8",
                          "incontinence",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Incontinence
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q8.contractures}
                      onChange={(e) =>
                        handleNestedChange(
                          "q8",
                          "contractures",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Contractures
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q8.limitedMobility}
                      onChange={(e) =>
                        handleNestedChange(
                          "q8",
                          "limitedMobility",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Limited ability to move self
                  </label>
                </div>
                <div className="mt-2">
                  Other:
                  <input
                    className="w-full border-b border-black outline-none bg-transparent"
                    value={formData.q8.other}
                    onChange={(e) =>
                      handleNestedChange("q8", "other", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="mt-2">
                  Please explain:
                  <input
                    className="w-full border-b border-black outline-none bg-transparent"
                    value={formData.q8.explain}
                    onChange={(e) =>
                      handleNestedChange("q8", "explain", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* 9 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <div className="flex-1">
                  <span className="font-bold mr-1">9.</span>
                  Previous or current weight gain/loss concerns?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q9.yes}
                      onChange={(e) =>
                        handleYesNoChange("q9", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q9.no}
                      onChange={(e) =>
                        handleYesNoChange("q9", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* 10 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <div className="flex-1">
                  <span className="font-bold mr-1">10.</span>
                  Previous or current concerns about stealing or failure to pay
                  for items?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q10.yes}
                      onChange={(e) =>
                        handleYesNoChange("q10", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q10.no}
                      onChange={(e) =>
                        handleYesNoChange("q10", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* 11 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-bold mr-1">11.</span>
                  History of convictions for illegal activity?
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q11.trespassing}
                      onChange={(e) =>
                        handleNestedChange(
                          "q11",
                          "trespassing",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Trespassing
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q11.misdemeanor}
                      onChange={(e) =>
                        handleNestedChange(
                          "q11",
                          "misdemeanor",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Misdemeanor
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q11.felony}
                      onChange={(e) =>
                        handleNestedChange("q11", "felony", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Felony
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q11.disturbance}
                      onChange={(e) =>
                        handleNestedChange(
                          "q11",
                          "disturbance",
                          e.target.checked,
                        )
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Disturbance
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q11.other}
                      onChange={(e) =>
                        handleNestedChange("q11", "other", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Other
                  </label>
                </div>
                <div>
                  If yes, please explain:
                  <input
                    className="w-full border-b border-black outline-none bg-transparent"
                    value={formData.q11.explain}
                    onChange={(e) =>
                      handleNestedChange("q11", "explain", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* 12 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <div className="flex-1">
                  <span className="font-bold mr-1">12.</span>
                  Previous or current incidents of imaginative fabrication,
                  exaggeration, or falsification of information?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q12.yes}
                      onChange={(e) =>
                        handleYesNoChange("q12", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q12.no}
                      onChange={(e) =>
                        handleYesNoChange("q12", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* 13 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">13.</span>
                  Previous incidents of suicide threats or attempts?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q13.yes}
                      onChange={(e) =>
                        handleYesNoChange("q13", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q13.no}
                      onChange={(e) =>
                        handleYesNoChange("q13", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                If yes, please explain:
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q13.explain}
                  onChange={(e) =>
                    handleNestedChange("q13", "explain", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* 14 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">14.</span>
                  Previous incidents of homicide threats or attempts?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q14.yes}
                      onChange={(e) =>
                        handleYesNoChange("q14", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q14.no}
                      onChange={(e) =>
                        handleYesNoChange("q14", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                If yes, please explain:
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q14.explain}
                  onChange={(e) =>
                    handleNestedChange("q14", "explain", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* 15 */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-2 md:items-center mb-2">
                <div className="flex-1">
                  <span className="font-bold mr-1">15.</span>
                  Previous or current medical conditions of concern?
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q15.yes}
                      onChange={(e) =>
                        handleYesNoChange("q15", "yes", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.q15.no}
                      onChange={(e) =>
                        handleYesNoChange("q15", "no", e.target.checked)
                      }
                      disabled={isReadOnly}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div>
                Medical Risk Factors (Please explain below):
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.q15.explain}
                  onChange={(e) =>
                    handleNestedChange("q15", "explain", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.headaches}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "headaches",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Headaches
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.ulcers}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "ulcers",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Ulcers
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.arthritis}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "arthritis",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Arthritis
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.pain}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "pain",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Pain
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.hypertension}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "hypertension",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Hypertension
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.heartDisease}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "heartDisease",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Heart disease
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.bleeding}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "bleeding",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Bleeding
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.medSideEffects}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "medSideEffects",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Medication side effects
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalRiskFactors.other}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalRiskFactors",
                        "other",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Other
                </label>
              </div>
              <div className="mt-2">
                Allergies:
                <input
                  className="w-full border-b border-black outline-none bg-transparent"
                  value={formData.medicalRiskFactors.allergies}
                  onChange={(e) =>
                    handleNestedChange(
                      "medicalRiskFactors",
                      "allergies",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
              </div>

              {/* Empty rows for writing */}
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-gray-300 h-6 mt-1"
                ></div>
              ))}

              <div className="mt-2">
                Concerns regarding doctors’ visits?
                <input
                  className="w-full border-b border-black outline-none mt-1 bg-transparent"
                  value={formData.doctorsVisits}
                  onChange={(e) =>
                    handleChange("doctorsVisits", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* 16 */}
            <div className="border-b border-black p-2">
              <div className="font-bold mb-2">
                <span className="mr-1">16.</span>
                Concerns regarding evacuation during fire drills?
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.q16.evacuatesIndependently}
                    onChange={(e) =>
                      handleNestedChange(
                        "q16",
                        "evacuatesIndependently",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Evacuates independently
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.q16.needsSupport}
                    onChange={(e) =>
                      handleNestedChange(
                        "q16",
                        "needsSupport",
                        e.target.checked,
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Needs support
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.q16.refuses}
                    onChange={(e) =>
                      handleNestedChange("q16", "refuses", e.target.checked)
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Refuses to evacuate
                </label>
              </div>
              <div className="mt-2">
                Other, please explain:
                <input
                  className="w-full border-b border-black outline-none mt-1 bg-transparent"
                  value={formData.q16.other}
                  onChange={(e) =>
                    handleNestedChange("q16", "other", e.target.value)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* Additional comments */}
            <div className="border-b border-black p-2">
              <div className="font-bold mb-2">
                Additional comments or concerns
              </div>
              <textarea
                className="w-full h-24 outline-none resize-none bg-transparent"
                value={formData.additionalComments}
                onChange={(e) =>
                  handleChange("additionalComments", e.target.value)
                }
                readOnly={isReadOnly}
              ></textarea>
            </div>

            {/* Signature – Home Rep */}
            <div className="border-b border-black p-2">
              <div className="flex flex-col md:flex-row gap-4 align-bottom">
                <div className="flex-1">
                  Signature/title of person completing this form (Home
                  Representative)
                  <input
                    name="signatures.homeRep"
                    className="w-full border-b border-black outline-none mt-2 bg-transparent"
                    value={formData.signatures.homeRep}
                    onChange={(e) =>
                      handleNestedChange(
                        "signatures",
                        "homeRep",
                        e.target.value,
                      )
                    }
                    onKeyDown={handleEnter}
                    style={getStyle("signatures.homeRep")}
                    readOnly={isReadOnly}
                  />
                </div>
                <div>
                  Date
                  <input
                    type="date"
                    className="w-full border-b border-black outline-none mt-2 bg-transparent"
                    value={formData.signatures.homeRepDate}
                    onChange={(e) =>
                      handleNestedChange(
                        "signatures",
                        "homeRepDate",
                        e.target.value,
                      )
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* Signature – Family/Guardian */}
            <div className="p-2">
              <div className="flex flex-col md:flex-row gap-4 align-bottom">
                <div className="flex-1">
                  Signature/title of person completing this form
                  (Individual/Family/Guardian)
                  <input
                    className="w-full border-b border-black outline-none mt-2 bg-transparent"
                    value={formData.signatures.guardian}
                    onChange={(e) =>
                      handleNestedChange(
                        "signatures",
                        "guardian",
                        e.target.value,
                      )
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
                <div>
                  Date
                  <input
                    type="date"
                    className="w-full border-b border-black outline-none mt-2 bg-transparent"
                    value={formData.signatures.guardianDate}
                    onChange={(e) =>
                      handleNestedChange(
                        "signatures",
                        "guardianDate",
                        e.target.value,
                      )
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] px-2 md:px-8 pb-8 bg-white rounded-b-lg shadow-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 btn-premium text-white font-sans font-bold tracking-wide transform transition-transform"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 btn-premium-red text-white font-sans font-bold tracking-wide transform transition-transform"
              onClick={() => {
                window.location.href = "/my-application";
              }}
            >
              Exit Application
            </button>
          </div>
          <SaveNextButton
            isSubmitting={isSubmitting}
            type="submit"
            isReadOnly={isReadOnly}
            onNext={onNext}
          />
        </div>
      </form>
    </div>
  );
};

export default SafetyRiskSelfPreservationAssessment;
