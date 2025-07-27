import React from "react";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  return <div className="p-6 w-[95%]">{children}</div>;
};

export default DoctorLayout;
