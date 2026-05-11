import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FileText,
  CheckCircle,
  Target,
  ArrowLeft,
  Briefcase,
  User,
  Shield,
  Phone,
  Clock,
  AlertCircle,
  Send,
  RotateCcw,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const PCAJobDescription = ({
  position,
  employeeSignature,
  signatureDate,
  onSignatureChange,
  onDateChange,
  isReadOnly = false,
}) => {
  const getPositionTitle = () => {
    switch (position) {
      case "PCA":
        return "Personal Care Assistant (PCA) Job Description";
      case "CNA":
        return "Certified Nursing Assistant (CNA) Job Description";
      case "LPN":
        return "Licensed Practical Nurse (LPN) Job Description";
      case "RN":
        return "Registered Nurse (RN) Job Description";
      default:
        return "Job Description";
    }
  };

  const getPositionContent = () => {
    switch (position) {
      case "PCA":
        return {
          summary:
            "The Personal Care Assistant (PCA) provides non-medical support services to clients in their homes, helping them with activities of daily living (ADLs) to enhance their independence, comfort, and safety. The PCA works under the supervision of a Registered Nurse or designated supervisor.",
          duties: [
            "Assist with personal hygiene including bathing, grooming, dressing, and toileting.",
            "Provide mobility support, including transferring and ambulation.",
            "Assist with meal preparation and feeding if necessary.",
            "Perform light housekeeping tasks such as laundry, dishes, and sweeping.",
            "Offer companionship and emotional support to clients.",
            "Monitor and report changes in client condition to the supervisor.",
            "Comply with infection control protocols and safety procedures.",
            "Maintain client confidentiality and respect client rights.",
            "Accurately document care and services provided each day.",
          ],
          qualifications: [
            "High school diploma or GED.",
            "Completion of a state-approved PCA training program or equivalent.",
            "Current CPR and First Aid certification.",
            "Must pass background checks and health screenings (e.g., TB test).",
            "Reliable, compassionate, and good interpersonal skills.",
          ],
          conditions:
            "PCAs work in client homes and may encounter a variety of living environments. The role requires physical effort including lifting, standing, and assisting with mobility. Flexibility in schedule and travel between clients may be required.",
          reporting:
            "The PCA reports directly to the Supervisory Nurse or designated agency supervisor.",
        };
      case "CNA":
        return {
          summary:
            "The Certified Nursing Assistant (CNA) provides basic nursing care and assistance to patients under the supervision of licensed nursing staff. CNAs help patients with daily living activities and monitor their health status.",
          duties: [
            "Assist patients with bathing, dressing, and personal hygiene.",
            "Help patients with mobility, including transferring and ambulation.",
            "Take and record vital signs such as temperature, blood pressure, and pulse.",
            "Assist with feeding and maintaining nutrition.",
            "Change bed linens and maintain clean patient environments.",
            "Observe and report changes in patient condition to nursing staff.",
            "Provide emotional support and companionship to patients.",
            "Follow infection control and safety protocols.",
            "Document care provided and patient observations.",
          ],
          qualifications: [
            "High school diploma or GED.",
            "Completion of state-approved CNA training program.",
            "Current CNA certification.",
            "Current CPR certification.",
            "Must pass background checks and health screenings.",
            "Strong communication and interpersonal skills.",
          ],
          conditions:
            "CNAs work in various healthcare settings including hospitals, nursing homes, and assisted living facilities. The role involves physical demands such as lifting and assisting patients. Shift work including nights, weekends, and holidays may be required.",
          reporting:
            "The CNA reports to the Charge Nurse or designated licensed nursing staff.",
        };
      case "LPN":
        return {
          summary:
            "The Licensed Practical Nurse (LPN) provides nursing care under the supervision of registered nurses and physicians. LPNs administer medications, monitor patient health, and assist with patient care in various healthcare settings.",
          duties: [
            "Administer medications and treatments as prescribed.",
            "Monitor and record patient vital signs and health status.",
            "Assist with patient assessments and care planning.",
            "Provide wound care and dressing changes.",
            "Insert and maintain IV lines under supervision.",
            "Educate patients and families about health conditions and care.",
            "Collaborate with healthcare team members.",
            "Maintain accurate patient records and documentation.",
            "Follow safety and infection control protocols.",
          ],
          qualifications: [
            "Completion of accredited LPN program.",
            "Current LPN license.",
            "Current CPR and Basic Life Support certification.",
            "Knowledge of nursing procedures and medical terminology.",
            "Strong clinical skills and attention to detail.",
            "Must pass background checks and health screenings.",
          ],
          conditions:
            "LPNs work in hospitals, clinics, long-term care facilities, and home health settings. The role requires standing for long periods, physical stamina, and the ability to work various shifts including nights and weekends.",
          reporting:
            "The LPN reports to the Registered Nurse or physician in charge.",
        };
      case "RN":
        return {
          summary:
            "The Registered Nurse (RN) provides comprehensive nursing care, coordinates patient care plans, and supervises nursing staff. RNs assess patient needs, administer treatments, and ensure high-quality healthcare delivery.",
          duties: [
            "Assess patient health conditions and develop care plans.",
            "Administer medications, treatments, and IV therapy.",
            "Monitor patient progress and adjust care plans as needed.",
            "Educate patients and families about health conditions and treatments.",
            "Coordinate with physicians and healthcare team members.",
            "Supervise and delegate tasks to nursing assistants and LPNs.",
            "Maintain accurate patient records and documentation.",
            "Ensure compliance with healthcare regulations and standards.",
            "Provide emergency care and respond to patient needs.",
          ],
          qualifications: [
            "Bachelor's or Associate degree in Nursing.",
            "Current RN license.",
            "Current CPR and Advanced Cardiac Life Support certification.",
            "Clinical experience in relevant specialty areas preferred.",
            "Strong critical thinking and decision-making skills.",
            "Must pass background checks and health screenings.",
          ],
          conditions:
            "RNs work in hospitals, clinics, emergency rooms, and specialty care units. The role involves high-stress situations, long hours, and shift work including nights, weekends, and holidays. Physical stamina and emotional resilience are required.",
          reporting:
            "The RN reports to the Nurse Manager or Director of Nursing.",
        };
      default:
        return {
          summary: "",
          duties: [],
          qualifications: [],
          conditions: "",
          reporting: "",
        };
    }
  };

  const content = getPositionContent();

  return (
    <div className="min-h-screen bg-white py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white">
        {/* Header */}
        <div className="border-b-4 border-blue-900 pb-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <img
              src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png"
              alt="Pacific Health Systems"
              className="h-24"
            />
          </div>
          <h1 className="text-center text-sm text-gray-700 font-semibold">
            {getPositionTitle()}
          </h1>
        </div>

        {/* Position Summary */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-900 mb-3">
            Position Summary
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed font-normal">
            {content.summary}
          </p>
        </div>

        {/* Duties and Responsibilities */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-900 mb-3">
            Duties and Responsibilities
          </h2>
          <p className="text-sm text-gray-800 mb-3">
            The {position} is responsible for performing the following tasks:
          </p>
          <ul className="space-y-2 ml-6">
            {content.duties.map((duty, index) => (
              <li
                key={index}
                className="text-sm text-gray-800 leading-relaxed flex font-normal"
              >
                <span className="mr-3">-</span>
                <span>{duty}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Qualifications */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-900 mb-3">
            Qualifications
          </h2>
          <ul className="space-y-2 ml-6">
            {content.qualifications.map((qual, index) => (
              <li
                key={index}
                className="text-sm text-gray-800 leading-relaxed flex font-normal"
              >
                <span className="mr-3">-</span>
                <span>{qual}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Working Conditions */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-900 mb-3">
            Working Conditions
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed font-normal">
            {content.conditions}
          </p>
        </div>

        {/* Reporting */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Reporting</h2>
          <p className="text-sm text-gray-800 leading-relaxed font-normal">
            {content.reporting}
          </p>
        </div>

        {/* Signature Section */}
        <div className="border-t-2 border-gray-900 pt-8 mt-12">
          <div className="max-w-md">
            <div className="pb-2 mb-8">
              <label className="text-xs text-gray-800 font-medium mb-2 block">
                Employee Signature
              </label>
              <input
                type="text"
                value={employeeSignature}
                onChange={(e) =>
                  !isReadOnly && onSignatureChange && onSignatureChange(e.target.value)
                }
                disabled={isReadOnly}
                placeholder="Type your full name"
                className="w-full border-b border-gray-900 pb-1 bg-transparent focus:outline-none focus:ring-0 px-0 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "28px",
                  fontWeight: "400",
                  letterSpacing: "0.5px",
                }}
              />
            </div>
            <div className="pb-2">
              <label className="text-xs text-gray-800 font-medium mb-2 block">
                Date
              </label>
              <input
                type="date"
                value={signatureDate}
                onChange={(e) => !isReadOnly && onDateChange && onDateChange(e.target.value)}
                disabled={isReadOnly}
                className="border-b border-gray-900 pb-1 bg-transparent focus:outline-none focus:ring-0 px-0 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDescription = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [positionType, setPositionType] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync savedData into state
  useEffect(() => {
    if (savedData) {
      const activePosition = savedData.positionSelected || savedData.positionType || "";
      setPositionType(activePosition);
      setEmployeeSignature(savedData.employeeSignature || "");
      setSignatureDate(savedData.signatureDate ? savedData.signatureDate.split("T")[0] : "");
    }
  }, [savedData]);

  // Set default date to today
  useEffect(() => {
    if (!signatureDate) {
      const today = new Date().toISOString().split("T")[0];
      setSignatureDate(today);
    }
  }, [signatureDate]);

  // Push draft changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        positionSelected: positionType,
        employeeSignature,
        signatureDate,
      });
    }
  }, [positionType, employeeSignature, signatureDate, onFormChange]);

  const handlePositionChange = (value) => {
    if (isReadOnly) return;
    setPositionType(value);
    toast.success(`Position set to ${value}`);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!positionType) {
      toast.error("Please select a position applied for.");
      return;
    }

    if (!employeeSignature || !employeeSignature.trim()) {
      toast.error("Please provide your signature before proceeding.");
      return;
    }

    if (!signatureDate) {
      toast.error("Please provide a date before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete({
          positionSelected: positionType,
          employeeSignature,
          signatureDate,
        });
      } else {
        toast.success("Job Description submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting job description:", error);
      toast.error("Failed to save and proceed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-sans">
      {/* Add cursive signature fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&family=Dancing+Script:wght@400;700&family=Pacifico&display=swap"
        rel="stylesheet"
      />

      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center mt-4 mb-8 w-full">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-xl border border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Job Description
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Select your position and complete the job description form
            </p>
          </div>

          {/* Position Selector */}
          <div className="mb-6 border border-blue-200 rounded-lg p-4 sm:p-6 bg-blue-50">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">
              Position Applied For *
            </label>
            <select
              value={positionType}
              onChange={(e) => handlePositionChange(e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
            >
              <option value="">Select Position</option>
              <option value="PCA">Personal Care Assistant (PCA)</option>
              <option value="CNA">Certified Nursing Assistant (CNA)</option>
              <option value="LPN">Licensed Practical Nurse (LPN)</option>
              <option value="RN">Registered Nurse (RN)</option>
            </select>
            {positionType && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-800">
                    Position set to: {positionType}
                  </span>
                </div>
              </div>
            )}
          </div>

          {positionType && (
            <div className="space-y-6">
              {/* Instructions Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                      📋 Instructions
                    </h3>
                    <ol className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700 list-none pl-0">
                      <li className="flex gap-2 sm:gap-3">
                        <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                        <span>View the {positionType} Job Description template below</span>
                      </li>
                      <li className="flex gap-2 sm:gap-3">
                        <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                        <span>Review the document carefully</span>
                      </li>
                      <li className="flex gap-2 sm:gap-3">
                        <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                        <span>Click "Save & Next" to proceed to the next form</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Step 1 Box containing Template */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                    Step 1: View Template
                  </h2>
                  <div className="w-full bg-white border border-gray-200 rounded-lg p-4">
                    <PCAJobDescription
                      position={positionType}
                      employeeSignature={employeeSignature}
                      signatureDate={signatureDate}
                      onSignatureChange={setEmployeeSignature}
                      onDateChange={setSignatureDate}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-12 pt-8 border-t border-gray-100">
            <button
              type="button"
              className="px-8 py-3 btn-premium text-white font-sans font-bold tracking-wide rounded-none transform transition-transform shadow-md w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="w-full sm:w-auto flex justify-center">
              <button
                type="button"
                className="px-8 py-3 btn-premium-red text-white font-sans font-bold tracking-wide rounded-none transform transition-transform shadow-md w-full sm:w-auto"
                onClick={() => {
                  window.location.href = "/my-application";
                }}
              >
                Exit Application
              </button>
            </div>

            <div className="w-full sm:w-auto">
              <SaveNextButton
                isSubmitting={isSubmitting}
                type="submit"
                isReadOnly={isReadOnly}
                onClick={handleSubmit}
                onNext={onNext}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

JobDescription.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default JobDescription;
