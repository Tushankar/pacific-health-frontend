import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import one from "../assets/one.jpg";
import two from "../assets/two.png";
import three from "../assets/three.jpg";
import four from "../assets/four.png";
import five from "../assets/five.jpg";
import six from "../assets/six.png";
import seven from "../assets/seven.png";
import eight from "../assets/eight.jpg";
import nine from "../assets/nine.jpg";
import ten from "../assets/ten.jpg";
import elev from "../assets/elev.jpg";
import twel from "../assets/twel.jpg";
import thirtee from "../assets/thirtee.gif";
import fourteen from "../assets/fourteen.jpg";
import fifte from "../assets/fifte.jpg";
import sixteen from "../assets/sixteen.jpg";
import sevteen from "../assets/sevteen.jpg";
import eighteen from "../assets/eighteen.jpg";
import nighteen from "../assets/nighteen.png";
import twenty from "../assets/twenty.png";
import twentyone from "../assets/twentyone.png";
import twentytwo from "../assets/twentytwo.png";

const MyHumanRights = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const rights = [
    {
      text: "Right to wear your own clothes. You should be able to pick the clothes you wear.",
      img: one,
    },
    { text: "Right to be treated well and with respect.", img: twel },

    {
      text: "Right to keep personal belongings in a private place that you can get into when you want.",
      img: two,
    },
    {
      text: "MEDICINE: You CANNOT be given medication: without a written order by a doctor, as punishment, or for staff convenience.",
      img: thirtee,
    },

    {
      text: "Right to meet people and take part in community activities.",
      img: three,
    },
    {
      text: "You CANNOT be subjected to experimental research without your consent.",
      img: fourteen,
    },

    {
      text: "Right to socialize. You have the right to have visitors and to see your friends, family, girlfriends or boyfriends every day.",
      img: four,
    },
    {
      text: "Right to see a doctor as soon as you need and the right to receive adequate medical treatment.",
      img: fifte,
    },

    {
      text: "Right to choose how and with whom you spend your free time: alone or alone with a friend.",
      img: five,
    },
    { text: "Your medical record is confidential.", img: sixteen },

    { text: "Right to exercise and have fun.", img: six },
    {
      text: "You CANNOT be tied or held down or be forced to be alone unless it is to protect you or someone else.",
      img: sevteen,
    },

    { text: "Right to send and receive mail that is not opened.", img: seven },
    {
      text: "Your things cannot be searched unless you are present or good reasons for the search are given.",
      img: eighteen,
    },

    {
      text: "Right to services that help you live, work and play in the most normal way possible.",
      img: eight,
    },
    {
      text: 'Right to say "NO" to anybody trying to change the way you act by hurting you, scaring you or upsetting you.',
      img: nighteen,
    },

    { text: "Right to worship and be who you choose.", img: nine },
    { text: "Right to use the telephone to make and get calls.", img: twenty },

    { text: "Right to training and education.", img: ten },
    {
      text: "Right to make choices about where you live, whom you live with, and the way you spend your time and who you spend your time with.",
      img: twentyone,
    },

    { text: "Right to vote.", img: elev },
    { text: "Right to work in the community.", img: twentytwo },
  ];

  const [formData, setFormData] = useState({
    clientName: "",
    date: "",
    signature: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName?.trim()) newErrors.clientName = true;
    if (!formData.date?.trim()) newErrors.date = true;
    if (!formData.signature?.trim()) newErrors.signature = true;
    if (!formData.dob?.trim()) newErrors.dob = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      const firstErrorField = document.querySelector(".border-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
      return false;
    }
    return true;
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

  const handleChange = (field, value) => {
    if (isReadOnly) return;
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
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center font-bold text-lg mb-6">
              My Human Rights
            </h1>

            <div className="grid grid-cols-2 border-t border-l border-black">
              {rights.map((right, index) => (
                <div
                  key={index}
                  className="flex items-stretch min-h-[70px] border-b border-r border-black"
                >
                  {/* IMAGE CELL */}
                  <div className="w-16 flex items-center justify-center shrink-0 overflow-hidden border-r border-black pr-1 self-stretch">
                    {right.img ? (
                      <img
                        src={right.img}
                        alt={`icon-${index}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* TEXT CELL */}
                  <div className="flex-1 text-[10px] leading-tight pl-2 py-1">
                    {right.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 space-y-4 mb-6">
              <div className="flex gap-2 items-end">
                <span className="w-32 font-bold whitespace-nowrap shrink-0">
                  Client Name: <RequiredStar />
                </span>
                <input
                  name="clientName"
                  className={`flex-1 border-b outline-none min-w-0 ${errors.clientName ? "border-red-500" : "border-black"}`}
                  value={formData.clientName}
                  onChange={(e) => {
                    handleChange("clientName", e.target.value);
                    if (errors.clientName)
                      setErrors((prev) => ({ ...prev, clientName: null }));
                  }}
                  style={getStyle("clientName")}
                  readOnly={isReadOnly}
                />
                <span className="w-16 text-right font-bold whitespace-nowrap shrink-0">
                  Date: <RequiredStar />
                </span>
                <input
                  name="date"
                  type="date"
                  className={`w-32 border-b outline-none text-center ${errors.date ? "border-red-500" : "border-black"}`}
                  value={formData.date}
                  onChange={(e) => {
                    handleChange("date", e.target.value);
                    if (errors.date)
                      setErrors((prev) => ({ ...prev, date: null }));
                  }}
                  style={getStyle("date")}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="flex gap-2 items-end">
                <span className="w-32 font-bold whitespace-nowrap shrink-0">
                  Signature: <RequiredStar />
                </span>
                <input
                  name="signature"
                  className={`flex-1 border-b outline-none min-w-0 ${errors.signature ? "border-red-500" : "border-black"}`}
                  value={formData.signature}
                  onChange={(e) => {
                    handleChange("signature", e.target.value);
                    if (errors.signature)
                      setErrors((prev) => ({ ...prev, signature: null }));
                  }}
                  style={getStyle("signature")}
                  readOnly={isReadOnly}
                />
                <span className="w-16 text-right font-bold whitespace-nowrap shrink-0">
                  DOB: <RequiredStar />
                </span>
                <input
                  name="dob"
                  type="date"
                  className={`w-32 border-b outline-none text-center ${errors.dob ? "border-red-500" : "border-black"}`}
                  value={formData.dob}
                  onChange={(e) => {
                    handleChange("dob", e.target.value);
                    if (errors.dob)
                      setErrors((prev) => ({ ...prev, dob: null }));
                  }}
                  style={getStyle("dob")}
                  readOnly={isReadOnly}
                />
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

export default MyHumanRights;

