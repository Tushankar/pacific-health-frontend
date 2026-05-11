import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  FileText,
  Target,
  Send,
  Calendar,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";

const LogoHeader = () => (
  <div className="flex flex-col sm:flex-row items-start mb-4">
    <div
      className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 relative"
      style={{ backgroundColor: "#1D1A53" }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 128 128"
        className="absolute inset-0 sm:w-24 sm:h-24"
      >
        <g transform="translate(64, 45)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = Math.cos(rad) * 25;
            const y2 = Math.sin(rad) * 25;
            return (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={x2}
                y2={y2}
                stroke="#FDB714"
                strokeWidth="2.5"
              />
            );
          })}
          <circle cx="0" cy="0" r="3" fill="#FDB714" />
        </g>
      </svg>
      <div className="text-white font-bold text-base sm:text-lg mt-10 sm:mt-12 relative z-10">
        DBHDD
      </div>
    </div>
    <div className="flex-1">
      <h1 className="text-sm sm:text-xl font-bold text-center sm:text-right mb-1">
        Georgia Department of Behavioral Health & Developmental Disabilities
      </h1>
      <p className="text-xs sm:text-sm text-center sm:text-right italic mb-3">
        Judy Fitzgerald, Commissioner
      </p>
      <div className="border-t-2 border-black pt-2">
        <h2 className="text-center text-sm sm:text-base font-bold">
          Office of Enterprise Compliance
        </h2>
        <p className="text-[10px] sm:text-xs text-center">
          Two Peachtree Street, NW • 2nd Floor • Atlanta, Georgia 30303-3142 •
          Telephone: 404-463-2507 • Fax: 770-339-5473
        </p>
      </div>
    </div>
  </div>
);

