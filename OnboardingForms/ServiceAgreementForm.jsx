import React, { useState } from "react";
import logo from "../../src/assets/logo.png";

const ServiceAgreementForm = () => {
  const [formData, setFormData] = useState({
    clientFirstName: "",
    clientMiddleName: "",
    clientLastName: "",
    address: "",
    street: "",
    state: "",
    city: "",
    zipCode: "",
    referralSource: "",
    referralDate: "",
    initialContactDate: "",
    startDate: "",
    services: {
      personalCare: false,
      companionSitter: false,
      nursing: false,
      cls: false,
      cai: false,
      respite: false,
    },
    clientDescription: "",
    frequencyDuration: "",
    servicesAre: "",
    reimbursement: "", // 'Medicaid', 'Insurance', 'Private Pay'
    chargesRate: "",
    accessFunds: "", // 'yes', 'no'
    accessVehicle: "", // 'yes', 'no'
    receivedRights: "", // 'yes', 'no'
    paymentSource: {
      nowComp: {
        cls: false,
        cai: false,
        respiteCat1: false,
        respiteCat2: false,
        respiteHourly: false,
        nursing: false,
        medicalSupplies: false,
        additionalStaffing: false,
      },
      source: false,
      icwp: false,
      gapp: false,
      ccsp: false,
      privatePay: false,
      privatePayRate: "",
      structuredFamily: false,
    },
    signatureClient: "",
    dateClient: "",
    signatureAgency: "",
    dateAgency: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.includes(":")) {
      const [grandparent, parent, child] = name.split(":");
      setFormData((prev) => ({
        ...prev,
        [grandparent]: {
          ...prev[grandparent],
          [parent]: {
            ...prev[grandparent][parent],
            [child]: type === "checkbox" ? checked : value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSingleSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Service Agreement Form Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center bg-gray-100 min-h-screen p-8 text-black font-sans gap-8"
    >
      {/* PAGE 1 */}
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] relative flex flex-col text-[10px] leading-tight">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-4 text-center">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={logo}
              alt="Pacific Health Systems"
              className="h-16 object-contain"
            />
          </div>
          <h2 className="text-sm font-bold underline">
            Service Agreement Form
          </h2>
          <p className="mt-2 text-[9px] text-justify max-w-xl">
            This agreement is between Pacific Health Systems LLC (hereafter
            "Provider") located at 213 Corporate Center Dr, Suite 325
            Stockbridge Georgia 30281.
          </p>
        </div>

        {/* Client Info Section */}
        <div className="mb-4">
          <div className="flex items-end mb-1">
            <span className="w-20 font-bold">Client Name:</span>
            <input
              name="clientFirstName"
              value={formData.clientFirstName}
              onChange={handleChange}
              className="flex-1 border-b border-black outline-none px-1"
            />
            <input
              name="clientMiddleName"
              value={formData.clientMiddleName}
              onChange={handleChange}
              className="flex-1 border-b border-black outline-none px-1"
            />
            <input
              name="clientLastName"
              value={formData.clientLastName}
              onChange={handleChange}
              className="flex-1 border-b border-black outline-none px-1"
            />
          </div>
          <div className="flex justify-between px-20 text-[8px] text-gray-500 mb-2">
            <span>First</span>
            <span>Middle</span>
            <span>Last</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border border-black p-1 mb-1">
            <div>
              <div className="flex">
                <span className="w-12 font-bold">Address:</span>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="flex-1 border-b border-black outline-none px-1"
                />
              </div>
              <div className="flex">
                <span className="w-12 font-bold">Street:</span>
                <input
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="flex-1 border-b border-black outline-none px-1"
                />
              </div>
              <div className="flex">
                <span className="w-12 font-bold">State:</span>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="flex-1 border-b border-black outline-none px-1"
                />
              </div>
            </div>
            <div>
              <div className="flex">
                <span className="w-12 font-bold">City:</span>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="flex-1 border-b border-black outline-none px-1"
                />
              </div>
              <div className="flex">
                <span className="w-12 font-bold">Zip Code:</span>
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="flex-1 border-b border-black outline-none px-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border border-black p-1">
            <div className="flex">
              <span className="w-20 font-bold">Referral Source:</span>
              <input
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className="flex-1 border-b border-black outline-none px-1"
              />
            </div>
            <div className="flex">
              <span className="w-20 font-bold">Referral Date:</span>
              <input
                name="referralDate"
                value={formData.referralDate}
                onChange={handleChange}
                className="flex-1 border-b border-black outline-none px-1"
              />
            </div>
            <div className="flex">
              <span className="w-20 font-bold">Initial Contact Date:</span>
              <input
                name="initialContactDate"
                value={formData.initialContactDate}
                onChange={handleChange}
                className="flex-1 border-b border-black outline-none px-1"
              />
            </div>
            <div className="flex">
              <span className="w-20 font-bold">Start Date:</span>
              <input
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="flex-1 border-b border-black outline-none px-1"
              />
            </div>
          </div>
        </div>

        {/* Provider Assurances */}
        <div className="mb-4">
          <p className="mb-2">
            Provider assures the Client or Client's Representative that Provider
            will:
          </p>
          <ol className="list-decimal ml-6 space-y-1 text-justify">
            <li>
              Not discriminate or permit discrimination against any person or
              group of people on the grounds of age, race, sex, color, religion,
              national origin, disability, or client's failure to execute
              advance directives.
            </li>
            <li>
              No discrimination, coerce or otherwise cause reprisal for
              complaints/grievance filed by the Client/Client Representative.
            </li>
            <li>
              Provider will be able to provide In-Home Services 24 hours a day,
              7 days a week, Monday through Sunday and on holidays if required
              by the clients on the client care plan.
            </li>
            <li>
              Respond to questions from the Client or Client's Representative
              with 30 minutes after they call 678-228-8031 (Client Care
              Coordinator).
            </li>
            <li>
              Hired qualified Personal Support Aides (PSA) to provide In-Home
              Services.
            </li>
            <li>
              Not accept clients when Provider does not have the capacity to
              meet the needs of the Client.
            </li>
            <li>
              Keep client's information confidential and will not release the
              client's information without the Client/ Client's Representative
              written consent.
            </li>
          </ol>
        </div>

        {/* Services Section */}
        <div className="mb-4">
          <h3 className="font-bold underline mb-1">Services</h3>
          <p className="mb-1">
            Provider will deliver the following services and service plan:
          </p>
          <div className="flex gap-4 mb-2 flex-wrap">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="services.personalCare"
                checked={formData.services.personalCare}
                onChange={handleChange}
              />{" "}
              Personal Care Service
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="services.companionSitter"
                checked={formData.services.companionSitter}
                onChange={handleChange}
              />{" "}
              Companion Sitter Services
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="services.nursing"
                checked={formData.services.nursing}
                onChange={handleChange}
              />{" "}
              Nursing Services
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="services.cls"
                checked={formData.services.cls}
                onChange={handleChange}
              />{" "}
              CLS
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="services.cai"
                checked={formData.services.cai}
                onChange={handleChange}
              />{" "}
              CAI
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="services.respite"
                checked={formData.services.respite}
                onChange={handleChange}
              />{" "}
              RESPITE
            </label>
          </div>
          <p className="mb-1">
            Please list the type of services you would need the caregiver to
            provide for you in your own word:
          </p>
          <p className="mb-1">Description of services as stated by Client:</p>
          <textarea
            name="clientDescription"
            value={formData.clientDescription}
            onChange={handleChange}
            className="w-full border border-black min-h-[64px] mb-2 p-1 resize-none outline-none"
          />

          <div className="flex items-end">
            <span className="whitespace-nowrap mr-2">
              Frequency and Duration of Services:
            </span>
            <input
              name="frequencyDuration"
              value={formData.frequencyDuration}
              onChange={handleChange}
              className="flex-1 border-b border-black outline-none px-1"
            />
            <span className="whitespace-nowrap mx-2">Services are:</span>
            <input
              name="servicesAre"
              value={formData.servicesAre}
              onChange={handleChange}
              className="w-20 border-b border-black outline-none px-1"
            />
          </div>
        </div>

        <div className="mt-auto text-center font-bold">1 | Page</div>
      </div>

      {/* PAGE 2 */}
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] relative flex flex-col text-[10px] leading-tight">
        <div className="mb-4 text-justify space-y-2">
          <div className="flex gap-2 items-center">
            <span>paid by reimbursement to the provider through:</span>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.reimbursement === "Medicaid"}
                onChange={() => handleSingleSelect("reimbursement", "Medicaid")}
              />{" "}
              Medicaid
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.reimbursement === "Insurance"}
                onChange={() =>
                  handleSingleSelect("reimbursement", "Insurance")
                }
              />{" "}
              Insurance
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.reimbursement === "Private Pay"}
                onChange={() =>
                  handleSingleSelect("reimbursement", "Private Pay")
                }
              />{" "}
              Private Pay
            </label>
          </div>
          <div className="flex items-end">
            <span>Charges for services (hourly or daily rate):</span>
            <input
              name="chargesRate"
              value={formData.chargesRate}
              onChange={handleChange}
              className="w-20 border-b border-black mx-1 p-0 outline-none text-center"
            />
            <span>to be billed monthly and due by the 15th of each month.</span>
          </div>
          <p>
            Client agrees and covenants that for a period of twelve (12) months
            following the termination of this Agreement, whether such
            termination is voluntary or involuntary, Client will not hire any of
            Company employees. If Client hires a Company employee, Client agrees
            to pay Company a recruitment and training fee of three thousand
            ($3,000.00) dollars per employee.
          </p>
          <p>
            If Undersigned or Client wishes to interrupt or terminate the
            Services provided under this agreement for any reason, Undersigned
            agrees to give Provider at least seven (7) days advance notice, or
            if seven (7) days advance notice is not possible under the
            circumstances, to provide notice as soon as possible. However, the
            Client or Undersigned may cancel services at any time. Provider may
            terminate the Services for any reason upon twenty-four (24) hour
            notice to Client.
          </p>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-[1fr_50px_50px] gap-2 mb-1 font-bold text-center">
            <div className="text-left"></div>
            <div>Yes</div>
            <div>No</div>
          </div>
          <div className="grid grid-cols-[1fr_50px_50px] gap-2 mb-1 items-center">
            <div>
              Authorization for access to client's personal funds for home
              management.
            </div>
            <div className="text-center">
              <input
                type="checkbox"
                checked={formData.accessFunds === "yes"}
                onChange={() => handleSingleSelect("accessFunds", "yes")}
              />
            </div>
            <div className="text-center">
              <input
                type="checkbox"
                checked={formData.accessFunds === "no"}
                onChange={() => handleSingleSelect("accessFunds", "no")}
              />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_50px_50px] gap-2 mb-2 items-center">
            <div>Authorization for access to client's personal vehicle.</div>
            <div className="text-center">
              <input
                type="checkbox"
                checked={formData.accessVehicle === "yes"}
                onChange={() => handleSingleSelect("accessVehicle", "yes")}
              />
            </div>
            <div className="text-center">
              <input
                type="checkbox"
                checked={formData.accessVehicle === "no"}
                onChange={() => handleSingleSelect("accessVehicle", "no")}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <span>
              Client has received a copy of the Bill of Rights and
              Responsibilities
            </span>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.receivedRights === "yes"}
                onChange={() => handleSingleSelect("receivedRights", "yes")}
              />{" "}
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.receivedRights === "no"}
                onChange={() => handleSingleSelect("receivedRights", "no")}
              />{" "}
              No
            </label>
          </div>
          <p className="mt-2">
            For information, questions, or complaints about services provided by
            Pacific Health Systems please call the Administrator @ 678-702-2474.
          </p>
          <p>
            In the event there is a complaint or problem that we have been made
            aware of that cannot be resolved, you may contact Healthcare
            Facility Regulation Division, Health Care Section at 404-657-5856 or
            for information call 404-657-5700.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold underline mb-2">Payment of Services</h3>
          <p className="mb-2">
            Source of Payment: (Please check all that apply)
          </p>

          <div className="space-y-1 ml-4">
            <div className="font-bold">NOW/COMP:</div>
            <div className="ml-4 space-y-1">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="paymentSource.nowComp.cls"
                  checked={formData.paymentSource.nowComp.cls}
                  onChange={handleChange}
                />{" "}
                Community Living Supports (Medicaid will be billed $6.35/unit of
                15-clock minute)
              </label>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="paymentSource.nowComp.cai"
                  checked={formData.paymentSource.nowComp.cai}
                  onChange={handleChange}
                />{" "}
                Community Access Individual (Medicaid will be billed $7.41/unit
                of 15-clock minute)
              </label>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="paymentSource.nowComp.respiteCat1"
                  checked={formData.paymentSource.nowComp.respiteCat1}
                  onChange={handleChange}
                />{" "}
                Respite daily Category 1: (Medicaid will be billed $153.41 daily
                for 8 hours or more)
              </label>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="paymentSource.nowComp.respiteCat2"
                  checked={formData.paymentSource.nowComp.respiteCat2}
                  onChange={handleChange}
                />{" "}
                Respite daily Category 2: (Medicaid will be billed $169.51 daily
                for 8 hours or more)
              </label>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="paymentSource.nowComp.respiteHourly"
                  checked={formData.paymentSource.nowComp.respiteHourly}
                  onChange={handleChange}
                />{" "}
                Respite Hourly (Medicaid will be billed $4.83/unity of 15-clock
                minutes)
              </label>
              <div className="flex gap-4 ml-6">
                <label className="flex gap-1">
                  <input
                    type="checkbox"
                    name="paymentSource.nowComp.nursing"
                    checked={formData.paymentSource.nowComp.nursing}
                    onChange={handleChange}
                  />{" "}
                  Nursing Services
                </label>
                <label className="flex gap-1">
                  <input
                    type="checkbox"
                    name="paymentSource.nowComp.medicalSupplies"
                    checked={formData.paymentSource.nowComp.medicalSupplies}
                    onChange={handleChange}
                  />{" "}
                  Specialized Medical Supplies
                </label>
                <label className="flex gap-1">
                  <input
                    type="checkbox"
                    name="paymentSource.nowComp.additionalStaffing"
                    checked={formData.paymentSource.nowComp.additionalStaffing}
                    onChange={handleChange}
                  />{" "}
                  Additional Staffing
                </label>
              </div>
            </div>

            <label className="flex gap-2 font-bold mt-2">
              <input
                type="checkbox"
                name="paymentSource.source"
                checked={formData.paymentSource.source}
                onChange={handleChange}
              />{" "}
              SOURCE (Medicaid will be billed $9.02/unit of 30-clock minutes)
            </label>

            <label className="flex gap-2 font-bold mt-2">
              <input
                type="checkbox"
                name="paymentSource.icwp"
                checked={formData.paymentSource.icwp}
                onChange={handleChange}
              />{" "}
              ICWP (Medicaid will be billed $17.96/unit of 60-clock minutes)
            </label>

            <label className="flex gap-2 font-bold mt-2">
              <input
                type="checkbox"
                name="paymentSource.gapp"
                checked={formData.paymentSource.gapp}
                onChange={handleChange}
              />{" "}
              GAPP (Medicaid will be billed $10.63/unit for RN, $37.28/Unit for
              LPN and $5.00/Unit for CNA. A unit is 15 minutes)
            </label>

            <label className="flex gap-2 font-bold mt-2">
              <input
                type="checkbox"
                name="paymentSource.ccsp"
                checked={formData.paymentSource.ccsp}
                onChange={handleChange}
              />{" "}
              CCSP (Medicaid will be billed $4.51/unit of 15-clock)
            </label>

            <div className="flex gap-2 font-bold mt-2 items-end">
              <input
                type="checkbox"
                name="paymentSource.privatePay"
                checked={formData.paymentSource.privatePay}
                onChange={handleChange}
              />
              <span>Private Pay @ $</span>
              <input
                name="paymentSource.privatePayRate"
                value={formData.paymentSource.privatePayRate}
                onChange={handleChange}
                className="w-10 border-b border-black text-center outline-none"
              />
              <span>/hour</span>
            </div>

            <label className="flex gap-2 font-bold mt-2">
              <input
                type="checkbox"
                name="paymentSource.structuredFamily"
                checked={formData.paymentSource.structuredFamily}
                onChange={handleChange}
              />{" "}
              Structured Family Caregiving (Medicaid will be billed $90.20 per
              unit)
            </label>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-8">
            The Service Agreement will become effective and bind the Provider
            and the Client/ Client representative to the terms in the Service
            Agreement when they each sign the agreement
          </p>

          <div className="flex justify-between items-end mb-4">
            <div className="flex-1 mr-8">
              <input
                name="signatureClient"
                value={formData.signatureClient}
                onChange={handleChange}
                className="w-full border-b border-black outline-none"
              />
              <div className="text-[9px]">Client/Representative Signature</div>
            </div>
            <div className="w-32">
              <input
                name="dateClient"
                value={formData.dateClient}
                onChange={handleChange}
                className="w-full border-b border-black outline-none"
              />
              <div className="text-[9px]">Date</div>
            </div>
          </div>

          <div className="flex justify-between items-end mb-8">
            <div className="flex-1 mr-8">
              <input
                name="signatureAgency"
                value={formData.signatureAgency}
                onChange={handleChange}
                className="w-full border-b border-black outline-none"
              />
              <div className="text-[9px]">Agency Representative</div>
            </div>
            <div className="w-32">
              <input
                name="dateAgency"
                value={formData.dateAgency}
                onChange={handleChange}
                className="w-full border-b border-black outline-none"
              />
              <div className="text-[9px]">Date</div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-auto text-center font-bold">2 | Page</div>
      </div>
    </form>
  );
};

export default ServiceAgreementForm;
