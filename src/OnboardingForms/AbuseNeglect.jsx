import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const AbuseNeglect = ({
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
    signature: "",
    date: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
    if (!formData.name?.trim()) newErrors.name = true;
    if (!formData.signature?.trim()) newErrors.signature = true;
    if (!formData.date?.trim()) newErrors.date = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) {
      toast.error("Please fill in your name, signature, and date.");
      setTimeout(() => {
        const firstErrorField = document.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          if (firstErrorField.tagName === "INPUT") firstErrorField.focus();
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
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Page 1 */}
            <div>
              {/* Header */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={logo}
                  alt="Pacific Health Systems"
                  className="h-12 md:h-16 object-contain mb-2"
                />
              </div>

              <div className="flex gap-4 items-end mb-8">
                <span className="font-bold whitespace-nowrap">
                  Name: <RequiredStar />{" "}
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange("name", e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  style={getStyle("name")}
                  className={`flex-grow border-b border-black outline-none px-2 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="font-bold w-20 shrink-0">POLICY:</span>
                  <span className="font-bold flex-1 text-center text-sm">
                    Abuse, Neglect and Exploitation
                  </span>
                </div>

                <p>
                  <span className="font-bold">PURPOSE:</span> To define abuse
                  and neglect and the procedure to follow in regard to reporting
                  them.
                </p>

                <p className="font-bold">
                  All reports of abuse will be treated as Critical Incidents and
                  will be investigated by Management.
                </p>

                <p className="font-bold">
                  Any staff member accused of neglect, abuse or exploitation of
                  any type will be immediately suspended pending an
                  investigation.
                </p>

                <div>
                  <p className="font-bold">DEFINITIONS:</p>
                  <ul className="space-y-4 mt-2">
                    <li className="flex gap-4">
                      <span className="w-4 shrink-0">a)</span>
                      <span>
                        <span className="font-bold">Physical abuse:</span>{" "}
                        physical act by caregiver that causes pain, suffering,
                        injury, or hurt to an individual; physical acts by
                        caregiver that chastise, belittle, embarrass, humiliate,
                        or degrade an individual; use of unapproved or excessive
                        physical or chemical restraint techniques toward an
                        individual by a caregiver.
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-4 shrink-0">b)</span>
                      <span>
                        <span className="font-bold">Verbal abuse:</span> any
                        derogatory, threatening, derisive, or demeaning
                        language, whether oral or with gestures, directed toward
                        an individual by caregiver; any profane language
                        directed toward an individual by caregiver.
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-4 shrink-0">c)</span>
                      <span>
                        <span className="font-bold">Neglect:</span> failure or
                        refusal to attend to the necessary care and necessary
                        treatment of an individual by caregiver; action or
                        inaction by caregiver that denies individuals the
                        prescribed care and treatment to which they are
                        entitled; actions by caregiver contrary to the
                        prescribed treatment or program; unauthorized removal or
                        unauthorized denial of an individual's personal
                        possessions (e.g., cigarettes, radio, phonograph,
                        toiletries, etc.); unauthorized removal or unauthorized
                        denial of an individual's scheduled meals or snacks;
                        failure to implement individual treatment programs as
                        designed by the interdisciplinary treatment team;
                        unauthorized use of seclusion and/or restraint; failure
                        to secure proper or sufficient clothing and to see that
                        individual is properly clothed; preventing an individual
                        during normal waking hours from communicating by letter,
                        telephone, or personal visit with the individual's
                        lawyer, physician, advocate, or guardian; preventing an
                        individual from having visits from relatives unless such
                        visits are unauthorized; failure to intervene or protect
                        the individual from abuse/mistreatment by another
                        individual or staff member; removal or denial of an
                        individual's normal comfort needs (e.g., bed, hot water,
                        lights, heat, clothing).
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-4 shrink-0">d)</span>
                      <span>
                        <span className="font-bold">Sexual abuse:</span> any
                        sexual activity between a caregiver and a individual,
                        even if such actions are consented to by the individual,
                        or that a person in the caregiver's position should have
                        reasonably known that the individual would perceive as
                        sexual activity; caregiver using his/her position for
                        sexual gratification or exploitation of individuals.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <p>
                    Pacific Health Systems does not and will not hire any person
                    charged with the following crimes:
                  </p>
                  <div className="mt-2 space-y-1 ml-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-black shrink-0"></div>
                      <span>Child, Individual or Patient Abuse</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-black shrink-0"></div>
                      <span>Child, Individual or Patient Neglect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-black shrink-0"></div>
                      <span>Child, Individual or Patient Misappropriation</span>
                    </div>
                  </div>
                </div>

                <p className="pt-4">
                  In the event that a staff person is convicted of any of the
                  above crimes they must notify Pacific Health Systems
                  immediately.
                </p>
              </div>

              <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
                1 | Page
              </div>
            </div>

            {/* Page 2 */}
            <div className="mt-8 pt-8 border-t border-gray-300">
              <div className="space-y-6">
                <p>
                  All staff are to notify the Director or designee of Pacific
                  Health Systems immediately upon becoming aware of a possible
                  abuse incident.
                </p>

                <div>
                  <p className="font-bold underline">
                    Reporting abuse and neglect allegations:
                  </p>
                  <p className="mt-2 text-justify">
                    Reports of abuse or neglect for adults must be reported to:
                  </p>
                  <ol className="list-[roman] ml-12 space-y-4 mt-4">
                    <li>
                      The Georgia Department of Behavioral Health &
                      Developmental Disabilities Office of Incident Management
                      immediately and follow the steps for DBHDD Critical
                      Incident & Death Policy 04-106.
                    </li>
                    <li>
                      The Director or designee must fill out the Critical
                      Incident & Death Reporting Form C and send an electronic
                      copy to the DBHDD Office of Investigations immediately.
                    </li>
                    <li>
                      The Director or designee must immediately notify the
                      Georgia Department of Community Health Healthcare Facility
                      Regulation Division at the following address:
                    </li>
                  </ol>
                </div>

                <div className="ml-12 space-y-1">
                  <p>Georgia Department of Community Health</p>
                  <p>Healthcare Facility Regulation Division (HFRD)</p>
                  <p>2 Peachtree Street, NW, Suite 31-447</p>
                  <p>Atlanta, GA 30303-3142</p>
                  <p>404-657-5850 Main/Licensing</p>
                  <p>404-657-5728 Complaint Line Local</p>
                  <p>800-878-6442 Complaint Line Toll Free</p>
                </div>

                <p className="text-red-600 font-bold italic">
                  All staff are mandated reporters and are mandated by the State
                  of Georgia to report all allegations of abuse and neglect.
                </p>

                <div className="mt-12">
                  <p>
                    I fully understand Pacific Health Systems policy and
                    procedures for Abuse, Neglect, and Exploitation.
                  </p>
                </div>

                {/* Signatures */}
                <div className="mt-20 flex justify-between items-end gap-12 mb-6">
                  <div className="flex-1">
                    <input
                      name="signature"
                      className={`w-full border-b border-black outline-none mb-1 px-2 ${errors.signature ? "border-red-500" : ""}`}
                      value={formData.signature}
                      style={getStyle("signature")}
                      onChange={(e) => {
                        handleChange("signature", e.target.value);
                        if (errors.signature)
                          setErrors((prev) => ({ ...prev, signature: null }));
                      }}
                    />
                    <div className="text-left font-bold text-[8px] md:text-[10px]">
                      Client/Client Representative Signature <RequiredStar />
                    </div>
                  </div>
                  <div className="w-[150px]">
                    <input
                      className={`w-full border-b border-black outline-none mb-1 px-2 text-center ${errors.date ? "border-red-500" : ""}`}
                      value={formData.date}
                      type="date"
                      style={getStyle("date")}
                      onChange={(e) => {
                        handleChange("date", e.target.value);
                        if (errors.date)
                          setErrors((prev) => ({ ...prev, date: null }));
                      }}
                    />
                    <div className="text-center font-bold text-[8px] md:text-[10px]">
                      Date <RequiredStar />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AbuseNeglect;

