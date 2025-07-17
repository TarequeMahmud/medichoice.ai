import AppointmentCard from "@/components/AppointmentCard";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="w-[100%]">
      <h1>Appointment page</h1>
      <p>Welcome to the patient dashboard page.</p>
      <AppointmentCard />
    </div>
  );
};

export default Page;
