import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

const GrievanceComplaints = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    signature: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (!formData.clientName?.trim()) newErrors.clientName = true;
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
      toast.error("Please fill in the client name, signature, and date.");
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

      <div className="flex-1 w-full flex flex-col items-center mt-4 mb-8">
        {/* Paper Container */}
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-2 md:p-12 bg-white text-[9px] md:text-base leading-snug shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-6">
              <img
                src={logo}
                alt="Pacific Health Systems"
                className="h-12 md:h-16 object-contain mb-2"
              />
              <h1 className="font-bold text-center text-sm md:text-lg underline uppercase">
                Grievance and Complaints for Individuals
              </h1>
            </div>

            <div className="space-y-4 text-justify">
              <p>
                Pacific Health Systems will grant individuals an opportunity to
                voice, telephone and/or write any complaints against company
                staff, management or another individual or services. The
                information presented by the individual must not be used in any
                manner to discriminate, cause retaliation or inflict fear in the
                individual. The policy and form will be written in terminology
                that the individual easily understands. If the individual is
                unable to complete the form, an advocate for the individual such
                as a family member or Support Coordinator/Monitor will be
                procured on behalf of the individual.
              </p>
              <ul className="list-none space-y-2">
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Pacific Health Systems ensures that all employees adhere to
                    Complaints and Grievances Regarding Community Services
                    policy.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Pacific Health Systems supports and encourages individuals
                    to exercise their rights and voice their grievances without
                    fear or restraints, discrimination, retaliation or
                    interferences.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Family members or legal guardians have the right to express
                    grievances on behalf of Pacific Health Systems individual
                    served who is unable to communicate independently.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Pacific Health Systems provides the Regional Office with a
                    copy of her policies and procedures for receiving,
                    considering and resolving an individual’s complaints and
                    grievances.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    All individuals shall be informed of their rights concerning
                    grievances during intake and interview.
                  </span>
                </li>
              </ul>

              <p>
                <span className="font-bold">PROCEDURE:</span> A grievance must
                be filed if the individual/legal representative/family member
                feels that the individual’s rights are being violated. The
                grievance can be filed by any of the following individuals
                and/or organizations:
              </p>
              <ul className="list-none ml-4 space-y-1">
                <li className="flex gap-2">
                  ✓ <span>Health facility Regulation (HFR)</span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    The individual being served by the agency or a family member
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Regional Office</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Service Monitor/Service Coordinator</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Staff of Pacific Health Systems</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>DDP of Pacific Health Systems</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Director of Pacific Health Systems organization</span>
                </li>
              </ul>

              <p>
                The following are some areas that individual complaints and
                grievances can occur:
              </p>
              <ul className="list-none ml-4 space-y-1">
                <li className="flex gap-2">
                  ✓ <span>Alleged abuse, neglect and/or exploitation</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Violation of client’s rights</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Misuse of client’s funds or resources</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Employee Misconduct</span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Alleged abuse and/or exploitation by another individual
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Services received from the agency by the individual.
                  </span>
                </li>
              </ul>

              <p>The following will take place:</p>
              <ol className="list-[lower-alpha] ml-8 space-y-1">
                <li>
                  Individual/family member files a grievance. It can be verbal
                  or written.
                </li>
                <li>
                  A staff member, family member or advocate helps the individual
                  complete the grievance form.
                </li>
                <li>
                  An employee who is involved in a grievance is not allowed to
                  assist the individual in completing the grievance form.
                </li>
                <li>
                  Director will speak to the individual and receive a verbal and
                  written account of the grievance and complaint.
                </li>
                <li>The Director will notify the board.</li>
                <li>The Director will investigate.</li>
                <li>
                  Conduct an emergency meeting and place an immediate plan of
                  action that will address the grievance or complaint.
                </li>
              </ol>
            </div>

            <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
              1 | Page
            </div>

            {/* Page 2 */}
            <div className="space-y-4 text-justify mt-8">
              <h2 className="font-bold uppercase underline">
                INTERNAL GRIEVANCE PROCESS
              </h2>
              <p className="italic">
                (The individual has the right to bypass the internal process and
                file the grievance directly with the Region or DBHDD Constituent
                Services.)
              </p>
              <ul className="list-none space-y-2">
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Individual, legal guardian or family member is to make an
                    oral complaint to the organization manager/ DDP of the
                    complaint/grievance.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    The DDP is to have the individual, legal guardian or family
                    member fill out a grievance/complaint form
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    The DDP must contact the Director, in person or via
                    telephone immediately and shall inform the Director of the
                    grievance.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Pacific Health Systems shall meet with the individual, legal
                    guardian or family member and anyone else involved in the
                    grievance within 24 hours.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    All efforts will be made to resolve the complaint/grievance.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    If unresolved or the individual is not satisfied with the
                    outcome, he or she may refer the complaint to the Regional
                    Office, HFR, DCH, the Ombudsman or a local advocacy
                    organization.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Pacific Health Systems will work with the individual, legal
                    guardian or family member to reach a mutually beneficial
                    solution that is satisfactory to the individual.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Pacific Health Systems will do a follow up with the
                    individual, his or her legal guardian and/or family members
                    one week after resolution of the complaint to ensure that
                    the individual is satisfied.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    The result of all complaints and grievances shall be
                    reported to the board.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Contact for Pacific Health Systems: Remmy Idaewor,
                    Tel#:678-480-5315. Address: 110 Eagle Springs Drive Suite C
                    Fax: 678-669-1693
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Pacific Health Systems must submit a quarterly report of all
                    individual complaints and grievances to the Regional Office
                    by the 15th of the month following the quarter being
                    reported. This report must include all grievances and
                    complaints received directly as well as those received
                    through the Regional Office. The reports must include:
                  </span>
                </li>
              </ul>
              <ul className="list-none ml-8 space-y-1">
                <li className="flex gap-2">
                  ✓ <span>Types and dates of complaints and grievances</span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Originator of complaints and/or grievance.</span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Complaints and grievances shall include all new filings in
                    the current quarter as well as those complaints and
                    grievances that remain unresolved, for whatever reason, from
                    previous quarters.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    With respect to resolve complaints and grievances, the
                    number of substantiated and unsubstantiated complaints and
                    grievances should be separately reported and identified as
                    such,
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Number of days taken to resolve the grievance and/or
                    complaint.
                  </span>
                </li>
                <li className="flex gap-2">
                  ✓ <span>Disability and the program involved</span>
                </li>
                <li className="flex gap-2">
                  ✓{" "}
                  <span>
                    Identified systems issues and corrective measures taken, if
                    any.
                  </span>
                </li>
              </ul>
              <p>
                If an individual is not satisfied with the outcome of the
                grievance or complaint, the individual or responsible party may
                contact the Department of Behavioral Health and Developmental
                Disabilities as an external source to investigate the issue.
              </p>
              <p>
                The DBHDD Regional Office and Pacific Health Systems as a
                provider shall designate a staff person to address all
                grievances and complaints that are presented to Pacific Health
                Systems
              </p>
              <p>
                An individual may bypass the Pacific Health Systems procedures
                at any time during the grievance process and contact the DBHDD
                Regional Offices Directly.
              </p>
            </div>

            <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
              2 | Page
            </div>

            {/* Page 3 */}
            <div className="space-y-4 text-justify mt-8">
              <p>
                A party may file an initial complaint and/or grievance to the
                DBHHD State Office. In such event, the following steps are
                taken:
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-black p-2 bg-blue-50">
                  <h3 className="font-bold underline mb-1">Region 1</h3>
                  <p>1230 Bald Ridge Marina Road, Suite 800</p>
                  <p>Cumming, GA 30041</p>
                  <p>678.947.2818 Phone</p>
                  <p>678.947.2817 Fax</p>
                  <p>877.217.4462 Toll Free</p>
                </div>
                <div className="border border-black p-2 bg-yellow-50">
                  <h3 className="font-bold underline mb-1">Region 3</h3>
                  <p>3073 Panthersville Road, Bldg. 10</p>
                  <p>Decatur, GA 30034</p>
                  <p>404.244.5050; 404.244.5056 or</p>
                  <p>404.244.5181 - Phone</p>
                  <p>404.244.5176 or 404.244.5179 - Fax</p>
                </div>
                <div className="border border-black p-2 bg-purple-50">
                  <h3 className="font-bold underline mb-1">Region 2</h3>
                  <p>3405 Mike Padgett Hgwy, Bldg 3</p>
                  <p>Augusta, GA 30906-3815</p>
                  <p>706.792.7733 Phone</p>
                  <p>706.792.7740 Fax</p>
                  <p>866.380.4835 Toll Free</p>
                </div>
                <div className="border border-black p-2 bg-orange-50">
                  <h3 className="font-bold underline mb-1">Region 6</h3>
                  <p>3000 Schatulga Road</p>
                  <p>(Mailing: P.O. Box 12435)</p>
                  <p>Columbus, GA 31907-2435</p>
                  <p>706.565.7835 Phone</p>
                  <p>706.565.3865 Fax</p>
                </div>
              </div>

              <ol className="list-decimal ml-8 space-y-4">
                <li>
                  The complaint/grievance is sent to the DBHHD Constituent
                  Services Office. The Phone number is 404-657-5964 Fax:
                  404-657-1137 e-mail{" "}
                  <span className="text-blue-600 underline">
                    DBHDDconstituentservices@dbhdd.ga.gov
                  </span>
                </li>
                <li>
                  Constituent Services sends out an email to the applicable
                  Regional Coordinator (RC), the Regional Services Director
                  (RSA), and their Administrative Assistant and other state
                  staff when appropriate.
                </li>
                <li>
                  The complaint/grievance is assigned by the RC, RSA or State
                  Office staff with a summary or their initial response to the
                  complaint/grievance for follow-up and resolution in accordance
                  with this policy.
                </li>
                <li>
                  Staff performs follow-up and provides the RC, RSA or State
                  Office staff person with a summary of their initial response
                  to the complainant, which is then communicated to Constituent
                  Services within two (2) business days, and
                </li>
                <li>
                  Regional or State Office staff notifies Constituent Services,
                  within five (5) business days of receiving the complaint
                  and/or grievance, of the findings and recommendations for
                  resolving the subject complaint or grievance.
                </li>
                <li>
                  The Regional, State Office, or Constituent Services contacts
                  the complainant to follow up with the findings and
                  recommendation for resolving the complaint or grievance.
                </li>
                <li>
                  The Regional Office shall determine how the
                  grievance/complaint shall be handled. Upon receipt of the
                  grievance or complaint the Regional Office shall determine
                  whether the complaint of grievance will be processed by the
                  Regional Office or whether the complaint or grievance will be
                  referred to another agency or entity for resolution.
                </li>
                <li>
                  If the complaint or grievance will not be processed by the
                  Regional Office, a staff member from the Regional Office will
                  notify the complainant by telephone or in writing within five
                  business days for the receipt of the grievance that the
                  Regional Office cannot properly address the complaint or
                  grievance. If possible, the Regional Office will provide
                  information for the appropriate agency or entity that needs to
                  investigate the complaint or grievance.
                </li>
                <li>
                  If the complaint or grievance will be processed by the
                  Regional Office, the Regional Office must determine from the
                  complainant if the complaint or grievance is the subject of a
                  pending or current litigation.
                </li>
                <li>
                  If the complaint or grievance is the subject of current
                  litigation, the Regional Office must determine if the
                  complainant is unable to give a response, the Regional Office
                  shall immediately contact the Division’s Legal Risk Management
                  Service for guidance.
                </li>
              </ol>
            </div>

            <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
              3 | Page
            </div>

            {/* Page 4 */}
            <div className="space-y-4 text-justify">
              <div className="space-y-4 text-justify">
                <ol className="list-decimal ml-8 space-y-4" start="11">
                  <li>
                    If the complaint or grievance is the subject of current
                    litigation, the Regional Office must determine if the
                    complainant has filed a complaint or grievance with the
                    provider and, if applicable, what resolution was suggested.
                  </li>
                  <li>
                    If the complaint or grievance was filed with the provider
                    and the individual was not satisfied with the outcome. The
                    individual refuses to communicate with the provider. The
                    provider has not taken any action or there is not a provider
                    involved in the complaint or grievance, the Regional Office
                    will review/investigate the complaint or grievance and
                    attempt to solve the underlying complaint or grievance.
                  </li>
                  <li>
                    If the complainant has not previously filed the complaint or
                    grievance with the provider, the Regional Office shall
                    advise the complainant to first exhaust all remedies
                    available through the provider. The Regional Office must
                    still record the complaint or grievance and forward it to
                    the provider. The Regional Office shall also inform the
                    complainant that the complaint or grievance will be promptly
                    forwarded to the provider and that the provider will contact
                    the complainant to resolve the matter. The Regional Office
                    will follow up within five (5) business days of the referral
                    to verify that the complaint or grievance is in the process
                    of being resolved. The Regional Office is not prohibited
                    from reaching out sooner. In no case, however, shall the
                    follow-up occur more than five business days from the
                    referral date.
                  </li>
                  <li>
                    If the Regional Office discovers, upon its follow-up of the
                    referral to the provider, that the provider has begun to
                    review the complaint and is working toward resolution, the
                    Regional Office will record that information and request
                    that the provider forward to the Regional Office notice of
                    the resolution of the complaint or grievance. The Regional
                    Office does not need to take additional action unless
                    circumstances demand further inquiry/action.
                  </li>
                  <li>
                    If the Regional Office discovers, upon its follow-up
                    referral that no process for resolution has commenced by the
                    provider, the Regional Office will record the reason or
                    reasons why no action toward resolution has been initiated.
                    The Regional Office will then conduct a review of the
                    complaint or grievance pursuant to this Policy.
                  </li>
                  <li>
                    The Regional office shall conduct and complete a review of
                    the complaint or grievance once it has been determined that
                    the provider has not begun a resolution process within five
                    (5) days of receipt of the complaint or grievance from the
                    Regional Office.
                  </li>
                </ol>
                <ul className="list-none ml-12 space-y-2">
                  <li className="flex gap-2">
                    ✓{" "}
                    <span>
                      If possible, the Regional Office will utilize an informal
                      resolution
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ✓{" "}
                    <span>
                      Investigate methods deemed most appropriate to determine
                      the facts will be utilized. Such methods may include, but
                      not limited to, personal interviews, telephone calls,
                      and/or review of documents and correspondence. The
                      reviewer/investigator shall have access to all documents
                      and correspondence. The reviewer/investigator shall have
                      access to all documents, records and personnel relevant to
                      the investigation.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ✓{" "}
                    <span>
                      Confidential information will be protected against
                      unauthorized disclosure(s).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ✓{" "}
                    <span>
                      Conflicts of interest will be avoided and where
                      discovered, immediately corrected.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ✓{" "}
                    <span>
                      Whenever appropriate or necessary, signed release of
                      information will be obtained.
                    </span>
                  </li>
                </ul>

                <h2 className="font-bold underline uppercase mt-8 text-center">
                  EXTENSIONS
                </h2>
                <p>
                  The regional Coordinator may grant an extension of this time
                  frame upon request and upon a showing of good cause, such as
                  the complexity of the issue or issues contained in the
                  complaint or grievance, or if fact gathering warrants
                  additional time. If the Regional Coordinator approves an
                  extension, the Regional Office shall notify the complainant in
                  writing of the extension and will also include an indication
                  of the time frame within which the review will be concluded.
                  Where applicable, a copy of the notice of extension shall also
                  be forwarded to the provider. An extension shall not exceed 20
                  business days from the date of the receipt of the complaint or
                  grievance.
                </p>
              </div>

              <div className="text-sm text-gray-500 mt-8 border-t border-gray-300 pt-4">
                4 | Page
              </div>
            </div>

            {/* Page 5 */}
            <div className="space-y-4 text-justify">
              <div className="space-y-4 text-justify">
                <h2 className="font-bold underline uppercase text-center">
                  FINDINGS/RESOLUTION
                </h2>
                <p>
                  The Regional Office shall notify the complainant in writing,
                  within five business days of the completion of the
                  complaint/grievance review and/or investigation. This shall
                  include the findings and recommendations for resolving the
                  complaint or grievance. Such notification of
                  findings/resolution shall include an explanation of the
                  process by which the individual may appeal the
                  findings/resolution of the Regional Office. A copy of the
                  findings must be kept on file along with the complaint or
                  grievance and a copy must be forwarded to the provider, if
                  applicable.
                </p>

                <h2 className="font-bold underline uppercase mt-8 text-center">
                  APPEAL
                </h2>
                <p>
                  When a complainant is dissatisfied with the resolution
                  proposed by the Regional Office, the complainant may request
                  that the Regional Office forward a copy of the complaint or
                  grievance, along with all relevant material and proposed
                  resolutions to the Division of DBHHD Constituent Services. A
                  complainant is not precluded from filing an appeal directly to
                  the Division of DBHHD Constituent Services, in which case the
                  Division’s Director or designee will contact the Regional
                  Office to request copies of all material deemed relevant to
                  the complaint or grievance.
                </p>
                <p>
                  The Division’s director or designee’s review of the complaint
                  or grievance shall be completed within ten (10 business days
                  of receipt of the appeal and all relevant material. The
                  Division’s director or its designee will provide a resolution
                  for the complaint or grievance that shall be final. A copy of
                  the final resolution shall be forwarded to the Regional Office
                  and, if applicable, the provider must maintain on file a copy
                  of the final resolution of all complaints and grievances.
                </p>

                <div className="mt-20">
                  <p>
                    I{" "}
                    <input
                      name="clientName"
                      value={formData.clientName}
                      onChange={(e) => {
                        handleChange(e);
                        if (errors.clientName)
                          setErrors((prev) => ({ ...prev, clientName: null }));
                      }}
                      style={getStyle("clientName")}
                      className={`border-b border-black w-64 outline-none px-2 text-center ${errors.clientName ? "border-red-500" : ""}`}
                      readOnly={isReadOnly}
                    />{" "}
                    <RequiredStar /> fully understand PHS policy and procedures
                    for complaints and grievances.
                  </p>
                </div>

                <div className="mt-32 flex justify-between items-end gap-12">
                  <div className="flex-1">
                    <input
                      name="signature"
                      value={formData.signature}
                      onChange={(e) => {
                        handleChange(e);
                        if (errors.signature)
                          setErrors((prev) => ({ ...prev, signature: null }));
                      }}
                      style={getStyle("signature")}
                      className={`w-full border-b border-black outline-none mb-1 px-4 ${errors.signature ? "border-red-500" : ""}`}
                      readOnly={isReadOnly}
                    />
                    <div className="text-left font-bold text-[10px]">
                      Client/Client Representative Signature <RequiredStar />
                    </div>
                  </div>
                  <div className="w-[200px]">
                    <input
                      name="date"
                      value={formData.date}
                      type="date"
                      onChange={(e) => {
                        handleChange(e);
                        if (errors.date)
                          setErrors((prev) => ({ ...prev, date: null }));
                      }}
                      style={getStyle("date")}
                      className={`w-full border-b border-black outline-none mb-1 px-4 text-center ${errors.date ? "border-red-500" : ""}`}
                      readOnly={isReadOnly}
                    />
                    <div className="text-center font-bold text-[10px]">
                      Date <RequiredStar />
                    </div>
                  </div>
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

export default GrievanceComplaints;

