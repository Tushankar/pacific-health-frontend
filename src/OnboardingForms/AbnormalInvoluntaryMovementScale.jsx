import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";

const AbnormalInvoluntaryMovementScale = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientID: "",
    examinerName: "",
    medication1: "",
    totalMgDay1: "",
    medication2: "",
    totalMgDay2: "",
    scores: {}, // Object to store scores for items 1-10. Key: item number, Value: 0-4
    dentalProblems: null, // null, 'yes', or 'no'
    wearDentures: null, // null, 'yes', or 'no'
    comments: "",
    examinerSignature: "",
    date: "",
    nextExamDate: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { key: "patientName", label: "Patient's Name" },
      { key: "date", label: "Date" },
      { key: "examinerName", label: "Examiner's Name" },
      { key: "examinerSignature", label: "Examiner's Signature" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key] || formData[field.key].trim() === "") {
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
    return errors[fieldName] ? { borderBottom: "2px solid red" } : {};
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScoreChange = (itemNumber, score) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [itemNumber]: score,
      },
    }));
  };

  const handleDentalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === value ? null : value,
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
    console.log("AbnormalInvoluntaryMovementScale Data:", formData);
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

  const renderScoreRow = (n, text) => (
    <div key={n} className="flex flex-col md:flex-row border-b border-black">
      <div className="p-2 w-full md:w-[60%] border-r-0 md:border-r border-black font-semibold text-sm">
        {n}. {text}
      </div>
      <div className="flex w-full md:w-[40%]">
        {[0, 1, 2, 3, 4].map((v) => (
          <div
            key={v}
            className="flex-1 flex flex-col items-center justify-center border-r border-black last:border-r-0 p-1 bg-gray-50 md:bg-transparent"
          >
            <span className="md:hidden text-xs font-bold mb-1">{v}</span>
            <input
              type="checkbox"
              checked={formData.scores[n] === v}
              onChange={() => handleScoreChange(n, v)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-serif">
      <ProgressBar
          currentStep={progressCurrent}
          totalSteps={progressTotal || 1}
        />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-8 bg-white text-[9px] md:text-sm leading-snug shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Top thick line */}
            <div className="border-t-4 border-black mb-3"></div>

            {/* Title */}
            <h1 className="text-sm md:text-xl font-bold mb-4">
              ABNORMAL INVOLUNTARY MOVEMENT SCALE (AIMS)
            </h1>

            {/* Patient info */}
            <div className="flex flex-col md:flex-row md:items-center mb-3 gap-2">
              <div className="flex items-center flex-1">
                <span className="font-semibold mr-2 shrink-0">
                  Patient&apos;s Name (Please Print):
                </span>
                <input
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  className="flex-1 border-b-2 border-black outline-none mr-0 md:mr-6"
                  style={getStyle("patientName")}
                />
              </div>

              <div className="flex items-center flex-1 mt-2 md:mt-0">
                <span className="font-semibold mr-2 shrink-0">
                  Patient&apos;s ID Information:
                </span>
                <input
                  name="patientID"
                  value={formData.patientID}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  className="flex-1 border-b-2 border-black outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center mb-6 gap-2">
              <span className="font-semibold mr-2">Examiner&apos;s Name:</span>
              <input
                name="examinerName"
                value={formData.examinerName}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="flex-1 min-w-0 border-b-2 border-black outline-none"
                style={getStyle("examinerName")}
              />
            </div>

            {/* Section title */}
            <h2 className="text-sm md:text-lg font-bold mb-3">
              CURRENT MEDICATIONS AND TOTAL MG/DAY
            </h2>

            {/* Medication rows */}
            <div className="flex flex-col md:flex-row md:items-center mb-2 gap-2">
              <span className="font-semibold mr-2 md:w-[120px]">
                Medication #1:
              </span>
              <input
                name="medication1"
                value={formData.medication1}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="flex-1 min-w-0 border-b-2 border-black outline-none mr-6"
              />

              <div className="flex items-center mt-2 md:mt-0">
                <span className="font-semibold mr-2">Total mg/Day:</span>
                <input
                  name="totalMgDay1"
                  value={formData.totalMgDay1}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  className="w-[80px] md:w-[120px] border-b-2 border-black outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="font-semibold mr-2 md:w-[120px]">
                Medication #2:
              </span>
              <input
                name="medication2"
                value={formData.medication2}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="flex-1 min-w-0 border-b-2 border-black outline-none mr-6"
              />

              <div className="flex items-center mt-2 md:mt-0">
                <span className="font-semibold mr-2">Total mg/Day:</span>
                <input
                  name="totalMgDay2"
                  value={formData.totalMgDay2}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                  className="w-[80px] md:w-[120px] border-b-2 border-black outline-none"
                />
              </div>
            </div>
            {/* Top thick line */}
            <div className="border-t-2 border-black mb-3 mt-6"></div>

            {/* Main Content Container */}
            <div className="w-full border border-black text-[9px] md:text-sm">
              {/* Header Row for Scale (Desktop Only) */}
              <div className="hidden md:flex border-b border-black bg-gray-100 font-bold">
                <div className="w-[60%] border-r border-black p-2"></div>
                {["None/Normal", "Minimal", "Mild", "Moderate", "Severe"].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center border-r border-black last:border-r-0 p-2 text-[10px] md:text-[13px]"
                    >
                      {h}
                    </div>
                  ),
                )}
              </div>

              {/* Facial and Oral Movements */}
              <div className="border-b border-black p-2 font-bold bg-gray-200">
                Facial and Oral Movements
              </div>
              {[
                {
                  n: 1,
                  text: "Muscles of Facial Expression e.g. movements of forehead, eyebrows, periorbital area, cheeks; include frowning, blinking, smiling, grimacing.",
                },
                {
                  n: 2,
                  text: "Lips and Perioral Area e.g. puckering, pouting, smacking",
                },
                {
                  n: 3,
                  text: "Jaw e.g. biting, clenching, chewing, mouth opening, lateral movement",
                },
                {
                  n: 4,
                  text: "Tongue. Rate only increases in movement both in and out of mouth, NOT inability to sustain movement.",
                },
              ].map((row) => renderScoreRow(row.n, row.text))}

              {/* Extremity Movements */}
              <div className="border-b border-black p-2 font-bold bg-gray-200">
                Extremity Movements
              </div>
              {[
                {
                  n: 5,
                  text: "Upper (arms, wrists, hands, fingers). Include choreic movements (i.e. rapid, objective purposeless, irregular, spontaneous); athetoid movements (i.e. repetitive, regular, rhythmic).",
                },
                {
                  n: 6,
                  text: "Lower (legs, knees, ankles, toes). E.g. lateral knee movement, foot tapping, heel dropping, foot squirming, inversion and eversion of foot.",
                },
              ].map((row) => renderScoreRow(row.n, row.text))}

              {/* Trunk Movements */}
              <div className="border-b border-black p-2 font-bold bg-gray-200">
                Trunk Movements
              </div>
              {renderScoreRow(
                7,
                "Neck, shoulders, hip. E.g. rocking, twisting, squirming, pelvic gyrations",
              )}

              {/* Scoring instructions */}
              <div className="border-b border-black p-2 text-[8px] md:text-[13px]">
                <strong>SCORING:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    Score the highest amplitude or frequency in a movement on
                    the 0–4 scale, not the average;
                  </li>
                  <li>
                    Score Activated Movements the same way; do not lower those
                    numbers as was proposed at one time;
                  </li>
                  <li>
                    <strong>A POSITIVE AIMS EXAMINATION</strong> IS A SCORE OF 2
                    IN TWO OR MORE MOVEMENTS OR A SCORE OF 3 OR 4 IN A SINGLE
                    MOVEMENT.
                  </li>
                </ul>
                <p className="mt-1">
                  Do not sum the scores: e.g. a patient who has scores 1 in four
                  movements DOES NOT have a positive AIMS score of 4.
                </p>
              </div>

              {/* Overall Severity */}
              <div className="border-b border-black p-2 font-bold bg-gray-200">
                Overall Severity
              </div>
              {[
                "Severity of abnormal movements",
                "Incapacitation due to abnormal movements",
                "Patient's awareness of abnormal movements (rate only patient’s report)",
              ].map((text, i) => renderScoreRow(8 + i, text))}

              {/* Awareness scale note */}
              <div className="border-b border-black p-2 text-[8px] md:text-[13px] bg-gray-50 italic">
                0 = No awareness, 1 = Aware, no distress, 2 = Aware, mild
                distress, 3 = Aware, moderate distress, 4 = Aware, severe
                distress
              </div>

              {/* Dental Status */}
              <div className="border-b border-black p-2 font-bold bg-gray-200">
                Dental Status
              </div>

              {/* Q11 */}
              <div className="flex flex-col md:flex-row border-b border-black">
                <div className="p-2 w-full md:w-[60%] border-r-0 md:border-r border-black font-semibold">
                  11. Current problems with teeth and/or dentures?
                </div>
                <div className="flex w-full md:w-[40%]">
                  <div className="flex-1 flex items-center justify-center border-r border-black p-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.dentalProblems === "yes"}
                        onChange={() =>
                          handleDentalChange("dentalProblems", "yes")
                        }
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.dentalProblems === "no"}
                        onChange={() =>
                          handleDentalChange("dentalProblems", "no")
                        }
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              {/* Q12 */}
              <div className="flex flex-col md:flex-row border-b border-black">
                <div className="p-2 w-full md:w-[60%] border-r-0 md:border-r border-black font-semibold">
                  12. Does patient usually wear dentures?
                </div>
                <div className="flex w-full md:w-[40%]">
                  <div className="flex-1 flex items-center justify-center border-r border-black p-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wearDentures === "yes"}
                        onChange={() =>
                          handleDentalChange("wearDentures", "yes")
                        }
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wearDentures === "no"}
                        onChange={() =>
                          handleDentalChange("wearDentures", "no")
                        }
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer / Comments */}
              <div className="border-b border-black p-2">
                Comments:
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full h-16 outline-none resize-none mt-1 bg-transparent"
                />
              </div>

              {/* Signatures */}
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    Examiner&apos;s Signature:
                    <input
                      name="examinerSignature"
                      value={formData.examinerSignature}
                      onChange={handleChange}
                      onKeyDown={handleEnter}
                      className="w-full border-b border-black outline-none mt-2 bg-transparent"
                      style={getStyle("examinerSignature")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      Date:
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        className="w-full border-b border-black outline-none mt-2 bg-transparent"
                        style={getStyle("date")}
                      />
                    </div>
                    <div>
                      Next Exam Date:
                      <input
                        type="date"
                        name="nextExamDate"
                        value={formData.nextExamDate}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        className="w-full border-b border-black outline-none mt-2 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default AbnormalInvoluntaryMovementScale;

