import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";

const RiskMitigationPlan = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    patientInfo: {
      name: "",
      address: "",
      diagnosis: "",
      allergies: "",
      city: "",
      dob: "",
      state: "",
      planDate: "",
      zip: "",
    },
    planStatus: "", // 'Developed' or 'NotNeeded'
    risks: Array(8).fill({ statement: "", action: "" }),
    staffTraining: Array(6).fill({ name: "", signatureDate: "" }),
    customContacts: Array(5).fill({
      name: "",
      address: "",
      phone: "",
      relationship: "",
    }),
    closestHospital: { address: "", phone: "" },
    disasterEvacSite: { address: "", phone: "" },
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { path: ["patientInfo", "name"], label: "Name" },
      { path: ["patientInfo", "diagnosis"], label: "Diagnosis" },
      { path: ["patientInfo", "allergies"], label: "Allergies" },
      { path: ["patientInfo", "planDate"], label: "Plan Date" },
    ];

    requiredFields.forEach((field) => {
      let value = formData;
      field.path.forEach((p) => {
        value = value ? value[p] : undefined;
      });

      if (!value || String(value).trim() === "") {
        newErrors[field.path.join(".")] = `${field.label} is required`;
      }
    });

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

  const handleChange = (section, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handlePlanStatusChange = (status) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, planStatus: status }));
  };

  const handleRiskChange = (index, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newRisks = [...prev.risks];
      newRisks[index] = { ...newRisks[index], [field]: value };
      return { ...prev, risks: newRisks };
    });
  };

  const handleTrainingChange = (index, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newTraining = [...prev.staffTraining];
      newTraining[index] = { ...newTraining[index], [field]: value };
      return { ...prev, staffTraining: newTraining };
    });
  };

  const handleCustomContactChange = (index, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newContacts = [...prev.customContacts];
      newContacts[index] = { ...newContacts[index], [field]: value };
      return { ...prev, customContacts: newContacts };
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
    console.log("RiskMitigationPlan Data:", formData);
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

  return (
    <div className="flex w-full items-start bg-white text-black font-serif">
      <div className="sticky top-0 self-start hidden md:flex flex-col items-center py-8 shrink-0 bg-white/50 backdrop-blur-sm z-10 h-screen">
        <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />
      </div>

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

          {/* --- PAGE 1 --- */}

          {/* Header */}
          <h1 className="text-center font-bold text-lg md:text-xl underline uppercase mb-6">
            RISK MITIGATION PLAN
          </h1>

          {/* Patient Info Table */}
          <div className="border border-black mb-6 text-[10px] md:text-sm">
            {/* Row 1 */}
            <div className="flex border-b border-black">
              <div className="w-[15%] p-1 font-bold border-r border-black flex items-center">
                Name:
              </div>
              <div className="w-[35%] p-1 border-r border-black">
                <input
                  type="text"
                  name="patientInfo.name"
                  className="w-full bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.name}
                  onChange={(e) =>
                    handleChange("patientInfo", "name", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  style={getStyle("patientInfo.name")}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="w-[50%] p-1 font-bold bg-gray-300 text-center flex items-center justify-center">
                Address
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex border-b border-black">
              <div className="w-[15%] p-1 font-bold border-r border-black flex items-center">
                Diagnosis:
              </div>
              <div className="w-[35%] p-1 border-r border-black">
                <input
                  type="text"
                  name="patientInfo.diagnosis"
                  className="w-full bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.diagnosis}
                  onChange={(e) =>
                    handleChange("patientInfo", "diagnosis", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  style={getStyle("patientInfo.diagnosis")}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="w-[50%] p-1">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.address}
                  onChange={(e) =>
                    handleChange("patientInfo", "address", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            {/* Row 3 */}
            <div className="flex border-b border-black">
              <div className="w-[15%] p-1 font-bold border-r border-black flex items-center">
                Allergies:
              </div>
              <div className="w-[35%] p-1 border-r border-black">
                <input
                  type="text"
                  name="patientInfo.allergies"
                  className="w-full bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.allergies}
                  onChange={(e) =>
                    handleChange("patientInfo", "allergies", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  style={getStyle("patientInfo.allergies")}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="w-[50%] p-1 flex items-center gap-1">
                <span className="font-bold">City:</span>
                <input
                  type="text"
                  className="flex-grow bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.city}
                  onChange={(e) =>
                    handleChange("patientInfo", "city", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            {/* Row 4 */}
            <div className="flex border-b border-black">
              <div className="w-[15%] p-1 font-bold border-r border-black flex items-center">
                Date of Birth:
              </div>
              <div className="w-[35%] p-1 border-r border-black">
                <input
                  type="date"
                  className="w-full bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.dob}
                  onChange={(e) =>
                    handleChange("patientInfo", "dob", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="w-[50%] p-1 flex items-center gap-1">
                <span className="font-bold">State:</span>
                <input
                  type="text"
                  className="flex-grow bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.state}
                  onChange={(e) =>
                    handleChange("patientInfo", "state", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            {/* Row 5 */}
            <div className="flex">
              <div className="w-[15%] p-1 font-bold border-r border-black flex items-center">
                Date of Plan:
              </div>
              <div className="w-[35%] p-1 border-r border-black">
                <input
                  type="date"
                  name="patientInfo.planDate"
                  className="w-full bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.planDate}
                  onChange={(e) =>
                    handleChange("patientInfo", "planDate", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  style={getStyle("patientInfo.planDate")}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="w-[50%] p-1 flex items-center gap-1">
                <span className="font-bold">Zip Code:</span>
                <input
                  type="text"
                  className="flex-grow bg-transparent outline-none min-w-0"
                  value={formData.patientInfo.zip}
                  onChange={(e) =>
                    handleChange("patientInfo", "zip", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="border border-black mb-1 p-1">
            <label className="flex items-center gap-2 font-bold select-none cursor-pointer">
              <input
                type="checkbox"
                checked={formData.planStatus === "Developed"}
                onChange={() => handlePlanStatusChange("Developed")}
                disabled={isReadOnly}
              />
              A Risk Mitigation Plan is developed for this Individual
            </label>
            <label className="flex items-center gap-2 font-bold select-none cursor-pointer">
              <input
                type="checkbox"
                checked={formData.planStatus === "NotNeeded"}
                onChange={() => handlePlanStatusChange("NotNeeded")}
                disabled={isReadOnly}
              />
              A risk Mitigation plan is not needed for this individual
            </label>
          </div>

          {/* Rationale */}
          <div className="border border-black p-1 mb-1 text-justify">
            <span className="font-bold">Plan Rationale:</span> The goal of this
            plan is to keep the individual and staff working with him/her
            healthy and safe in the event of a crisis situation. The plan will
            have a documented review at least 365 days from the date from the
            last review of effectiveness, applicability, quality of accuracy.
          </div>

          {/* Risk Mitigation Table */}
          <div className="border border-black mb-8">
            <div className="bg-gray-400 text-center font-bold border-b border-black">
              RISK MITIGATION PLAN
            </div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-1 font-bold border-r border-black">
                Statement and Description of known conditions/ risks/ diagnosis/
                vulnerabilities
              </div>
              <div className="p-1 font-bold">Action steps</div>
            </div>
            {/* Rows */}
            {formData.risks.map((risk, i) => (
              <div
                key={i}
                className="grid grid-cols-2 border-b border-black min-h-[40px]"
              >
                <div className="border-r border-black p-1">
                  <textarea
                    className="w-full h-full bg-transparent outline-none resize-none overflow-hidden min-w-0"
                    rows={2}
                    value={risk.statement}
                    onChange={(e) =>
                      handleRiskChange(i, "statement", e.target.value)
                    }
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="p-1">
                  <textarea
                    className="w-full h-full bg-transparent outline-none resize-none overflow-hidden min-w-0"
                    rows={2}
                    value={risk.action}
                    onChange={(e) =>
                      handleRiskChange(i, "action", e.target.value)
                    }
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] mb-8">
            This risk mitigation plan is reviewed at least annually and promptly
            revised as my diagnosis/risk status changes.
          </div>

          {/* --- PAGE 2 --- */}
          <div className="mt-8 border-t-2 border-black pt-8"></div>

          {/* Staff Training Table */}
          <div className="border border-black mb-8 text-[11px] md:text-xs">
            <div className="p-1 border-b border-black">
              <span className="font-bold">Staff Training:</span> Individual
              staff will be trained on how to effectively implement all
              interventions outlined in this plan. Any new staff should be
              trained prior to working with individual.
            </div>
            <div className="grid grid-cols-2 border-b border-black font-bold text-center">
              <div className="p-1 border-r border-black">Name</div>
              <div className="p-1">Signature and date</div>
            </div>
            {formData.staffTraining.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 border-b border-black min-h-[30px]"
              >
                <div className="border-r border-black p-1">
                  <input
                    className="w-full outline-none min-w-0 bg-transparent"
                    value={row.name}
                    onChange={(e) =>
                      handleTrainingChange(i, "name", e.target.value)
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="p-1">
                  <input
                    className="w-full outline-none min-w-0 bg-transparent"
                    value={row.signatureDate}
                    onChange={(e) =>
                      handleTrainingChange(i, "signatureDate", e.target.value)
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contacts Table */}
          <div className="border border-black text-[11px] md:text-sm">
            {/* Header */}
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black font-bold bg-gray-100">
              <div className="p-1 border-r border-black">Name</div>
              <div className="p-1 border-r border-black">Address</div>
              <div className="p-1 border-r border-black">Phone</div>
              <div className="p-1">Relationship</div>
            </div>

            {/* Custom Rows x 5 */}
            {formData.customContacts.map((contact, i) => (
              <div
                key={i}
                className="grid grid-cols-[20%_35%_25%_20%] border-b border-black min-h-[24px]"
              >
                <div className="p-1 border-r border-black">
                  <input
                    className="w-full outline-none min-w-0 bg-transparent"
                    value={contact.name}
                    onChange={(e) =>
                      handleCustomContactChange(i, "name", e.target.value)
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="p-1 border-r border-black">
                  <input
                    className="w-full outline-none min-w-0 bg-transparent"
                    value={contact.address}
                    onChange={(e) =>
                      handleCustomContactChange(i, "address", e.target.value)
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="p-1 border-r border-black">
                  <input
                    className="w-full outline-none min-w-0 bg-transparent"
                    value={contact.phone}
                    onChange={(e) =>
                      handleCustomContactChange(i, "phone", e.target.value)
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="p-1">
                  <input
                    className="w-full outline-none min-w-0 bg-transparent"
                    value={contact.relationship}
                    onChange={(e) =>
                      handleCustomContactChange(
                        i,
                        "relationship",
                        e.target.value,
                      )
                    }
                    onKeyDown={handleEnter}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            ))}

            {/* Pre-filled Rows */}
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-semibold">
                Fire Department
              </div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1">Emergency</div>
            </div>
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-semibold">
                City Police
              </div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1">Emergency</div>
            </div>
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-semibold">
                Sheriff Department
              </div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1">Emergency</div>
            </div>
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-semibold">
                Ambulance
              </div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1">Emergency</div>
            </div>
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-semibold">
                Poison Control
              </div>
              <div className="p-1 border-r border-black"></div>
              <div className="p-1 border-r border-black">1-800-222-1222</div>
              <div className="p-1">Emergency</div>
            </div>
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-semibold">
                Closest Hospital
              </div>
              <div className="p-1 border-r border-black">
                <input
                  className="w-full outline-none min-w-0 bg-transparent"
                  value={formData.closestHospital.address}
                  onChange={(e) =>
                    handleChange("closestHospital", "address", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 border-r border-black">
                <input
                  className="w-full outline-none min-w-0 bg-transparent"
                  value={formData.closestHospital.phone}
                  onChange={(e) =>
                    handleChange("closestHospital", "phone", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1">Emergency</div>
            </div>
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-semibold">
                Closest Disaster Evacuation Site
              </div>
              <div className="p-1 border-r border-black">
                <input
                  className="w-full outline-none min-w-0 bg-transparent"
                  value={formData.disasterEvacSite.address}
                  onChange={(e) =>
                    handleChange("disasterEvacSite", "address", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1 border-r border-black">
                <input
                  className="w-full outline-none min-w-0 bg-transparent"
                  value={formData.disasterEvacSite.phone}
                  onChange={(e) =>
                    handleChange("disasterEvacSite", "phone", e.target.value)
                  }
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-1">Emergency</div>
            </div>

            {/* Pacific Health Systems Row */}
            <div className="grid grid-cols-[20%_35%_25%_20%] border-b border-black">
              <div className="p-1 border-r border-black font-bold ">
                Pacific Health Systems, LLC
              </div>
              <div className="p-1 border-r border-black">
                303 Corporate Center Dr Suite 325,
                <br />
                Stockbridge, GA 30281
              </div>
              <div className="p-1 border-r border-black text-[8px] md:text-sm break-words leading-tight">
                678-782-2474
                <br />
                678-751-5183(Text)
                <br />
                404-566-0014 (Nurse)
              </div>
              <div className="p-1">Provider</div>
            </div>
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

export default RiskMitigationPlan;
