import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const DirectDepositForm = ({
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
    companyName: "PACIFIC HEALTH SYSTEMS/18107168",
    employeeName: "",
    employeeNumber: "",
    accounts: [
      {
        action: "",
        accountType: "",
        accountHolderName: "",
        routingNumber: "",
        accountNumber: "",
        bankName: "",
        depositType: "",
        depositPercent: "",
        depositAmount: "",
        depositRemainder: false,
        lastFourDigits: "",
      },
      {
        action: "",
        accountType: "",
        accountHolderName: "",
        routingNumber: "",
        accountNumber: "",
        bankName: "",
        depositType: "",
        depositPercent: "",
        depositAmount: "",
        depositRemainder: false,
        lastFourDigits: "",
      },
      {
        action: "",
        accountType: "",
        accountHolderName: "",
        routingNumber: "",
        accountNumber: "",
        bankName: "",
        depositType: "",
        depositPercent: "",
        depositAmount: "",
        depositRemainder: false,
        lastFourDigits: "",
      },
    ],
    employeeSignature: "",
    employeeDate: "",
    employerName: "",
    employerSignature: "",
    employerDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (savedData) {
      setFormData((prev) => ({
        ...prev,
        ...savedData,
        accounts: savedData.accounts || prev.accounts,
      }));
    }
  }, [savedData]);

  const handleSaveAndNext = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    // Check if form has meaningful data
    const hasData =
      formData.employeeName?.trim() ||
      formData.employeeNumber?.trim() ||
      formData.accounts.some(
        (acc) =>
          acc.action?.trim() ||
          acc.routingNumber?.trim() ||
          acc.accountNumber?.trim() ||
          acc.bankName?.trim()
      );

    if (!hasData) {
      toast.error("Please fill in at least some information before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(formData);
      }
    } catch (error) {
      console.error("Error saving Direct Deposit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    if (isReadOnly) return;
    const newAccounts = [...formData.accounts];
    newAccounts[index][field] = value;
    const updatedData = { ...formData, accounts: newAccounts };
    setFormData(updatedData);
    if (onFormChange) onFormChange(updatedData);
  };

  const handleTopLevelChange = (field, value) => {
    if (isReadOnly) return;
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (onFormChange) onFormChange(updatedData);
  };

  const handleLastFourDigitsChange = (accountIndex, digitIndex, value) => {
    if (isReadOnly) return;
    const currentDigits = formData.accounts[accountIndex].lastFourDigits || "";
    const digitsArray = currentDigits.padEnd(4, " ").split("");
    digitsArray[digitIndex] = value.replace(/\D/g, "") || " ";
    const newDigits = digitsArray.join("").trim();
    handleInputChange(accountIndex, "lastFourDigits", newDigits);
  };

  const handleRoutingNumberChange = (accountIndex, digitIndex, value) => {
    if (isReadOnly) return;
    const currentDigits = formData.accounts[accountIndex].routingNumber || "";
    const digitsArray = currentDigits.padEnd(9, " ").split("");
    digitsArray[digitIndex] = value.replace(/\D/g, "") || " ";
    const newDigits = digitsArray.join("").trim();
    handleInputChange(accountIndex, "routingNumber", newDigits);
  };

  const handleAccountNumberChange = (accountIndex, digitIndex, value) => {
    if (isReadOnly) return;
    const currentDigits = formData.accounts[accountIndex].accountNumber || "";
    const digitsArray = currentDigits.padEnd(17, " ").split("");
    digitsArray[digitIndex] = value.replace(/\D/g, "") || " ";
    const newDigits = digitsArray.join("").trim();
    handleInputChange(accountIndex, "accountNumber", newDigits);
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-gray-50 min-h-screen text-black font-sans p-0">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />
      <div className="flex-1 flex flex-col items-center py-8 w-full px-4 overflow-x-auto">
        <div className="w-full max-w-[950px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden p-3 sm:p-6 md:p-10 mb-8 mx-auto text-black">
          <div className="max-w-4xl mx-auto bg-white p-6">
            {/* Header */}
            <div className="mb-4 border-t-[3px] border-black pt-4">
              <div className="text-center">
                <h1
                  className="text-4xl font-black tracking-wide italic mb-0 text-black"
                  style={{
                    fontFamily: "Arial Black, sans-serif",
                    letterSpacing: "-0.05em",
                    fontWeight: "900",
                  }}
                >
                  PAYCHEX
                </h1>
              </div>
              <div className="text-center">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-black font-[Arial,Helvetica,sans-serif]">
                  Direct Deposit Enrollment/Change Form*
                </h2>
              </div>
            </div>

            {/* Company and Employee Info */}
            <div className="mb-3 text-[13px] text-black">
              <div className="mb-2">
                <span className="font-bold">Company Name and/or Client Number</span>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleTopLevelChange("companyName", e.target.value)
                  }
                  className="border-0 border-b border-black outline-none bg-[#DDE5FE] ml-2 px-1 text-[13px] py-0"
                  style={{ width: "600px", height: "20px" }}
                  disabled={isReadOnly}
                />
              </div>
              <div className="mb-2">
                <span className="font-bold">Employee/Worker Name</span>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) =>
                    handleTopLevelChange("employeeName", e.target.value)
                  }
                  className="border-0 border-b border-black outline-none bg-[#DDE5FE] ml-2 px-1 text-[13px] py-0"
                  style={{ width: "350px", height: "20px" }}
                  disabled={isReadOnly}
                />
                <span className="font-bold ml-6">Employee/Worker Number</span>
                <input
                  type="text"
                  value={formData.employeeNumber}
                  onChange={(e) =>
                    handleTopLevelChange("employeeNumber", e.target.value)
                  }
                  className="border-0 border-b border-black outline-none bg-[#DDE5FE] ml-2 px-1 text-[13px] py-0"
                  style={{ width: "100px", height: "20px" }}
                  disabled={isReadOnly}
                />
              </div>
              <p className="text-[10px] mb-0.5 pl-4 text-black">
                <span className="font-bold">Employee/Worker:</span> Retain a copy of
                this form for your records. Return the original to your
                employer/company.
              </p>
              <p className="text-[10px] pl-4 text-black">
                <span className="font-bold">Employer/Company:</span> Please retain a
                copy of this document for your records.
              </p>
            </div>

            {/* Main Form Section */}
            <div className="border-[2px] border-black">
              <div className="bg-black text-white px-2 py-1.5 text-[10px] font-bold text-center">
                COMPLETE TO ENROLL / ADD / CHANGE BANK ACCOUNTS –{" "}
                <span className="italic">
                  PLEASE PRINT CLEARLY IN BLACK/BLUE INK ONLY
                </span>
              </div>

              {formData.accounts.map((account, index) => (
                <div key={index} className={index < 2 ? "border-b-[5px] border-black" : ""}>
                  {/* Action Row */}
                  <div className="flex border-t border-b border-black text-[10px] text-black">
                    <div className="flex items-center px-2 py-1.5 border-r border-black">
                      <input
                        type="checkbox"
                        checked={account.action === "add"}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "action",
                            e.target.checked ? "add" : ""
                          )
                        }
                        className="mr-1 w-3 h-3 bg-[#DDE5FE]"
                        disabled={isReadOnly}
                      />
                      <label className="whitespace-nowrap">Add new</label>
                    </div>
                    <div className="flex items-center px-2 py-1.5 border-r border-black">
                      <input
                        type="checkbox"
                        checked={account.action === "update"}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "action",
                            e.target.checked ? "update" : ""
                          )
                        }
                        className="mr-1 w-3 h-3 bg-[#DDE5FE]"
                        disabled={isReadOnly}
                      />
                      <label className="whitespace-nowrap">
                        Update existing account
                      </label>
                    </div>
                    <div className="flex items-center px-2 py-1.5 border-r border-black">
                      <input
                        type="checkbox"
                        checked={account.action === "replace"}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "action",
                            e.target.checked ? "replace" : ""
                          )
                        }
                        className="mr-1 w-3 h-3 bg-[#DDE5FE]"
                        disabled={isReadOnly}
                      />
                      <label className="whitespace-nowrap">
                        Replace existing account
                      </label>
                    </div>
                    <div className="flex items-center px-2 py-1.5 flex-1">
                      <label className="whitespace-nowrap mr-2">
                        Last 4 digits of the existing account number
                      </label>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((digitIndex) => (
                          <input
                            key={digitIndex}
                            type="text"
                            maxLength="1"
                            value={
                              (account.lastFourDigits || "")[
                                digitIndex
                              ] || ""
                            }
                            onChange={(e) =>
                              handleLastFourDigitsChange(
                                index,
                                digitIndex,
                                e.target.value
                              )
                            }
                            className="w-6 h-6 text-center border border-black px-0 py-0 outline-none bg-[#DDE5FE] text-[13px] font-bold"
                            disabled={isReadOnly}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Account Type Row */}
                  <div className="flex border-b border-black text-[10px] text-black">
                    <div className="flex items-center px-2 py-1.5 whitespace-nowrap">
                      Type of Account
                    </div>
                    <div className="flex items-center px-2 py-1.5">
                      <input
                        type="checkbox"
                        checked={account.accountType === "checking"}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "accountType",
                            e.target.checked ? "checking" : ""
                          )
                        }
                        className="mr-1 w-3 h-3 bg-[#DDE5FE]"
                        disabled={isReadOnly}
                      />
                      <label className="whitespace-nowrap">Checking</label>
                    </div>
                    <div className="flex items-center px-2 py-1.5 border-r border-black">
                      <input
                        type="checkbox"
                        checked={account.accountType === "savings"}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "accountType",
                            e.target.checked ? "savings" : ""
                          )
                        }
                        className="mr-1 w-3 h-3 bg-[#DDE5FE]"
                        disabled={isReadOnly}
                      />
                      <label className="whitespace-nowrap">Savings</label>
                    </div>
                    <div className="flex items-center px-2 py-1.5 flex-1">
                      <label className="whitespace-nowrap mr-1">
                        Account holder's Name:
                      </label>
                      <input
                        type="text"
                        value={account.accountHolderName}
                        onChange={(e) =>
                          handleInputChange(index, "accountHolderName", e.target.value)
                        }
                        className="flex-1 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px]"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  {/* Routing Number Row */}
                  <div className="flex border-b border-black text-[10px] text-black">
                    <div className="flex items-center px-2 py-1.5 whitespace-nowrap w-44">
                      Routing/Transit Number
                    </div>
                    <div className="flex-1 px-2 py-1.5">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((digitIndex) => (
                          <input
                            key={digitIndex}
                            type="text"
                            maxLength="1"
                            value={
                              (account.routingNumber || "")[
                                digitIndex
                              ] || ""
                            }
                            onChange={(e) =>
                              handleRoutingNumberChange(index, digitIndex, e.target.value)
                            }
                            className="w-6 h-6 text-center border border-black px-0 py-0 outline-none bg-[#DDE5FE] text-[13px] font-bold"
                            disabled={isReadOnly}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Account Number Row */}
                  <div className="flex border-b border-black text-[10px] text-black">
                    <div className="flex items-center px-2 py-1.5 whitespace-nowrap w-44">
                      Checking/Savings Account Number**
                    </div>
                    <div className="flex-1 px-2 py-1.5">
                      <div className="flex gap-1">
                        {[
                          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                        ].map((digitIndex) => (
                          <input
                            key={digitIndex}
                            type="text"
                            maxLength="1"
                            value={
                              (account.accountNumber || "")[
                                digitIndex
                              ] || ""
                            }
                            onChange={(e) =>
                              handleAccountNumberChange(index, digitIndex, e.target.value)
                            }
                            className="w-6 h-6 text-center border border-black px-0 py-0 outline-none bg-[#DDE5FE] text-[13px] font-bold"
                            disabled={isReadOnly}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bank Name Row */}
                  <div className="flex border-b border-black text-[10px]">
                    <div className="flex items-center px-2 py-1.5 whitespace-nowrap w-44">
                      Financial Institution ("Bank") Name
                    </div>
                    <div className="flex-1 px-2 py-1.5 border-0">
                      <input
                        type="text"
                        value={account.bankName}
                        onChange={(e) =>
                          handleInputChange(index, "bankName", e.target.value)
                        }
                        className="w-full px-1 py-0 outline-none bg-[#DDE5FE] text-[13px] border-0 border-b border-black"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  {/* Deposit Amount Row */}
                  <div className="flex border-b border-black text-[10px]">
                    <div className="flex items-center px-2 py-1.5 whitespace-nowrap">
                      I wish to deposit (check one):
                    </div>
                    <div className="flex items-center px-2 py-1.5 border-0">
                      <input
                        type="text"
                        value={account.depositPercent}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "depositPercent",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        className="w-10 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px] mr-1"
                        disabled={isReadOnly}
                      />
                      <label className="whitespace-nowrap">% of Net</label>
                    </div>
                    <div className="flex items-center px-2 py-1.5 border-0">
                      <label className="whitespace-nowrap mr-1">
                        Specific Dollar Amount $
                      </label>
                      <input
                        type="text"
                        value={account.depositAmount}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "depositAmount",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        className="w-20 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px]"
                        disabled={isReadOnly}
                      />
                      <span className="ml-1 text-[13px] self-center">.00</span>
                    </div>
                    <div className="flex items-center px-2 py-1.5 flex-1">
                      <input
                        type="checkbox"
                        checked={account.depositRemainder}
                        onChange={(e) =>
                          handleInputChange(index, "depositRemainder", e.target.checked)
                        }
                        className="mr-1 w-3 h-3 bg-[#DDE5FE]"
                        disabled={isReadOnly}
                      />
                      <label className="whitespace-nowrap">
                        Remainder of Net Pay
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmation Statement */}
            <div className="mt-4 border-[2px] border-black text-black">
              <div className="bg-black text-white px-2 py-1.5 text-[10px] font-bold text-center">
                CONFIRMATION STATEMENT –{" "}
                <span className="italic">
                  PLEASE PRINT CLEARLY IN BLACK/BLUE INK ONLY
                </span>
              </div>
              <div className="p-3 text-[10px] leading-tight text-black">
                <p className="mb-3">
                  I authorize my employer/company to deposit and I authorize my
                  earnings into the bank account(s) specified above and, if
                  necessary, to electronically debit the account to correct
                  erroneous credits. I understand that this authorization will
                  remain in effect until I notify Company in writing that I wish to
                  revoke it. I certify the account number accurately reflects my
                  intended receiving account. I agree that direct deposit
                  transactions I authorize comply with all applicable laws. My
                  signature below indicates that I am agreeing to all terms that are
                  set forth in this document. I further agree that the authority of
                  the accountholder to authorize my employer/company make direct
                  deposits into the named account. I understand that this
                  authorization will remain in full force and effect until I notify
                  Company in writing that I wish to revoke my authorization and
                  understand that the Company requires at least 5 business days
                  prior notice to cancel this authorization.
                </p>

                <div className="flex items-center mb-3">
                  <label className="font-bold whitespace-nowrap mr-2">
                    Employee/Worker Signature:
                  </label>
                  <input
                    type="text"
                    value={formData.employeeSignature}
                    onChange={(e) =>
                      handleTopLevelChange("employeeSignature", e.target.value)
                    }
                    className="flex-1 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px] mr-4"
                    placeholder="Type your full name"
                    style={{ fontFamily: "Brush Script MT, cursive" }}
                    disabled={isReadOnly}
                  />
                  <label className="font-bold whitespace-nowrap mr-2">Date:</label>
                  <input
                    type="text"
                    value={formData.employeeDate}
                    onChange={(e) =>
                      handleTopLevelChange("employeeDate", e.target.value)
                    }
                    className="w-28 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px]"
                    placeholder="M/DD/YY"
                    disabled={isReadOnly}
                  />
                </div>

                <p className="mb-3">
                  I confirm that the above named employee/worker has passed or
                  changed a bank account for direct deposit transactions processed
                  by Paychex, Inc. I have reviewed the information provided and it
                  is accurate to the best of my knowledge. My signature below
                  indicates that I have the authority to execute this document on
                  behalf of the Client.
                </p>

                <div className="flex items-center mb-3 text-black">
                  <label className="font-bold whitespace-nowrap mr-2">
                    Employer/Company Representative Printed Name:
                  </label>
                  <input
                    type="text"
                    value={formData.employerName}
                    onChange={(e) =>
                      handleTopLevelChange("employerName", e.target.value)
                    }
                    className="flex-1 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px]"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="flex items-center mb-3 text-black">
                  <label className="font-bold whitespace-nowrap mr-2">
                    Employer/Company Representative Signature:
                  </label>
                  <input
                    type="text"
                    value={formData.employerSignature}
                    onChange={(e) =>
                      handleTopLevelChange("employerSignature", e.target.value)
                    }
                    className="flex-1 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px] mr-4"
                    placeholder="Type full name"
                    style={{ fontFamily: "Brush Script MT, cursive" }}
                    disabled={isReadOnly}
                  />
                  <label className="font-bold whitespace-nowrap mr-2">Date:</label>
                  <input
                    type="text"
                    value={formData.employerDate}
                    onChange={(e) =>
                      handleTopLevelChange("employerDate", e.target.value)
                    }
                    className="w-28 border-0 border-b border-black px-1 py-0 outline-none bg-[#DDE5FE] text-[13px]"
                    placeholder="M/DD/YY"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="bg-gray-100 p-2 text-[10px] leading-tight text-black">
                  <p className="mb-1">
                    <span className="font-bold">
                      * All fields are required unless noted.
                    </span>{" "}
                    <span className="ml-8">M/DD/YY</span>
                  </p>
                  <p className="mb-1">
                    <span className="font-bold">
                      ** Certain accounts may have restrictions on deposits and
                      withdrawals.
                    </span>{" "}
                    Check with your bank for more information specific to your
                    account.
                  </p>
                  <p className="italic">
                    <span className="font-bold">Note:</span> Digital or Electronic
                    Signatures are not acceptable.
                  </p>
                </div>

                <div className="text-right mt-2 text-[10px] text-black">
                  <p>DP0002 10/20</p>
                  <p>Form Expires 10/31/23</p>
                </div>
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
            <SaveNextButton
              isSubmitting={isSubmitting}
              type="submit"
              isReadOnly={isReadOnly}
              onClick={handleSaveAndNext}
              onNext={onNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

DirectDepositForm.propTypes = {
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

export default DirectDepositForm;
