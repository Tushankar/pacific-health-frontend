import React, { useState } from "react";
import logo from "../../src/assets/logo.png";

const AbuseNeglect = () => {
  const [formData, setFormData] = useState({
    name: "",
    signature: "",
    date: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Abuse, Neglect and Exploitation Form Data:", formData);
    alert("Form submitted successfully! Check console for data.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center bg-gray-100 min-h-screen p-8 text-black font-sans gap-8"
    >
      {/* Page 1 */}
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] relative flex flex-col text-[12px] leading-relaxed border border-gray-300">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Pacific Health Systems"
            className="h-16 object-contain mb-4"
          />
        </div>

        <div className="space-y-4">
          <div className="flex">
            <span className="font-bold w-20">POLICY:</span>
            <span className="font-bold flex-1 text-center text-sm">
              Abuse, Neglect and Exploitation
            </span>
          </div>

          <p>
            <span className="font-bold">PURPOSE:</span> To define abuse and
            neglect and the procedure to follow in regard to reporting them.
          </p>

          <p className="font-bold">
            All reports of abuse will be treated as Critical Incidents and will
            be investigated by Management.
          </p>

          <p className="font-bold">
            Any staff member accused of neglect, abuse or exploitation of any
            type will be immediately suspended pending an investigation.
          </p>

          <div>
            <p className="font-bold">DEFINITIONS:</p>
            <ul className="space-y-4 mt-2">
              <li className="flex gap-4">
                <span className="w-4">a)</span>
                <span>
                  <span className="font-bold">Physical abuse:</span> physical
                  act by caregiver that causes pain, suffering, injury, or hurt
                  to an individual; physical acts by caregiver that chastise,
                  belittle, embarrass, humiliate, or degrade an individual; use
                  of unapproved or excessive physical or chemical restraint
                  techniques toward an individual by a caregiver.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="w-4">b)</span>
                <span>
                  <span className="font-bold">Verbal abuse:</span> any
                  derogatory, threatening, derisive, or demeaning language,
                  whether oral or with gestures, directed toward an individual
                  by caregiver; any profane language directed toward an
                  individual by caregiver.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="w-4">c)</span>
                <span>
                  <span className="font-bold">Neglect:</span> failure or refusal
                  to attend to the necessary care and necessary treatment of an
                  individual by caregiver; action or inaction by caregiver that
                  denies individuals the prescribed care and treatment to which
                  they are entitled; actions by caregiver contrary to the
                  prescribed treatment or program; unauthorized removal or
                  unauthorized denial of an individual's personal possessions
                  (e.g., cigarettes, radio, phonograph, toiletries, etc.);
                  unauthorized removal or unauthorized denial of an individual's
                  scheduled meals or snacks; failure to implement individual
                  treatment programs as designed by the interdisciplinary
                  treatment team; unauthorized use of seclusion and/or
                  restraint; failure to secure proper or sufficient clothing and
                  to see that individual is properly clothed; preventing an
                  individual during normal waking hours from communicating by
                  letter, telephone, or personal visit with the individual's
                  lawyer, physician, advocate, or guardian; preventing an
                  individual from having visits from relatives unless such
                  visits are unauthorized; failure to intervene or protect the
                  individual from abuse/mistreatment by another individual or
                  staff member; removal or denial of an individual's normal
                  comfort needs (e.g., bed, hot water, lights, heat, clothing).
                </span>
              </li>
              <li className="flex gap-4">
                <span className="w-4">d)</span>
                <span>
                  <span className="font-bold">Sexual abuse:</span> any sexual
                  activity between a caregiver and a individual, even if such
                  actions are consented to by the individual, or that a person
                  in the caregiver's position should have reasonably known that
                  the individual would perceive as sexual activity; caregiver
                  using his/her position for sexual gratification or
                  exploitation of individuals.
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
                <div className="w-4 h-4 border border-black"></div>
                <span>Child, Individual or Patient Abuse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-black"></div>
                <span>Child, Individual or Patient Neglect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-black"></div>
                <span>Child, Individual or Patient Misappropriation</span>
              </div>
            </div>
          </div>

          <p className="pt-4">
            In the event that a staff person is convicted of any of the above
            crimes they must notify Pacific Health Systems immediately.
          </p>
        </div>

        <div className="absolute bottom-8 left-0 w-full text-center text-[10px]">
          Page 1 / 2
        </div>
      </div>

      {/* Page 2 */}
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] relative flex flex-col text-[12px] leading-relaxed border border-gray-300">
        <div className="space-y-6">
          <p>
            All staff are to notify the Director or designee of Pacific Health
            Systems immediately upon becoming aware of a possible abuse
            incident.
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
                The Georgia Department of Behavioral Health & Developmental
                Disabilities Office of Incident Management immediately and
                follow the steps for DBHDD Critical Incident & Death Policy
                04-106.
              </li>
              <li>
                The Director or designee must fill out the Critical Incident &
                Death Reporting Form C and send an electronic copy to the DBHDD
                Office of Investigations immediately.
              </li>
              <li>
                The Director or designee must immediately notify the Georgia
                Department of Community Health Healthcare Facility Regulation
                Division at the following address:
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
            All staff are mandated reporters and are mandated by the State of
            Georgia to report all allegations of abuse and neglect.
          </p>

          <div className="mt-12">
            <p>
              I{" "}
              <input
                className="border-b border-black w-64 outline-none px-2 text-center"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />{" "}
              fully understand Pacific Health Systems policy and procedures for
              Abuse, Neglect, and Exploitation.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-20 flex justify-between items-end gap-12 mb-6">
            <div className="flex-1">
              <input
                className="w-full border-b border-black outline-none mb-1 px-2"
                value={formData.signature}
                onChange={(e) => handleChange("signature", e.target.value)}
              />
              <div className="text-left font-bold text-[10px]">
                Client/Client Representative Signature
              </div>
            </div>
            <div className="w-[150px]">
              <input
                className="w-full border-b border-black outline-none mb-1 px-2 text-center"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              <div className="text-center font-bold text-[10px]">Date</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full text-center text-[10px]">
          Page 2 / 2
        </div>
      </div>
    </form>
  );
};

export default AbuseNeglect;
