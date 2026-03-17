import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const CodeOfEthicsPolicy = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    clientSignature: "",
    date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };

  const logData = () => {
    console.log("CodeOfEthicsPolicy Data:", formData);
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
    if (!formData.clientSignature?.trim()) newErrors.clientSignature = true;
    if (!formData.date?.trim()) newErrors.date = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in the signature and date.");
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

  const getStyle = (field) => ({
    outline: "none",
    background: errors[field] ? "#fee2e2" : "transparent",
    borderTop: errors[field] ? "2px solid #ef4444" : "1px solid black",
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
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-sm md:text-xl font-bold text-center uppercase">
              CODE OF ETHICS POLICY
            </h1>
            <h2 className="text-xs md:text-lg italic font-semibold text-center">
              "Standard of conduct"
            </h2>
          </div>

          {/* Policy Statement */}
          <div className="mb-4">
            <p className="text-justify mb-2">
              <span className="font-bold">Policy:</span> All persons, staff,
              contractors, parents of individuals, individuals, guardians and/or
              families with respect all individuals' belief, traditions, and
              customs according to their cultural preferences.
            </p>
          </div>

          {/* Procedure */}
          <div className="mb-4">
            <h3 className="font-bold mb-1">Procedure</h3>
            <ol className="list-decimal pl-4 md:pl-8 space-y-1">
              <li>
                All persons (staff, contractors, parents of individuals,
                individuals, guard fans and or families) are always expected to
                maintain and exercise the highest form of moral and ethical
                standards in carrying out daily responsibilities and functions.
              </li>
              <li>
                All persons (staff, contractors, parents of Individuals,
                individuals, guardians and or families) must conduct themselves
                in a manner that prohibits all forms of prejudice, threats, and
                favoritism.
              </li>
              <li>
                All persons (staff, contractors, parents of individuals,
                Individuals, guardians and or families) must comply with Pacific
                Health Systems policy and procedures according to OCH
                Guidelines. (Policy 1201)
              </li>
              <li>
                All persons (staff, contractors, parents of individuals,
                individuals, guardians and or families) will perform their job
                duties in a professional manner.
              </li>
              <li>
                All persons (staff, contractors, parents of individuals,
                individuals, guardians and or families) will not disclose
                privileged and confidential Information.
              </li>
              <li>
                All persons (staff, contractors, parents of individuals,
                Individuals, guardians and or families) that violate any client
                rights, HIPPA, or have a conflict of interests with other
                parties will be terminated.
              </li>
              <li>
                All persons (staff, contractors, parents of Individuals,
                Individuals, guardians and or families) will respect all
                clients' belief, traditions, and customs according to their
                chosen cultural preferences.
              </li>
              <li>
                All persons (staff, contractors, parents of individuals,
                individuals, guardians and or families) will receive training in
                ethics and cultural diversity.
              </li>
              <li>
                All persons (staff, contractors, parents of individuals,
                individuals, guardians and or families) have a right to a fair
                and equal opportunity to express their concerns without fear or
                threat of retaliation.
              </li>
              <li>
                All persons (staff, contractors, parents of individuals,
                individuals, guardians and or families) are prohibited to use
                any confidential information as a means to financial gain.
              </li>
            </ol>
          </div>

          {/* Prohibitions */}
          <div className="mb-8">
            <h3 className="font-bold mb-1 uppercase text-sm md:text-lg">
              THE EMPLOYEE MAY <span className="underline">NOT</span>
            </h3>
            <ol className="list-decimal pl-4 md:pl-8 space-y-1">
              <li>Use the client's vehicle(s) for personal reasons.</li>
              <li>Consume the client's food or drinks.</li>
              <li>Use the client's phone for personal calls</li>
              <li>
                Discuss his/her personal problems, religious and/or political
                beliefs.
              </li>
              <li>
                Accept gifts or monetary tips from the client and/or client's
                family.
              </li>
              <li>Lend money to a client or borrow from a client.</li>
              <li>
                Purchase or sell gifts, food, or other items to/from the client.
              </li>
              <li>
                Bring friends, children, relatives, or pets to client's house.
              </li>
              <li>
                Consume alcoholic beverages or other illegal substances prior to
                delivery of services or within the client's home.
              </li>
              <li>Sleep in the client's home.</li>
              <li>Remain on the premises after services have been rendered.</li>
              <li>
                Show up at client's home on weekends or on off duty times.
              </li>
              <li>
                Do things not listed-on the care plan or assignment sheet
                without permission.
              </li>
              <li>Smoke in client's home.</li>
              <li>Stay after service time without proper authorization.</li>
              <li>
                Turn in a Daily Care Log, Service Record Plan or Progress Note
                that is not authorized
              </li>
            </ol>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 md:gap-16 mt-12 mb-12">
              <div>
                <input
                  type="text"
                  name="clientSignature"
                  value={formData.clientSignature}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.clientSignature)
                      setErrors((prev) => ({ ...prev, clientSignature: null }));
                  }}
                  onKeyDown={handleEnter}
                  style={getStyle("clientSignature")}
                  className={`w-full ${errors.clientSignature ? "border-red-500" : ""}`}
                />
                <div className="font-bold">
                  Signature of Client/ Client Representative <RequiredStar />
                </div>
              </div>
              <div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.date)
                      setErrors((prev) => ({ ...prev, date: null }));
                  }}
                  onKeyDown={handleEnter}
                  style={getStyle("date")}
                  className={`w-full ${errors.date ? "border-red-500" : ""}`}
                />
                <div className="font-bold">
                  Date <RequiredStar />
                </div>
              </div>
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

export default CodeOfEthicsPolicy;

