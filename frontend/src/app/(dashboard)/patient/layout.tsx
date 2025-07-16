import React from "react";

interface PatientLayoutProps {
  children: React.ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  return <div className="p-6 w-[95%]">{children}</div>;
};

export default PatientLayout;
