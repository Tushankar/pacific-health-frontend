import React, { useState, useEffect, useRef } from "react";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const PrivateHomeCare = ({ onComplete, savedData, progressCurrent = 0, progressTotal = 1, onFormChange, isReadOnly = false, onNext }) => {
  const [formData, setFormData] = useState({
    adminName: "",
    contactPhone: "",
    clientSignature: "",
    acknowledgementName: "",
    signatureDate: "",
    clientSignatureBottom: "",
    dateBottom: "",
  });

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = Array.from(
        document.querySelectorAll("input, select, textarea"),
      );
      const index = inputs.indexOf(e.target);
      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  };

  // Pre-fill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, [savedData]);

  // Draft save: notify parent when form data changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.adminName?.trim()) newErrors.adminName = true;
    if (!formData.contactPhone?.trim()) newErrors.contactPhone = true;
    if (!formData.acknowledgementName?.trim()) newErrors.acknowledgementName = true;
    if (!formData.clientSignatureBottom?.trim()) newErrors.clientSignatureBottom = true;
    if (!formData.dateBottom?.trim()) newErrors.dateBottom = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in all signature and required fields.");
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
    borderBottom: errors[field] ? "2px solid #ef4444" : "2px solid black",
    transition: "all 0.2s"
  });

  const RequiredStar = () => <span className="text-red-500 ml-1 font-bold">*</span>;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div className="text-center font-bold text-lg md:text-xl uppercase mb-8">
        <div>PRIVATE HOME CARE</div>
        <div>CLIENTS RIGHTS & RESPONSIBILITIES FORM</div>
      </div>

      <p className="mb-6 font-bold text-justify uppercase">
        ALL CLIENTS RIGHTS WILL BE GIVEN TO ALL AGENCY CLIENTS AT THE TIME OF
        SERVICE AND ANY COMPLAINTS WILL BE HANDLED BY
      </p>

      {/* Highlighted Administrator Section */}
      <div className="mb-6">
        <div className="flex items-center">
          <span className="font-bold bg-yellow-300 px-1 mr-2 whitespace-nowrap text-[9px] md:text-sm">
            THE AGENCY ADMINISTRATOR: <RequiredStar />
          </span>
          <input
            type="text"
            name="adminName"
            value={formData.adminName}
            onChange={(e) => {
              handleChange(e);
              if(errors.adminName) setErrors(prev => ({...prev, adminName: null}));
            }}
            onKeyDown={handleEnter}
            style={getStyle("adminName")}
            className={`flex-grow min-w-0 w-full ${errors.adminName ? "border-red-500" : ""}`}
            readOnly={isReadOnly}
          />
        </div>
      </div>

      <p className="mb-6 text-justify">
        All clients will receive a written notice of the address and telephone
        number of the state licensing authority, i.e. The department, which
        further explains that the department is charged with the responsibility
        of Licensing the provider and investigating client complaints which
        appear to violate licensing regulations;
      </p>

      {/* Highlighted Phone Section */}
      <div className="mb-6">
        <div className="flex items-center">
          <span className="font-bold bg-yellow-300 px-1 mr-2 whitespace-nowrap text-[9px] md:text-sm">
            This agencies contact phone number is: <RequiredStar />
          </span>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => {
              handleChange(e);
              if(errors.contactPhone) setErrors(prev => ({...prev, contactPhone: null}));
            }}
            onKeyDown={handleEnter}
            style={getStyle("contactPhone")}
            className={`flex-grow min-w-0 w-full ${errors.contactPhone ? "border-red-500" : ""}`}
            readOnly={isReadOnly}
          />
        </div>
      </div>

      <p className="mb-6">
        To make complaints only call: (404-657-5700, 404-657-5726 & 1 800
        878-6442).
      </p>

      <p className="mb-8 text-justify">
        The Department that regulates this agency is:{" "}
        <span className="underline font">
          Department of Community Health /Healthcare Facility Regulation/Home
          Care Unit for information about licensing requirements: (404-657-1509)
        </span>
        . @ 2 Peachtree Street, Suite 31-447 Atlanta, Georgia 30303
      </p>

      {/* Rights List */}
      <div className="space-y-4 mb-8 text-justify">
        <p>
          (a)Right to be informed about plan of service and to participate in
          the planning;
        </p>
        <p>
          (b) Right to be promptly and fully informed of any changes in the plan
          of service
        </p>
        <p>(c) Right to accept or refuse services;</p>
        <p>(d) Right to be fully informed of the charges for services;</p>
        <p>
          (e) Right to be informed of the name, business telephone number and
          business address of the person supervising the services and how to
          contact that person; ...
        </p>
        <p>
          (f) Right to be informed of the complaint procedures and the right to
          submit complaints without fear of discrimination or retaliation and to
          have them investigated by the provider within a reasonable period of
          time. The complaint procedure provided shall include the name,
          business address and telephone number of the person designated by the
          provider to handle complaints and questions; ...
        </p>
        <p>(g) Right of confidentiality of client record;</p>
        <p>(h) Right to have property and residence treated with respect;</p>
        <p>
          (i) Right to receive a written notice of the address and telephone
          number of the state licensing authority, i.e. the department, which
          further explains that the department is charged with the
          responsibility of licensing the provider and investigating client
          complaints which appear to violate licensing regulations;
        </p>
        <p>
          (j) Right to obtain a copy of the provider's most recent completed
          report of licensure inspection from the provider upon written request.
          The provider is not required to release the report of licensure
          inspection until the provider has had an opportunity to file a written
          plan of correction for the violations, if any, identified. The
          facility may charge the client reasonable photocopying charges;
        </p>
        <p>
          (k) Right to be advised that the client and the responsible party, if
          applicable, must advise the provider of any changes in the client's
          condition or any events that affect the client's service needs.
        </p>
      </div>

      {/* Acknowledgement/Signature */}
      <div className="flex items-center gap-2 mb-8">
        <span className="font-bold">Name: <RequiredStar /> </span>
        <input
          type="text"
          name="acknowledgementName"
          value={formData.acknowledgementName}
          onChange={(e) => {
            handleChange(e);
            if(errors.acknowledgementName) setErrors(prev => ({...prev, acknowledgementName: null}));
          }}
          onKeyDown={handleEnter}
          style={getStyle("acknowledgementName")}
          className={`flex-1 border-b border-black outline-none px-2 ${errors.acknowledgementName ? "border-red-500" : ""}`}
          readOnly={isReadOnly}
        />
      </div>
      <div className="mb-8 font-bold leading-loose text-justify">
        I acknowledge the rights listed above have been shared and or explained to
        me and I fully understand what those rights are. I have also been given
        a copy of the right
      </div>

      <div className="flex gap-4 items-end font-bold">
        <div className="flex-1">
            <input
              type="text"
              name="clientSignatureBottom"
              value={formData.clientSignatureBottom}
              onChange={(e) => {
                handleChange(e);
                if(errors.clientSignatureBottom) setErrors(prev => ({...prev, clientSignatureBottom: null}));
              }}
              onKeyDown={handleEnter}
              style={getStyle("clientSignatureBottom")}
              className={`w-full border-b border-black outline-none mb-1 px-2 ${errors.clientSignatureBottom ? "border-red-500" : ""}`}
              readOnly={isReadOnly}
            />
            <div className="text-center font-bold">
              Client/ Representative Signature <RequiredStar />
            </div>
          </div>
        <div className="w-[200px]">
            <input
              type="date"
              name="dateBottom"
              value={formData.dateBottom}
              onChange={(e) => {
                handleChange(e);
                if(errors.dateBottom) setErrors(prev => ({...prev, dateBottom: null}));
              }}
              onKeyDown={handleEnter}
              style={getStyle("dateBottom")}
              className={`w-full border-b border-black outline-none mb-1 px-2 text-center ${errors.dateBottom ? "border-red-500" : ""}`}
              readOnly={isReadOnly}
            />
            <div className="text-center font-bold">Date <RequiredStar /></div>
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
  );
};

export default PrivateHomeCare;
