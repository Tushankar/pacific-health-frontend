import React, { useState, useEffect, useRef } from "react";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const HomeSupervisoryVisitForm = ({ onComplete, savedData, progressCurrent = 0, progressTotal = 1, onFormChange, isReadOnly = false, onNext }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    date: "",
    services: {
      companionSitter: false,
      personalCare: false,
      skilledNursing: false,
    },
    generalCondition: ["", "", ""],
    progressReview: ["", ""],
    problems: ["", ""],
    satisfaction: {
      clientSatisfiedYes: false,
      clientSatisfiedNo: false,
      appropriatenessYes: false,
      appropriatenessNo: false,
      clientMFMCYes: false,
      clientMFMCNo: false,
    },
    notes: ["", ""],
    vitals: {
      bp: "",
      rr: "",
      temp: "",
      hr: "",
      bs: "",
    },
    assessment: {
      respiratory: {
        wnl: false,
        rhonchi: false,
        crackles: false,
        diminished: false,
        wheezing: false,
        rales: false,
        other: false,
      },
      neurological: {
        wnl: false,
        unsteadyGait: false,
        disoriented: false,
        confused: false,
        forgetful: false,
      },
      cardiovascular: { wnl: false, chestPain: false },
      skin: { wnl: false, dry: false, clammy: false, cool: false },
      capRefill: { less3: false, greater3: false },
      wounds: "",
      edema: {
        pitting: false,
        plus1: false,
        plus2: false,
        plus3: false,
        plus4: false,
      },
      edemaNotes: "",
    },
    footer: {
      assessorName: "",
      date: "",
    },
  });

  const updateState = (path, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  const handleInput = (path) => (e) => updateState(path, e.target.value);
  const handleCheckbox = (path) => (e) => updateState(path, e.target.checked);

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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName?.trim()) newErrors.clientName = true;
    if (!formData.date?.trim()) newErrors.date = true;
    if (!formData.footer?.assessorName?.trim()) newErrors.assessorName = true;
    if (!formData.footer?.date?.trim()) newErrors.assessorDate = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in all required name and date fields.");
      setTimeout(() => {
        const firstErrorField = document.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorField.focus();
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);
    try {
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

  const getStyle = (field) => ({
    outline: "none",
    background: errors[field] ? "#fee2e2" : "transparent",
    borderBottom: errors[field] ? "2px solid #ef4444" : "1px solid black",
    transition: "all 0.2s"
  });

  const RequiredStar = () => <span className="text-red-500 ml-1 font-bold">*</span>;
  const handleArrayInput = (path, index) => (e) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newState = { ...prev };
      const newArray = [...newState[path]];
      newArray[index] = e.target.value;
      newState[path] = newArray;
      return newState;
    });
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = Array.from(
        document.querySelectorAll("input, textarea, select"),
      );
      const index = inputs.indexOf(e.target);
      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  };

  return (
    <div className="w-full flex justify-center bg-gray-100 min-h-screen p-8 text-black font-sans">
      {/* Paper Container */}
      <form onSubmit={handleSubmit} className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] relative flex flex-col text-[10px] leading-tight border border-gray-300">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-8">
          Home Supervisory Visit
        </h1>

        {/* Header */}
        <div className="flex items-end mb-8">
          <span className="font-bold mr-2 whitespace-nowrap">Client Name: <RequiredStar /></span>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => {
              handleInput(["clientName"])(e);
              if(errors.clientName) setErrors(prev => ({...prev, clientName: null}));
            }}
            onKeyDown={handleEnter}
            style={getStyle("clientName")}
            className={`flex-grow ${errors.clientName ? "border-red-500" : ""}`}
            readOnly={isReadOnly}
          />
          <span className="font-bold ml-4 mr-2 whitespace-nowrap">Date: <RequiredStar /></span>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => {
              handleInput(["date"])(e);
              if(errors.date) setErrors(prev => ({...prev, date: null}));
            }}
            onKeyDown={handleEnter}
            style={getStyle("date")}
            className={`w-24 md:w-32 ${errors.date ? "border-red-500" : ""}`}
            readOnly={isReadOnly}
          />
        </div>

        {/* Service Checkboxes */}
        <div className="flex justify-between px-4 md:px-12 mb-8 text-[9px] md:text-sm">
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.services.companionSitter}
              onChange={handleCheckbox(["services", "companionSitter"])}
              disabled={isReadOnly}
            />{" "}
            Companion Sitter
          </label>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.services.personalCare}
              onChange={handleCheckbox(["services", "personalCare"])}
              disabled={isReadOnly}
            />{" "}
            Personal Care
          </label>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.services.skilledNursing}
              onChange={handleCheckbox(["services", "skilledNursing"])}
              disabled={isReadOnly}
            />{" "}
            Skilled Nursing Services
          </label>
        </div>

        {/* Assessment of General Condition */}
        <div className="mb-6 text-[9px] md:text-sm">
          <div className="flex items-end w-full">
            <span className="font-bold mr-2 whitespace-nowrap">
              Assessment of General Condition:
            </span>
            <input
              type="text"
              value={formData.generalCondition[0]}
              onChange={handleArrayInput("generalCondition", 0)}
              onKeyDown={handleEnter}
              className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
              readOnly={isReadOnly}
            />
          </div>
          <input
            type="text"
            value={formData.generalCondition[1]}
            onChange={handleArrayInput("generalCondition", 1)}
            onKeyDown={handleEnter}
            className="w-full bg-transparent outline-none border-b border-black mt-4"
            readOnly={isReadOnly}
          />
          <input
            type="text"
            value={formData.generalCondition[2]}
            onChange={handleArrayInput("generalCondition", 2)}
            onKeyDown={handleEnter}
            className="w-full bg-transparent outline-none border-b border-black mt-4"
            readOnly={isReadOnly}
          />
        </div>

        {/* Review of Progress */}
        <div className="mb-6 text-[9px] md:text-sm">
          <div className="flex items-end w-full">
            <span className="font-bold mr-2 whitespace-nowrap">
              Review of Progress:
            </span>
            <input
              type="text"
              value={formData.progressReview[0]}
              onChange={handleArrayInput("progressReview", 0)}
              onKeyDown={handleEnter}
              className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
              readOnly={isReadOnly}
            />
          </div>
          <input
            type="text"
            value={formData.progressReview[1]}
            onChange={handleArrayInput("progressReview", 1)}
            onKeyDown={handleEnter}
            className="w-full bg-transparent outline-none border-b border-black mt-4"
            readOnly={isReadOnly}
          />
        </div>

        {/* Problems */}
        <div className="mb-6 text-[9px] md:text-sm">
          <div className="flex items-end w-full">
            <span className="font-bold mr-2 whitespace-nowrap">Problems:</span>
            <input
              type="text"
              value={formData.problems[0]}
              onChange={handleArrayInput("problems", 0)}
              onKeyDown={handleEnter}
              className="w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm"
              readOnly={isReadOnly}
            />
          </div>
          <input
            type="text"
            value={formData.problems[1]}
            onChange={handleArrayInput("problems", 1)}
            onKeyDown={handleEnter}
            className="w-full bg-transparent outline-none border-b border-black mt-4"
            readOnly={isReadOnly}
          />
        </div>

        {/* Satisfaction Section */}
        <div className="space-y-2 mb-6 text-[9px] md:text-sm font-bold">
          <div className="flex items-center">
            <span className="mr-2">Client Satisfied with Services:</span>
            <label className="flex items-center mr-4 cursor-pointer">
              <span className="mr-1">Yes</span>{" "}
              <input
                type="checkbox"
                checked={formData.satisfaction.clientSatisfiedYes}
                onChange={handleCheckbox([
                  "satisfaction",
                  "clientSatisfiedYes",
                ])}
                disabled={isReadOnly}
              />
            </label>
            <label className="flex items-center cursor-pointer">
              <span className="mr-1">No</span>{" "}
              <input
                type="checkbox"
                checked={formData.satisfaction.clientSatisfiedNo}
                onChange={handleCheckbox(["satisfaction", "clientSatisfiedNo"])}
                disabled={isReadOnly}
              />
            </label>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Appropriateness of Services:</span>
            <label className="flex items-center mr-4 cursor-pointer">
              <span className="mr-1">Yes</span>{" "}
              <input
                type="checkbox"
                checked={formData.satisfaction.appropriatenessYes}
                onChange={handleCheckbox([
                  "satisfaction",
                  "appropriatenessYes",
                ])}
                disabled={isReadOnly}
              />
            </label>
            <label className="flex items-center cursor-pointer">
              <span className="mr-1">No</span>{" "}
              <input
                type="checkbox"
                checked={formData.satisfaction.appropriatenessNo}
                onChange={handleCheckbox(["satisfaction", "appropriatenessNo"])}
                disabled={isReadOnly}
              />
            </label>
          </div>
          <div className="flex items-center">
            <span className="mr-16">Client MF/MC:</span>
            <label className="flex items-center mr-4 cursor-pointer">
              <span className="mr-1">Yes</span>{" "}
              <input
                type="checkbox"
                checked={formData.satisfaction.clientMFMCYes}
                onChange={handleCheckbox(["satisfaction", "clientMFMCYes"])}
                disabled={isReadOnly}
              />
            </label>
            <label className="flex items-center cursor-pointer">
              <span className="mr-1">No</span>{" "}
              <input
                type="checkbox"
                checked={formData.satisfaction.clientMFMCNo}
                onChange={handleCheckbox(["satisfaction", "clientMFMCNo"])}
                disabled={isReadOnly}
              />
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8 text-[9px] md:text-sm">
          <div className="flex items-end w-full">
            <span className="font-bold mr-2 whitespace-nowrap">Notes:</span>
            <input
              type="text"
              name="assessorName"
              value={formData.footer.assessorName}
              onChange={(e) => {
                handleInput(["footer", "assessorName"])(e);
                if(errors.assessorName) setErrors(prev => ({...prev, assessorName: null}));
              }}
              onKeyDown={handleEnter}
              style={getStyle("assessorName")}
              className={`w-full bg-transparent outline-none border-b border-black text-[9px] md:text-sm ${errors.assessorName ? "border-red-500" : ""}`}
              readOnly={isReadOnly}
            />
          </div>
          <input
            type="text"
            value={formData.notes[1]}
            onChange={handleArrayInput("notes", 1)}
            onKeyDown={handleEnter}
            className="w-full bg-transparent outline-none border-b border-black mt-4"
            readOnly={isReadOnly}
          />
        </div>

        {/* Vitals Table */}
        <div className="border border-black mb-2 text-[9px] md:text-sm">
          <div className="grid grid-cols-5 divide-x divide-black h-8">
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">BP:</span>
              <input
                type="text"
                value={formData.vitals.bp}
                onChange={handleInput(["vitals", "bp"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none text-center text-[9px] md:text-sm"
                readOnly={isReadOnly}
              />
            </div>
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">RR:</span>
              <input
                type="text"
                value={formData.vitals.rr}
                onChange={handleInput(["vitals", "rr"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none text-center text-[9px] md:text-sm"
                readOnly={isReadOnly}
              />
            </div>
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">Temp:</span>
              <input
                type="text"
                value={formData.vitals.temp}
                onChange={handleInput(["vitals", "temp"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none text-center text-[9px] md:text-sm"
                readOnly={isReadOnly}
              />
            </div>
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">HR:</span>
              <input
                type="text"
                value={formData.vitals.hr}
                onChange={handleInput(["vitals", "hr"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none text-center text-[9px] md:text-sm"
                readOnly={isReadOnly}
              />
            </div>
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">BS:</span>
              <input
                type="text"
                value={formData.vitals.bs}
                onChange={handleInput(["vitals", "bs"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none text-center text-[9px] md:text-sm"
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

        {/* Assessment Grid */}
        <div className="border border-black text-[9px] md:text-sm mb-12">
          <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">Respiratory:</span>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">WNL</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.respiratory.wnl}
                  onChange={handleCheckbox([
                    "assessment",
                    "respiratory",
                    "wnl",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Rhonchi</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.respiratory.rhonchi}
                  onChange={handleCheckbox([
                    "assessment",
                    "respiratory",
                    "rhonchi",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Crackles</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.respiratory.crackles}
                  onChange={handleCheckbox([
                    "assessment",
                    "respiratory",
                    "crackles",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">Neurological:</span>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">WNL</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.neurological.wnl}
                  onChange={handleCheckbox([
                    "assessment",
                    "neurological",
                    "wnl",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Unsteady gait</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.neurological.unsteadyGait}
                  onChange={handleCheckbox([
                    "assessment",
                    "neurological",
                    "unsteadyGait",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div className="p-1 flex flex-wrap gap-x-2 gap-y-1">
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Diminished</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.respiratory.diminished}
                  onChange={handleCheckbox([
                    "assessment",
                    "respiratory",
                    "diminished",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Wheezing</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.respiratory.wheezing}
                  onChange={handleCheckbox([
                    "assessment",
                    "respiratory",
                    "wheezing",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Rales</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.respiratory.rales}
                  onChange={handleCheckbox([
                    "assessment",
                    "respiratory",
                    "rales",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Other</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.respiratory.other}
                  onChange={handleCheckbox([
                    "assessment",
                    "respiratory",
                    "other",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
            <div className="p-1 flex flex-wrap gap-x-2 gap-y-1">
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Disoriented</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.neurological.disoriented}
                  onChange={handleCheckbox([
                    "assessment",
                    "neurological",
                    "disoriented",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Confused</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.neurological.confused}
                  onChange={handleCheckbox([
                    "assessment",
                    "neurological",
                    "confused",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Forgetful</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.neurological.forgetful}
                  onChange={handleCheckbox([
                    "assessment",
                    "neurological",
                    "forgetful",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">Cardiovascular:</span>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">WNL</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.cardiovascular.wnl}
                  onChange={handleCheckbox([
                    "assessment",
                    "cardiovascular",
                    "wnl",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Chest pain</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.cardiovascular.chestPain}
                  onChange={handleCheckbox([
                    "assessment",
                    "cardiovascular",
                    "chestPain",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">Skin:</span>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">WNL</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.skin.wnl}
                  onChange={handleCheckbox(["assessment", "skin", "wnl"])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Dry</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.skin.dry}
                  onChange={handleCheckbox(["assessment", "skin", "dry"])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Clammy</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.skin.clammy}
                  onChange={handleCheckbox(["assessment", "skin", "clammy"])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Cool</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.skin.cool}
                  onChange={handleCheckbox(["assessment", "skin", "cool"])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">Cap. Refill:</span>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">&lt;3 sec</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.capRefill.less3}
                  onChange={handleCheckbox([
                    "assessment",
                    "capRefill",
                    "less3",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">&gt;3sec</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.capRefill.greater3}
                  onChange={handleCheckbox([
                    "assessment",
                    "capRefill",
                    "greater3",
                  ])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
            <div className="p-1 flex items-center gap-1 min-h-[30px]">
              <span className="font-bold whitespace-nowrap">Wounds:</span>
              <input
                type="text"
                value={formData.assessment.wounds}
                onChange={handleInput(["assessment", "wounds"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none px-1 text-[9px] md:text-sm"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-black">
            <div className="p-1 flex items-center gap-1">
              <span className="font-bold">Edema:</span>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">Pitting</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.edema.pitting}
                  onChange={handleCheckbox(["assessment", "edema", "pitting"])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">1+</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.edema.plus1}
                  onChange={handleCheckbox(["assessment", "edema", "plus1"])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">2+</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.edema.plus2}
                  onChange={handleCheckbox(["assessment", "edema", "plus2"])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">3+</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.edema.plus3}
                  onChange={handleCheckbox(["assessment", "edema", "plus3"])}
                  disabled={isReadOnly}
                />
              </label>
              <label className="flex items-center gap-0.5">
                <span className="whitespace-nowrap">4+</span>
                <input
                  type="checkbox"
                  checked={formData.assessment.edema.plus4}
                  onChange={handleCheckbox(["assessment", "edema", "plus4"])}
                  disabled={isReadOnly}
                />
              </label>
            </div>
            <div className="p-1 flex items-center gap-1 min-h-[30px]">
              <span className="font-bold whitespace-nowrap">Notes:</span>
              <input
                type="text"
                value={formData.assessment.edemaNotes}
                onChange={handleInput(["assessment", "edemaNotes"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none px-1 text-[9px] md:text-sm"
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end mb-8 text-[9px] md:text-sm">
          <span className="font-bold mr-2 whitespace-nowrap">
            Assessor Name: <RequiredStar />
          </span>
          <input
            type="text"
            value={formData.footer.assessorName}
            onChange={(e) => {
              handleInput(["footer", "assessorName"])(e);
              if(errors.assessorName) setErrors(prev => ({...prev, assessorName: null}));
            }}
            onKeyDown={handleEnter}
            style={getStyle("assessorName")}
            className={`flex-grow min-w-0 ${errors.assessorName ? "border-red-500" : ""}`}
            readOnly={isReadOnly}
          />
          <span className="font-bold ml-4 mr-2 whitespace-nowrap">
            Date: <RequiredStar />
          </span>
          <input
            type="date"
            value={formData.footer.date}
            onChange={(e) => {
              handleInput(["footer", "date"])(e);
              if(errors.assessorDate) setErrors(prev => ({...prev, assessorDate: null}));
            }}
            onKeyDown={handleEnter}
            style={getStyle("assessorDate")}
            className={`w-24 md:w-32 ${errors.assessorDate ? "border-red-500" : ""}`}
            readOnly={isReadOnly}
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex justify-between items-center mt-auto pt-8 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => { window.location.href = "/my-application"; }}
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
};

export default HomeSupervisoryVisitForm;
