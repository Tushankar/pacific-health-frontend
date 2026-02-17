import React, { useState, useEffect, useRef } from "react";
import SaveNextButton from "../components/common/SaveNextButton";

const ClientBasicInfo = ({ onComplete, savedData, progressCurrent = 0, progressTotal = 1, onFormChange, isReadOnly = false, onNext }) => {
  const [formData, setFormData] = useState({
    clientInfo: {
      name: "",
      dob: "",
      sex: "",
      last4Digits: "",
      veteranStatus: "",
      referralDate: "",
      admittedFrom: "",
      phone: "",
      dateAdmitted: "",
      referralSourceAgency: "",
      participantAddress: "",
      participantPhone: "",
      serviceProvider: "",
      providerAddress: "",
      programType: "",
    },
    familyInfo: {
      nextOfKin: { name: "", address: "", phone: "" },
      legalGuardian: { name: "", address: "", phone: "" },
      repPayee: { name: "", address: "", phone: "" },
    },
    physicianInfo: {
      primary: {
        name: "Dr. Peter Nwaizuzu",
        address: "8 Jonesboro St, McDonough, GA 30253",
        phone: "(800) 734-8186",
      },
      secondary: { name: "", address: "", phone: "" },
    },
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { path: ["clientInfo", "name"], label: "Name" },
      { path: ["clientInfo", "dob"], label: "Date of Birth" },
      { path: ["clientInfo", "phone"], label: "Phone #" },
      { path: ["clientInfo", "participantAddress"], label: "Participant's Address" },
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

  const updateState = (path, value) => {
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

  const handleInput = (path) => (e) => updateState(path, e.target.value);

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, [savedData]);
  // Draft save: notify parent when formData changes after user interaction
  // Draft save: notify parent when form data changes
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
    <div className="w-full bg-white min-h-screen text-black font-serif flex justify-center mt-4 mb-8">
      {/* Paper Container */}
      <form onSubmit={handleSubmit} className="w-[98%] md:w-[85%] lg:w-[60%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug">
        {/* Main Header */}
        <h1 className="font-bold text-center text-sm md:text-xl mb-6 uppercase">
          CLIENT BASIC INFORMATION SHEET
        </h1>

        {/* Client Info Grid - 3 Columns */}
        <div className="border border-black mb-8">
          {/* Row 1 */}
          <div className="grid grid-cols-3 border-b border-black">
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Name
              </span>
              <input
                type="text"
                name="clientInfo.name"
                value={formData.clientInfo.name}
                onChange={handleInput(["clientInfo", "name"])}
                onKeyDown={handleEnter}
                className="w-full bg-white outline-none flex-grow min-w-0"
                style={getStyle("clientInfo.name")}
              />
            </div>
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Date of Birth
              </span>
              <input
                type="date"
                name="clientInfo.dob"
                value={formData.clientInfo.dob}
                onChange={handleInput(["clientInfo", "dob"])}
                onKeyDown={handleEnter}
                className="w-full bg-white outline-none flex-grow min-w-0"
                style={getStyle("clientInfo.dob")}
              />
            </div>
            <div className="p-1 h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Sex
              </span>
              <input
                type="text"
                value={formData.clientInfo.sex}
                onChange={handleInput(["clientInfo", "sex"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 border-b border-black">
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Last 4 Digits
              </span>
              <input
                type="text"
                value={formData.clientInfo.last4Digits}
                onChange={handleInput(["clientInfo", "last4Digits"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Veteran’s Status
              </span>
              <input
                type="text"
                value={formData.clientInfo.veteranStatus}
                onChange={handleInput(["clientInfo", "veteranStatus"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
            <div className="p-1 h-24 flex flex-col">
              <span className="font-bold mb-1 uppercase">DATE OF REFERRAL</span>
              <input
                type="date"
                value={formData.clientInfo.referralDate}
                onChange={handleInput(["clientInfo", "referralDate"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 border-b border-black">
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Admitted From (place & address)
              </span>
              <textarea
                value={formData.clientInfo.admittedFrom}
                onChange={handleInput(["clientInfo", "admittedFrom"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0 resize-none"
              ></textarea>
            </div>
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Phone #
              </span>
              <input
                type="tel"
                name="clientInfo.phone"
                value={formData.clientInfo.phone}
                onChange={handleInput(["clientInfo", "phone"])}
                onKeyDown={handleEnter}
                className="w-full bg-white outline-none flex-grow min-w-0"
                style={getStyle("clientInfo.phone")}
              />
            </div>
            <div className="p-1 h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Date Admitted
              </span>
              <input
                type="date"
                value={formData.clientInfo.dateAdmitted}
                onChange={handleInput(["clientInfo", "dateAdmitted"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-3 border-b border-black">
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Referral Source Agency
              </span>
              <textarea
                value={formData.clientInfo.referralSourceAgency}
                onChange={handleInput(["clientInfo", "referralSourceAgency"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0 resize-none"
              ></textarea>
            </div>
            <div className="p-1 border-r border-black h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Participant’s Address
              </span>
              <textarea
                name="clientInfo.participantAddress"
                value={formData.clientInfo.participantAddress}
                onChange={handleInput(["clientInfo", "participantAddress"])}
                onKeyDown={handleEnter}
                className="w-full bg-white outline-none flex-grow min-w-0 resize-none"
                style={getStyle("clientInfo.participantAddress")}
              ></textarea>
            </div>
            <div className="p-1 h-24 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Phone #
              </span>
              <input
                type="tel"
                value={formData.clientInfo.participantPhone}
                onChange={handleInput(["clientInfo", "participantPhone"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-3">
            <div className="p-1 border-r border-black h-28 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Person’s/Agency Providing Service
              </span>
              <textarea
                value={formData.clientInfo.serviceProvider}
                onChange={handleInput(["clientInfo", "serviceProvider"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0 resize-none"
              ></textarea>
            </div>
            <div className="p-1 border-r border-black h-28 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Address/Phone #
              </span>
              <textarea
                value={formData.clientInfo.providerAddress}
                onChange={handleInput(["clientInfo", "providerAddress"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0 resize-none"
              ></textarea>
            </div>
            <div className="p-1 h-28 flex flex-col">
              <span className="font-bold mb-1 break-words leading-tight">
                Program Type: NOW/COMP/ SOURCE/CCSP/GAPP/ICWP
              </span>
              <textarea
                value={formData.clientInfo.programType}
                onChange={handleInput(["clientInfo", "programType"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Family Info Section */}
        <h2 className="font-bold text-sm md:text-base mb-2 uppercase">
          FAMILY/RESPONSIBLE PARTY INFORMATION
        </h2>
        <div className="border border-black mb-8">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-black uppercase font-bold bg-white">
            <div className="p-1 border-r border-black">NEXT OF KIN</div>
            <div className="p-1 border-r border-black">ADDRESS</div>
            <div className="p-1">PHONE #</div>
          </div>
          {/* Row 1 */}
          <div className="grid grid-cols-3 border-b border-black h-24">
            <div className="p-1 border-r border-black">
              <textarea
                value={formData.familyInfo.nextOfKin.name}
                onChange={handleInput(["familyInfo", "nextOfKin", "name"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
            <div className="p-1 border-r border-black">
              <textarea
                value={formData.familyInfo.nextOfKin.address}
                onChange={handleInput(["familyInfo", "nextOfKin", "address"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
            <div className="p-1">
              <textarea
                value={formData.familyInfo.nextOfKin.phone}
                onChange={handleInput(["familyInfo", "nextOfKin", "phone"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
          </div>

          {/* Header 2 */}
          <div className="grid grid-cols-3 border-b border-black uppercase font-bold bg-white">
            <div className="p-1 border-r border-black">
              LEGAL GUARDIAN, SURROGATE, RESPONSIBLE PERSON
            </div>
            <div className="p-1 border-r border-black">ADDRESS</div>
            <div className="p-1">PHONE #</div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-3 border-b border-black h-24">
            <div className="p-1 border-r border-black">
              <textarea
                value={formData.familyInfo.legalGuardian.name}
                onChange={handleInput(["familyInfo", "legalGuardian", "name"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
            <div className="p-1 border-r border-black">
              <textarea
                value={formData.familyInfo.legalGuardian.address}
                onChange={handleInput([
                  "familyInfo",
                  "legalGuardian",
                  "address",
                ])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
            <div className="p-1">
              <textarea
                value={formData.familyInfo.legalGuardian.phone}
                onChange={handleInput(["familyInfo", "legalGuardian", "phone"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
          </div>

          {/* Header 3 */}
          <div className="grid grid-cols-3 border-b border-black uppercase font-bold bg-white text-[8px] md:text-sm">
            <div className="p-1 border-r border-black">
              REPRESENTATIVE PAYEE (if applicable)
            </div>
            <div className="p-1 border-r border-black">ADDRESS</div>
            <div className="p-1">PHONE #</div>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-3 h-24">
            <div className="p-1 border-r border-black">
              <textarea
                value={formData.familyInfo.repPayee.name}
                onChange={handleInput(["familyInfo", "repPayee", "name"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
            <div className="p-1 border-r border-black">
              <textarea
                value={formData.familyInfo.repPayee.address}
                onChange={handleInput(["familyInfo", "repPayee", "address"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
            <div className="p-1">
              <textarea
                value={formData.familyInfo.repPayee.phone}
                onChange={handleInput(["familyInfo", "repPayee", "phone"])}
                onKeyDown={handleEnter}
                className="w-full h-full bg-transparent outline-none resize-none min-w-0"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Physician Info Section */}
        <div className="border border-black mb-8">
          <div className="p-1 font-bold border-b border-black uppercase bg-white">
            CLIENT PERSONAL PHYSICIAN INFORMATION
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-3 border-b border-black min-h-[80px]">
            <div className="p-1 border-r border-black flex flex-col">
              <span className="font-bold break-words leading-tight">
                Client Physician
              </span>
              <input
                type="text"
                value={formData.physicianInfo.primary.name}
                onChange={handleInput(["physicianInfo", "primary", "name"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
            <div className="p-1 border-r border-black flex flex-col">
              <span className="font-bold break-words leading-tight">
                Physician Address
              </span>
              <textarea
                value={formData.physicianInfo.primary.address}
                onChange={handleInput(["physicianInfo", "primary", "address"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0 resize-none break-words"
              ></textarea>
            </div>
            <div className="p-1 flex flex-col">
              <span className="font-bold break-words leading-tight">
                Physician Phone #
              </span>
              <input
                type="tel"
                value={formData.physicianInfo.primary.phone}
                onChange={handleInput(["physicianInfo", "primary", "phone"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 min-h-[80px]">
            <div className="p-1 border-r border-black flex flex-col">
              <span className="font-bold ">Client Physician</span>
              <input
                type="text"
                value={formData.physicianInfo.secondary.name}
                onChange={handleInput(["physicianInfo", "secondary", "name"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
            <div className="p-1 border-r border-black flex flex-col">
              <span className="font-bold ">Physician Address</span>
              <textarea
                value={formData.physicianInfo.secondary.address}
                onChange={handleInput([
                  "physicianInfo",
                  "secondary",
                  "address",
                ])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0 resize-none"
              ></textarea>
            </div>
            <div className="p-1 flex flex-col">
              <span className="font-bold ">Physician Phone #</span>
              <input
                type="tel"
                value={formData.physicianInfo.secondary.phone}
                onChange={handleInput(["physicianInfo", "secondary", "phone"])}
                onKeyDown={handleEnter}
                className="w-full bg-transparent outline-none flex-grow min-w-0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center p-4">
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
export default ClientBasicInfo;
