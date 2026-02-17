import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.jpg";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";

export default function ComprehensiveNursingAssessment({ onComplete, savedData, progressCurrent = 0, progressTotal = 1, onFormChange, isReadOnly = false, onNext }) {
  const [formData, setFormData] = useState({
    clientName: "",
    dob: "",
    dateCompleted: "",
    clientID: "",
    address: "",
    phone: "",
    otherID1: "",
    otherID2: "",
    rnInitiating: "",
    allergies: "",
    diagnoses: "",
    vitalSigns: "",
    height: "",
    weight: "",
    temp: "",
    pulse: "",
    resp: "",
    bp: "",
    glucose: "",
    o2Admin: "",
    diagnosis1: "",
    diagnosis2: "",
    diagnosis3: "",
    diagnosis4: "",
    diagnosis5: "",
    o2Sats: "",
    nutrition: {
      assessment: "",
      diet: [],
      recentWeightChange: "",
      supplements: "",
      eatingConditions: "",
      mealtimeMonitoring: "",
      fluidsMonitoring: [],
      mucousMembranes: "",
      skinTurgor: "",
      comments: "",
    },
    nutritionNotes: "",
    elimination: {
      bladder: [],
      bowel: [],
      management: [],
      bowelSounds: [],
      constipation: [],
      ostomies: [],
      comments: "",
    },
    sensory: {
      vision: [],
      correctivedevice: "",
      hearing: [],
      hearingAid: "",
    },
    musculoskeletal: {
      mobility: [],
      assistiveDevices: "",
      rom: [],
      motorDevelopment: [],
      adlEating: "",
      adlBathing: "",
      adlDressing: "",
    },
    skin: {
      condition: [],
      intact: "",
      specialCare: "",
    },
    neuro: {
      sensation: [],
      painLevel: "",
      painFreq: [],
      painDetails: "",
      verbalResponse: [],
      confusedOriented: "",
      aphasia: [],
      memoryDeficits: "",
      impairedDecision: "",
      sleepPattern: "",
      sleepAids: "",
      seizures: "",
    },
    neuroComments: "",
    circulation: {
      history: [],
      pulse: [],
      skinColor: [],
      skinTemp: [],
      edema: "",
      pitting: "",
      comments: "",
    },
    respiration: {
      respirations: [],
      breathSoundsRight: [],
      breathSoundsLeft: [],
      shortnessOfBreath: "",
      sobTriggers: "",
      oxygen: "",
      oxygenAmount: "",
      o2Sats: "",
      treatments: [],
    },
    dental: {
      teeth: [],
      hygiene: [],
    },
    psychosocial: {
      selfInjurious: "",
      aggressive: "",
      disruptiveFreq: "",
      behavior: [],
      answersQuestions: [],
      delusions: "",
    },
    safety: {
      environmentSafe: "",
      comments: "",
    },
    safetyNotes: "",
    medications: {
      threeWayCheck: "",
      discrepancies: "",
      storedAppropriately: "",
      caregiverInstructed: "",
      caregiverInstructedExplain: "",
      vitalSignsRequired: "",
      vitalSignsSpecify: "",
      labMonitoring: "",
      labSpecify: "",
      labsArranged: "",
      labsExplain: "",
      comments: "",
    },
    highRiskMeds: {
      taking: "",
      takingSpecify: "",
      caregiverInstructed: [],
    },
    reviewMeds: {
      seeMar: "",
    },
    medicallyFrail: {
      isFrail: "",
      explain: "",
    },
    finalComments: "",
    signatures: {
      rnSignature: "",
      rnPrint: "",
      rnDate: "",
      otherSignature: "",
      otherPrint: "",
      otherDate: "",
    },
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { key: "clientName", label: "Client's Name" },
      { key: "dob", label: "Date of Birth" },
      { key: "dateCompleted", label: "Date Completed" },
      { key: "rnInitiating", label: "RN Initiating Assessment" },
      { key: "height", label: "Height" },
      { key: "weight", label: "Weight" },
      { key: "pulse", label: "Pulse" },
      { key: "resp", label: "Respiration" },
      { key: "bp", label: "Blood Pressure" },
      { key: "allergies", label: "Allergies" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key] || String(formData[field.key]).trim() === "") {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    if (!formData.signatures.rnSignature || formData.signatures.rnSignature.trim() === "") {
      newErrors["signatures.rnSignature"] = "RN Signature is required";
    }
    if (!formData.signatures.rnPrint || formData.signatures.rnPrint.trim() === "") {
      newErrors["signatures.rnPrint"] = "RN Print Name is required";
    }
    if (!formData.signatures.rnDate || formData.signatures.rnDate.trim() === "") {
      newErrors["signatures.rnDate"] = "RN Signature Date is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorElement = document.getElementsByName(firstErrorKey)[0] || document.getElementById(firstErrorKey);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleCheckboxChange = (section, field, value) => {
    setFormData((prev) => {
      const current = prev[section][field];
      if (Array.isArray(current)) {
        if (current.includes(value)) {
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: current.filter((x) => x !== value),
            },
          };
        } else {
          return {
            ...prev,
            [section]: { ...prev[section], [field]: [...current, value] },
          };
        }
      } else {
        // For single value checkboxes acting as radios or booleans
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: prev[section][field] === value ? "" : value,
          },
        };
      }
    });
  };

  const handleSimpleCheckbox = (field, value) => {
    // handle top level if needed, currently most are nested
  };

  const logData = () => {
    console.log("ComprehensiveNursingAssessment Data:", formData);
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, [savedData]);
  // Draft save: notify parent when formData changes after user interaction
  // Draft save: notify parent when form data changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

  // Track user interaction on any input

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;
    setIsSubmitting(true);
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

  return (
    <div className="flex w-full items-start bg-white text-black font-serif">
      <div className="sticky top-0 self-start hidden md:flex flex-col items-center py-8 shrink-0 bg-white/50 backdrop-blur-sm z-10 h-screen">
        <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col items-center mt-4 mb-8">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug shadow-lg rounded-t-lg">
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
        <div className="text-center mb-5">
          <h1 className="font-bold text-sm uppercase text-blue-500">
            Comprehensive Initial Nursing Assessment
          </h1>
          <p className="text-[12px]">
            Assessment has to be done by RN on all agency clients to determine
            that they are not medically frail or medically fragile
          </p>
          <p className="mt-2 text-[11px] font-bold">
            Type of assessment: (circle one) 1. Initial &nbsp; 2. Annual &nbsp;
            3. Change of Services and condition
          </p>
          <p className="text-[10px] mt-2">
            To be completed at the time of initial assessment prior to the
            delegation of any nursing tasks or services being offered or if
            there is a significant change in the client's condition
          </p>
        </div>

        {/* Client Info */}
        <table className="w-full border border-black border-collapse mt-3">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[30%]">
                Client&apos;s Name:
                <input
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  style={getStyle("clientName")}
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1 w-[20%]">
                DOB:
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  style={getStyle("dob")}
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1 w-[20%]">
                Date Completed:
                <input
                  type="date"
                  name="dateCompleted"
                  value={formData.dateCompleted}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  style={getStyle("dateCompleted")}
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1 w-[30%]">
                <input
                  name="clientID"
                  value={formData.clientID}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  placeholder="ID #"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1">
                Client&apos;s Address:
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                Phone:
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  name="otherID1"
                  value={formData.otherID1}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  name="otherID2"
                  value={formData.otherID2}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1" colSpan={4}>
                RN Initiating Assessment:
                <input
                  name="rnInitiating"
                  value={formData.rnInitiating}
                  onChange={handleChange}
                  className="w-[60%] outline-none"
                  style={getStyle("rnInitiating")}
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Allergies / Diagnoses */}
        <table className="w-full border border-black border-collapse mt-3">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[18%]">ALLERGIES:</td>
              <td className="border border-black p-1" colSpan={5}>
                DIAGNOSES:
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1 align-top">
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full h-full outline-none resize-none"
                  style={getStyle("allergies")}
                  readOnly={isReadOnly}
                />
              </td>

              <td className="border border-black p-1 align-top w-[22%]">
                Vital Signs:
                <input
                  name="vitalSigns"
                  value={formData.vitalSigns}
                  onChange={handleChange}
                  className="w-12 border-b border-black outline-none"
                  readOnly={isReadOnly}
                />
                <br />
                Ht in inches:
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-12 border-b border-black outline-none"
                  style={getStyle("height")}
                  readOnly={isReadOnly}
                />
                <br />
                Wt in lbs:
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-12 border-b border-black outline-none"
                  style={getStyle("weight")}
                  readOnly={isReadOnly}
                />
              </td>

              <td className="border border-black p-1 align-top w-[15%]">
                T ={" "}
                <input
                  name="temp"
                  value={formData.temp}
                  onChange={handleChange}
                  className="w-12 border-b border-black outline-none"
                  readOnly={isReadOnly}
                />
                <br />P ={" "}
                <input
                  name="pulse"
                  value={formData.pulse}
                  onChange={handleChange}
                  className="w-12 border-b border-black outline-none"
                  style={getStyle("pulse")}
                  readOnly={isReadOnly}
                />
              </td>

              <td className="border border-black p-1 align-top w-[15%]">
                R ={" "}
                <input
                  name="resp"
                  value={formData.resp}
                  onChange={handleChange}
                  className="w-12 border-b border-black outline-none"
                  style={getStyle("resp")}
                  readOnly={isReadOnly}
                />
                <br />
                BP ={" "}
                <input
                  name="bp"
                  value={formData.bp}
                  onChange={handleChange}
                  className="w-16 border-b border-black outline-none"
                  style={getStyle("bp")}
                  readOnly={isReadOnly}
                />
              </td>

              <td className="border border-black p-1 align-top w-[15%]">
                Blood Glucose or n/a
                <input
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  className="w-full border-b border-black outline-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>

              <td className="border border-black p-1 align-top w-[15%]">
                O2 admin or n/a
                <input
                  name="o2Admin"
                  value={formData.o2Admin}
                  onChange={handleChange}
                  className="w-full border-b border-black outline-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1">
                <input
                  name="diagnoses"
                  value={formData.diagnoses}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="Primary Diagnosis"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  name="diagnosis1"
                  value={formData.diagnosis1}
                  onChange={handleChange}
                  className="w-full outline-none"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  name="diagnosis2"
                  value={formData.diagnosis2}
                  onChange={handleChange}
                  className="w-full outline-none"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  name="diagnosis3"
                  value={formData.diagnosis3}
                  onChange={handleChange}
                  className="w-full outline-none"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  name="diagnosis4"
                  value={formData.diagnosis4}
                  onChange={handleChange}
                  className="w-full outline-none"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                O2 Sats or n/a
                <input
                  name="o2Sats"
                  value={formData.o2Sats}
                  onChange={handleChange}
                  className="w-full border-b border-black outline-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Nutrition */}
        <table className="w-full border border-black border-collapse mt-3">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[10%]">NUTRITION</td>
              <td className="border border-black p-1 w-[65%]">
                Assessment – Explain ALL answers that are not within normal
                limits
              </td>
              <td className="border border-black p-1 w-[25%]">COMMENTS:</td>
            </tr>

            <tr>
              <td className="border border-black p-1">
                <input
                  name="nutrition_assessment"
                  value={formData.nutrition.assessment}
                  onChange={(e) =>
                    handleNestedChange(
                      "nutrition",
                      "assessment",
                      e.target.value,
                    )
                  }
                  className="w-full outline-none p-1"
                  readOnly={isReadOnly}
                />
              </td>

              <td className="border border-black p-1 leading-tight">
                Diet:
                {[
                  "Regular",
                  "ADA",
                  "Low Sodium",
                  "Mechanical Soft",
                  "Pureed",
                ].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.nutrition.diet.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("nutrition", "diet", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Recent weight changes:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.recentWeightChange === "NO"}
                    onChange={() =>
                      handleNestedChange(
                        "nutrition",
                        "recentWeightChange",
                        "NO",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  NO
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.recentWeightChange === "YES"}
                    onChange={() =>
                      handleNestedChange(
                        "nutrition",
                        "recentWeightChange",
                        "YES",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  YES
                </label>
                <br />
                Supplements:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.supplements === "NO"}
                    onChange={() =>
                      handleNestedChange("nutrition", "supplements", "NO")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  NO
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.supplements === "YES"}
                    onChange={() =>
                      handleNestedChange("nutrition", "supplements", "YES")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  YES
                </label>
                <br />
                Conditions affecting eating, chewing or swallowing:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.eatingConditions === "NO"}
                    onChange={() =>
                      handleNestedChange("nutrition", "eatingConditions", "NO")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  NO
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.eatingConditions === "YES"}
                    onChange={() =>
                      handleNestedChange("nutrition", "eatingConditions", "YES")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  YES
                </label>
                <br />
                Monitoring Required at mealtimes:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.mealtimeMonitoring === "NO"}
                    onChange={() =>
                      handleNestedChange(
                        "nutrition",
                        "mealtimeMonitoring",
                        "NO",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  NO
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.nutrition.mealtimeMonitoring === "YES"}
                    onChange={() =>
                      handleNestedChange(
                        "nutrition",
                        "mealtimeMonitoring",
                        "YES",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  YES
                </label>
                <br />
                Fluids, Monitoring:
                {["NO", "YES", "Increased", "Restricted"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.nutrition.fluidsMonitoring.includes(
                        opt,
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "nutrition",
                          "fluidsMonitoring",
                          opt,
                        )
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Mucous Membranes:
                {["Moist", "Dry"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.nutrition.mucousMembranes.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange(
                          "nutrition",
                          "mucousMembranes",
                          opt,
                        )
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Skin Turgor:
                {["Good", "Fair", "Poor"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.nutrition.skinTurgor.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("nutrition", "skinTurgor", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </td>

              <td className="border border-black p-1">
                <textarea
                  value={formData.nutrition.comments}
                  onChange={(e) =>
                    handleNestedChange("nutrition", "comments", e.target.value)
                  }
                  className="w-full h-full outline-none resize-none"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        <div className="mt-3">
          <p className="">Notes:</p>
          <textarea
            name="nutritionNotes"
            value={formData.nutritionNotes}
            onChange={handleChange}
            className="w-full border border-black h-24 p-1  outline-none resize-none"
            readOnly={isReadOnly}
          ></textarea>
        </div>

        {/* Elimination*/}

        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%] align-top">
                Elimination:
              </td>

              <td className="border border-black p-1 w-[60%] leading-tight">
                Bladder Incontinence:
                {["None", "Occasional (less than daily)", "Daily"].map(
                  (opt) => (
                    <label key={opt}>
                      <input
                        type="checkbox"
                        checked={formData.elimination.bladder.includes(opt)}
                        onChange={() =>
                          handleCheckboxChange("elimination", "bladder", opt)
                        }
                        className="mx-1"
                        disabled={isReadOnly}
                      />{" "}
                      {opt}
                    </label>
                  ),
                )}
                <br />
                Bowel Incontinence:
                {["None", "Occasional (less than daily)", "Daily"].map(
                  (opt) => (
                    <label key={opt}>
                      <input
                        type="checkbox"
                        checked={formData.elimination.bowel.includes(opt)}
                        onChange={() =>
                          handleCheckboxChange("elimination", "bowel", opt)
                        }
                        className="mx-1"
                        disabled={isReadOnly}
                      />{" "}
                      {opt}
                    </label>
                  ),
                )}
                <br />
                Incontinent Management Techniques:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.management.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "management", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.management.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "management", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <br />
                Bowel sounds present:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.bowelSounds.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "bowelSounds", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.bowelSounds.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "bowelSounds", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <br />
                Constipation:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.constipation.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "constipation", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.constipation.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "constipation", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <br />
                Ostomies:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.ostomies.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "ostomies", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.elimination.ostomies.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("elimination", "ostomies", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
              </td>

              <td className="border border-black p-1 w-[25%] align-top">
                Comments:
                <textarea
                  value={formData.elimination.comments}
                  onChange={(e) =>
                    handleNestedChange(
                      "elimination",
                      "comments",
                      e.target.value,
                    )
                  }
                  className="w-full h-full outline-none resize-none"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/*Sensory */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%]">Sensory:</td>

              <td className="border border-black p-1 w-[60%]">
                Vision:
                {["Normal", "Impaired"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.sensory.vision.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("sensory", "vision", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                &nbsp; Corrective Device:
                <input
                  value={formData.sensory.correctivedevice}
                  onChange={(e) =>
                    handleNestedChange(
                      "sensory",
                      "correctivedevice",
                      e.target.value,
                    )
                  }
                  className="border-b border-black outline-none w-40"
                  readOnly={isReadOnly}
                />
                <br />
                Hearing:
                {["Normal", "Impaired"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.sensory.hearing.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("sensory", "hearing", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                &nbsp; Hearing Aid:
                {["No", "Yes"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.sensory.hearingAid.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("sensory", "hearingAid", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </td>

              <td className="border border-black p-1 w-[25%]"></td>
            </tr>
          </tbody>
        </table>

        {/* MUSCULOSKELETAL*/}

        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%] align-top">
                Musculoskeletal:
              </td>

              <td className="border border-black p-1 w-[85%] leading-tight">
                Mobility:
                {["Normal", "Impaired"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.musculoskeletal.mobility.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("musculoskeletal", "mobility", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                &nbsp; Assistive Devices:
                {["No", "Yes"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.musculoskeletal.assistiveDevices.includes(
                        opt,
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "musculoskeletal",
                          "assistiveDevices",
                          opt,
                        )
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                ROM:
                {["Full", "Limited"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.musculoskeletal.rom.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("musculoskeletal", "rom", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Motor Development:
                {[
                  "Head control",
                  "Sits",
                  "Walks",
                  "Hemiparesis",
                  "Tremors",
                ].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.musculoskeletal.motorDevelopment.includes(
                        opt,
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "musculoskeletal",
                          "motorDevelopment",
                          opt,
                        )
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                ADL's: [S=self], [A=assist], [T=total] &nbsp; Eating:
                <input
                  value={formData.musculoskeletal.adlEating}
                  onChange={(e) =>
                    handleNestedChange(
                      "musculoskeletal",
                      "adlEating",
                      e.target.value,
                    )
                  }
                  className="border-b border-black outline-none w-12"
                  readOnly={isReadOnly}
                />
                &nbsp; Bathing:
                <input
                  value={formData.musculoskeletal.adlBathing}
                  onChange={(e) =>
                    handleNestedChange(
                      "musculoskeletal",
                      "adlBathing",
                      e.target.value,
                    )
                  }
                  className="border-b border-black outline-none w-12"
                  readOnly={isReadOnly}
                />
                &nbsp; Dressing:
                <input
                  value={formData.musculoskeletal.adlDressing}
                  onChange={(e) =>
                    handleNestedChange(
                      "musculoskeletal",
                      "adlDressing",
                      e.target.value,
                    )
                  }
                  className="border-b border-black outline-none w-12"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Skin*/}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%]">SKIN:</td>

              <td className="border border-black p-1 w-[85%] leading-tight">
                {[
                  "Normal",
                  "Pale",
                  "Red",
                  "Irritation",
                  "Abrasion",
                  "Other",
                ].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.skin.condition.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("skin", "condition", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Skin Intact:
                {["YES", "NO"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.skin.intact === opt}
                      onChange={() => handleNestedChange("skin", "intact", opt)}
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                (If no, a wound assessment MUST be completed)
                <br />
                Special Care or Monitoring:
                {["No", "Yes"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.skin.specialCare === opt}
                      onChange={() =>
                        handleNestedChange("skin", "specialCare", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/*Neuro */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%] align-top">
                Neuro
              </td>

              <td className="border border-black p-1 w-[85%] leading-tight">
                Sensation:
                {["Intact", "Diminished/Absent"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.neuro.sensation.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("neuro", "sensation", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Pain Level (0=none – 10=excruciating):
                <input
                  value={formData.neuro.painLevel}
                  onChange={(e) =>
                    handleNestedChange("neuro", "painLevel", e.target.value)
                  }
                  className="border-b border-black outline-none w-12"
                  readOnly={isReadOnly}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.painFreq.includes(
                      "Less than Daily",
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        "neuro",
                        "painFreq",
                        "Less than Daily",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Less than Daily
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.painFreq.includes("Daily")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "painFreq", "Daily")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Daily
                </label>
                <br />
                If there is pain, indicate the site, cause & treatment:
                <input
                  value={formData.neuro.painDetails}
                  onChange={(e) =>
                    handleNestedChange("neuro", "painDetails", e.target.value)
                  }
                  className="border-b border-black outline-none w-full"
                  readOnly={isReadOnly}
                />
                <br />
                Verbal Response:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.verbalResponse.includes("A/O x")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "verbalResponse", "A/O x")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  A/O x{" "}
                  <input
                    value={formData.neuro.confusedOriented}
                    onChange={(e) =>
                      handleNestedChange(
                        "neuro",
                        "confusedOriented",
                        e.target.value,
                      )
                    }
                    className="border-b border-black outline-none w-8"
                    readOnly={isReadOnly}
                  />
                </label>
                {[
                  "Confused",
                  "Inappropriate",
                  "Incomprehensible",
                  "No Response",
                ].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.neuro.verbalResponse.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("neuro", "verbalResponse", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Aphasia:
                {["None", "Expressive", "Receptive"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.neuro.aphasia.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("neuro", "aphasia", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Memory Deficits:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.memoryDeficits.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "memoryDeficits", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.memoryDeficits.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "memoryDeficits", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                &nbsp; Impaired Decision making:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.impairedDecision.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "impairedDecision", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.impairedDecision.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "impairedDecision", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <br />
                Sleep pattern:
                <input
                  value={formData.neuro.sleepPattern}
                  onChange={(e) =>
                    handleNestedChange("neuro", "sleepPattern", e.target.value)
                  }
                  className="border-b border-black outline-none w-full"
                  readOnly={isReadOnly}
                />
                <br />
                Sleep Aids:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.sleepAids.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "sleepAids", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.sleepAids.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "sleepAids", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <br />
                Seizures:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.seizures.includes("No")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "seizures", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.neuro.seizures.includes("Yes")}
                    onChange={() =>
                      handleCheckboxChange("neuro", "seizures", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Comments */}
        <div className="mt-3">
          <p className="">Comments:</p>
          <textarea
            value={formData.neuroComments}
            onChange={(e) =>
              setFormData({ ...formData, neuroComments: e.target.value })
            }
            className="w-full border border-black h-24 p-1 outline-none resize-none"
            readOnly={isReadOnly}
          ></textarea>
        </div>

        {/*Circulation */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%] align-top">
                Circulation
              </td>

              <td className="border border-black p-1 w-[60%] leading-tight">
                History of:
                {["Arrhythmia", "Hypertension", "Hypotension", "N/A"].map(
                  (opt) => (
                    <label key={opt}>
                      <input
                        type="checkbox"
                        checked={formData.circulation.history.includes(opt)}
                        onChange={() =>
                          handleCheckboxChange("circulation", "history", opt)
                        }
                        className="mx-1"
                        disabled={isReadOnly}
                      />{" "}
                      {opt}
                    </label>
                  ),
                )}
                <br />
                Pulse:
                {["Regular", "Irregular"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.circulation.pulse.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("circulation", "pulse", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                      {opt}
                  </label>
                ))}
                <br />
                Skin:
                {[
                  "Pink",
                  "Cyanotic",
                  "Pale",
                  "Mottled",
                  "Warm",
                  "Cool",
                  "Dry",
                  "Diaphoretic",
                ].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.circulation.skinColor.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("circulation", "skinColor", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Edema:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.circulation.edema === "No"}
                    onChange={() =>
                      handleNestedChange("circulation", "edema", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.circulation.edema === "Yes"}
                    onChange={() =>
                      handleNestedChange("circulation", "edema", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                &nbsp; Pitting:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.circulation.pitting === "No"}
                    onChange={() =>
                      handleNestedChange("circulation", "pitting", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.circulation.pitting === "Yes"}
                    onChange={() =>
                      handleNestedChange("circulation", "pitting", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
              </td>

              <td className="border border-black p-1 w-[25%] align-top">
                Comments:
                <textarea
                  value={formData.circulation.comments}
                  onChange={(e) =>
                    handleNestedChange(
                      "circulation",
                      "comments",
                      e.target.value,
                    )
                  }
                  className="w-full h-full outline-none p-1 resize-none"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/*Respiration */}

        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%] align-top">
                Respiration
              </td>

              <td className="border border-black p-1 w-[85%] leading-tight">
                Respirations:
                {["Regular", "Unlabored", "Irregular", "Labored"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.respiration.respirations.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("respiration", "respirations", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Breath Sounds: (Right:
                {["Clear", "Rales"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.respiration.breathSoundsRight.includes(
                        opt,
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "respiration",
                          "breathSoundsRight",
                          opt,
                        )
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}{" "}
                ) (Left:
                {["Clear", "Rales"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.respiration.breathSoundsLeft.includes(
                        opt,
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "respiration",
                          "breathSoundsLeft",
                          opt,
                        )
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}{" "}
                )<br />
                Shortness of breath:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.respiration.shortnessOfBreath === "No"}
                    onChange={() =>
                      handleNestedChange(
                        "respiration",
                        "shortnessOfBreath",
                        "No",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.respiration.shortnessOfBreath === "Yes"}
                    onChange={() =>
                      handleNestedChange(
                        "respiration",
                        "shortnessOfBreath",
                        "Yes",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                (If yes indicate triggers)
                <input
                  value={formData.respiration.sobTriggers}
                  onChange={(e) =>
                    handleNestedChange(
                      "respiration",
                      "sobTriggers",
                      e.target.value,
                    )
                  }
                  className="border-b border-black outline-none w-full"
                  readOnly={isReadOnly}
                />
                <br />
                Respiratory Treatments: Oxygen
                <label>
                  <input
                    type="checkbox"
                    checked={formData.respiration.oxygen === "No"}
                    onChange={() =>
                      handleNestedChange("respiration", "oxygen", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.respiration.oxygen === "Yes"}
                    onChange={() =>
                      handleNestedChange("respiration", "oxygen", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <br />
                If yes indicate amount and administration:
                <input
                  value={formData.respiration.oxygenAmount}
                  onChange={(e) =>
                    handleNestedChange(
                      "respiration",
                      "oxygenAmount",
                      e.target.value,
                    )
                  }
                  className="border-b border-black outline-none w-full"
                  readOnly={isReadOnly}
                />
                <br />
                O2 Sats:
                <input
                  value={formData.respiration.o2Sats}
                  onChange={(e) =>
                    handleNestedChange("respiration", "o2Sats", e.target.value)
                  }
                  className="border-b border-black outline-none w-24"
                  readOnly={isReadOnly}
                />
                <br />
                {["Aerosol", "Nebulizer", "CPAP", "BIPAP"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.respiration.treatments.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("respiration", "treatments", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/*Dental */}

        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%]">Dental</td>

              <td className="border border-black p-1 w-[85%] leading-tight">
                {[
                  "Own teeth",
                  "Dentures",
                  "Full",
                  "Partial",
                  "Upper",
                  "Lower",
                ].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.dental.teeth.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("dental", "teeth", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Dental Hygiene:
                {["Good", "Fair", "Poor"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.dental.hygiene.includes(opt)}
                      onChange={() =>
                        handleCheckboxChange("dental", "hygiene", opt)
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/*Psychosocial */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[15%] align-top">
                Psychosocial
              </td>

              <td className="border border-black p-1 w-[85%] leading-tight">
                Self-injurious Behavior:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.psychosocial.selfInjurious === "No"}
                    onChange={() =>
                      handleNestedChange("psychosocial", "selfInjurious", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.psychosocial.selfInjurious === "Yes"}
                    onChange={() =>
                      handleNestedChange("psychosocial", "selfInjurious", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <br />
                Aggressive Behavior:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.psychosocial.aggressive === "No"}
                    onChange={() =>
                      handleNestedChange("psychosocial", "aggressive", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.psychosocial.aggressive === "Yes"}
                    onChange={() =>
                      handleNestedChange("psychosocial", "aggressive", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <br />
                Frequency of disruptive behavior:
                <input
                  value={formData.psychosocial.disruptiveFreq}
                  onChange={(e) =>
                    handleNestedChange(
                      "psychosocial",
                      "disruptiveFreq",
                      e.target.value,
                    )
                  }
                  className="border-b border-black outline-none w-full"
                  readOnly={isReadOnly}
                />
                <br />
                Behavior:
                {["Calm", "Lethargic", "Angry", "Resists Care", "Other"].map(
                  (opt) => (
                    <label key={opt}>
                      <input
                        type="checkbox"
                        checked={formData.psychosocial.behavior.includes(opt)}
                        onChange={() =>
                          handleCheckboxChange("psychosocial", "behavior", opt)
                        }
                        className="mx-1"
                        disabled={isReadOnly}
                      />{" "}
                      {opt}
                    </label>
                  ),
                )}
                <br />
                Answers Questions:
                {["Readily", "Slowly", "Inappropriately"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={formData.psychosocial.answersQuestions.includes(
                        opt,
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "psychosocial",
                          "answersQuestions",
                          opt,
                        )
                      }
                      className="mx-1"
                      disabled={isReadOnly}
                    />{" "}
                    {opt}
                  </label>
                ))}
                <br />
                Delusions and/or hallucinations:
                <label>
                  <input
                    type="checkbox"
                    checked={formData.psychosocial.delusions === "No"}
                    onChange={() =>
                      handleNestedChange("psychosocial", "delusions", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.psychosocial.delusions === "Yes"}
                    onChange={() =>
                      handleNestedChange("psychosocial", "delusions", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
              </td>
            </tr>
          </tbody>
        </table>

        {/*Safety needs */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              {/* Left label */}
              <td className="border border-black p-1 w-[15%] align-top">
                Safety Needs
              </td>

              {/* Middle content */}
              <td className="border border-black p-1 w-[60%] leading-tight">
                Is the environment safe for the resident?
                <label className="ml-4">
                  <input
                    type="checkbox"
                    checked={formData.safety.environmentSafe === "Yes"}
                    onChange={() =>
                      handleNestedChange("safety", "environmentSafe", "Yes")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="checkbox"
                    checked={formData.safety.environmentSafe === "No"}
                    onChange={() =>
                      handleNestedChange("safety", "environmentSafe", "No")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <div className="mt-1">
                  (Adequate lighting, open traffic areas, non-skid rugs,
                  appropriate furniture &amp; assistive devices.)
                </div>
              </td>

              {/* Right comments */}
              <td className="border border-black p-1 w-[25%]">
                <textarea
                  value={formData.safety.comments}
                  onChange={(e) =>
                    handleNestedChange("safety", "comments", e.target.value)
                  }
                  className="w-full h-full outline-none p-1 resize-none"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        <div className="mt-3">
          <p className="">Notes:</p>
          <textarea
            name="safetyNotes"
            value={formData.safetyNotes}
            onChange={handleChange}
            className="w-full border border-black h-72 p-1 outline-none resize-none"
            readOnly={isReadOnly}
          ></textarea>
        </div>

        {/*MEDICATIONS AND TREATMENTS */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              {/* Left label */}
              <td className="border border-black p-1 w-[20%] align-top">
                Medications and Treatments
              </td>

              {/* Middle content */}
              <td className="border border-black p-1 w-[55%] leading-tight">
                Has a 3-way check (orders, medications and MAR) been conducted
                for all of the client's medications and treatments, including
                OTC and PRN&apos;s?
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.threeWayCheck === "Yes"}
                    onChange={() =>
                      handleNestedChange("medications", "threeWayCheck", "Yes")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.threeWayCheck === "No"}
                    onChange={() =>
                      handleNestedChange("medications", "threeWayCheck", "No")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <br />
                Were any discrepancies identified?
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.discrepancies === "No"}
                    onChange={() =>
                      handleNestedChange("medications", "discrepancies", "No")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.discrepancies === "Yes"}
                    onChange={() =>
                      handleNestedChange("medications", "discrepancies", "Yes")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <br />
                Are medications stored appropriately?
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.storedAppropriately === "Yes"}
                    onChange={() =>
                      handleNestedChange(
                        "medications",
                        "storedAppropriately",
                        "Yes",
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.storedAppropriately === "No"}
                    onChange={() =>
                      handleNestedChange(
                        "medications",
                        "storedAppropriately",
                        "No",
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <br />
                Has the caregiver been instructed on monitoring the
                effectiveness of drug therapy, drug reactions, side effects and
                how and when to report problems that may occur?
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.caregiverInstructed === "Yes"}
                    onChange={() =>
                      handleNestedChange(
                        "medications",
                        "caregiverInstructed",
                        "Yes",
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.caregiverInstructed === "No"}
                    onChange={() =>
                      handleNestedChange(
                        "medications",
                        "caregiverInstructed",
                        "No",
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <br />
                (If no, please explain)
                <textarea
                  value={formData.medications.caregiverInstructedExplain}
                  onChange={(e) =>
                    handleNestedChange(
                      "medications",
                      "caregiverInstructedExplain",
                      e.target.value,
                    )
                  }
                  className="w-full border border-black outline-none resize-none mt-1"
                  rows={2}
                  readOnly={isReadOnly}
                />
                Are vital signs required related to a medication or diagnosis?
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.vitalSignsRequired === "No"}
                    onChange={() =>
                      handleNestedChange(
                        "medications",
                        "vitalSignsRequired",
                        "No",
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.vitalSignsRequired === "Yes"}
                    onChange={() =>
                      handleNestedChange(
                        "medications",
                        "vitalSignsRequired",
                        "Yes",
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                (specify)
                <input
                  value={formData.medications.vitalSignsSpecify}
                  onChange={(e) =>
                    handleNestedChange(
                      "medications",
                      "vitalSignsSpecify",
                      e.target.value,
                    )
                  }
                  className="w-full border-b border-black outline-none mt-1"
                  readOnly={isReadOnly}
                />
                Is lab monitoring required related to a medication or diagnosis?
                (hypoglycemic, anticoagulant, psychotropic, seizure, etc.)
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.labMonitoring === "No"}
                    onChange={() =>
                      handleNestedChange("medications", "labMonitoring", "No")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.labMonitoring === "Yes"}
                    onChange={() =>
                      handleNestedChange("medications", "labMonitoring", "Yes")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                (specify)
                <input
                  value={formData.medications.labSpecify}
                  onChange={(e) =>
                    handleNestedChange(
                      "medications",
                      "labSpecify",
                      e.target.value,
                    )
                  }
                  className="w-full border-b border-black outline-none mt-1"
                  readOnly={isReadOnly}
                />
                Have arrangements been made to obtain these labs?
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.labsArranged === "Yes"}
                    onChange={() =>
                      handleNestedChange("medications", "labsArranged", "Yes")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.medications.labsArranged === "No"}
                    onChange={() =>
                      handleNestedChange("medications", "labsArranged", "No")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                (explain)
                <input
                  value={formData.medications.labsExplain}
                  onChange={(e) =>
                    handleNestedChange(
                      "medications",
                      "labsExplain",
                      e.target.value,
                    )
                  }
                  className="w-full border-b border-black outline-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>

              {/* Right comments */}
              <td className="border border-black p-1 w-[25%] align-top">
                Comments:
                <textarea
                  value={formData.medications.comments}
                  onChange={(e) =>
                    handleNestedChange(
                      "medications",
                      "comments",
                      e.target.value,
                    )
                  }
                  className="w-full h-full outline-none resize-none"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/*High risk Medication */}

        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[20%] align-top">
                High Risk Medications
              </td>

              <td className="border border-black p-1 w-[80%] leading-tight">
                Is the Client taking any high risk drugs?
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.highRiskMeds.taking === "No"}
                    onChange={() =>
                      handleNestedChange("highRiskMeds", "taking", "No")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.highRiskMeds.taking === "Yes"}
                    onChange={() =>
                      handleNestedChange("highRiskMeds", "taking", "Yes")
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                (specify)
                <input
                  value={formData.highRiskMeds.takingSpecify}
                  onChange={(e) =>
                    handleNestedChange(
                      "highRiskMeds",
                      "takingSpecify",
                      e.target.value,
                    )
                  }
                  className="w-full border-b border-black outline-none mt-1"
                  readOnly={isReadOnly}
                />
                <br />
                Has the caregiver received instruction on special precautions
                for all high risk medications (such as hypoglycemic,
                anticoagulants, etc.) and how and when to report problems that
                may occur?
                <br />
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.highRiskMeds.caregiverInstructed.includes(
                      "Yes",
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        "highRiskMeds",
                        "caregiverInstructed",
                        "Yes",
                      )
                    }
                    disabled={isReadOnly}
                  />{" "}
                  Yes
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.highRiskMeds.caregiverInstructed.includes(
                      "No",
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        "highRiskMeds",
                        "caregiverInstructed",
                        "No",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </label>
                <label className="ml-3 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.highRiskMeds.caregiverInstructed.includes(
                      "N/A",
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        "highRiskMeds",
                        "caregiverInstructed",
                        "N/A",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  N/A
                </label>
              </td>
            </tr>
          </tbody>
        </table>

        {/*Review of medications */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[50%]">
                Review of All Medications
              </td>
              <td className="border border-black p-1 w-[50%]">
                See Attached MAR
                <input
                  value={formData.reviewMeds.seeMar}
                  onChange={(e) =>
                    handleNestedChange("reviewMeds", "seeMar", e.target.value)
                  }
                  className="ml-2 border-b border-black outline-none w-40"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/*Medically frail or fragile   */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[60%]">
                Is Client deemed medically frail or fragile? If yes, please
                explain
              </td>
              <td className="border border-black p-1 w-[40%]">
                <textarea
                  value={formData.medicallyFrail.explain}
                  onChange={(e) =>
                    handleNestedChange(
                      "medicallyFrail",
                      "explain",
                      e.target.value,
                    )
                  }
                  className="w-full h-16 outline-none resize-none"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Final Comments */}
        <table className="w-full border border-black border-collapse mt-4 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1">
                Comments:
                <textarea
                  name="finalComments"
                  value={formData.finalComments}
                  onChange={handleChange}
                  className="w-full h-20 outline-none resize-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signature Section */}
        <table className="w-full border border-black border-collapse mt-3 text-[12px]">
          <tbody>
            <tr>
              <td className="border border-black p-1 w-[50%]">
                Agency RN&apos;s signature:
                <input
                  name="signatures.rnSignature"
                  value={formData.signatures.rnSignature}
                  onChange={(e) =>
                    handleNestedChange(
                      "signatures",
                      "rnSignature",
                      e.target.value,
                    )
                  }
                  className="w-full outline-none mt-1"
                  placeholder=""
                  style={getStyle("signatures.rnSignature")}
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1 w-[50%]">
                <input
                  value={formData.signatures.otherSignature}
                  onChange={(e) =>
                    handleNestedChange(
                      "signatures",
                      "otherSignature",
                      e.target.value,
                    )
                  }
                  className="w-full outline-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1">
                Print Name:
                <input
                  name="signatures.rnPrint"
                  value={formData.signatures.rnPrint}
                  onChange={(e) =>
                    handleNestedChange("signatures", "rnPrint", e.target.value)
                  }
                  className="w-full outline-none mt-1"
                  style={getStyle("signatures.rnPrint")}
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  value={formData.signatures.otherPrint}
                  onChange={(e) =>
                    handleNestedChange(
                      "signatures",
                      "otherPrint",
                      e.target.value,
                    )
                  }
                  className="w-full outline-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1">
                Date assessment completed:
                <input
                  type="date"
                  name="signatures.rnDate"
                  value={formData.signatures.rnDate}
                  onChange={(e) =>
                    handleNestedChange("signatures", "rnDate", e.target.value)
                  }
                  className="w-full outline-none mt-1"
                  style={getStyle("signatures.rnDate")}
                  readOnly={isReadOnly}
                />
              </td>
              <td className="border border-black p-1">
                <input
                  type="date"
                  value={formData.signatures.otherDate}
                  onChange={(e) =>
                    handleNestedChange(
                      "signatures",
                      "otherDate",
                      e.target.value,
                    )
                  }
                  className="w-full outline-none mt-1"
                  readOnly={isReadOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-3">
          <p> </p>
        </div>
        </div>

        {/* Action Buttons */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] px-2 md:px-8 pb-8 bg-white rounded-b-lg shadow-lg flex justify-between items-center">
          <button
            type="button"
            className="px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide transform transition-transform"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          <button
            type="button"
            className="px-8 py-3 btn-premium-red text-white font-sans font-bold tracking-wide transform transition-transform"
            onClick={() => alert("Exiting application...")}
          >
            Exit Application
          </button>
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
}
