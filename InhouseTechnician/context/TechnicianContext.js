import React, { createContext, useState } from "react";

export const TechnicianContext = createContext();

export const TechnicianProvider = ({ children }) => {
  const [technician, setTechnician] = useState({
    id: "tech123",
    name: "Rajesh Kumar",
    age: 32,
    gender: "Male",
    email: "rajesh.kumar@example.com",
    mobile: "+91 9876543210",
    accountNumber: "123456789012",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    aadhaarNumber: "1234 5678 9012",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    aadhaarVerified: false,
    bankVerified: false,
    identityVerified: false,
    overallStatus: "Verified",
  });

  return (
    <TechnicianContext.Provider value={{ technician, setTechnician }}>
      {children}
    </TechnicianContext.Provider>
  );
};
