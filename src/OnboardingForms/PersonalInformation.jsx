import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  User,
  ArrowLeft,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SaveNextButton from "../components/common/SaveNextButton";
import logo from "../assets/logo.png";
import { toast } from "sonner";

// FormInput component
const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  placeholder = "",
  required = false,
  disabled = false,
  onFocus = () => {},
  onBlur = () => {},
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500"
      required={required}
      disabled={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </div>
);

FormInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

// FormSelect component
const FormSelect = ({
  label,
  value,
  onChange,
  options,
  className = "",
  required = false,
  disabled = false,
  showPlaceholder = true,
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200 max-h-48 overflow-y-auto disabled:bg-gray-100 disabled:text-gray-500"
      required={required}
      disabled={disabled}
    >
      {showPlaceholder && <option value="">Select...</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

FormSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  showPlaceholder: PropTypes.bool,
};

// Format SSN as 000-00-0000
const formatSSN = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const limited = cleaned.slice(0, 9);
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 5) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`;
  }
};

// Format phone number as +1 (XXX) XXX-XXXX
const formatPhone = (value) => {
  const withoutPrefix = value.replace(/^\+1\s*/, "");
  const cleaned = withoutPrefix.replace(/\D/g, "");
  const limited = cleaned.slice(0, 10);
  if (limited.length === 0) {
    return "";
  } else if (limited.length <= 3) {
    return `+1 (${limited}`;
  } else if (limited.length <= 6) {
    return `+1 (${limited.slice(0, 3)}) ${limited.slice(3)}`;
  } else {
    return `+1 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  }
};

