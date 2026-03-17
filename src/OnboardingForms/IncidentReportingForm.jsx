import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";

const IncidentReportingForm = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    incidentTypes: {
      abuse: {
        physical: false,
        verbal: false,
        sexual: false,
        mental: false,
        staffToClient: false,
      },
      death: {
        unexpected: false,
        waiverRequestPending: false,
        hospiceProvided: false,
        called911: false,
        time911: "",
      },
      cprStaff: "",
      seriousInjury: {
        resultedInDeath: false,
        hospitalAdmission: false,
        erVisit: false,
        mdVisit: false,
      },
      externalDisaster: {
        fire: false,
        flood: false,
        physicalPlantDamage: false,
        clientsRelocated: false,
      },
      missingResident: { policeNotifiedDate: "", policeNotifiedTime: "" },
      memoryImpairment: false,
      other: {
        neglect: false,
        exploitation: false,
        criminalRecord: false,
        insuranceWill: false,
        specify: "",
      },
    },
    details: {
      residentNames: "",
      dateOfIncident: "",
      timeOfIncident: "",
      incidentDetails: ["", "", ""],
    },
    notifications: {
      residentName: "",
      familyGuardian: "",
      physician: "",
      police: "",
      otherNotify: "",
      perpetratorName: "",
      relationshipToResident: "",
      currentAddress: "",
      phone: "",
      cityStateZip: "",
      witnessNames: "",
      witnessAddress: "",
      witnessPhone: "",
      witnessRelationship: "",
    },
    mitigationSteps: ["", "", "", ""],
    footer: {
      reporter: "",
      title: "",
      dateOfReport: "",
      timeOfReport: "",
    },
    incidentChecks: {
      abuse: false,
      death: false,
      seriousInjury: false,
      externalDisaster: false,
      missingResident: false,
    },
  });

  // Updated handlers to respect isReadOnly
  const updateState = (path, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  const handleCheckbox = (path) => (e) => updateState(path, e.target.checked);
  const handleInput = (path) => (e) => updateState(path, e.target.value);
  const handleArrayInput = (path, index) => (e) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      const newArray = [...current[path[path.length - 1]]];
      newArray[index] = e.target.value;
      current[path[path.length - 1]] = newArray;
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

  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({ ...prev, ...savedData }));
    }
  }, [savedData]);

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
      if (onComplete) {
        // Ensure we send the core formData to onComplete
        await onComplete(formData);
      } else {
        console.log("Form submitted successfully!", formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        <form
          onKeyDown={handleEnter}
          onSubmit={handleSubmit}
          className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg"
        >
          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-16 object-contain mb-2"
            />
            <h1 className="text-sm md:text-lg font-bold text-center uppercase">
              INCIDENT REPORTING FORM
            </h1>
          </div>

          <div className="border-2 border-black mb-6">
            <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] border-b border-black">
              <div className="bg-gray-300 p-1 border-r border-black font-bold">
                Agency Address
              </div>
              <div className="p-1">
                303 Corporate Center Dr. Suite 325 Stockbridge GA 30281
              </div>
            </div>
            <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] border-b border-black">
              <div className="bg-gray-300 p-1 border-r border-black font-bold">
                County
              </div>
              <div className="p-1">Henry</div>
            </div>
            <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] border-b border-black">
              <div className="bg-gray-300 p-1 border-r border-black font-bold">
                Phone
              </div>
              <div className="p-1">678-7782-2473</div>
            </div>
            <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] border-b border-black">
              <div className="bg-gray-300 p-1 border-r border-black font-bold">
                Fax
              </div>
              <div className="p-1">678-669-1693</div>
            </div>
            <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] border-b border-black">
              <div className="bg-gray-300 p-1 border-r border-black font-bold">
                Email
              </div>
              <div className="p-1 text-blue-600 underline cursor-pointer">
                Claudia.campbell@pacifichealthsystems.net
              </div>
            </div>
            <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr]">
              <div className="bg-gray-300 p-1 border-r border-black font-bold">
                Administrator
              </div>
              <div className="p-1">Clauda Campbell</div>
            </div>
          </div>

          <div className="mb-4 font-bold">
            Type of Incident (check all that apply):
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <input
              type="checkbox"
              className="mr-1"
              checked={formData.incidentChecks?.abuse || false}
              onChange={handleCheckbox(["incidentChecks", "abuse"])}
              disabled={isReadOnly}
            />
            <span className="font-bold">Abuse:</span>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.abuse.physical}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "abuse",
                  "physical",
                ])}
                disabled={isReadOnly}
              />{" "}
              Physical
            </label>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.abuse.verbal}
                onChange={handleCheckbox(["incidentTypes", "abuse", "verbal"])}
                disabled={isReadOnly}
              />{" "}
              Verbal
            </label>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.abuse.sexual}
                onChange={handleCheckbox(["incidentTypes", "abuse", "sexual"])}
                disabled={isReadOnly}
              />{" "}
              Sexual
            </label>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.abuse.mental}
                onChange={handleCheckbox(["incidentTypes", "abuse", "mental"])}
                disabled={isReadOnly}
              />{" "}
              mental
            </label>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.abuse.staffToClient}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "abuse",
                  "staffToClient",
                ])}
                disabled={isReadOnly}
              />{" "}
              Staff to Client
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <input
              type="checkbox"
              className="mr-1"
              checked={formData.incidentChecks?.death || false}
              onChange={handleCheckbox(["incidentChecks", "death"])}
              disabled={isReadOnly}
            />
            <span className="font-bold">Death:</span>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.death.unexpected}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "death",
                  "unexpected",
                ])}
                disabled={isReadOnly}
              />{" "}
              Unexpected
            </label>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.death.waiverRequestPending}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "death",
                  "waiverRequestPending",
                ])}
                disabled={isReadOnly}
              />{" "}
              Waiver request pending
            </label>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.death.hospiceProvided}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "death",
                  "hospiceProvided",
                ])}
                disabled={isReadOnly}
              />{" "}
              Hospice provided
            </label>
            <label className="flex items-center gap-1 ml-2">
              <input
                type="checkbox"
                checked={formData.incidentTypes.death.called911}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "death",
                  "called911",
                ])}
                disabled={isReadOnly}
              />{" "}
              911 called (Time{" "}
              <input
                type="text"
                value={formData.incidentTypes.death.time911}
                onChange={handleInput(["incidentTypes", "death", "time911"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="border-b border-black w-16 outline-none text-center text-[9px] md:text-sm bg-transparent"
              />
              )
            </label>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <span>CPR by (Staff Name:</span>
            <input
              type="text"
              value={formData.incidentTypes.cprStaff}
              onChange={handleInput(["incidentTypes", "cprStaff"])}
              onKeyDown={handleEnter}
              readOnly={isReadOnly}
              className="border-b border-black flex-grow outline-none text-[9px] md:text-sm bg-transparent"
            />
            <span>)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <input
              type="checkbox"
              className="mr-1"
              checked={formData.incidentChecks?.seriousInjury || false}
              onChange={handleCheckbox(["incidentChecks", "seriousInjury"])}
              disabled={isReadOnly}
            />
            <span className="font-bold">Serious Injury:</span>
            <label className="ml-2 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.seriousInjury.resultedInDeath}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "seriousInjury",
                  "resultedInDeath",
                ])}
                disabled={isReadOnly}
              />{" "}
              resulted in death
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.seriousInjury.hospitalAdmission}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "seriousInjury",
                  "hospitalAdmission",
                ])}
                disabled={isReadOnly}
              />{" "}
              Hospital admission
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.seriousInjury.erVisit}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "seriousInjury",
                  "erVisit",
                ])}
                disabled={isReadOnly}
              />{" "}
              ER visit
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.seriousInjury.mdVisit}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "seriousInjury",
                  "mdVisit",
                ])}
                disabled={isReadOnly}
              />{" "}
              MD visit
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <input
              type="checkbox"
              className="mr-1"
              checked={formData.incidentChecks?.externalDisaster || false}
              onChange={handleCheckbox(["incidentChecks", "externalDisaster"])}
              disabled={isReadOnly}
            />
            <span className="font-bold">External Disaster:</span>
            <label className="ml-2 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.externalDisaster.fire}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "externalDisaster",
                  "fire",
                ])}
                disabled={isReadOnly}
              />{" "}
              Fire
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.externalDisaster.flood}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "externalDisaster",
                  "flood",
                ])}
                disabled={isReadOnly}
              />{" "}
              Flood
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={
                  formData.incidentTypes.externalDisaster.physicalPlantDamage
                }
                onChange={handleCheckbox([
                  "incidentTypes",
                  "externalDisaster",
                  "physicalPlantDamage",
                ])}
                disabled={isReadOnly}
              />{" "}
              Damage to physical plant
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={
                  formData.incidentTypes.externalDisaster.clientsRelocated
                }
                onChange={handleCheckbox([
                  "incidentTypes",
                  "externalDisaster",
                  "clientsRelocated",
                ])}
                disabled={isReadOnly}
              />{" "}
              Clients relocated
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <input
              type="checkbox"
              className="mr-1"
              checked={formData.incidentChecks?.missingResident || false}
              onChange={handleCheckbox(["incidentChecks", "missingResident"])}
              disabled={isReadOnly}
            />
            <span className="font-bold">Missing Resident:</span>
            <span className="ml-2">
              Police notified (Date{" "}
              <input
                type="date"
                value={
                  formData.incidentTypes.missingResident.policeNotifiedDate
                }
                onChange={handleInput([
                  "incidentTypes",
                  "missingResident",
                  "policeNotifiedDate",
                ])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="border-b border-black w-24 outline-none text-center text-[9px] md:text-sm bg-transparent"
              />{" "}
              Time{" "}
              <input
                type="text"
                value={
                  formData.incidentTypes.missingResident.policeNotifiedTime
                }
                onChange={handleInput([
                  "incidentTypes",
                  "missingResident",
                  "policeNotifiedTime",
                ])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="border-b border-black w-16 outline-none text-center text-[9px] md:text-sm bg-transparent"
              />
              )
            </span>
          </div>

          <div className="mb-2 flex items-center gap-1">
            <input
              type="checkbox"
              checked={formData.incidentTypes.memoryImpairment}
              onChange={handleCheckbox(["incidentTypes", "memoryImpairment"])}
              disabled={isReadOnly}
            />{" "}
            Client has memory impairment
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="font-bold">Other:</span>
            <label className="ml-2 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.other.neglect}
                onChange={handleCheckbox(["incidentTypes", "other", "neglect"])}
                disabled={isReadOnly}
              />{" "}
              Neglect
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.other.exploitation}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "other",
                  "exploitation",
                ])}
                disabled={isReadOnly}
              />{" "}
              Exploitation
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.other.criminalRecord}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "other",
                  "criminalRecord",
                ])}
                disabled={isReadOnly}
              />{" "}
              Owner/staff acquires criminal record
            </label>
            <label className="ml-4 flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.incidentTypes.other.insuranceWill}
                onChange={handleCheckbox([
                  "incidentTypes",
                  "other",
                  "insuranceWill",
                ])}
                disabled={isReadOnly}
              />{" "}
              Insurance/will
            </label>
          </div>

          <div className="flex items-end mb-6">
            <span className="font-bold mr-2">Other: (specify)</span>
            <input
              type="text"
              value={formData.incidentTypes.other.specify}
              onChange={handleInput(["incidentTypes", "other", "specify"])}
              onKeyDown={handleEnter}
              readOnly={isReadOnly}
              className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
            />
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-end">
              <span className="mr-2">Residents Name(s):</span>
              <input
                type="text"
                value={formData.details.residentNames}
                onChange={handleInput(["details", "residentNames"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
              />
            </div>
            <div className="flex items-end">
              <span className="mr-2">Date of Incident:</span>
              <input
                type="date"
                value={formData.details.dateOfIncident}
                onChange={handleInput(["details", "dateOfIncident"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
              />
            </div>
            <div className="flex items-end">
              <span className="mr-2">Time of Incident:</span>
              <input
                type="text"
                value={formData.details.timeOfIncident}
                onChange={handleInput(["details", "timeOfIncident"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2">
              Details of Incident: (attach a page for additional details, if
              needed)
            </div>
            {formData.details.incidentDetails.map((detail, idx) => (
              <input
                key={idx}
                type="text"
                value={detail}
                onChange={handleArrayInput(["details", "incidentDetails"], idx)}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="w-full border-b border-black outline-none mb-2 text-[9px] md:text-sm bg-transparent"
              />
            ))}
          </div>

          <div className="font-bold mb-2">Notifications Date Time</div>
          <div className="font-bold mb-4">(AM or PM)</div>

          <div className="space-y-4 mb-6">
            {[
              {
                label: "Residents Name:",
                path: ["notifications", "residentName"],
              },
              {
                label: "Family/guardian/responsible party:",
                path: ["notifications", "familyGuardian"],
              },
              { label: "Physician:", path: ["notifications", "physician"] },
              { label: "Police:", path: ["notifications", "police"] },
              {
                label: "Other (specify)",
                path: ["notifications", "otherNotify"],
              },
              {
                label: "Alleged Perpetrator Name:",
                path: ["notifications", "perpetratorName"],
              },
              {
                label: "Relationship to Resident:",
                path: ["notifications", "relationshipToResident"],
              },
              {
                label: "Current Address:",
                path: ["notifications", "currentAddress"],
              },
              { label: "Phone:", path: ["notifications", "phone"] },
              {
                label: "City: State: Zip:",
                path: ["notifications", "cityStateZip"],
              },
              {
                label: "Witness Names:",
                path: ["notifications", "witnessNames"],
              },
              { label: "Address:", path: ["notifications", "witnessAddress"] },
              {
                label: "Phone Number:",
                path: ["notifications", "witnessPhone"],
              },
              {
                label: "Relationship to Resident:",
                path: ["notifications", "witnessRelationship"],
              },
            ].map((field, idx) => (
              <div key={idx} className="flex items-end">
                <span className="mr-2">{field.label}</span>
                <input
                  type="text"
                  value={formData.notifications[field.path[1]]}
                  onChange={handleInput(field.path)}
                  onKeyDown={handleEnter}
                  readOnly={isReadOnly}
                  className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="mb-2">
              Immediate correction or steps taken to prevent further incidents:
            </div>
            {formData.mitigationSteps.map((step, idx) => (
              <input
                key={idx}
                type="text"
                value={step}
                onChange={handleArrayInput(["mitigationSteps"], idx)}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="w-full border-b border-black outline-none mb-2 h-6 text-[9px] md:text-sm bg-transparent"
              />
            ))}
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-end">
              <span className="mr-2">Reporter:</span>
              <input
                type="text"
                value={formData.footer.reporter}
                onChange={handleInput(["footer", "reporter"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
              />
            </div>
            <div className="flex items-end">
              <span className="mr-2">Title:</span>
              <input
                type="text"
                value={formData.footer.title}
                onChange={handleInput(["footer", "title"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
              />
            </div>
            <div className="flex items-end">
              <span className="mr-2">Signature:</span>
              <div className="flex-grow border-b border-black h-6"></div>
            </div>
            <div className="flex items-end">
              <span className="mr-2">Date of Report:</span>
              <input
                type="date"
                value={formData.footer.dateOfReport}
                onChange={handleInput(["footer", "dateOfReport"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
              />
            </div>
            <div className="flex items-end">
              <span className="mr-2">Time of Report:</span>
              <input
                type="text"
                value={formData.footer.timeOfReport}
                onChange={handleInput(["footer", "timeOfReport"])}
                onKeyDown={handleEnter}
                readOnly={isReadOnly}
                className="flex-grow border-b border-black outline-none text-[9px] md:text-sm bg-transparent"
              />
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
            1 | Page
          </div>

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
                  if (
                    window.confirm(
                      "Are you sure you want to exit the application process? Any unsaved changes may be lost.",
                    )
                  ) {
                    window.location.href = "/my-application";
                  }
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

export default IncidentReportingForm;

