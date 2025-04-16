"use client";

import { useState, useEffect } from "react";

// Country data
const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" }
].sort((a, b) => a.name.localeCompare(b.name));

// State data by country
const statesByCountry = {
  IN: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
  ].sort(),
  US: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
  ].sort(),
  GB: [
    "England", "Scotland", "Wales", "Northern Ireland"
  ].sort(),
  CA: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
    "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", 
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
  ].sort(),
  AU: [
    "New South Wales", "Victoria", "Queensland", "Western Australia",
    "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
  ].sort()
};

// City data by state
const citiesByState = {
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", 
    "Amravati", "Kolhapur", "Sangli", "Jalgaon", "Akola", "Nanded", "Latur"
  ].sort(),
  "Karnataka": [
    "Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belgaum", "Gulbarga", 
    "Dharwad", "Davangere", "Bellary", "Shimoga", "Tumkur", "Raichur"
  ].sort(),
  "Delhi": [
    "New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", 
    "Central Delhi", "Shahdara", "Dwarka"
  ].sort(),
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", 
    "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi"
  ].sort(),
  "California": [
    "Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", 
    "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim"
  ].sort(),
  "New York": [
    "New York City", "Buffalo", "Rochester", "Syracuse", "Albany", 
    "Yonkers", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"
  ].sort(),
  "Texas": [
    "Houston", "Austin", "Dallas", "San Antonio", "Fort Worth", 
    "El Paso", "Arlington", "Corpus Christi", "Plano", "Lubbock"
  ].sort(),
  "Florida": [
    "Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg", 
    "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"
  ].sort(),
  "England": [
    "London", "Manchester", "Birmingham", "Liverpool", "Leeds", 
    "Sheffield", "Bristol", "Newcastle", "Nottingham", "Plymouth"
  ].sort(),
  "Ontario": [
    "Toronto", "Ottawa", "Mississauga", "Hamilton", "London", 
    "Brampton", "Kitchener", "Windsor", "Vaughan", "Markham"
  ].sort(),
  "New South Wales": [
    "Sydney", "Newcastle", "Wollongong", "Maitland", "Central Coast", 
    "Wagga Wagga", "Albury", "Port Macquarie", "Tamworth", "Orange"
  ].sort()
};

// Add more data for other states as needed

export default function LocationDropdowns() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setStates(statesByCountry[selectedCountry as keyof typeof statesByCountry] || []);
      setSelectedState("");
      setCities([]);
    } else {
      setStates([]);
      setSelectedState("");
      setCities([]);
    }
  }, [selectedCountry]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedState) {
      setCities(citiesByState[selectedState as keyof typeof citiesByState] || []);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm">
          Country*
        </label>
        <select 
          id="country" 
          className="w-full border rounded-md p-2" 
          required
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="state" className="text-sm">
          State*
        </label>
        <select 
          id="state" 
          className="w-full border rounded-md p-2" 
          required
          disabled={!selectedCountry}
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="city" className="text-sm">
          City*
        </label>
        <select 
          id="city" 
          className="w-full border rounded-md p-2" 
          required
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
