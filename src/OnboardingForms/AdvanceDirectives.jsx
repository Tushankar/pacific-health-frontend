import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const AdvanceDirectives = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    individualName: "",
    dob: "",
    initials1: "",
    initials2: "",
    initials3: "",
    checkChoice: "", // 'executed', 'notExecuted', 'additionalInfo'
    signatureIndividual: "",
    signatureWitness: "",
    dateIndividual: "",
    dateWitness: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? value : "") : value,
    }));
  };

  const handleCheck = (choice) => {
    setFormData((prev) => ({
      ...prev,
      checkChoice: choice,
    }));
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.individualName?.trim()) newErrors.individualName = true;
    if (!formData.dob?.trim()) newErrors.dob = true;
    if (!formData.checkChoice) newErrors.checkChoice = true;
    if (!formData.signatureIndividual?.trim())
      newErrors.signatureIndividual = true;
    if (!formData.dateIndividual?.trim()) newErrors.dateIndividual = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error(
        "Please fill in all required fields and select one directive statement.",
      );
      setTimeout(() => {
        const firstErrorField = document.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          if (firstErrorField.tagName === "INPUT") firstErrorField.focus();
        } else {
          // Scroll to selection if that's the error
          const selectionHeader = document.querySelector(
            ".text-red-600.underline",
          );
          if (selectionHeader)
            selectionHeader.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
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
    transition: "all 0.2s",
  });

  const RequiredStar = () => (
    <span className="text-red-500 ml-1 font-bold">*</span>
  );

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-12 md:h-16 object-contain mb-2"
              />
              <h2 className="text-center font-bold uppercase text-sm md:text-lg">
                ADVANCE DIRECTIVES
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-4 text-justify">
              <p>
                Competent adults have the right to control decisions relating to
                their own medical care. The law has provided alternatives in
                writing for you so your Healthcare provider and family will know
                how you want to be treated in the event you are unable to tell
                them. These legal documents that assure your future Healthcare
                choices are known as Advance Directives. The two types are:
              </p>
              <ol className="list-decimal pl-8 space-y-1">
                <li>The Durable Power of Attorney for Healthcare</li>
                <li>A Living Will</li>
              </ol>

              <p>
                The Durable Power of Attorney for Healthcare is a document that
                enables you to appoint another person, called your Agent, to
                make Healthcare decisions for you if you are unable,
                incapacitated or incompetent to do so. You do not have to be in
                a terminal condition to have an appointed Agent. Your Agent's
                authority begins when your doctor certifies that you lack the
                capacity to make Healthcare decisions.
              </p>

              <p>
                Your Agent has the authority to make any and all Healthcare
                decisions for you in accordance with your wishes.
              </p>

              <p>
                Healthcare means any treatment, service, or procedure to
                maintain, diagnose or treat your physical or mental condition.
                Your agent may consent, refuse to consent, or withdraw consent
                to medical treatment and may make decisions about withdrawing
                life-sustaining treatment. A physician must comply with your
                Agent's instructions or allow you to be transferred to another
                physician. Inform the person you appoint that you want him/her
                to be your Agent.
              </p>

              <p>
                A Living Will is a type of Advance Directive. It provides a
                means for you to instruct your physician to withhold or withdraw
                life-sustaining procedures in the event of a coma; persistent
                vegetative state or a terminal condition.
              </p>

              <p>
                A Living Will must be signed, witnessed, and dated. Both you and
                your physician should have a copy. A Living Will may be revoked
                at any time by physically destroying the document or
                communicating this change in decision to your physician.
              </p>
            </div>

            {/* Footer Page 1 */}
            <div className="mt-auto pt-16">
              <div className="flex items-end gap-4 w-full">
                <span className="whitespace-nowrap font-medium shrink-0 text-sm">
                  Individual's Name: <RequiredStar />
                </span>
                <input
                  name="individualName"
                  value={formData.individualName}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.individualName)
                      setErrors((prev) => ({ ...prev, individualName: null }));
                  }}
                  style={getStyle("individualName")}
                  className={`flex-grow border-b border-black border-dashed outline-none min-w-0 bg-transparent ${errors.individualName ? "border-red-500" : ""}`}
                />
                <span className="whitespace-nowrap font-medium shrink-0 text-sm ml-8">
                  DOB <RequiredStar />
                </span>
                <input
                  name="dob"
                  value={formData.dob}
                  type="date"
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.dob)
                      setErrors((prev) => ({ ...prev, dob: null }));
                  }}
                  style={getStyle("dob")}
                  className={`w-1/3 border-b border-black border-dashed outline-none bg-transparent ${errors.dob ? "border-red-500" : ""}`}
                />
              </div>
              <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
                1 | Page
              </div>
            </div>
            {/* Page 2 Content */}
            <div className="space-y-6 mt-8">
              <div className="flex gap-4">
                <span>1.</span>
                <div>
                  I have been given written materials on my right to accept or
                  refuse medical and surgical treatment and my rights to
                  formulate advance directives.
                  <div className="flex justify-end mt-2">
                    <div className="flex items-end gap-2">
                      <input
                        name="initials1"
                        value={formData.initials1}
                        onChange={handleChange}
                        className="w-32 border-b border-black outline-none text-center"
                      />
                      <span className="text-[7px] md:text-[9px] whitespace-nowrap">
                        (individuals' initials)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <span>2.</span>
                <div>
                  I understand that I am not required to have an Advance
                  Directive in order to receive medical treatment.
                  <div className="inline-flex items-end gap-2 ml-2">
                    <input
                      name="initials2"
                      value={formData.initials2}
                      onChange={handleChange}
                      className="w-32 border-b border-black outline-none text-center"
                    />
                    <span className="text-[7px] md:text-[9px] whitespace-nowrap">
                      (individuals' initials)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <span>3.</span>
                <div>
                  I understand that the terms of any Advance Directive that I
                  execute will be followed by Pacific Health Systems PCH to the
                  extent permitted by law and in accordance with the service's
                  policies and procedures.
                  <div className="inline-flex items-end gap-2 ml-2">
                    <input
                      name="initials3"
                      value={formData.initials3}
                      onChange={handleChange}
                      className="w-32 border-b border-black outline-none text-center"
                    />
                    <span className="text-[7px] md:text-[9px] whitespace-nowrap">
                      (individuals' initials)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 mb-8">
              <h3
                className={`font-bold underline uppercase mb-4 ${errors.checkChoice ? "text-red-600" : ""}`}
              >
                PLEASE CHECK ONE OF THE FOLLOWING STATEMENTS <RequiredStar />
              </h3>

              <div className="space-y-6">
                <div
                  className={`flex gap-2 cursor-pointer ${errors.checkChoice ? "bg-red-50 p-1 rounded" : ""}`}
                  onClick={() => {
                    handleCheck("executed");
                    if (errors.checkChoice)
                      setErrors((prev) => ({ ...prev, checkChoice: null }));
                  }}
                >
                  <div
                    className={`w-6 h-6 border-b ${errors.checkChoice ? "border-red-500" : "border-black"} shrink-0 flex items-center justify-center font-bold`}
                  >
                    {formData.checkChoice === "executed" ? "X" : ""}
                  </div>
                  <p>
                    I have executed an Advance Directive and will provide a copy
                    to Pacific Health Systems. I understand that the staff and
                    physicians associated with Pacific Health Systems will not
                    be able to follow the terms of my Advance Directive until I
                    provide a copy to the staff.
                  </p>
                </div>
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() => handleCheck("notExecuted")}
                >
                  <div
                    className={`w-6 h-6 border-b border-black shrink-0 flex items-center justify-center font-bold`}
                  >
                    {formData.checkChoice === "notExecuted" ? "X" : ""}
                  </div>
                  <p>
                    I have not executed an Advance Directive and do not wish to
                    discuss Advance Directives further, at this time.
                  </p>
                </div>
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() => handleCheck("additionalInfo")}
                >
                  <div
                    className={`w-6 h-6 border-b border-black shrink-0 flex items-center justify-center font-bold`}
                  >
                    {formData.checkChoice === "additionalInfo" ? "X" : ""}
                  </div>
                  <p>
                    I have not executed an Advance Directive but would like to
                    obtain additional information about Advance Directives.
                  </p>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-12 space-y-12">
              <div className="flex justify-between gap-12">
                <div className="flex-1">
                  <input
                    name="signatureIndividual"
                    value={formData.signatureIndividual}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.signatureIndividual)
                        setErrors((prev) => ({
                          ...prev,
                          signatureIndividual: null,
                        }));
                    }}
                    style={getStyle("signatureIndividual")}
                    className={`w-full border-b border-black outline-none mb-1 ${errors.signatureIndividual ? "border-red-500" : ""}`}
                  />
                  <div className="text-xs font-bold">
                    Individual/ Guardian Signature <RequiredStar />
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    name="signatureWitness"
                    value={formData.signatureWitness}
                    onChange={handleChange}
                    className="w-full border-b border-black outline-none mb-1"
                  />
                  <div className="text-xs font-bold">Witness</div>
                </div>
              </div>
              <div className="flex justify-between gap-12">
                <div className="flex-1">
                  <input
                    name="dateIndividual"
                    value={formData.dateIndividual}
                    type="date"
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.dateIndividual)
                        setErrors((prev) => ({
                          ...prev,
                          dateIndividual: null,
                        }));
                    }}
                    style={getStyle("dateIndividual")}
                    className={`w-full border-b border-black outline-none mb-1 text-center ${errors.dateIndividual ? "border-red-500" : ""}`}
                    placeholder="MM/DD/YYYY"
                  />
                  <div className="text-[8px] md:text-[10px] font-bold text-center">
                    Date <RequiredStar />
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    name="dateWitness"
                    value={formData.dateWitness}
                    onChange={handleChange}
                    className="w-full border-b border-black outline-none mb-1 text-center"
                    placeholder="MM/DD/YYYY"
                  />
                  <div className="text-[8px] md:text-[10px] font-bold text-center">
                    Date
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
              2 | Page
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
    </div>
  );
};

export default AdvanceDirectives;