const BackgroundCheckForm = ({
  enrollmentId,
  formId,
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
  activeEnrollment,
}) => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    ssn: "",
    height: "",
    weight: "",
    eyeColor: "",
    hairColor: "",
    dob: "",
    sex: "",
    race: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    provider: "",
    position: "",
    signature: "",
    date: new Date().toISOString().split("T")[0],
    providerName: "",
    applicantName: "",
    directContact: "",
    contactPhone: "",
    emailAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      setFormData((prev) => ({ ...prev, ...savedData }));
    } else {
      // Pre-fill from Applicant Information if available
      const appInfoForm = activeEnrollment?.forms?.find(f => f.name === "Applicant Information" || f.formId === 101);
      if (appInfoForm?.data) {
        const d = appInfoForm.data;
        setFormData(prev => ({
          ...prev,
          lastName: d.lastName || "",
          firstName: d.firstName || "",
          middleInitial: d.middleName ? d.middleName.charAt(0) : "",
          ssn: d.ssn || "",
          dob: d.dateOfBirth || "",
          sex: d.gender || "",
          race: d.race || "",
          streetAddress: d.address || "",
          city: d.city || "",
          state: d.state || "",
          zip: d.zipCode || "",
          applicantName: `${d.firstName || ""} ${d.lastName || ""}`.trim(),
        }));
      }
    }
  }, [savedData, activeEnrollment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (onFormChange) onFormChange(updated);
  };

  const handleSSNChange = (digitIndex, value) => {
    const currentDigits = formData.ssn || "";
    const digitsArray = currentDigits.padEnd(9, " ").split("");
    digitsArray[digitIndex] = value.replace(/\D/g, "") || " ";
    const newDigits = digitsArray.join("").trim();
    const updated = { ...formData, ssn: newDigits };
    setFormData(updated);
    if (onFormChange) onFormChange(updated);

    // Auto-focus next input
    if (value && digitIndex < 8) {
      const nextInput = document.querySelector(`input[name="ssn-${digitIndex + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSSNKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      const prevInput = document.querySelector(`input[name="ssn-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    if (!formData.signature) {
      toast.error("Please sign the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(formData);
      }
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-gray-50 min-h-screen text-black font-sans p-0">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 flex flex-col items-center py-8 w-full px-4">
        
        {/* PARENT CONTAINER - MATCHING HRMS SCREENSHOT */}
        <div className="w-full max-w-[850px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden p-6 sm:p-12 mb-8 mx-auto">
          
          {/* Status Banner */}
          {formData.signature && (
            <div className="mb-8 p-4 rounded-lg border bg-green-50 border-green-200">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-base font-semibold text-green-800">
                    ✅ Progress Updated - Form Completed Successfully
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    You cannot make any changes to the form until HR provides their feedback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Background Check
            </h1>
            <p className="text-base text-gray-600">
              Review the background check registration form below
            </p>
          </div>

          {/* Instructions Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-8 mb-10">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📋</span>
                  <h3 className="text-lg font-bold text-gray-800">Instructions</h3>
                </div>
                <ol className="space-y-4 text-sm sm:text-base text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                    <span>Fill out the Background Check registration form below with your personal information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                    <span>Complete both pages of the form (Registration and Notification)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                    <span>Click Save & Next to submit your background check information</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* PAGE 1 - Gemalto Registration Form */}
          <div className="w-full max-w-[700px] min-h-[900px] bg-white p-3 sm:p-12 mb-8 mx-auto" style={{ border: "1px solid #333" }}>
            <link
              href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
              rel="stylesheet"
            />
            <LogoHeader />

            <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6">
              Gemalto Applicant Registration Form
            </h2>

            <div className="space-y-3">
              {/* Name Row */}
              <div className="grid grid-cols-12 gap-2 sm:gap-4">
                <div className="col-span-12 sm:col-span-5">
                  <label className="block text-xs mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-12 sm:col-span-5">
                  <label className="block text-xs mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-12 sm:col-span-2">
                  <label className="block text-xs mb-1">Middle Initial</label>
                  <input
                    type="text"
                    name="middleInitial"
                    value={formData.middleInitial}
                    onChange={handleChange}
                    maxLength={1}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
              </div>

              {/* SSN and Physical Details */}
              <div className="grid grid-cols-12 gap-2 sm:gap-4">
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-xs mb-1">Social Security No.</label>
                  <div className="flex gap-[1px] justify-start items-center">
                    {[...Array(9)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        name={`ssn-${i}`}
                        maxLength="1"
                        value={(formData.ssn || "")[i] || ""}
                        onChange={(e) => handleSSNChange(i, e.target.value)}
                        onKeyDown={(e) => handleSSNKeyDown(e, i)}
                        readOnly={isReadOnly}
                        className="w-5 h-6 text-center border border-black px-0 py-0 outline-none bg-white text-[12px] font-bold text-black flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-xs mb-1">Height</label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-xs mb-1">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-xs mb-1">Eye color</label>
                  <input
                    type="text"
                    name="eyeColor"
                    value={formData.eyeColor}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-xs mb-1">Hair Color</label>
                  <input
                    type="text"
                    name="hairColor"
                    value={formData.hairColor}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
              </div>

              {/* DOB, Sex, Race */}
              <div className="grid grid-cols-12 gap-2 sm:gap-4">
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-xs mb-1">Date of Birth</label>
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-xs mb-1">Sex</label>
                  <input
                    type="text"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-6 sm:col-span-5">
                  <label className="block text-xs mb-1">Race</label>
                  <input
                    type="text"
                    name="race"
                    value={formData.race}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
              </div>

              {/* Address Row */}
              <div className="grid grid-cols-12 gap-2 sm:gap-4">
                <div className="col-span-12 sm:col-span-5">
                  <label className="block text-xs mb-1">Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <label className="block text-xs mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-xs mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-xs mb-1">Zip</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
              </div>

              {/* Provider and Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs mb-1">Provider</label>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Position Applied For</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
              </div>

              {/* Consent Text */}
              <div className="text-[10px] sm:text-xs leading-relaxed my-4">
                <p className="text-justify">
                  I am aware that a fingerprint-based background check is required
                  for employment with a DBHDD network provider under Policy 04-104.
                  I have read and accepted the terms of the Applicant Privacy Rights
                  and Privacy Act Statement. I understand that DBHDD Criminal
                  History Background Section (CHBC) must approve all applicant
                  registrations prior to a fingerprint submission. I also understand
                  that registrations will be approved or rejected based upon
                  information submitted. In either case, I will receive an email
                  from Gemalto explaining the status of my request. I understand
                  that incomplete forms or inaccurate information will delay
                  approval process.
                </p>
              </div>

              {/* Signature and Date */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div>
                  <label className="block text-xs mb-1">Signature</label>
                  <input
                    type="text"
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    placeholder="Sign here"
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      fontSize: "28px",
                      letterSpacing: "0.5px",
                    }}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-[10px] sm:text-xs mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                <p>
                  2 Peachtree Street, NW • Atlanta, Georgia 30303 • 404.657.2252
                </p>
                <p>dbhdd.georgia.gov • Facebook: Georgia DBHDD • Twitter: @DBHDD</p>
              </div>
            </div>
          </div>

          {/* PAGE 2 - Notification Form */}
          <div className="w-full max-w-[700px] min-h-[900px] bg-white p-3 sm:p-12 mb-8 mx-auto" style={{ border: "1px solid #333" }}>
            <LogoHeader />

            <div className="space-y-3 sm:space-y-4">
              {/* TO/FROM/RE Section */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex">
                  <div className="font-bold w-16 sm:w-24">TO:</div>
                  <div>DBHDD Provider Network</div>
                </div>
                <div className="flex">
                  <div className="font-bold w-16 sm:w-24">FROM:</div>
                  <div>
                    <div>DBHDD Office of Enterprise Compliance</div>
                    <div>Criminal History Background Checks Section</div>
                  </div>
                </div>
                <div className="flex">
                  <div className="font-bold w-16 sm:w-24">RE:</div>
                  <div>Gemalto Applicant Registration Notification</div>
                </div>
              </div>

              {/* Notification Text */}
              <div className="text-xs sm:text-sm">
                <p>
                  Please send notification forms to CHBC by facsimile to (404),
                  656-0008 or via email at{" "}
                  <span className="text-blue-600 underline font-bold">
                    DBHDD.REG@DBHDD.GA.GOV
                  </span>{" "}
                  with this Cover Sheet after completing the information required
                  below:
                </p>
              </div>

              {/* Notification Form Fields */}
              <div className="space-y-3 mt-4 sm:mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <label className="font-bold text-xs sm:text-sm sm:w-64">
                    Provider Name
                  </label>
                  <input
                    type="text"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="flex-1 border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <label className="font-bold text-xs sm:text-sm sm:w-64">
                    Applicant Name
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="flex-1 border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <label className="font-bold text-xs sm:text-sm sm:w-64">
                    Name of Direct Contact
                  </label>
                  <input
                    type="text"
                    name="directContact"
                    value={formData.directContact}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="flex-1 border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <label className="font-bold text-xs sm:text-sm sm:w-64">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="flex-1 border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <label className="font-bold text-xs sm:text-sm sm:w-64">
                    Email address
                  </label>
                  <input
                    type="text"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className="flex-1 border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent"
                  />
                </div>
              </div>

              {/* Mandatory Notice */}
              <div className="text-center text-xs sm:text-sm font-bold mt-4 sm:mt-6">
                *** THE NOTIFICATION FORM AND COVER LETTER ARE MANDATORY FOR PROCESSING ***
              </div>

              {/* Contact Information */}
              <div className="text-xs sm:text-sm mt-3 sm:mt-4">
                <p>
                  If you have questions, please contact our office at 404-232-1541,
                  404-463-2507 or 404-232-1641.
                </p>
              </div>

              {/* Footer */}
              <div className="text-center text-[10px] sm:text-xs mt-6 sm:mt-8 pt-3 sm:pt-4 border-t">
                <p className="font-bold">
                  Georgia Department of Behavioral Health & Developmental
                  Disabilities
                </p>
                <p>
                  2 Peachtree Street, NW • Atlanta, Georgia 30303 • 404.657.2252
                  dbhdd.georgia.gov • Facebook: GeorgiaDBHDD • Twitter: @DBHDD
                </p>
              </div>
            </div>
          </div>
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

BackgroundCheckForm.propTypes = {
  enrollmentId: PropTypes.string,
  formId: PropTypes.number,
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
  activeEnrollment: PropTypes.object,
};

export default BackgroundCheckForm;
