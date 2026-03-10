import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

const td = {
  border: "1px solid #000",
  padding: "4px",
  fontSize: "inherit",
  verticalAlign: "top",
};

const input = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "inherit",
};

const blackRow = {
  background: "#000",
  height: "8px",
  padding: 0,
};

const centerItalic = {
  textAlign: "center",
  fontStyle: "italic",
  fontWeight: "bold",
};

const Form01ClientInfo = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  selectedProgram,
  onFormChange,
  isReadOnly = false,
  onNext,
  ...props
}) => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    streetAddress: "",
    county: "",
    phone: "",
    sex: "",
    language: "",
    ssn: "",
    admissionDate: "",
    dob: "",
    medicaid: "",
    program: {
      now: false,
      comp: false,
    },
    services: {
      cls: false,
      cai: false,
      respite: false,
    },
    nextOfKin: {
      name: "",
      relationship: "",
      address: "",
      phone: "",
    },
    contacts: [
      { name: "", address: "", phone: "", relationship: "" },
      { name: "", address: "", phone: "", relationship: "" },
      { name: "", address: "", phone: "", relationship: "" },
    ],
    physicians: [
      { type: "", name: "", address: "", phone: "" },
      { type: "", name: "", address: "", phone: "" },
      { type: "", name: "", address: "", phone: "" },
    ],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { key: "lastName", label: "Last Name" },
      { key: "firstName", label: "First Name" },
      { key: "streetAddress", label: "Street Address" },
      { key: "phone", label: "Phone" },
      { key: "sex", label: "Sex" },
      { key: "dob", label: "Date of Birth" },
      { key: "ssn", label: "SSN#" },
      { key: "medicaid", label: "Medicaid #" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key] || formData[field.key].trim() === "") {
        newErrors[field.key] = `${field.label} is required`;
      } else if (field.key === "medicaid") {
        const medicaidVal = formData[field.key].trim();
        const medicaidRegex = /^(111|222)\d{9}$/;
        if (!medicaidRegex.test(medicaidVal)) {
          newErrors[field.key] =
            "Medicaid # must be 12 digits and start with 111 or 222";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({
        ...prev,
        ...savedData,
        program: savedData.program || prev.program,
        services: savedData.services || prev.services,
        nextOfKin: savedData.nextOfKin || prev.nextOfKin,
        contacts: savedData.contacts || prev.contacts,
        physicians: savedData.physicians || prev.physicians,
      }));
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

  // Auto-set program checkboxes based on selected program
  useEffect(() => {
    if (selectedProgram && !savedData) {
      setFormData((prev) => ({
        ...prev,
        program: {
          now: selectedProgram === "NOW-COMP",
          comp: selectedProgram === "NOW-COMP",
        },
      }));
    }
  }, [selectedProgram, savedData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value },
    });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      if (errors.medicaid && formData.medicaid.trim() !== "") {
        toast.error("Medicaid # must be 12 digits and start with 111 or 222");
      } else {
        toast.error("Please fill in all required fields.");
      }
      // Scroll to the first error
      setTimeout(() => {
        const firstErrorField = document.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
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

  const getInputStyle = (field) => ({
    ...input,
    border: errors[field] ? "1px solid #ef4444" : "none",
    boxShadow: errors[field] ? "0 0 0 1px #ef4444" : "none",
    borderRadius: "2px",
    paddingLeft: errors[field] ? "4px" : "0",
  });

  const RequiredStar = () => (
    <span className="text-red-500 ml-1 italic font-bold">*</span>
  );

  return (
    <div className="flex w-full items-start">
      {/* Sidebar Progress Bar */}
      <ProgressBar
        currentStep={progressCurrent}
        totalSteps={progressTotal || 1}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col md:items-center overflow-x-hidden">
        <div className="w-full text-black font-serif flex flex-col md:items-center mb-8">
          {/* Paper Container */}
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-[85%] lg:w-[75%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug shadow-lg"
          >
            {/* HEADER */}
            <div
              style={{ borderBottom: "2px solid #000", paddingBottom: "10px" }}
            >
              <div className="flex justify-center items-center gap-4">
                <img
                  src={logo}
                  alt="Pacific Health Systems"
                  style={{ height: 80, objectFit: "contain" }}
                />
              </div>
            </div>

            <h3 style={{ textAlign: "center", margin: "10px 0" }}>
              Client Information Form
            </h3>

            {/* MAIN TABLE */}
            <div className="w-full overflow-x-auto">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "20px",
                  minWidth: "500px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={td}>
                      Last Name: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("lastName")}
                        className={
                          errors.lastName
                            ? "border-red-500 shadow-outline-red"
                            : ""
                        }
                        value={formData.lastName}
                        onChange={(e) => {
                          handleChange("lastName", e.target.value);
                          if (errors.lastName)
                            setErrors((prev) => ({ ...prev, lastName: null }));
                        }}
                      />
                    </td>
                    <td style={td}>
                      First Name: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("firstName")}
                        className={
                          errors.firstName
                            ? "border-red-500 shadow-outline-red"
                            : ""
                        }
                        value={formData.firstName}
                        onChange={(e) => {
                          handleChange("firstName", e.target.value);
                          if (errors.firstName)
                            setErrors((prev) => ({ ...prev, firstName: null }));
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={td}>Middle Name:</td>
                    <td style={td} colSpan="3">
                      <input
                        style={input}
                        value={formData.middleName}
                        onChange={(e) =>
                          handleChange("middleName", e.target.value)
                        }
                      />
                    </td>
                    <td style={td}>
                      Program:
                      <label style={{ cursor: "pointer", marginLeft: "8px" }}>
                        <input
                          type="checkbox"
                          style={{ marginRight: "4px" }}
                          checked={formData.program.now}
                          onChange={(e) =>
                            handleNestedChange(
                              "program",
                              "now",
                              e.target.checked,
                            )
                          }
                        />
                        NOW
                      </label>
                      <label style={{ cursor: "pointer", marginLeft: "12px" }}>
                        <input
                          type="checkbox"
                          style={{ marginRight: "4px" }}
                          checked={formData.program.comp}
                          onChange={(e) =>
                            handleNestedChange(
                              "program",
                              "comp",
                              e.target.checked,
                            )
                          }
                        />
                        COMP
                      </label>
                    </td>
                    <td style={td} colSpan="3"></td>
                  </tr>

                  <tr>
                    <td style={td}>
                      Street Address: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("streetAddress")}
                        className={
                          errors.streetAddress
                            ? "border-red-500 shadow-outline-red"
                            : ""
                        }
                        value={formData.streetAddress}
                        onChange={(e) => {
                          handleChange("streetAddress", e.target.value);
                          if (errors.streetAddress)
                            setErrors((prev) => ({
                              ...prev,
                              streetAddress: null,
                            }));
                        }}
                      />
                    </td>
                    <td style={td}>
                      Services:
                      <label style={{ cursor: "pointer", marginLeft: "8px" }}>
                        <input
                          type="checkbox"
                          style={{ marginRight: "4px" }}
                          checked={formData.services.cls}
                          onChange={(e) =>
                            handleNestedChange(
                              "services",
                              "cls",
                              e.target.checked,
                            )
                          }
                        />
                        CLS
                      </label>
                      <label style={{ cursor: "pointer", marginLeft: "12px" }}>
                        <input
                          type="checkbox"
                          style={{ marginRight: "4px" }}
                          checked={formData.services.cai}
                          onChange={(e) =>
                            handleNestedChange(
                              "services",
                              "cai",
                              e.target.checked,
                            )
                          }
                        />
                        CAI
                      </label>
                      <label style={{ cursor: "pointer", marginLeft: "12px" }}>
                        <input
                          type="checkbox"
                          style={{ marginRight: "4px" }}
                          checked={formData.services.respite}
                          onChange={(e) =>
                            handleNestedChange(
                              "services",
                              "respite",
                              e.target.checked,
                            )
                          }
                        />
                        RESPITE
                      </label>
                    </td>
                    <td style={td} colSpan="3"></td>
                  </tr>

                  <tr>
                    <td style={td}>County:</td>
                    <td style={td} colSpan="3">
                      <input
                        style={input}
                        value={formData.county}
                        onChange={(e) => handleChange("county", e.target.value)}
                      />
                    </td>
                    <td style={td}>
                      Phone: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("phone")}
                        className={
                          errors.phone
                            ? "border-red-500 shadow-outline-red"
                            : ""
                        }
                        value={formData.phone}
                        onChange={(e) => {
                          handleChange("phone", e.target.value);
                          if (errors.phone)
                            setErrors((prev) => ({ ...prev, phone: null }));
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={td}>
                      Sex: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("sex")}
                        className={
                          errors.sex ? "border-red-500 shadow-outline-red" : ""
                        }
                        value={formData.sex}
                        onChange={(e) => {
                          handleChange("sex", e.target.value);
                          if (errors.sex)
                            setErrors((prev) => ({ ...prev, sex: null }));
                        }}
                      />
                    </td>
                    <td style={td}>Language:</td>
                    <td style={td} colSpan="3">
                      <input
                        style={input}
                        value={formData.language}
                        onChange={(e) =>
                          handleChange("language", e.target.value)
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={td}>
                      SSN#: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("ssn")}
                        className={
                          errors.ssn ? "border-red-500 shadow-outline-red" : ""
                        }
                        value={formData.ssn}
                        onChange={(e) => {
                          handleChange("ssn", e.target.value);
                          if (errors.ssn)
                            setErrors((prev) => ({ ...prev, ssn: null }));
                        }}
                      />
                    </td>
                    <td style={td}>Admission Date:</td>
                    <td style={td} colSpan="3">
                      <input
                        style={input}
                        value={formData.admissionDate}
                        onChange={(e) =>
                          handleChange("admissionDate", e.target.value)
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={td}>
                      Date of Birth: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("dob")}
                        className={
                          errors.dob ? "border-red-500 shadow-outline-red" : ""
                        }
                        value={formData.dob}
                        onChange={(e) => {
                          handleChange("dob", e.target.value);
                          if (errors.dob)
                            setErrors((prev) => ({ ...prev, dob: null }));
                        }}
                      />
                    </td>
                    <td style={td}>
                      Medicaid #: <RequiredStar />
                    </td>
                    <td style={td} colSpan="3">
                      <input
                        style={getInputStyle("medicaid")}
                        className={
                          errors.medicaid
                            ? "border-red-500 shadow-outline-red"
                            : ""
                        }
                        value={formData.medicaid}
                        onChange={(e) => {
                          handleChange("medicaid", e.target.value);
                          if (errors.medicaid)
                            setErrors((prev) => ({ ...prev, medicaid: null }));
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={blackRow} colSpan="8"></td>
                  </tr>

                  {/* NEXT OF KIN */}
                  <tr>
                    <td colSpan="8" style={{ ...td, ...centerItalic }}>
                      Next of Kin (if minor or adjudicated, parent, or legal
                      guardian):
                    </td>
                  </tr>

                  <tr>
                    <td style={td}>Name:</td>
                    <td style={td} colSpan="3">
                      <input
                        style={input}
                        value={formData.nextOfKin.name}
                        onChange={(e) =>
                          handleNestedChange(
                            "nextOfKin",
                            "name",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td style={td}>Relationship:</td>
                    <td style={td} colSpan="3">
                      <input
                        style={input}
                        value={formData.nextOfKin.relationship}
                        onChange={(e) =>
                          handleNestedChange(
                            "nextOfKin",
                            "relationship",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={td}>Address:</td>
                    <td style={td} colSpan="7">
                      <input
                        style={input}
                        value={formData.nextOfKin.address}
                        onChange={(e) =>
                          handleNestedChange(
                            "nextOfKin",
                            "address",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={td}>Phone:</td>
                    <td style={td} colSpan="7">
                      <input
                        style={input}
                        value={formData.nextOfKin.phone}
                        onChange={(e) =>
                          handleNestedChange(
                            "nextOfKin",
                            "phone",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style={blackRow} colSpan="8"></td>
                  </tr>

                  {/* CONTACTS */}
                  <tr>
                    <td colSpan="8" style={{ ...td, ...centerItalic }}>
                      Contacts: Support Coordination & Provider Services
                    </td>
                  </tr>

                  <tr>
                    <td style={td} colSpan="2">
                      Name
                    </td>
                    <td style={td} colSpan="2">
                      Address
                    </td>
                    <td style={td} colSpan="2">
                      Phone
                    </td>
                    <td style={td} colSpan="2">
                      Relationship
                    </td>
                  </tr>

                  {[0, 1, 2].map((i) => (
                    <tr key={i}>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.contacts[i].name}
                          onChange={(e) =>
                            handleArrayChange(
                              "contacts",
                              i,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.contacts[i].address}
                          onChange={(e) =>
                            handleArrayChange(
                              "contacts",
                              i,
                              "address",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.contacts[i].phone}
                          onChange={(e) =>
                            handleArrayChange(
                              "contacts",
                              i,
                              "phone",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.contacts[i].relationship}
                          onChange={(e) =>
                            handleArrayChange(
                              "contacts",
                              i,
                              "relationship",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td style={blackRow} colSpan="8"></td>
                  </tr>

                  {/* PHYSICIAN */}
                  <tr>
                    <td colSpan="8" style={{ ...td, ...centerItalic }}>
                      Physician and Other Professional Services
                    </td>
                  </tr>

                  <tr>
                    <td style={td} colSpan="2">
                      Type of Specialist
                    </td>
                    <td style={td} colSpan="2">
                      Name
                    </td>
                    <td style={td} colSpan="2">
                      Address
                    </td>
                    <td style={td} colSpan="2">
                      Phone
                    </td>
                  </tr>

                  {[0, 1, 2].map((i) => (
                    <tr key={i}>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.physicians[i].type}
                          onChange={(e) =>
                            handleArrayChange(
                              "physicians",
                              i,
                              "type",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.physicians[i].name}
                          onChange={(e) =>
                            handleArrayChange(
                              "physicians",
                              i,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.physicians[i].address}
                          onChange={(e) =>
                            handleArrayChange(
                              "physicians",
                              i,
                              "address",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td style={td} colSpan="2">
                        <input
                          style={input}
                          value={formData.physicians[i].phone}
                          onChange={(e) =>
                            handleArrayChange(
                              "physicians",
                              i,
                              "phone",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-8 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 btn-premium-red text-white font-sans font-bold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  onClick={() => { window.location.href = "/my-application"; }}
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
    </div>
  );
};

export default Form01ClientInfo;
