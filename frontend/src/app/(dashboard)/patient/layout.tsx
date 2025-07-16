import Sidebar from "@/components/Sidebar";
import React from "react";

interface PatientLayoutProps {
  children: React.ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row justify-start items-center min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default PatientLayout;
