import React, { useState } from "react";
import logo from "../../s../../src/assets/logo.jpg";

const ClientRightsResponsibilities = () => {
  const [formData, setFormData] = useState({
    clientSignature: "",
    clientSignatureDate: "",
    administratorSignature: "",
    administratorSignatureDate: "",
  });

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
    console.log("ClientRightsResponsibilities Data:", formData);
  };

  return (
    <div className="w-full bg-white min-h-screen text-black font-serif flex justify-center mt-4 mb-8">
      <div className="w-[98%] md:w-[85%] lg:w-[60%] p-2 md:p-12 text-[9px] md:text-base leading-snug">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Pacific Health Systems Logo"
            className="h-10 md:h-20 object-contain mb-2"
          />
          <h1 className="text-sm md:text-xl font-bold text-center underline">
            Client Rights and Responsibilities
          </h1>
          <h2 className="text-xs md:text-lg font-bold text-center underline italic">
            Know Your Client Rights
          </h2>
        </div>

        {/* Rights Section */}
        <div className="mb-6">
          <h3 className="font-bold mb-2 underline italic">
            You have the right to:
          </h3>
          <ol className="list-decimal pl-4 md:pl-8 space-y-1 text-justify">
            <li>Be treated with dignity and respect for your privacy.</li>
            <li>Receive services that are suitable for your culture.</li>
            <li>
              Have an independent advocate (representative) that you chose.
            </li>
            <li>
              Get information on your treatment choices in a way that you can
              understand.
            </li>
            <li>Have a service plan which you help to write and get a copy.</li>
            <li>
              Take part in decisions about your health care, including the right
              to refuse treatment, except as provided by law.
            </li>
            <li>
              Have a medical professional explain the benefits, risks and side
              effects of any medication prescribed.
            </li>
            <li>
              Receive services in the least restrictive, suitable setting
              subject to available funding.
            </li>
            <li>
              Review or ask for a copy of your medical records and ask that they
              be amended (changed) or corrected.
            </li>
            <li>
              Have your record and the information you give in therapy sessions
              kept confidential (private). Exceptions in the Health Insurance
              Portability and Accountability Act (HIPAA) Privacy Notice and
              state and federal laws include:
              <ul className="list-[lower-alpha] pl-4 md:pl-8 mt-1">
                <li>You are a danger to yourself or others.</li>
                <li>You are gravely disabled (unable to care for yourself).</li>
                <li>In cases of child abuse or suspected child abuse.</li>
              </ul>
            </li>
            <li>
              Give an opinion about providers to the state or federal government
              or to the media without it causing any adverse (bad) effects on
              how we provide services.
            </li>
            <li>
              Be free from any restraint or seclusion (isolation). These cannot
              be used to force you to do something, to discipline you, to
              retaliate (react) against you, or for the convenience of the
              provider.
            </li>
            <li>
              Get help understanding your rights and filing a grievance
              (complaint) or appeal.
            </li>
            <li>
              File a grievance (complaint) about any part of your services.
            </li>
            <li>
              Be free to exercise (use) all rights, its providers, or the state
              cannot treat you differently because you exercise your rights.
            </li>
            <li>
              Know that sexual intimacy in a professional relationship is never
              appropriate within client and Direct Support Staff. You should
              report it to the state.
            </li>
            <li>
              Right to be informed about the plan for services and to be
              involved in the development of the plan
            </li>
            <li>
              Right to be informed promptly about any changes in services before
              the change occurs.
            </li>
            <li>Right to accept or refuse services</li>
            <li>Right to be informed of the charges for services provided</li>
            <li>
              Right to be informed of the contact numbers for the supervisory
              personnel
            </li>
            <li>Right to be informed of complaint procedures</li>
            <li>Right to confidentiality of client records</li>
            <li>Right to have property and residence treated with respect</li>
            <li>
              Right to written notice of the contact information for the state
              licensing authority
            </li>
            <li>
              Right to a copy of the PHCP's most recent report from a license
              inspection.
            </li>
            <li>
              Responsibility of the client and/or representative party to inform
              the provider of any changes in the client's condition
            </li>
          </ol>
        </div>

        {/* Medicaid Rights */}
        <div className="mb-6">
          <h3 className="font-bold mb-2 underline italic">
            Medicaid consumers have these additional rights:
          </h3>
          <ol
            className="list-decimal pl-4 md:pl-8 space-y-1 text-justify"
            start="28"
          >
            <li>
              Receive interpreter services at no cost if you have problems
              communicating or do not speak English.
            </li>
            <li>
              Have information on mental health benefits and how to get them.
            </li>
            <li>
              Be given a choice of providers within the DBHDD provider network
              and to ask that provider join the network.
            </li>
            <li>
              Receive prompt (quick) notice that your services have ended or
              about changes in your services or providers.
            </li>
            <li>Get a second opinion at no cost to you.</li>
            <li>
              Receive medically necessary mental health services according to
              federal regulations.
            </li>
            <li>
              Appeal the denial or reduction (lowering) in the type or level of
              service that you request or that is provided to you.
            </li>
          </ol>
        </div>

        {/* Responsibilities Section */}
        <div className="mb-6">
          <h3 className="font-bold mb-2 underline italic">
            Your Client have the responsibility to:
          </h3>
          <ol className="list-decimal pl-4 md:pl-8 space-y-1 text-justify">
            <li>Be involved in writing your service plan.</li>
            <li>
              Tell your provider if you do not understand or do not agree with
              the plan.
            </li>
            <li>
              Give your treatment team all the information they need so that all
              of you can make the best decisions about your care.
            </li>
            <li>Arrive on time for appointments.</li>
            <li>
              If you cannot make an appointment, call ahead of time and set up
              another appointment.
            </li>
            <li>
              Treat staff and other consumers with the same courtesy you expect.
            </li>
          </ol>
        </div>

        {/* Acknowledgment Paragraph */}
        <div className="mb-8 text-justify">
          <p>
            I have read the Rights and Responsibilities for participation in the
            Pacific Health Systems Services Program listed above. My signature
            on this form indicates that I have been informed of these Rights and
            Responsibilities and agree to abide by them as a Client / Client
            Representative in the Program. I have received copies of the
            agency’s grievance procedures, any release of information forms, and
            this document. I understand that failure to respect the rights and
            responsibilities above may result in my being sanctioned or
            discharged from Pacific Health Systems
          </p>
        </div>

        <form>
          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 md:gap-16 mt-12 mb-12">
            <div>
              <input
                type="text"
                name="clientSignature"
                value={formData.clientSignature}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="w-full border-t border-black outline-none mt-8"
              />
              <div className="font-bold">
                Signature of Client/ Client Representative
              </div>
            </div>
            <div>
              <input
                type="date"
                name="clientSignatureDate"
                value={formData.clientSignatureDate}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="w-full border-t border-black outline-none mt-8"
              />
              <div className="font-bold">Date</div>
            </div>
            <div>
              <input
                type="text"
                name="administratorSignature"
                value={formData.administratorSignature}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="w-full border-t border-black outline-none mt-8"
              />
              <div className="font-bold">Signature of Administrator</div>
            </div>
            <div>
              <input
                type="date"
                name="administratorSignatureDate"
                value={formData.administratorSignatureDate}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="w-full border-t border-black outline-none mt-8"
              />
              <div className="font-bold">Date</div>
            </div>
          </div>
          {/*<div className="mt-4 flex justify-center no-print">
                        <button
                            type="button"
                            onClick={logData}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Log Data
                        </button>
                    </div>*/}
        </form>

        {/* Footer */}
        <div className="text-center text-[8px] md:text-sm font-bold mt-12">
          <p>
            Department of Community Health, Healthcare Facility Regulation
            Division Licensure and Certification
          </p>
          <p>2 Peachtree Street, NW Suites 311447</p>
          <p>Atlanta, Georgia 30303</p>
          <p>404-657-5700</p>
          <p>Complaints Only: 404-657-5728 or 1-800-878-6442</p>
        </div>
      </div>
    </div>
  );
};

export default ClientRightsResponsibilities;
