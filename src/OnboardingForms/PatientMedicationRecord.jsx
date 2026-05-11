import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";

const PatientMedicationRecord = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const rows = Array.from({ length: 20 });

  // State management for form data
  const [clientInfo, setClientInfo] = useState({
    name: "",
    dob: "",
    address: "",
    phone: "",
    allergies: "",
    diagnosis: "",
  });

  const [medications, setMedications] = useState(
    rows.map(() => ({ medication: "", dose: "", route: "", frequency: "" })),
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { key: "name", label: "Client Name" },
      { key: "dob", label: "Date of Birth" },
      { key: "address", label: "Address" },
      { key: "phone", label: "Phone" },
      { key: "allergies", label: "Allergies" },
      { key: "diagnosis", label: "Diagnosis" },
    ];

    requiredFields.forEach((field) => {
      if (
        !clientInfo[field.key] ||
        String(clientInfo[field.key]).trim() === ""
      ) {
        newErrors[field.key] = `${field.label} is required`;
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
    return errors[fieldName]
      ? { background: "#fee2e2", border: "1px solid red" }
      : {};
  };

  // Handle client info changes
  const handleClientChange = (field, value) => {
    if (isReadOnly) return;
    setClientInfo({ ...clientInfo, [field]: value });
  };

  // Handle medication changes
  const handleMedicationChange = (index, field, value) => {
    if (isReadOnly) return;
    const updatedMeds = [...medications];
    updatedMeds[index][field] = value;
    setMedications(updatedMeds);
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      if (savedData.clientInfo)
        setClientInfo((prev) => ({ ...prev, ...savedData.clientInfo }));
      if (savedData.medications) setMedications(savedData.medications);
    }
  }, [savedData]);

  // Draft save: notify parent when form data changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange({ clientInfo, medications });
    }
  }, [clientInfo, medications]);

  // Handle form submission
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
        await onComplete({ clientInfo, medications });
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
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 w-full flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <form
          onSubmit={handleSubmit}
          className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug shadow-lg rounded-lg"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-6 w-full">
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-12 md:h-16 object-contain mb-2"
            />
            <h2 className="text-sm md:text-lg font-bold text-black text-center">
              Patient Medication Record
            </h2>
          </div>

          {/* Client Details Section */}
          <div className="w-full border border-black mb-8 text-sm">
            <div className="flex flex-col md:flex-row border-b border-black">
              <div className="w-full md:w-1/3 bg-gray-100 font-bold p-1 border-b md:border-b-0 md:border-r border-black">
                Client Name:
              </div>
              <input
                name="name"
                className="w-full md:w-2/3 p-1 outline-none focus:bg-blue-50"
                value={clientInfo.name}
                onChange={(e) => {
                  handleClientChange("name", e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: null }));
                }}
                style={getStyle("name")}
                readOnly={isReadOnly}
              />
            </div>
            <div className="flex flex-col md:flex-row border-b border-black">
              <div className="w-full md:w-1/3 bg-gray-100 font-bold p-1 border-b md:border-b-0 md:border-r border-black">
                Date of Birth (DOB):
              </div>
              <input
                name="dob"
                type="date"
                className="w-full md:w-2/3 p-1 outline-none focus:bg-blue-50"
                value={clientInfo.dob}
                onChange={(e) => {
                  handleClientChange("dob", e.target.value);
                  if (errors.dob) setErrors((prev) => ({ ...prev, dob: null }));
                }}
                style={getStyle("dob")}
                readOnly={isReadOnly}
              />
            </div>
            <div className="flex flex-col md:flex-row border-b border-black">
              <div className="w-full md:w-1/3 bg-gray-100 font-bold p-1 border-b md:border-b-0 md:border-r border-black">
                Address:
              </div>
              <input
                name="address"
                className="w-full md:w-2/3 p-1 outline-none focus:bg-blue-50"
                value={clientInfo.address}
                onChange={(e) => {
                  handleClientChange("address", e.target.value);
                  if (errors.address)
                    setErrors((prev) => ({ ...prev, address: null }));
                }}
                style={getStyle("address")}
                readOnly={isReadOnly}
              />
            </div>
            <div className="flex flex-col md:flex-row border-b border-black">
              <div className="w-full md:w-1/3 bg-gray-100 font-bold p-1 border-b md:border-b-0 md:border-r border-black">
                Phone:
              </div>
              <input
                name="phone"
                className="w-full md:w-2/3 p-1 outline-none focus:bg-blue-50"
                value={clientInfo.phone}
                onChange={(e) => {
                  handleClientChange("phone", e.target.value);
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: null }));
                }}
                style={getStyle("phone")}
                readOnly={isReadOnly}
              />
            </div>
            <div className="flex flex-col md:flex-row border-b border-black">
              <div className="w-full md:w-1/3 bg-gray-100 font-bold p-1 border-b md:border-b-0 md:border-r border-black">
                Allergies:
              </div>
              <input
                name="allergies"
                className="w-full md:w-2/3 p-1 outline-none focus:bg-blue-50"
                value={clientInfo.allergies}
                onChange={(e) => {
                  handleClientChange("allergies", e.target.value);
                  if (errors.allergies)
                    setErrors((prev) => ({ ...prev, allergies: null }));
                }}
                style={getStyle("allergies")}
                readOnly={isReadOnly}
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-gray-100 font-bold p-1 border-b md:border-b-0 md:border-r border-black">
                Diagnosis:
              </div>
              <input
                name="diagnosis"
                className="w-full md:w-2/3 p-1 outline-none focus:bg-blue-50"
                value={clientInfo.diagnosis}
                onChange={(e) => {
                  handleClientChange("diagnosis", e.target.value);
                  if (errors.diagnosis)
                    setErrors((prev) => ({ ...prev, diagnosis: null }));
                }}
                style={getStyle("diagnosis")}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Medication Table Section */}
          <div className="w-full border-2 border-black mb-6">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-4 border-b border-black font-bold text-sm bg-gray-100 text-center">
              <div className="border-r border-black p-1">Medication/Drug</div>
              <div className="border-r border-black p-1">Dose</div>
              <div className="border-r border-black p-1">Route</div>
              <div className="p-1">Frequency</div>
            </div>

            {/* Table Rows */}
            {rows.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 border-b border-black last:border-b-0 text-sm"
              >
                <div className="flex flex-col md:block border-b md:border-b-0 md:border-r border-black p-1">
                  <span className="md:hidden font-bold text-xs mb-1 text-gray-500">
                    Medication/Drug:
                  </span>
                  <input
                    className="outline-none focus:bg-blue-50 w-full"
                    value={medications[index].medication}
                    onChange={(e) =>
                      handleMedicationChange(
                        index,
                        "medication",
                        e.target.value,
                      )
                    }
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="flex flex-col md:block border-b md:border-b-0 md:border-r border-black p-1">
                  <span className="md:hidden font-bold text-xs mb-1 text-gray-500">
                    Dose:
                  </span>
                  <input
                    className="outline-none focus:bg-blue-50 w-full"
                    value={medications[index].dose}
                    onChange={(e) =>
                      handleMedicationChange(index, "dose", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="flex flex-col md:block border-b md:border-b-0 md:border-r border-black p-1">
                  <span className="md:hidden font-bold text-xs mb-1 text-gray-500">
                    Route:
                  </span>
                  <input
                    className="outline-none focus:bg-blue-50 w-full"
                    value={medications[index].route}
                    onChange={(e) =>
                      handleMedicationChange(index, "route", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="flex flex-col md:block p-1">
                  <span className="md:hidden font-bold text-xs mb-1 text-gray-500">
                    Frequency:
                  </span>
                  <input
                    className="outline-none focus:bg-blue-50 w-full"
                    value={medications[index].frequency}
                    onChange={(e) =>
                      handleMedicationChange(index, "frequency", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full px-2 md:px-8 pb-8 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-8">
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

export default PatientMedicationRecord;

