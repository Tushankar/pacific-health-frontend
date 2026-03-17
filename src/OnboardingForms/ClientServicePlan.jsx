import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const ClientServicePlan = ({
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
    telephone: "",
    address: "",
    city: "",
    age: "",
    diagnoses: "",
    goals: {
      independence: false,
      nutrition: false,
      hygiene: false,
      other: false,
      otherText: "",
    },
    directionsToHome: "",
    limitations: {
      unsteadyGait: false,
      hoh: false,
      impairedSpeech: false,
      rlWeakness: false,
      decreasedSensory: false,
      cognitive: false,
      incontinence: false,
      other: false,
    },
    equipment: "",
    frequencyDuration: "",
    dischargePlans: {
      pc: false,
      cis: false,
      nursing: false,
    },
    tasks: {
      bath: false,
      oralCare: false,
      dressing: false,
      toileting: false,
      hairCare: false,
      grooming: false,
      ambulation: false,
      transfer: false,
      positionValue: "",
      observeSkin: false,
      feeding: false,
      mealPrep: false,
      medicationReminder: false,
      prescriptions: false,
      errands: false,
      cleanRoom: false,
      laundry: false,
      vacuum: false,
      sweepMop: false,
      removeTrash: false,
      washDishes: false,
      billPaying: false,
      other: false,
    },
    diet: "",
    specialInstructions: "",
    extraTasks: {
      dust: false,
      cleanKitchen: false,
      mdAppointment: false,
      oversight: false,
      cleanBathroom: false,
      incontinenceCare: false,
      vitalSigns: false,
      vitalSignsRange: "",
      bloodSugar: false,
      bloodSugarRange: "",
    },
    initialPlan: {
      date: "",
      sig1: "",
      sig2: "",
    },
    updatePlan1: {
      date: "",
      sig1: "",
      sig2: "",
    },
    updatePlan2: {
      date: "",
      sig1: "",
      sig2: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { key: "name", label: "Name" },
      { key: "telephone", label: "Telephone" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "age", label: "Age" },
      { key: "diagnoses", label: "Diagnoses" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key] || String(formData[field.key]).trim() === "") {
        newErrors[field.key] = true;
      }
    });

    if (!formData.initialPlan.date) newErrors["initialPlan.date"] = true;
    if (!formData.initialPlan.sig1) newErrors["initialPlan.sig1"] = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({ ...prev, ...savedData }));
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

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      setTimeout(() => {
        const firstErrorField = document.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          if (
            firstErrorField.tagName === "INPUT" ||
            firstErrorField.tagName === "TEXTAREA"
          ) {
            firstErrorField.focus();
          }
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
    borderBottom: errors[field] ? "2px solid #ef4444" : "none",
    transition: "all 0.2s",
  });

  const borderStyle = (field) => ({
    outline: "none",
    background: errors[field] ? "#fee2e2" : "transparent",
    border: errors[field] ? "1px solid #ef4444" : "none",
    width: "100%",
    transition: "all 0.2s",
  });

  const RequiredStar = () => (
    <span className="text-red-500 ml-1 italic font-bold">*</span>
  );

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <form
          onSubmit={handleSubmit}
          className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug shadow-lg rounded-t-lg"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-12 md:h-16 object-contain mb-2"
            />
            <h2 className="text-sm md:text-lg font-bold text-center">
              Client Service Plan
            </h2>
          </div>

          {/* Client Info Grid */}
          <div className="border border-black mb-1">
            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] border-b border-black text-[9px] md:text-sm">
              <div
                className={`p-1 border-b md:border-b-0 md:border-r border-black flex ${errors.name ? "bg-red-50" : ""}`}
              >
                <span className="font-bold mr-1">
                  Name: <RequiredStar />{" "}
                </span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  style={getStyle("name")}
                  className={`flex-1 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              <div
                className={`p-1 flex ${errors.telephone ? "bg-red-50" : ""}`}
              >
                <span className="font-bold mr-1">
                  Telephone: <RequiredStar />{" "}
                </span>
                <input
                  name="telephone"
                  value={formData.telephone}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.telephone)
                      setErrors((prev) => ({ ...prev, telephone: null }));
                  }}
                  style={getStyle("telephone")}
                  className={`flex-1 ${errors.telephone ? "border-red-500" : ""}`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b border-black">
              <div
                className={`p-1 border-b md:border-b-0 md:border-r border-black flex ${errors.address ? "bg-red-50" : ""}`}
              >
                <span className="font-bold mr-1">
                  Address: <RequiredStar />{" "}
                </span>
                <input
                  name="address"
                  value={formData.address}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.address)
                      setErrors((prev) => ({ ...prev, address: null }));
                  }}
                  style={getStyle("address")}
                  className={`flex-1 ${errors.address ? "border-red-500" : ""}`}
                />
              </div>
              <div
                className={`p-1 border-b md:border-b-0 md:border-r border-black flex ${errors.city ? "bg-red-50" : ""}`}
              >
                <span className="font-bold mr-1">
                  City: <RequiredStar />{" "}
                </span>
                <input
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.city)
                      setErrors((prev) => ({ ...prev, city: null }));
                  }}
                  style={getStyle("city")}
                  className={`flex-1 ${errors.city ? "border-red-500" : ""}`}
                />
              </div>
              <div className={`p-1 flex ${errors.age ? "bg-red-50" : ""}`}>
                <span className="font-bold mr-1">
                  Age: <RequiredStar />{" "}
                </span>
                <input
                  name="age"
                  value={formData.age}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.age)
                      setErrors((prev) => ({ ...prev, age: null }));
                  }}
                  style={getStyle("age")}
                  className={`flex-1 ${errors.age ? "border-red-500" : ""}`}
                />
              </div>
            </div>
            <div className={`p-1 ${errors.diagnoses ? "bg-red-50" : ""}`}>
              <span className="font-bold block">
                Client Diagnoses: <RequiredStar />{" "}
              </span>
              <textarea
                name="diagnoses"
                value={formData.diagnoses}
                onChange={(e) => {
                  handleChange(e);
                  if (errors.diagnoses)
                    setErrors((prev) => ({ ...prev, diagnoses: null }));
                }}
                style={borderStyle("diagnoses")}
                className={`w-full resize-none h-4 ${errors.diagnoses ? "border-red-500" : ""}`}
              />
            </div>
          </div>

          {/* Goals & Directions */}
          <div className="border border-black border-t-0 mb-0 grid grid-cols-1 md:grid-cols-2">
            {/* Left: Client Goals */}
            <div className="p-1 border-b md:border-b-0 md:border-r border-black">
              <span className="font-bold block mb-1">Client Goals:</span>
              <div className="space-y-0.5">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="goals.independence"
                    checked={formData.goals.independence}
                    onChange={handleChange}
                  />{" "}
                  Maintain optimal level of independence
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="goals.nutrition"
                    checked={formData.goals.nutrition}
                    onChange={handleChange}
                  />{" "}
                  Proper Nutrition
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="goals.hygiene"
                    checked={formData.goals.hygiene}
                    onChange={handleChange}
                  />{" "}
                  Personal Hygiene
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="goals.other"
                    checked={formData.goals.other}
                    onChange={handleChange}
                  />{" "}
                  Other:{" "}
                  <input
                    name="goals.otherText"
                    value={formData.goals.otherText}
                    onChange={handleChange}
                    className="border-b border-black w-24 outline-none bg-transparent"
                  />
                </label>
              </div>
            </div>

            {/* Right: Directions to Home */}
            <div className="p-1">
              <span className="font-bold block">Directions to Home:</span>
              <textarea
                name="directionsToHome"
                value={formData.directionsToHome}
                onChange={handleChange}
                className="w-full h-24 resize-none outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Functional Limitations */}
          <div className="border border-black border-t-0 p-1 mb-0 border-b border-black bg-gray-50">
            <span className="font-bold mr-1 block md:inline">
              Functional Limitations:
            </span>
            <div className="inline-flex gap-2 flex-wrap">
              {[
                { label: "Unsteady gait", name: "limitations.unsteadyGait" },
                { label: "HOH", name: "limitations.hoh" },
                {
                  label: "Impaired Speech",
                  name: "limitations.impairedSpeech",
                },
                { label: "R/L sided weakness", name: "limitations.rlWeakness" },
                {
                  label: "Decreased Sensory",
                  name: "limitations.decreasedSensory",
                },
                { label: "Cognitive", name: "limitations.cognitive" },
                { label: "Incontinence", name: "limitations.incontinence" },
                { label: "Other", name: "limitations.other" },
              ].map((lim) => (
                <label key={lim.name} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={lim.name}
                    checked={lim.name
                      .split(".")
                      .reduce((o, i) => o[i], formData)}
                    onChange={handleChange}
                  />
                  {lim.label}
                </label>
              ))}
            </div>
          </div>

          {/* Equipment & Frequency Grid */}
          <div className="border border-black border-t-0 grid grid-cols-1 md:grid-cols-2">
            {/* Row 1 Col 1: Equipment */}
            <div className="p-1 border-b md:border-b-0 md:border-r border-black h-auto md:h-24">
              <span className="font-bold block">Equipment:</span>
              <textarea
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full h-full resize-none outline-none bg-transparent pt-1"
              />
            </div>

            {/* Row 1 Col 2: Discharge Plans */}
            <div className="p-1 border-b border-black h-auto md:h-24 flex items-center">
              <span className="font-bold">
                Discharge Plans: Until Services Are No Longer Needed
              </span>
            </div>

            {/* Row 2 Col 1: Frequency Label */}
            <div className="p-1 border-b md:border-b-0 md:border-r border-black flex items-center h-auto md:h-12">
              <span className="font-bold">
                Frequency and Duration of Services:
              </span>
            </div>

            {/* Row 2 Col 2: Frequency Checkboxes */}
            <div className="p-1 flex items-center justify-around h-auto md:h-12 py-2 md:py-0">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="dischargePlans.pc"
                  checked={formData.dischargePlans.pc}
                  onChange={handleChange}
                />{" "}
                PC
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="dischargePlans.cis"
                  checked={formData.dischargePlans.cis}
                  onChange={handleChange}
                />{" "}
                C/S
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="dischargePlans.nursing"
                  checked={formData.dischargePlans.nursing}
                  onChange={handleChange}
                />{" "}
                Nursing
              </label>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="border border-black border-t-0 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] flex-1">
            {/* Left Col - Tasks */}
            <div className="border-b md:border-b-0 md:border-r border-black">
              <div className="font-bold border-b border-black p-1 bg-gray-50">
                Tasks to be Performed:
              </div>
              <div className="flex flex-col">
                {[
                  { label: "Bath", name: "tasks.bath" },
                  { label: "Oral Care", name: "tasks.oralCare" },
                  { label: "Dressing", name: "tasks.dressing" },
                  { label: "Toileting", name: "tasks.toileting" },
                  { label: "Hair Care", name: "tasks.hairCare" },
                  { label: "Grooming", name: "tasks.grooming" },
                  { label: "Assist with ambulation", name: "tasks.ambulation" },
                  { label: "Assist with transfer", name: "tasks.transfer" },
                ].map(({ label, name }) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 border-b border-black p-1"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={name.split(".").reduce((o, i) => o[i], formData)}
                      onChange={handleChange}
                    />
                    <span>{label}</span>
                  </label>
                ))}

                <label className="flex items-center gap-2 border-b border-black p-1">
                  <input
                    type="checkbox"
                    name="tasks.positioning"
                    checked={formData.tasks.positioning}
                    onChange={handleChange}
                  />
                  <div className="flex items-center gap-1">
                    <span>Position q</span>
                    <input
                      name="tasks.positionValue"
                      value={formData.tasks.positionValue}
                      onChange={handleChange}
                      className="w-12 border-b border-black text-center outline-none bg-transparent"
                    />
                    <span>hrs</span>
                  </div>
                </label>

                {[
                  { label: "Observe Skin", name: "tasks.observeSkin" },
                  { label: "Assist with feeding", name: "tasks.feeding" },
                  { label: "Meal Prep", name: "tasks.mealPrep" },
                  {
                    label: "Medication Reminder",
                    name: "tasks.medicationReminder",
                  },
                  {
                    label: "Pick up prescriptions",
                    name: "tasks.prescriptions",
                  },
                  { label: "Grocery shopping/Errands", name: "tasks.errands" },
                  { label: "Clean client room/area", name: "tasks.cleanRoom" },
                  { label: "Laundry/Change Linen", name: "tasks.laundry" },
                  { label: "Vacuum", name: "tasks.vacuum" },
                  { label: "Sweep/Mop", name: "tasks.sweepMop" },
                  { label: "Remove Trash", name: "tasks.removeTrash" },
                  { label: "Wash Dishes", name: "tasks.washDishes" },
                  { label: "Bill Paying", name: "tasks.billPaying" },
                  { label: "Other", name: "tasks.other" },
                ].map(({ label, name }) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 border-b border-black p-1"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={name.split(".").reduce((o, i) => o[i], formData)}
                      onChange={handleChange}
                    />
                    <span>{label}</span>
                  </label>
                ))}

                <div className="flex p-1 h-full items-center">
                  <span className="font-bold mr-2">DIET:</span>
                  <input
                    name="diet"
                    value={formData.diet}
                    onChange={handleChange}
                    className="flex-1 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Col - Special Instructions & More Tasks */}

            <div className="flex flex-col">
              <div className="p-1 border-b border-black font-bold bg-gray-50">
                Special Instructions:
              </div>
              <div className="p-2 border-b border-black">
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  className="w-full h-48 resize-none outline-none border-2 border-green-500 rounded p-1"
                />
              </div>

              <div className="flex flex-col">
                {[
                  { label: "Dust", name: "extraTasks.dust" },
                  { label: "Clean kitchen", name: "extraTasks.cleanKitchen" },
                  {
                    label: "Accompany to MD appointment",
                    name: "extraTasks.mdAppointment",
                  },
                  {
                    label: "Provide watchful oversight",
                    name: "extraTasks.oversight",
                  },
                  { label: "Clean Bathroom", name: "extraTasks.cleanBathroom" },
                  {
                    label: "Incontinence Care",
                    name: "extraTasks.incontinenceCare",
                  },
                  { label: "Vital Signs", name: "extraTasks.vitalSigns" },
                  { label: "Blood Sugar", name: "extraTasks.bloodSugar" },
                ].map(({ label, name }) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 border-b border-black p-1 last:border-b-0 md:last:border-b"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={name.split(".").reduce((o, i) => o[i], formData)}
                      onChange={handleChange}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="border border-black border-t-0 mb-8">
            {/* Row 1 */}

            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
              <div
                className={`p-1 border-b md:border-b-0 md:border-r border-black flex items-center ${errors["initialPlan.date"] ? "bg-red-50" : ""}`}
              >
                <span className="font-bold mr-2">
                  Initial Plan Date: <RequiredStar />{" "}
                </span>
                <input
                  type="date"
                  name="initialPlan.date"
                  value={formData.initialPlan.date}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors["initialPlan.date"])
                      setErrors((prev) => ({
                        ...prev,
                        "initialPlan.date": null,
                      }));
                  }}
                  style={getStyle("initialPlan.date")}
                  className={`flex-1 ${errors["initialPlan.date"] ? "border-red-500" : ""}`}
                />
              </div>
              <div
                className={`p-1 flex items-center ${errors["initialPlan.sig1"] ? "bg-red-50" : ""}`}
              >
                <span className="font-bold mr-2">
                  Signature: <RequiredStar />{" "}
                </span>
                <input
                  name="initialPlan.sig1"
                  value={formData.initialPlan.sig1}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors["initialPlan.sig1"])
                      setErrors((prev) => ({
                        ...prev,
                        "initialPlan.sig1": null,
                      }));
                  }}
                  style={getStyle("initialPlan.sig1")}
                  className={`flex-1 ${errors["initialPlan.sig1"] ? "border-red-500 shadow-sm" : ""}`}
                />
              </div>
            </div>

            {/* Row 2 */}

            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
              <div className="p-1 border-b md:border-b-0 md:border-r border-black flex items-center">
                <span className="font-bold mr-2">Update Plan:</span>
                <input
                  name="updatePlan1.date"
                  value={formData.updatePlan1.date}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
              <div className="p-1 flex items-center">
                <span className="font-bold mr-2">Signature:</span>
                <input
                  name="updatePlan1.sig1"
                  value={formData.updatePlan1.sig1}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
              <div className="p-1 border-b md:border-b-0 md:border-r border-black flex items-center">
                <span className="font-bold mr-2">Update Plan:</span>
                <input
                  name="updatePlan1.date"
                  value={formData.updatePlan1.date}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
              <div className="p-1 flex items-center">
                <span className="font-bold mr-2">Signature:</span>
                <input
                  name="updatePlan1.sig1"
                  value={formData.updatePlan1.sig1}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-1 border-b md:border-b-0 md:border-r border-black flex items-center">
                <span className="font-bold mr-2">Update Plan:</span>
                <input
                  name="updatePlan2.date"
                  value={formData.updatePlan2.date}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
              <div className="p-1 flex items-center">
                <span className="font-bold mr-2">Signature:</span>
                <input
                  name="updatePlan2.sig2"
                  value={formData.updatePlan2.sig2}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}

          {/* Action Buttons */}
          <div className="w-full px-2 md:px-8 py-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
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

export default ClientServicePlan;

