import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.jpg";
import bodyDiagram from "../assets/body_diagram.png";

const HomeSupervisoryVisit = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    clientInfo: {
      name: "",
      dob: "",
      date: "",
      address: "",
      phone: "",
      diagnosis: "",
      allergies: "",
      allergiesDate: "",
    },
    services: [],
    assessment: {
      generalCondition: "",
      progressReview: "",
      problems: "",
    },
    satisfaction: {
      clientSatisfied: "",
      appropriateness: "",
      clientMfMc: "",
    },
    vitals: {
      bp: "",
      rr: "",
      temp: "",
      hr: "",
      bs: "",
      height: "",
      weight: "",
      bmi: "",
      other1: "",
      other2: "",
    },
    assessmentGrid: {
      dietNutrition: { appetite: "", notes: "" },
      respiratory: { wnl: false, breathSounds: "", o2Therapy: "", notes: "" },
      abdomen: { lastBm: "", bowelSounds: "", notes: "" },
      cardiovascular: { chestPain: "", heartRate: "", notes: "" },
      skin: { intact: "", notes: "" },
      capRefill: "",
      edema: "",
      neuro: {
        painSensation: "",
        loc: [],
        orientexX: "",
        communication: "",
        seizures: "",
        notes: "",
      },
      behavior: { types: [], sleepPatterns: "", notes: "" },
      incontinent: "",
      sensory: { vision: "", hearing: "", dental: "" },
      mobility: {
        ambulatory: false,
        gait: "",
        assistiveDevices: "",
        notes: "",
      },
    },
    visitNotes: "",
    assessor: { name: "", date: "" },
    skinIntegrity: {
      individualName: "",
      date: "",
      staffName: "",
      timeShift: "",
      skinIntact: "",
      skinNotIntact: "",
      descriptions: [],
      otherDescription: "",
      colors: [],
      sizes: [],
      otherSize: "",
      assistance: {
        ambulation: { yes: "", no: "" },
        transfer: { yes: "", no: "" },
        toileting: { yes: "", no: "" },
      },
      independent: "",
      continence: "",
      dependent: "",
      incontinence: "",
      comments: "",
    },
    medication: {
      medications: Array(15).fill({
        start: "",
        stop: "",
        name: "",
        dose: "",
        freq: "",
        route: "",
        new: false,
        change: false,
      }),
      rnSignature: "",
      date: "",
    },
    clientSurvey: {
      ratings: Array(12).fill(""),
      comments: "",
    },
  });

  const handleChange = (section, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleNestedChange = (section, subSection, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: { ...prev[section][subSection], [field]: value },
      },
    }));
  };

  const handleServiceChange = (service) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleSkinAssistanceChange = (subSection, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      skinIntegrity: {
        ...prev.skinIntegrity,
        assistance: {
          ...prev.skinIntegrity.assistance,
          [subSection]: {
            ...prev.skinIntegrity.assistance[subSection],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const medications = [...prev.medication.medications];
      medications[index] = { ...medications[index], [field]: value };
      return {
        ...prev,
        medication: { ...prev.medication, medications },
      };
    });
  };

  const handleSurveyRatingChange = (index, rating) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const ratings = [...prev.clientSurvey.ratings];
      ratings[index] = rating;
      return {
        ...prev,
        clientSurvey: { ...prev.clientSurvey, ratings },
      };
    });
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
    console.log("HomeSupervisoryVisit Data:", formData);
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
    console.log("Submitting HomeSupervisoryVisit form...", formData);
    try {
      if (onComplete) {
        await onComplete(formData);
        console.log(
          "HomeSupervisoryVisit form submitted successfully (onComplete called)",
        );
      } else {
        console.log("Form submitted successfully (no onComplete)!", formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 w-full flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <form
          onSubmit={handleSubmit}
          className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg"
        >
          <div className="absolute top-2 right-2 no-print">
            <button
              type="button"
              onClick={logData}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
            >
              Log Data
            </button>
          </div>

          {/* --- PAGE 1: Home Supervisory Visit --- */}

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-12 md:h-16 object-contain mb-2"
            />
            <h1 className="text-sm md:text-lg font-bold uppercase text-center text-black">
              Home Supervisory Visit
            </h1>
          </div>

          {/* Client Info */}
          <div className="flex flex-col md:flex-row gap-2 mb-4 text-[9px] md:text-sm">
            <div className="w-full md:flex-[3] flex gap-2 items-end">
              <span className="font-bold whitespace-nowrap">Client Name:</span>
              <input
                type="text"
                value={formData.clientInfo.name}
                onChange={(e) =>
                  handleChange("clientInfo", "name", e.target.value)
                }
                onKeyDown={handleEnter}
                className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                readOnly={isReadOnly}
              />
            </div>
            <div className="w-full md:flex-1 flex gap-2 items-end">
              <span className="font-bold">DOB:</span>
              <input
                type="date"
                value={formData.clientInfo.dob}
                onChange={(e) =>
                  handleChange("clientInfo", "dob", e.target.value)
                }
                onKeyDown={handleEnter}
                className="border-b border-black flex-grow outline-none bg-transparent min-w-[50px]"
                readOnly={isReadOnly}
              />
            </div>
            <div className="hidden md:flex md:flex-1 gap-2 items-end">
              <span className="font-bold">Date:</span>
              <input
                type="date"
                value={formData.clientInfo.date}
                onChange={(e) =>
                  handleChange("clientInfo", "date", e.target.value)
                }
                onKeyDown={handleEnter}
                className="border-b border-black flex-grow outline-none bg-transparent min-w-[50px]"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4 text-[9px] md:text-sm">
            <div className="w-full md:flex-[3] flex gap-2 items-end">
              <span className="font-bold">Address:</span>
              <input
                type="text"
                value={formData.clientInfo.address}
                onChange={(e) =>
                  handleChange("clientInfo", "address", e.target.value)
                }
                onKeyDown={handleEnter}
                className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                readOnly={isReadOnly}
              />
            </div>
            <div className="w-full md:flex-1 flex gap-2 items-end">
              <span className="font-bold">Phone:</span>
              <input
                type="text"
                value={formData.clientInfo.phone}
                onChange={(e) =>
                  handleChange("clientInfo", "phone", e.target.value)
                }
                onKeyDown={handleEnter}
                className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="flex gap-2 items-end mb-4 text-[9px] md:text-sm">
            <span className="font-bold whitespace-nowrap">Diagnosis:</span>
            <input
              type="text"
              value={formData.clientInfo.diagnosis}
              onChange={(e) =>
                handleChange("clientInfo", "diagnosis", e.target.value)
              }
              onKeyDown={handleEnter}
              className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
              readOnly={isReadOnly}
            />
          </div>

          <div className="flex gap-2 items-end mb-6 text-[9px] md:text-sm">
            <span className="font-bold whitespace-nowrap">Allergies:</span>
            <input
              type="text"
              value={formData.clientInfo.allergies}
              onChange={(e) =>
                handleChange("clientInfo", "allergies", e.target.value)
              }
              onKeyDown={handleEnter}
              className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
              readOnly={isReadOnly}
            />

            <div className="flex md:hidden gap-2 items-end">
              <span className="font-bold">Date:</span>
              <input
                type="date"
                value={formData.clientInfo.allergiesDate}
                onChange={(e) =>
                  handleChange("clientInfo", "allergiesDate", e.target.value)
                }
                onKeyDown={handleEnter}
                className="border-b border-black w-[85px] outline-none bg-transparent text-[9px]"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Service Checkboxes */}
          <div className="flex flex-col md:flex-row justify-between md:justify-center gap-2 md:gap-16 mb-6 font-bold text-[9px] md:text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.services.includes("Companion Sitter")}
                onChange={() => handleServiceChange("Companion Sitter")}
                className="mx-1"
                disabled={isReadOnly}
              />{" "}
              Companion Sitter
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.services.includes("Personal Care")}
                onChange={() => handleServiceChange("Personal Care")}
                className="mx-1"
                disabled={isReadOnly}
              />{" "}
              Personal Care
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.services.includes("Skilled Nursing Services")}
                onChange={() => handleServiceChange("Skilled Nursing Services")}
                className="mx-1"
                disabled={isReadOnly}
              />{" "}
              Skilled Nursing Services
            </label>
          </div>

          {/* Assessment Text Areas */}
          <div className="mb-4 text-[9px] md:text-sm">
            <label className="font-bold block mb-1">
              Assessment of General Condition:
            </label>
            <textarea
              value={formData.assessment.generalCondition}
              onChange={(e) =>
                handleChange("assessment", "generalCondition", e.target.value)
              }
              rows="5"
              className="w-full border-b border-black outline-none bg-transparent resize-none leading-relaxed"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, transparent 95%, black 95%)",
                backgroundSize: "100% 1.5em",
                lineHeight: "1.5em",
              }}
              readOnly={isReadOnly}
            ></textarea>
          </div>

          {/* Review of Progress */}
          <div className="mb-4 text-[9px] md:text-sm">
            <label className="font-bold block mb-1">Review of Progress:</label>
            <textarea
              value={formData.assessment.progressReview}
              onChange={(e) =>
                handleChange("assessment", "progressReview", e.target.value)
              }
              rows="3"
              className="w-full border-b border-black outline-none bg-transparent resize-none leading-relaxed"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, transparent 95%, black 95%)",
                backgroundSize: "100% 1.5em",
                lineHeight: "1.5em",
              }}
              readOnly={isReadOnly}
            ></textarea>
          </div>

          <div className="mb-6 text-[9px] md:text-sm">
            <label className="font-bold block mb-1">Problems:</label>
            <textarea
              value={formData.assessment.problems}
              onChange={(e) =>
                handleChange("assessment", "problems", e.target.value)
              }
              rows="4"
              className="w-full border-b border-black outline-none bg-transparent resize-none leading-relaxed"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, transparent 95%, black 95%)",
                backgroundSize: "100% 1.5em",
                lineHeight: "1.5em",
              }}
            ></textarea>
          </div>

          {/* Satisfaction Questions */}
          <div className="mb-6 font-bold text-[9px] md:text-xs">
            <div className="flex items-center justify-between md:justify-start md:gap-12 mb-2">
              <span>Client Satisfied with Services:</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  Yes{" "}
                  <input
                    type="checkbox"
                    checked={formData.satisfaction.clientSatisfied === "Yes"}
                    onChange={() =>
                      handleChange("satisfaction", "clientSatisfied", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </label>
                <label className="flex items-center gap-1">
                  No{" "}
                  <input
                    type="checkbox"
                    checked={formData.satisfaction.clientSatisfied === "No"}
                    onChange={() =>
                      handleChange("satisfaction", "clientSatisfied", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-11 mb-2">
              <span>Appropriateness of Services:</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  Yes{" "}
                  <input
                    type="checkbox"
                    checked={formData.satisfaction.appropriateness === "Yes"}
                    onChange={() =>
                      handleChange("satisfaction", "appropriateness", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </label>
                <label className="flex items-center gap-1">
                  No{" "}
                  <input
                    type="checkbox"
                    checked={formData.satisfaction.appropriateness === "No"}
                    onChange={() =>
                      handleChange("satisfaction", "appropriateness", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-24 mb-2">
              <span>Client MF/MC:</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  Yes{" "}
                  <input
                    type="checkbox"
                    checked={formData.satisfaction.clientMfMc === "Yes"}
                    onChange={() =>
                      handleChange("satisfaction", "clientMfMc", "Yes")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </label>
                <label className="flex items-center gap-1">
                  No{" "}
                  <input
                    type="checkbox"
                    checked={formData.satisfaction.clientMfMc === "No"}
                    onChange={() =>
                      handleChange("satisfaction", "clientMfMc", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Vitals Table */}
          <div className="border border-black mb-8 text-[9px] md:text-xs">
            <div className="grid grid-cols-5 border-b border-black divide-x divide-black">
              <div className="p-1 font-bold flex items-center">
                BP:{" "}
                <input
                  type="text"
                  value={formData.vitals.bp}
                  onChange={(e) => handleChange("vitals", "bp", e.target.value)}
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 font-bold flex items-center">
                RR:{" "}
                <input
                  type="text"
                  value={formData.vitals.rr}
                  onChange={(e) => handleChange("vitals", "rr", e.target.value)}
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 font-bold flex items-center">
                Temp:{" "}
                <input
                  type="text"
                  value={formData.vitals.temp}
                  onChange={(e) =>
                    handleChange("vitals", "temp", e.target.value)
                  }
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 font-bold flex items-center">
                HR:{" "}
                <input
                  type="text"
                  value={formData.vitals.hr}
                  onChange={(e) => handleChange("vitals", "hr", e.target.value)}
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 font-bold flex items-center">
                BS:{" "}
                <input
                  type="text"
                  value={formData.vitals.bs}
                  onChange={(e) => handleChange("vitals", "bs", e.target.value)}
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 divide-x divide-black">
              <div className="p-1 font-bold flex items-center">
                Height:{" "}
                <input
                  type="text"
                  value={formData.vitals.height}
                  onChange={(e) =>
                    handleChange("vitals", "height", e.target.value)
                  }
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 font-bold flex items-center">
                Weight:{" "}
                <input
                  type="text"
                  value={formData.vitals.weight}
                  onChange={(e) =>
                    handleChange("vitals", "weight", e.target.value)
                  }
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 font-bold flex items-center">
                BMI:{" "}
                <input
                  type="text"
                  value={formData.vitals.bmi}
                  onChange={(e) =>
                    handleChange("vitals", "bmi", e.target.value)
                  }
                  className="ml-1 w-full min-w-0 outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 bg-gray-100">
                <input
                  type="text"
                  value={formData.vitals.other1}
                  onChange={(e) =>
                    handleChange("vitals", "other1", e.target.value)
                  }
                  className="ml-1 w-full outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 bg-gray-100">
                <input
                  type="text"
                  value={formData.vitals.other2}
                  onChange={(e) =>
                    handleChange("vitals", "other2", e.target.value)
                  }
                  className="ml-1 w-full outline-none bg-transparent"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* --- PAGE 2: Assessment Grid --- */}
          <div className="border-t-4 border-black my-8 pt-8 text-[9px] md:text-xs">
            <div className="flex flex-col items-center mb-6">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-16 object-contain mb-2"
              />
            </div>

            <div className="grid grid-cols-2 border border-black">
              {/* Row 1 */}
              <div className="border-b border-black border-r p-1 min-h-[160px]">
                <span className="font-bold">Diet & Nutrition:</span>
                <br />
                <span className="font-bold">Appetite:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.dietNutrition.appetite}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "dietNutrition",
                      "appetite",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.dietNutrition.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "dietNutrition",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-24 outline-none bg-transparent resize-none leading-normal"
                  readOnly={isReadOnly}
                ></textarea>
              </div>
              <div className="border-b border-black p-1 min-h-[160px]">
                <span className="font-bold">
                  Respiratory: WNL{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.respiratory.wnl}
                    onChange={(e) =>
                      handleNestedChange(
                        "assessmentGrid",
                        "respiratory",
                        "wnl",
                        e.target.checked,
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </span>
                <br />
                <span className="font-bold">Breath Sounds:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.respiratory.breathSounds}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "respiratory",
                      "breathSounds",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">02 Therapy:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.respiratory.o2Therapy}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "respiratory",
                      "o2Therapy",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.respiratory.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "respiratory",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-24 outline-none bg-transparent resize-none leading-normal"
                  readOnly={isReadOnly}
                ></textarea>
              </div>

              {/* Row 2 */}
              <div className="border-b border-black border-r p-1 min-h-[160px]">
                <span className="font-bold">Abdomen:</span>
                <br />
                <span className="font-bold">Last BM:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.abdomen.lastBm}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "abdomen",
                      "lastBm",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Bowel sounds:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.abdomen.bowelSounds}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "abdomen",
                      "bowelSounds",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.abdomen.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "abdomen",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-24 outline-none bg-transparent resize-none leading-normal"
                  readOnly={isReadOnly}
                ></textarea>
              </div>
              <div className="border-b border-black p-1 min-h-[160px]">
                <span className="font-bold">
                  Cardiovascular: Chest pain{" "}
                  <input
                    type="checkbox"
                    checked={
                      formData.assessmentGrid.cardiovascular.chestPain === "Yes"
                    }
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "cardiovascular",
                        "chestPain",
                        "Yes",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Yes{" "}
                  <input
                    type="checkbox"
                    checked={
                      formData.assessmentGrid.cardiovascular.chestPain === "No"
                    }
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "cardiovascular",
                        "chestPain",
                        "No",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  No
                </span>
                <br />
                <span className="font-bold">Heart Rate:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.cardiovascular.heartRate}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "cardiovascular",
                      "heartRate",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.cardiovascular.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "cardiovascular",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-24 outline-none bg-transparent resize-none leading-normal"
                  readOnly={isReadOnly}
                ></textarea>
              </div>

              {/* Row 3 */}
              <div className="border-b border-black border-r p-1 min-h-[160px]">
                <span className="font-bold">
                  Skin: intact YES{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.skin.intact === "Yes"}
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "skin",
                        "intact",
                        "Yes",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  NO{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.skin.intact === "No"}
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "skin",
                        "intact",
                        "No",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  [Check Skin Assessment Sheet]
                </span>
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.skin.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "skin",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-28 outline-none bg-transparent resize-none leading-normal"
                  readOnly={isReadOnly}
                ></textarea>
              </div>
              <div className="border-b border-black p-1 min-h-[160px]">
                <span className="font-bold">
                  Cap refill:{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.capRefill === "< 3 sec"}
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "",
                        "capRefill",
                        "< 3 sec",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                  &lt; 3 sec{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.capRefill === "> 3 sec"}
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "",
                        "capRefill",
                        "> 3 sec",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  &gt;3 sec
                </span>
                <br />
                <span className="font-bold">
                  Edema: NO{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.edema === "No"}
                    onChange={() =>
                      handleNestedChange("assessmentGrid", "", "edema", "No")
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  YES{" "}
                  <input
                    type="checkbox"
                    checked={
                      formData.assessmentGrid.edema !== "No" &&
                      formData.assessmentGrid.edema !== ""
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "assessmentGrid",
                        "",
                        "edema",
                        e.target.checked ? "Yes" : "No",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  pitting:
                  {["+1", "+2", "+3", "+4"].map((val) => (
                    <label key={val} className="mx-1 inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.assessmentGrid.edema === val}
                        onChange={() =>
                          handleNestedChange("assessmentGrid", "", "edema", val)
                        }
                      />{" "}
                      {val}
                    </label>
                  ))}
                </span>
              </div>

              {/* Row 4 */}
              <div className="border-b border-black border-r p-1 min-h-[160px]">
                <span className="font-bold">Neuro: Pain Sensation:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.neuro.painSensation}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "neuro",
                      "painSensation",
                      e.target.value,
                    )
                  }
                />
                <br />
                <span className="font-bold">
                  LOC: Awake{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.neuro.loc.includes(
                      "Awake",
                    )}
                    onChange={() => {
                      const val = "Awake";
                      const current = formData.assessmentGrid.neuro.loc;
                      const newLoc = current.includes(val)
                        ? current.filter((x) => x !== val)
                        : [...current, val];
                      handleNestedChange(
                        "assessmentGrid",
                        "neuro",
                        "loc",
                        newLoc,
                      );
                    }}
                    className="mx-0.5"
                  />{" "}
                  Alert{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.neuro.loc.includes(
                      "Alert",
                    )}
                    onChange={() => {
                      const val = "Alert";
                      const current = formData.assessmentGrid.neuro.loc;
                      const newLoc = current.includes(val)
                        ? current.filter((x) => x !== val)
                        : [...current, val];
                      handleNestedChange(
                        "assessmentGrid",
                        "neuro",
                        "loc",
                        newLoc,
                      );
                    }}
                    className="mx-0.5"
                  />{" "}
                  Oriented x{" "}
                  <input
                    type="text"
                    value={formData.assessmentGrid.neuro.orientexX}
                    onChange={(e) =>
                      handleNestedChange(
                        "assessmentGrid",
                        "neuro",
                        "orientexX",
                        e.target.value,
                      )
                    }
                    className="border-b border-black w-8 min-w-0 outline-none bg-transparent"
                  />
                </span>
                <br />
                <span className="font-bold">Communication:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.neuro.communication}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "neuro",
                      "communication",
                      e.target.value,
                    )
                  }
                />
                <br />
                <span className="font-bold">Seizures:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.neuro.seizures}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "neuro",
                      "seizures",
                      e.target.value,
                    )
                  }
                />
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.neuro.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "neuro",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-16 outline-none bg-transparent resize-none leading-normal"
                ></textarea>
              </div>
              <div className="border-b border-black p-1 min-h-[160px]">
                <span className="font-bold">
                  Behavior:
                  {["Calm", "Lethargic", "Angry", "Aggressive"].map((opt) => (
                    <label key={opt} className="mx-1">
                      <input
                        type="checkbox"
                        checked={formData.assessmentGrid.behavior.types.includes(
                          opt,
                        )}
                        onChange={() => {
                          const current =
                            formData.assessmentGrid.behavior.types;
                          const newTypes = current.includes(opt)
                            ? current.filter((x) => x !== opt)
                            : [...current, opt];
                          handleNestedChange(
                            "assessmentGrid",
                            "behavior",
                            "types",
                            newTypes,
                          );
                        }}
                      />{" "}
                      {opt}{" "}
                    </label>
                  ))}
                </span>
                <br />
                <span className="font-bold">Sleep Patterns:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.behavior.sleepPatterns}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "behavior",
                      "sleepPatterns",
                      e.target.value,
                    )
                  }
                />
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.behavior.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "behavior",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-24 outline-none bg-transparent resize-none leading-normal"
                ></textarea>
              </div>

              {/* Row 5 */}
              <div className="border-b border-black border-r p-2 min-h-[60px] flex items-center">
                <span className="font-bold">
                  Incontinent:{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.incontinent === "Yes"}
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "",
                        "incontinent",
                        "Yes",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  YES{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.incontinent === "No"}
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "",
                        "incontinent",
                        "No",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  NO
                </span>
              </div>
              <div className="border-b border-black p-2 min-h-[60px]">
                <span className="font-bold">Vision:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.sensory.vision}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "sensory",
                      "vision",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Hearing:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.sensory.hearing}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "sensory",
                      "hearing",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Dental:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.sensory.dental}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "sensory",
                      "dental",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
              </div>

              {/* Row 6 */}
              <div className="p-2 min-h-[160px] border-r border-black">
                <span className="font-bold">
                  Mobility: Ambulatory{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.mobility.ambulatory}
                    onChange={(e) =>
                      handleNestedChange(
                        "assessmentGrid",
                        "mobility",
                        "ambulatory",
                        e.target.checked,
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Gait: Steady{" "}
                  <input
                    type="checkbox"
                    checked={formData.assessmentGrid.mobility.gait === "Steady"}
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "mobility",
                        "gait",
                        "Steady",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />{" "}
                  Impaired{" "}
                  <input
                    type="checkbox"
                    checked={
                      formData.assessmentGrid.mobility.gait === "Impaired"
                    }
                    onChange={() =>
                      handleNestedChange(
                        "assessmentGrid",
                        "mobility",
                        "gait",
                        "Impaired",
                      )
                    }
                    className="mx-1"
                    disabled={isReadOnly}
                  />
                </span>
                <br />
                <span className="font-bold">Assistive Devices:</span>
                <input
                  className="ml-2 border-b border-black outline-none w-1/2"
                  value={formData.assessmentGrid.mobility.assistiveDevices}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "mobility",
                      "assistiveDevices",
                      e.target.value,
                    )
                  }
                  readOnly={isReadOnly}
                />
                <br />
                <span className="font-bold">Notes:</span>
                <textarea
                  value={formData.assessmentGrid.mobility.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "assessmentGrid",
                      "mobility",
                      "notes",
                      e.target.value,
                    )
                  }
                  className="w-full h-24 outline-none bg-transparent resize-none leading-normal"
                  readOnly={isReadOnly}
                ></textarea>
              </div>
              <div className="p-2 min-h-[160px]"></div>
            </div>

            <div className="mt-8">
              <span className="font-bold">Visit Notes:</span>
              <textarea
                value={formData.visitNotes}
                onChange={(e) => handleChange("visitNotes", "", e.target.value)}
                rows="6"
                className="w-full border-b border-black outline-none bg-transparent resize-none leading-[2em]"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, transparent 95%, black 95%)",
                  backgroundSize: "100% 2em",
                }}
                readOnly={isReadOnly}
              ></textarea>
            </div>

            <div className="flex flex-col md:flex-row justify-between mt-12 items-end font-bold gap-4 md:gap-0">
              <div className="flex gap-2 items-end w-full md:w-1/2">
                <span className="whitespace-nowrap">Assessor Name:</span>
                <input
                  type="text"
                  value={formData.assessor.name}
                  onChange={(e) =>
                    handleChange("assessor", "name", e.target.value)
                  }
                  className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="flex gap-2 items-end w-full md:w-1/3">
                <span>Date:</span>
                <input
                  type="date"
                  value={formData.assessor.date}
                  onChange={(e) =>
                    handleChange("assessor", "date", e.target.value)
                  }
                  className="border-b border-black flex-grow outline-none bg-transparent min-w-[50px]"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
              2 | Page
            </div>
          </div>

          {/* --- PAGE 3: Skin Integrity Form --- */}
          <div className="border-t-4 border-black my-8 pt-8 break-before-page">
            <div className="flex flex-col items-center mb-4">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-16 object-contain mb-2"
              />
              <h1 className="text-xl font-bold font-sans text-center mt-2">
                Skin Integrity Form
              </h1>
            </div>

            <div className="border border-black">
              <div className="p-2 border-b border-black text-xs">
                Please describe the individuals skin integrity. Fill out one
                sheet for each site.
              </div>

              <div className="p-2 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:flex-1 flex gap-2 items-end">
                    <span className="font-bold whitespace-nowrap">
                      Individual's Name:
                    </span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.individualName}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "individualName",
                          e.target.value,
                        )
                      }
                      className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="w-full md:w-1/3 flex gap-2 items-end">
                    <span className="font-bold">Date:</span>
                    <input
                      type="date"
                      value={formData.skinIntegrity.date}
                      onChange={(e) =>
                        handleChange("skinIntegrity", "date", e.target.value)
                      }
                      className="border-b border-black flex-grow outline-none bg-transparent min-w-[50px]"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:flex-1 flex gap-2 items-end">
                    <span className="font-bold whitespace-nowrap">
                      Staff Name:
                    </span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.staffName}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "staffName",
                          e.target.value,
                        )
                      }
                      className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="w-full md:w-1/3 flex gap-2 items-end">
                    <span className="font-bold text-xs whitespace-nowrap">
                      Time/ Shift:
                    </span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.timeShift}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "timeShift",
                          e.target.value,
                        )
                      }
                      className="border-b border-black w-1/2 flex-grow-0 md:flex-grow outline-none bg-transparent min-w-0"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
                  <div className="w-full md:flex-1 flex gap-2 items-end">
                    <span className="font-bold whitespace-nowrap">
                      Skin Intact:
                    </span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.skinIntact}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "skinIntact",
                          e.target.value,
                        )
                      }
                      className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="w-full md:flex-1 flex gap-2 items-end">
                    <span className="font-bold whitespace-nowrap">
                      Skin Not Intact:
                    </span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.skinNotIntact}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "skinNotIntact",
                          e.target.value,
                        )
                      }
                      className="border-b border-black w-1/2 flex-grow-0 md:flex-grow outline-none bg-transparent min-w-0"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Body Diagram */}
              <div className="flex justify-center mb-4 border-b border-black pb-4">
                <img
                  src={bodyDiagram}
                  alt="Body Diagram"
                  className="max-w-full h-auto max-h-[300px]"
                />
              </div>

              {/* Description Table */}
              <div className="grid grid-cols-3 border-b border-black text-xs md:text-sm">
                <div className="border-r border-black p-2">
                  <h3 className="font-bold mb-2">DESCRIBE:</h3>
                  <div className="space-y-4">
                    {[
                      "Mark on Body on the back sheet",
                      "Skin Broken/ Open",
                      "Skin Scratched (Skin Tear)",
                      "Unusual Lesions (scars, rash, etc.)",
                      "Pressure Ulcers",
                    ].map((desc) => (
                      <label key={desc} className="flex items-end gap-1">
                        <span className="border-b border-black w-8 inline-block text-center">
                          {formData.skinIntegrity.descriptions.includes(desc)
                            ? "X"
                            : ""}
                        </span>{" "}
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.skinIntegrity.descriptions.includes(
                            desc,
                          )}
                          onChange={() => {
                            const current = formData.skinIntegrity.descriptions;
                            const newDesc = current.includes(desc)
                              ? current.filter((x) => x !== desc)
                              : [...current, desc];
                            handleChange(
                              "skinIntegrity",
                              "descriptions",
                              newDesc,
                            );
                          }}
                        />{" "}
                        {desc}
                      </label>
                    ))}
                    <label className="flex items-end gap-1">
                      <span className="border-b border-black w-8 inline-block text-center">
                        {formData.skinIntegrity.otherDescription ? "X" : ""}
                      </span>{" "}
                      Other:{" "}
                      <input
                        className="border-b border-black flex-1 min-w-0 outline-none bg-transparent"
                        value={formData.skinIntegrity.otherDescription}
                        onChange={(e) =>
                          handleChange(
                            "skinIntegrity",
                            "otherDescription",
                            e.target.value,
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="border-r border-black p-2">
                  <h3 className="font-bold mb-2">COLOR:</h3>
                  <div className="space-y-4">
                    {[
                      "Normal",
                      "Pink",
                      "Red",
                      "Purple/ Blue",
                      "Yellow",
                      "Black",
                    ].map((color) => (
                      <label key={color} className="flex items-end gap-1">
                        <span className="border-b border-black w-8 inline-block text-center">
                          {formData.skinIntegrity.colors.includes(color)
                            ? "X"
                            : ""}
                        </span>{" "}
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.skinIntegrity.colors.includes(
                            color,
                          )}
                          onChange={() => {
                            const current = formData.skinIntegrity.colors;
                            const newColors = current.includes(color)
                              ? current.filter((x) => x !== color)
                              : [...current, color];
                            handleChange("skinIntegrity", "colors", newColors);
                          }}
                        />{" "}
                        {color}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="font-bold mb-2">SIZE:</h3>
                  <div className="space-y-4">
                    {["Quarter Size", "Dime Size", "Nickel Size"].map(
                      (size) => (
                        <label key={size} className="flex items-end gap-1">
                          <span className="border-b border-black w-8 inline-block text-center">
                            {formData.skinIntegrity.sizes.includes(size)
                              ? "X"
                              : ""}
                          </span>{" "}
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={formData.skinIntegrity.sizes.includes(
                              size,
                            )}
                            onChange={() => {
                              const current = formData.skinIntegrity.sizes;
                              const newSizes = current.includes(size)
                                ? current.filter((x) => x !== size)
                                : [...current, size];
                              handleChange("skinIntegrity", "sizes", newSizes);
                            }}
                          />{" "}
                          {size}
                        </label>
                      ),
                    )}
                    <label className="flex items-end gap-1">
                      <span className="border-b border-black w-8 inline-block text-center">
                        {formData.skinIntegrity.otherSize ? "X" : ""}
                      </span>{" "}
                      Other:
                    </label>
                    <input
                      className="border-b border-black w-full outline-none bg-transparent"
                      value={formData.skinIntegrity.otherSize}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "otherSize",
                          e.target.value,
                        )
                      }
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-black p-2 bg-gray-100 text-xs font-bold">
                Check all that apply below: Person Needs Assistance with:
              </div>

              <div className="grid grid-cols-2 text-xs md:text-sm">
                <div className="p-2 space-y-2 border-r border-black">
                  <div className="grid grid-cols-[30%_1fr_1fr] items-center gap-1">
                    <span>Ambulation:</span>
                    <label className="flex items-center whitespace-nowrap">
                      Yes{" "}
                      <input
                        type="text"
                        className="border-b border-black w-6 ml-0.5 outline-none bg-transparent text-center"
                        value={formData.skinIntegrity.assistance.ambulation.yes}
                        onChange={(e) =>
                          handleSkinAssistanceChange(
                            "ambulation",
                            "yes",
                            e.target.value,
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      No{" "}
                      <input
                        type="text"
                        className="border-b border-black w-6 ml-0.5 outline-none bg-transparent text-center"
                        value={formData.skinIntegrity.assistance.ambulation.no}
                        onChange={(e) =>
                          handleSkinAssistanceChange(
                            "ambulation",
                            "no",
                            e.target.value,
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-[30%_1fr_1fr] items-center gap-1">
                    <span>Transfer:</span>
                    <label className="flex items-center whitespace-nowrap">
                      Yes{" "}
                      <input
                        type="text"
                        className="border-b border-black w-6 ml-0.5 outline-none bg-transparent text-center"
                        value={formData.skinIntegrity.assistance.transfer.yes}
                        onChange={(e) =>
                          handleSkinAssistanceChange(
                            "transfer",
                            "yes",
                            e.target.value,
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      No{" "}
                      <input
                        type="text"
                        className="border-b border-black w-6 ml-0.5 outline-none bg-transparent text-center"
                        value={formData.skinIntegrity.assistance.transfer.no}
                        onChange={(e) =>
                          handleSkinAssistanceChange(
                            "transfer",
                            "no",
                            e.target.value,
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-[30%_1fr_1fr] items-center gap-1">
                    <span>Toileting:</span>
                    <label className="flex items-center whitespace-nowrap">
                      Yes{" "}
                      <input
                        type="text"
                        className="border-b border-black w-6 ml-0.5 outline-none bg-transparent text-center"
                        value={formData.skinIntegrity.assistance.toileting.yes}
                        onChange={(e) =>
                          handleSkinAssistanceChange(
                            "toileting",
                            "yes",
                            e.target.value,
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      No{" "}
                      <input
                        type="text"
                        className="border-b border-black w-6 ml-0.5 outline-none bg-transparent text-center"
                        value={formData.skinIntegrity.assistance.toileting.no}
                        onChange={(e) =>
                          handleSkinAssistanceChange(
                            "toileting",
                            "no",
                            e.target.value,
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </label>
                  </div>
                </div>

                <div className="p-2 space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <span>Independent:</span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.independent}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "independent",
                          e.target.value,
                        )
                      }
                      className="border-b border-black flex-1 min-w-0 outline-none bg-transparent"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <span>Continence:</span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.continence}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "continence",
                          e.target.value,
                        )
                      }
                      className="border-b border-black flex-1 min-w-0 outline-none bg-transparent"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <span>Dependent:</span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.dependent}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "dependent",
                          e.target.value,
                        )
                      }
                      className="border-b border-black flex-1 min-w-0 outline-none bg-transparent"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <span>Incontinence:</span>
                    <input
                      type="text"
                      value={formData.skinIntegrity.incontinence}
                      onChange={(e) =>
                        handleChange(
                          "skinIntegrity",
                          "incontinence",
                          e.target.value,
                        )
                      }
                      className="border-b border-black flex-1 min-w-0 outline-none bg-transparent"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-black p-2 min-h-[100px]">
                <p className="font-bold mb-1">Comments:</p>
                <textarea
                  value={formData.skinIntegrity.comments}
                  onChange={(e) =>
                    handleChange("skinIntegrity", "comments", e.target.value)
                  }
                  className="w-full h-24 outline-none bg-transparent resize-none"
                  readOnly={isReadOnly}
                ></textarea>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
              3 | Page
            </div>
          </div>

          {/* --- PAGE 4: Medication --- */}
          <div className="border-t-4 border-black my-8 pt-8 break-before-page">
            <div className="flex flex-col items-center mb-6">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-16 object-contain mb-2"
              />
              <h1 className="text-xl font-bold font-sans text-center mt-4">
                Medication
              </h1>
            </div>

            <div className="border border-black">
              <div className="grid grid-cols-[14%_14%_1fr_10%_12%_10%_15%] border-b border-black font-bold text-center bg-gray-100 text-[9px] md:text-[10px]">
                <div className="p-1 border-r border-black">Start Date</div>
                <div className="p-1 border-r border-black">Stop Date:</div>
                <div className="p-1 border-r border-black">
                  Medication Names
                </div>
                <div className="p-1 border-r border-black">Dose</div>
                <div className="p-1 border-r border-black">Frequency</div>
                <div className="p-1 border-r border-black">Route</div>
                <div className="p-1">New/Change (circle)</div>
              </div>

              {formData.medication.medications.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[14%_14%_1fr_10%_12%_10%_15%] border-b border-black text-[9px] md:text-[10px] items-center min-h-[40px] ${i === 14 ? "" : ""}`}
                >
                  <div className="p-1 border-r border-black h-full">
                    <input
                      className="w-full h-full bg-transparent outline-none"
                      value={row.start}
                      onChange={(e) =>
                        handleMedicationChange(i, "start", e.target.value)
                      }
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="p-1 border-r border-black h-full">
                    <input
                      className="w-full h-full bg-transparent outline-none"
                      value={row.stop}
                      onChange={(e) =>
                        handleMedicationChange(i, "stop", e.target.value)
                      }
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="p-1 border-r border-black h-full">
                    <input
                      className="w-full h-full bg-transparent outline-none"
                      value={row.name}
                      onChange={(e) =>
                        handleMedicationChange(i, "name", e.target.value)
                      }
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="p-1 border-r border-black h-full">
                    <input
                      className="w-full h-full bg-transparent outline-none"
                      value={row.dose}
                      onChange={(e) =>
                        handleMedicationChange(i, "dose", e.target.value)
                      }
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="p-1 border-r border-black h-full">
                    <input
                      className="w-full h-full bg-transparent outline-none"
                      value={row.freq}
                      onChange={(e) =>
                        handleMedicationChange(i, "freq", e.target.value)
                      }
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="p-1 border-r border-black h-full">
                    <input
                      className="w-full h-full bg-transparent outline-none"
                      value={row.route}
                      onChange={(e) =>
                        handleMedicationChange(i, "route", e.target.value)
                      }
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="p-1 flex flex-col justify-center text-[9px] leading-tight">
                    <label>
                      <input
                        type="checkbox"
                        checked={row.new}
                        onChange={(e) =>
                          handleMedicationChange(i, "new", e.target.checked)
                        }
                        disabled={isReadOnly}
                      />{" "}
                      New
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={row.change}
                        onChange={(e) =>
                          handleMedicationChange(i, "change", e.target.checked)
                        }
                        disabled={isReadOnly}
                      />{" "}
                      Change
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 items-end mt-8">
              <span className="font-bold">RN Signature:</span>
              <input
                type="text"
                value={formData.medication.rnSignature}
                onChange={(e) =>
                  handleChange("medication", "rnSignature", e.target.value)
                }
                className="border-b border-black flex-grow outline-none bg-transparent min-w-0"
                readOnly={isReadOnly}
              />
              <span className="font-bold">Date:</span>
              <input
                type="date"
                value={formData.medication.date}
                onChange={(e) =>
                  handleChange("medication", "date", e.target.value)
                }
                className="border-b border-black w-[30%] min-w-[50px] outline-none bg-transparent"
                readOnly={isReadOnly}
              />
              <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
                4 | Page
              </div>
            </div>
          </div>

          {/* --- PAGE 5: Client Satisfaction Survey --- */}
          <div className="border-t-4 border-black my-8 pt-8 break-before-page">
            <div className="flex flex-col items-center mb-6">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-16 object-contain mb-2"
              />
              <h1 className="text-xl font-bold uppercase text-center text-black mt-2">
                CLIENT SATISFACTION SURVEY
              </h1>
            </div>

            <div className="mb-4 text-xs font-bold">
              <p>Scale:</p>
              <ol className="list-decimal list-inside ml-2">
                <li>Not Applicable</li>
                <li>Disagree</li>
                <li>Agree</li>
                <li>Strongly Agree</li>
              </ol>
            </div>

            <div className="border border-black text-xs md:text-sm">
              <div className="grid grid-cols-[1fr_40px_40px_40px_40px] border-b border-black font-bold bg-gray-100">
                <div className="p-1 border-r border-black">
                  How do you agree or disagree with the following?
                </div>
                <div className="p-1 border-r border-black text-center">1</div>
                <div className="p-1 border-r border-black text-center">2</div>
                <div className="p-1 border-r border-black text-center">3</div>
                <div className="p-1 text-center">4</div>
              </div>

              {[
                "My Aide is responsive to my needs and is helpful",
                "My Aide reports to work on time",
                "If given a choice, I would like to try another aide",
                "I believe my Aide is competent in what he/she does",
                "My Aide or Nurse tells me his/her personal issues or challenges",
                "I know how to contact the office if I have a problem or complaint",
                "The admin office staff is courteous and respectful",
                "Whenever I call the admin office, they respond to me promptly",
                "Overall, I am satisfied with the services provided by PHS",
                "Overall, I would recommend PHS to a family member or friend",
                "I know how to contact my Case Manager if I have a complaint",
                "I know how to contact DCH if I have an issue or a complaint",
              ].map((q, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_40px_40px_40px_40px] border-b border-black"
                >
                  <div className="p-1 border-r border-black pl-2">
                    {i + 1}. {q}
                  </div>
                  {["1", "2", "3", "4"].map((rating) => (
                    <div
                      key={rating}
                      className="p-1 border-r border-black last:border-r-0 text-center flex justify-center items-center"
                    >
                      <input
                        type="checkbox"
                        checked={formData.clientSurvey.ratings[i] === rating}
                        onChange={() => handleSurveyRatingChange(i, rating)}
                        disabled={isReadOnly}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="font-bold underline mb-1">Additional Comments:</p>
              <div className="border border-black h-24 p-2">
                <textarea
                  value={formData.clientSurvey.comments}
                  onChange={(e) =>
                    handleChange("clientSurvey", "comments", e.target.value)
                  }
                  className="w-full h-full outline-none bg-transparent resize-none"
                  readOnly={isReadOnly}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
            1 | Page
          </div>
          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-12 pb-8">
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
    </div>
  );
};

export default HomeSupervisoryVisit;