// Format Government ID based on type
const formatGovernmentId = (value, idType) => {
  if (!idType) return value;
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  if (idType === "Passport") {
    const limited = cleaned.slice(0, 9);
    if (limited.length > 1 && /^[A-Z]/.test(limited)) {
      const letter = limited[0];
      const numbers = limited.slice(1).replace(/[^0-9]/g, "");
      return letter + numbers.slice(0, 8);
    }
    return limited;
  } else if (idType === "Driver's License" || idType === "State ID") {
    const limited = cleaned.slice(0, 12);
    if (limited.length > 1 && /^\d/.test(limited) && limited.length >= 8) {
      if (limited.length === 9) {
        return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
      } else if (limited.length === 8) {
        return `${limited.slice(0, 2)}-${limited.slice(2, 5)}-${limited.slice(5)}`;
      }
    } else if (limited.length > 1 && /^[A-Z]\d/.test(limited)) {
      const letter = limited[0];
      const numbers = limited.slice(1).replace(/[^0-9]/g, "");
      if (numbers.length >= 7) {
        return `${letter}${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 9)}`;
      } else if (numbers.length >= 6) {
        return `${letter}${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      }
    }
    return limited;
  }
  return cleaned.slice(0, 20);
};

// Mask SSN for display
const maskSSN = (value) => {
  if (!value) return "";
  if (value.length < 11) return value;
  return "***-**-****";
};

// Geographic Data
const COUNTRIES_DATA = [
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Australia", label: "Australia" },
  { value: "India", label: "India" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Mexico", label: "Mexico" },
  { value: "Philippines", label: "Philippines" },
  { value: "China", label: "China" },
];

const STATES_DATA = {
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "District of Columbia"
  ],
  Canada: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
    "Northwest Territories", "Nunavut", "Yukon"
  ],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Australia: [
    "New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
  ],
  India: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ],
  Germany: [
    "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia",
    "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
  ],
  France: [
    "Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Occitanie", "Nouvelle-Aquitaine", "Hauts-de-France", "Grand Est", "Brittany", "Normandy", "Pays de la Loire"
  ],
  Mexico: [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato",
    "Guerrero", "Hidalgo", "Jalisco", "Mexico City", "Mexico State", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca",
    "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz",
    "Yucatán", "Zacatecas"
  ],
  Philippines: [
    "Metro Manila", "Cebu", "Davao", "Calabarzon", "Central Luzon", "Western Visayas", "Central Visayas", "Northern Mindanao", "Ilocos Region", "Bicol Region"
  ],
  China: [
    "Beijing", "Shanghai", "Guangdong", "Zhejiang", "Jiangsu", "Shandong", "Henan", "Sichuan", "Hubei", "Hunan", "Fujian", "Anhui", "Hebei", "Liaoning", "Shaanxi"
  ],
};

const CITIES_DATA = {
  "United States": {
    Alabama: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"],
    Alaska: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
    Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Tempe"],
    Arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
    California: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno", "Long Beach", "Anaheim", "Bakersfield", "Santa Ana", "Riverside", "Stockton", "Irvine"],
    Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder", "Lakewood"],
    Connecticut: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
    Delaware: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
    Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "St. Petersburg", "Hialeah", "Tallahassee", "Cape Coral", "Fort Myers"],
    Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens", "Macon"],
    Hawaii: ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
    Idaho: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
    Illinois: ["Chicago", "Aurora", "Naperville", "Rockford", "Joliet", "Springfield"],
    Indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
    Iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
    Kansas: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"],
    Kentucky: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
    Louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
    Maine: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
    Maryland: ["Baltimore", "Columbia", "Germantown", "Silver Spring", "Waldorf", "Frederick"],
    Massachusetts: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell", "Brockton"],
    Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing"],
    Minnesota: ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington"],
    Mississippi: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
    Missouri: ["Kansas City", "Saint Louis", "Springfield", "Columbia", "Independence"],
    Montana: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
    Nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    Nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
    "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Dover"],
    "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Trenton"],
    "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
    Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
    Oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
    Oregon: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Beaverton"],
    Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Erie", "Harrisburg"],
    "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
    "South Carolina": ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
    Tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
    Texas: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
    Utah: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
    Vermont: ["Burlington", "South Burlington", "Rutland", "Essex Junction", "Bennington"],
    Virginia: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria"],
    Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent"],
    "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
    Wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
    Wyoming: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
    "District of Columbia": ["Washington"],
  },
  Canada: {
    Alberta: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"],
    Manitoba: ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
    "New Brunswick": ["Saint John", "Moncton", "Fredericton", "Dieppe", "Miramichi"],
    "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South"],
    "Nova Scotia": ["Halifax", "Dartmouth", "Sydney", "Truro", "New Glasgow"],
    Ontario: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham"],
    "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall"],
    Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
    Saskatchewan: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current"],
    "Northwest Territories": ["Yellowknife", "Hay River", "Inuvik", "Fort Smith"],
    Nunavut: ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake"],
    Yukon: ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction"],
  },
  "United Kingdom": {
    England: ["London", "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Bristol", "Newcastle"],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    Wales: ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
    "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry", "Bangor"],
  },
  Australia: {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Maitland"],
    Victoria: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
    Queensland: ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns"],
    "Western Australia": ["Perth", "Mandurah", "Bunbury", "Geraldton", "Kalgoorlie"],
    "South Australia": ["Adelaide", "Mount Gambier", "Whyalla", "Murray Bridge", "Port Augusta"],
    Tasmania: ["Hobart", "Launceston", "Devonport", "Burnie", "Kingston"],
    "Australian Capital Territory": ["Canberra", "Queanbeyan"],
    "Northern Territory": ["Darwin", "Alice Springs", "Palmerston", "Katherine"],
  },
  India: {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
    Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    Delhi: ["New Delhi", "Delhi"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Noida", "Ghaziabad"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal"],
    Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  }
};

const PersonalInformation = ({
  onComplete,
  savedData,
  progressCurrent = 0,
  progressTotal = 1,
  onFormChange,
  isReadOnly = false,
  onNext,
}) => {
  const [ssnFocused, setSsnFocused] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    date: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    email: "",
    dateAvailable: "",
    socialSecurityNo: "",
    desiredSalary: "",
    desiredSalaryType: "",
    positionAppliedFor: "",
    governmentIdType: "",
    governmentIdState: "",
    governmentIdCountry: "",
    governmentIdNumber: "",
    isUSCitizen: "",
    isAuthorizedToWork: "",
    authorizedToWorkExplanation: "",
    hasWorkedHereBefore: "",
    previousWorkDate: "",
    hasBeenConvictedOfFelony: "",
    felonyExplanation: "",
  });

  // Prefill from saved data if available
  useEffect(() => {
    if (savedData) {
      setFormData((prev) => {
        const updated = { ...prev, ...savedData };
        // Trigger states/cities prefill
        if (updated.country) {
          const statesList = STATES_DATA[updated.country]?.map((s) => ({ value: s, label: s })) || [];
          setStates(statesList);
          if (updated.state) {
            const citiesList = CITIES_DATA[updated.country]?.[updated.state]?.map((c) => ({ value: c, label: c })) || [];
            setCities(citiesList);
          }
        }
        return updated;
      });
    } else {
      // Default load United States states
      loadStatesForCountry("United States");
    }
  }, [savedData]);

  // Sync back to parent for draft saves
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData]);

  const loadStatesForCountry = (countryName) => {
    if (countryName && STATES_DATA[countryName]) {
      const statesList = STATES_DATA[countryName].map((state) => ({
        value: state,
        label: state,
      }));
      setStates(statesList);
    } else {
      setStates([]);
    }
    setCities([]);
  };

  const loadCitiesForState = (countryName, stateName) => {
    if (
      countryName &&
      stateName &&
      CITIES_DATA[countryName] &&
      CITIES_DATA[countryName][stateName]
    ) {
      const citiesList = CITIES_DATA[countryName][stateName].map((city) => ({
        value: city,
        label: city,
      }));
      setCities(citiesList);
    } else {
      setCities([]);
    }
  };

  const handleInputChange = (field, value) => {
    if (isReadOnly) return;
    
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Cascading geolist resets
      if (field === "country") {
        updated.state = "";
        updated.city = "";
        loadStatesForCountry(value);
      } else if (field === "state") {
        updated.city = "";
        loadCitiesForState(prev.country, value);
      } else if (field === "governmentIdType") {
        updated.governmentIdState = "";
        updated.governmentIdCountry = "";
        updated.governmentIdNumber = "";
      }
      return updated;
    });
  };

  const getMissingFields = () => {
    const missing = [];
    if (!formData.firstName?.trim()) missing.push("First Name");
    if (!formData.lastName?.trim()) missing.push("Last Name");
    if (!formData.streetAddress?.trim()) missing.push("Street Address");
    if (!formData.city?.trim()) missing.push("City");
    if (!formData.state?.trim()) missing.push("State");
    if (!formData.zipCode?.trim()) missing.push("ZIP Code");
    if (!formData.country?.trim()) missing.push("Country");
    if (!formData.phone?.trim()) missing.push("Phone");
    if (!formData.email?.trim()) missing.push("Email");
    if (!formData.socialSecurityNo?.trim()) missing.push("Social Security No.");
    if (!formData.positionAppliedFor?.trim()) missing.push("Position Applied For");
    if (!formData.governmentIdType?.trim()) missing.push("ID Type");
    if (!formData.governmentIdNumber?.trim()) missing.push("Document Number");
    if (
      (formData.governmentIdType === "Driver's License" ||
        formData.governmentIdType === "State ID") &&
      !formData.governmentIdState?.trim()
    )
      missing.push("ID State");
    if (
      formData.governmentIdType === "Passport" &&
      !formData.governmentIdCountry?.trim()
    )
      missing.push("ID Country");
    if (!formData.isUSCitizen)
      missing.push("Are you a citizen of the United States?");
    if (formData.isUSCitizen === "NO" && !formData.isAuthorizedToWork)
      missing.push("Are you authorized to work in the U.S.?");
    if (
      formData.isUSCitizen === "NO" &&
      formData.isAuthorizedToWork === "YES" &&
      !formData.authorizedToWorkExplanation?.trim()
    )
      missing.push("Work Authorization Details");
    if (!formData.hasWorkedHereBefore)
      missing.push("Have you ever worked for this company?");
    if (formData.hasWorkedHereBefore === "YES" && !formData.previousWorkDate?.trim())
      missing.push("Previous Work Date");
    if (!formData.hasBeenConvictedOfFelony)
      missing.push("Have you ever been convicted of a felony?");
    if (
      formData.hasBeenConvictedOfFelony === "YES" &&
      !formData.felonyExplanation?.trim()
    )
      missing.push("Felony Explanation");

    return missing;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the required fields: ${missingFields.join(", ")}`);
      // Scroll to top or first error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanData = { ...formData };
      if (cleanData.isUSCitizen === "YES") {
        cleanData.isAuthorizedToWork = "";
        cleanData.authorizedToWorkExplanation = "";
      }
      if (cleanData.hasWorkedHereBefore === "NO") {
        cleanData.previousWorkDate = "";
      }
      if (cleanData.hasBeenConvictedOfFelony === "NO") {
        cleanData.felonyExplanation = "";
      }

      if (onComplete) {
        await onComplete(cleanData);
      } else {
        toast.success("Personal information completed!");
      }
    } catch (error) {
      console.error("Error submitting personal information:", error);
      toast.error("Failed to complete form submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse 2xl:flex-row w-full items-start bg-white text-black font-sans">
      <ProgressBar currentStep={progressCurrent} totalSteps={progressTotal || 1} />

      <div className="flex-1 w-full flex flex-col items-center mt-4 mb-8">
        <div className="w-[98%] md:w-[85%] lg:w-[75%] p-4 sm:p-6 md:p-12 bg-white leading-snug shadow-lg rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Logo Header */}
            <div className="flex flex-col items-center mb-6">
              <img src={logo} alt="Pacific Health Systems" className="h-12 md:h-16 object-contain mb-2" />
            </div>

            {/* Blue Banner Header */}
            <div className="bg-[#1F3A93] text-white p-4 md:p-6 rounded-lg mb-8">
              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center">
                  <User className="w-6 h-6 md:w-8 md:h-8 mb-2 sm:mb-0 sm:mr-3" />
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                      Applicant Information
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1">
                      Part 1: Employment Application
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields container */}
            <div className="space-y-8">
              {/* Full Name Section */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1F3A93] mb-4 pb-2 border-b-2 border-[#1F3A93]">
                  Full Name
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <FormInput
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(val) => handleInputChange("lastName", val)}
                    required
                    disabled={isReadOnly}
                  />
                  <FormInput
                    label="First Name"
                    value={formData.firstName}
                    onChange={(val) => handleInputChange("firstName", val)}
                    required
                    disabled={isReadOnly}
                  />
                  <FormInput
                    label="Middle Initial"
                    value={formData.middleInitial}
                    onChange={(val) => handleInputChange("middleInitial", val)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Date of Birth Section */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormInput
                    label="Date of Birth"
                    value={formData.date}
                    onChange={(val) => handleInputChange("date", val)}
                    type="date"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1F3A93] mb-4 pb-2 border-b-2 border-[#1F3A93]">
                  Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormSelect
                    label="Country"
                    value={formData.country}
                    onChange={(val) => handleInputChange("country", val)}
                    options={COUNTRIES_DATA}
                    required
                    disabled={isReadOnly}
                  />
                  <FormSelect
                    label="State"
                    value={formData.state}
                    onChange={(val) => handleInputChange("state", val)}
                    options={states}
                    required
                    disabled={isReadOnly || states.length === 0}
                  />
                  <FormInput
                    label="City"
                    value={formData.city}
                    onChange={(val) => handleInputChange("city", val)}
                    placeholder="Enter your city"
                    required
                    disabled={isReadOnly}
                  />
                  <FormInput
                    label="Street Address"
                    value={formData.streetAddress}
                    onChange={(val) => handleInputChange("streetAddress", val)}
                    required
                    disabled={isReadOnly}
                    className="md:col-span-2"
                  />
                  <FormInput
                    label="Apartment/Unit #"
                    value={formData.apartment}
                    onChange={(val) => handleInputChange("apartment", val)}
                    disabled={isReadOnly}
                  />
                  <FormInput
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(val) => handleInputChange("zipCode", val)}
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1F3A93] mb-4 pb-2 border-b-2 border-[#1F3A93]">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormInput
                    label="Phone"
                    value={formData.phone}
                    onChange={(val) => handleInputChange("phone", formatPhone(val))}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    required
                    disabled={isReadOnly}
                  />
                  <FormInput
                    label="Email"
                    value={formData.email}
                    onChange={(val) => handleInputChange("email", val)}
                    type="email"
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1F3A93] mb-4 pb-2 border-b-2 border-[#1F3A93]">
                  Employment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormInput
                    label="Date Available"
                    value={formData.dateAvailable}
                    onChange={(val) => handleInputChange("dateAvailable", val)}
                    type="date"
                    disabled={isReadOnly}
                  />
                  <FormInput
                    label="Social Security No."
                    value={ssnFocused ? formData.socialSecurityNo : maskSSN(formData.socialSecurityNo)}
                    onChange={(val) => handleInputChange("socialSecurityNo", formatSSN(val))}
                    onFocus={() => setSsnFocused(true)}
                    onBlur={() => setSsnFocused(false)}
                    placeholder="000-00-0000"
                    required
                    disabled={isReadOnly}
                  />
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Desired Salary Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                            $
                          </span>
                          <input
                            type="text"
                            value={formData.desiredSalary}
                            onChange={(e) => handleInputChange("desiredSalary", e.target.value)}
                            placeholder="Enter amount"
                            disabled={isReadOnly}
                            className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      <FormSelect
                        label="Salary Type"
                        value={formData.desiredSalaryType}
                        onChange={(val) => handleInputChange("desiredSalaryType", val)}
                        options={[
                          { value: "hourly", label: "Hourly" },
                          { value: "weekly", label: "Weekly" },
                          { value: "biweekly", label: "Bi-Weekly" },
                          { value: "monthly", label: "Monthly" },
                          { value: "yearly", label: "Yearly" },
                        ]}
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>
                  <FormInput
                    label="Position Applied For"
                    value={formData.positionAppliedFor}
                    onChange={(val) => handleInputChange("positionAppliedFor", val)}
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Government ID Section */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1F3A93] mb-4 pb-2 border-b-2 border-[#1F3A93]">
                  Government ID
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormSelect
                    label="ID Type"
                    value={formData.governmentIdType}
                    onChange={(val) => handleInputChange("governmentIdType", val)}
                    options={[
                      { value: "Driver's License", label: "Driver's License" },
                      { value: "State ID", label: "State ID" },
                      { value: "Passport", label: "Passport" },
                    ]}
                    required
                    disabled={isReadOnly}
                  />
                  <FormInput
                    label="Document Number"
                    value={formData.governmentIdNumber}
                    onChange={(val) => handleInputChange("governmentIdNumber", formatGovernmentId(val, formData.governmentIdType))}
                    placeholder="Enter document number"
                    required
                    disabled={isReadOnly}
                  />
                  {(formData.governmentIdType === "Driver's License" || formData.governmentIdType === "State ID") && (
                    <FormSelect
                      label="State"
                      value={formData.governmentIdState}
                      onChange={(val) => handleInputChange("governmentIdState", val)}
                      options={states}
                      required
                      disabled={isReadOnly || states.length === 0}
                    />
                  )}
                  {formData.governmentIdType === "Passport" && (
                    <FormSelect
                      label="Country"
                      value={formData.governmentIdCountry}
                      onChange={(val) => handleInputChange("governmentIdCountry", val)}
                      options={COUNTRIES_DATA}
                      required
                      disabled={isReadOnly}
                    />
                  )}
                </div>
              </div>

              {/* Authorization & Background */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1F3A93] mb-4 pb-2 border-b-2 border-[#1F3A93]">
                  Authorization & Background
                </h2>
                <div className="space-y-6">
                  {/* Citizen Question */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Are you a citizen of the United States? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="isUSCitizen"
                          value="YES"
                          checked={formData.isUSCitizen === "YES"}
                          onChange={(e) => handleInputChange("isUSCitizen", e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                          required
                          disabled={isReadOnly}
                        />
                        <span className="ml-2 text-gray-700 font-medium">YES</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="isUSCitizen"
                          value="NO"
                          checked={formData.isUSCitizen === "NO"}
                          onChange={(e) => handleInputChange("isUSCitizen", e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                          required
                          disabled={isReadOnly}
                        />
                        <span className="ml-2 text-gray-700 font-medium">NO</span>
                      </label>
                    </div>
                  </div>

                  {/* Auth to Work (Non-US Citizen) */}
                  {formData.isUSCitizen === "NO" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Are you authorized to work in the U.S.? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="isAuthorizedToWork"
                            value="YES"
                            checked={formData.isAuthorizedToWork === "YES"}
                            onChange={(e) => handleInputChange("isAuthorizedToWork", e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                            required
                            disabled={isReadOnly}
                          />
                          <span className="ml-2 text-gray-700 font-medium">YES</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="isAuthorizedToWork"
                            value="NO"
                            checked={formData.isAuthorizedToWork === "NO"}
                            onChange={(e) => {
                              handleInputChange("isAuthorizedToWork", e.target.value);
                              handleInputChange("authorizedToWorkExplanation", "");
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                            required
                            disabled={isReadOnly}
                          />
                          <span className="ml-2 text-gray-700 font-medium">NO</span>
                        </label>
                      </div>
                      {formData.isAuthorizedToWork === "YES" && (
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Please provide details about your work authorization: <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.authorizedToWorkExplanation}
                            onChange={(e) => handleInputChange("authorizedToWorkExplanation", e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200 min-h-[100px] disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="Please provide details about your work authorization (e.g., visa type, expiration date, etc.)"
                            required
                            disabled={isReadOnly}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Worked Here Before */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Have you ever worked for this company? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasWorkedHereBefore"
                          value="YES"
                          checked={formData.hasWorkedHereBefore === "YES"}
                          onChange={(e) => handleInputChange("hasWorkedHereBefore", e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                          required
                          disabled={isReadOnly}
                        />
                        <span className="ml-2 text-gray-700 font-medium">YES</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasWorkedHereBefore"
                          value="NO"
                          checked={formData.hasWorkedHereBefore === "NO"}
                          onChange={(e) => {
                            handleInputChange("hasWorkedHereBefore", e.target.value);
                            handleInputChange("previousWorkDate", "");
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                          required
                          disabled={isReadOnly}
                        />
                        <span className="ml-2 text-gray-700 font-medium">NO</span>
                      </label>
                    </div>
                    {formData.hasWorkedHereBefore === "YES" && (
                      <div className="mt-4">
                        <FormInput
                          label="If yes, when?"
                          value={formData.previousWorkDate}
                          onChange={(val) => handleInputChange("previousWorkDate", val)}
                          placeholder="e.g., January 2020 - March 2021"
                          required
                          disabled={isReadOnly}
                        />
                      </div>
                    )}
                  </div>

                  {/* Felony Question */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Have you ever been convicted of a felony? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasBeenConvictedOfFelony"
                          value="YES"
                          checked={formData.hasBeenConvictedOfFelony === "YES"}
                          onChange={(e) => handleInputChange("hasBeenConvictedOfFelony", e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                          required
                          disabled={isReadOnly}
                        />
                        <span className="ml-2 text-gray-700 font-medium">YES</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasBeenConvictedOfFelony"
                          value="NO"
                          checked={formData.hasBeenConvictedOfFelony === "NO"}
                          onChange={(e) => {
                            handleInputChange("hasBeenConvictedOfFelony", e.target.value);
                            handleInputChange("felonyExplanation", "");
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                          required
                          disabled={isReadOnly}
                        />
                        <span className="ml-2 text-gray-700 font-medium">NO</span>
                      </label>
                    </div>
                    {formData.hasBeenConvictedOfFelony === "YES" && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          If yes, explain: <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.felonyExplanation}
                          onChange={(e) => handleInputChange("felonyExplanation", e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200 min-h-[100px] disabled:bg-gray-100 disabled:text-gray-500"
                          placeholder="Please provide details..."
                          required
                          disabled={isReadOnly}
                        />
                      </div>
                    )}
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

              <div className="w-full sm:w-auto">
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

PersonalInformation.propTypes = {
  onComplete: PropTypes.func,
  savedData: PropTypes.object,
  progressCurrent: PropTypes.number,
  progressTotal: PropTypes.number,
  onFormChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  onNext: PropTypes.func,
};

export default PersonalInformation;
